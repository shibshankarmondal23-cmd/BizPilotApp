/**
 * BizPilot Subscription & Access Control Service
 * 
 * ARCHITECTURAL NOTES FOR FUTURE PAYMENT & AUTHENTICATION INTEGRATIONS:
 * 
 * 1. Security Directive:
 *    NEVER include secret API keys (e.g., Stripe Secret Key, Webhook Secret, Private Key)
 *    in client-side code. All checkout session creation and customer portal sessions
 *    must be initiated via secure server API routes (e.g., `/api/stripe/create-checkout-session`).
 * 
 * 2. Subscription States:
 *    - 'free': Default state for guest users. Free tools work without an account.
 *    - 'premium': Active paying subscriber with full access to all premium tools.
 *    - 'expired': User whose subscription lapsed or failed renewal.
 *    - 'loading': State during initial authentication or subscription sync check.
 * 
 * 3. Future Provider Integration (e.g. Stripe, LemonSqueezy, Paddle):
 *    Implement the PaymentProviderAdapter interface and plug it into `subscriptionService`.
 *    The rest of the UI (modals, gates, badges) will consume this seamlessly without refactoring.
 */

import { SubscriptionPlanId, SubscriptionState, SubscriptionStatus, SubscriptionTier } from '../types';
import { PLAN_CONFIG_MAP, calculateEntitlementExpiry } from './paymentServerAdapter';

/**
 * List of free tool IDs and URL slugs
 */
export const FREE_TOOL_IDENTIFIERS = new Set<string>([
  'percentage-calc',
  'percentage-calculator',
  'word-counter',
  'hourly-rate',
  'hourly-rate-calculator',
  'image-resizer',
]);

/**
 * List of premium tool IDs and URL slugs
 */
export const PREMIUM_TOOL_IDENTIFIERS = new Set<string>([
  'profit-margin',
  'profit-margin-calc',
  'profit-margin-calculator',
  'invoice-gen',
  'invoice-generator',
  'quote-gen',
  'quote-generator',
  'proposal-gen',
  'proposal-generator',
]);

/**
 * Configuration for strict gate enforcement
 * When false: Free/guest users can interact with premium tools in preview mode with upgrade banners.
 * When true: Free users are hard-gated from premium tools unless active entitlement is verified.
 */
export const ENFORCE_STRICT_PREMIUM_LOCK = false;

/**
 * Default subscription state for guest/anonymous users.
 * IMPORTANT: User is strictly in 'free' state by default with zero assumptions of premium.
 */
export const DEFAULT_GUEST_SUBSCRIPTION: SubscriptionState = {
  status: 'free',
  tier: 'free',
  planId: 'free',
  planName: 'Free Forever',
  startsAt: null,
  expiresAt: null,
  renewsAt: null,
  cancelAtPeriodEnd: false,
  isPromotionalRate: false,
  isPremium: false,
};

/**
 * Check whether a given tool ID or slug is premium
 */
export function isToolPremium(toolIdOrSlug: string): boolean {
  const normalized = toolIdOrSlug.toLowerCase().trim();
  return PREMIUM_TOOL_IDENTIFIERS.has(normalized);
}

/**
 * Check whether a given tool ID or slug is free
 */
export function isToolFree(toolIdOrSlug: string): boolean {
  const normalized = toolIdOrSlug.toLowerCase().trim();
  return FREE_TOOL_IDENTIFIERS.has(normalized);
}

/**
 * Helper to check if a subscription has an active entitlement
 */
export function isSubscriptionActive(sub: SubscriptionState): boolean {
  if (sub.status === 'active') {
    // If expiresAt is set, check date
    if (sub.expiresAt) {
      return new Date(sub.expiresAt).getTime() > Date.now();
    }
    return true;
  }

  // If user cancelled, they keep access until expiry
  if (sub.status === 'cancelled' && sub.expiresAt) {
    return new Date(sub.expiresAt).getTime() > Date.now();
  }

  return false;
}

/**
 * Helper to check if a subscription is expired
 */
export function isSubscriptionExpired(sub: SubscriptionState): boolean {
  if (sub.status === 'expired') return true;
  if (sub.expiresAt && new Date(sub.expiresAt).getTime() <= Date.now()) return true;
  return false;
}

/**
 * Format plan tier badge for UI displays
 */
export function getSubscriptionTierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case 'monthly':
      return 'Premium Monthly';
    case '3-months':
      return '3-Month Premium';
    case '6-months':
      return '6-Month Premium';
    case '1-year':
      return '1-Year Premium';
    case 'free':
    default:
      return 'Free Plan';
  }
}

/**
 * Format status badge for UI displays
 */
export function getSubscriptionStatusLabel(status: SubscriptionStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'active':
      return { label: 'Active', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    case 'cancelled':
      return { label: 'Cancelled', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };
    case 'expired':
      return { label: 'Expired', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' };
    case 'loading':
      return { label: 'Syncing', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 'free':
    default:
      return { label: 'Free Tier', badgeClass: 'bg-slate-100 text-slate-800 border-slate-200' };
  }
}

/**
 * Check whether a user with given subscription state can access a tool
 */
export function canUserAccessTool(
  toolIdOrSlug: string,
  subscription: SubscriptionState = DEFAULT_GUEST_SUBSCRIPTION
): boolean {
  // Free tools are always accessible to all users (including unauthenticated guests)
  if (isToolFree(toolIdOrSlug)) {
    return true;
  }

  // Active or unexpired cancelled subscribers have full access to premium tools
  if (isSubscriptionActive(subscription)) {
    return true;
  }

  // If strict locking is disabled, allow preview mode with upgrade banners
  if (!ENFORCE_STRICT_PREMIUM_LOCK) {
    return true;
  }

  // Otherwise, locked for non-entitled users
  return false;
}

/**
 * Interface for client-side payment provider adapters (e.g. Stripe)
 */
export interface PaymentProviderAdapter {
  id: string;
  name: string;
  createCheckoutSession: (planId: SubscriptionPlanId, customerEmail?: string) => Promise<{
    checkoutUrl?: string;
    sessionId?: string;
    error?: string;
    status: 'ready' | 'configuration_required' | 'failed';
  }>;
  verifyPaymentSession: (sessionId: string) => Promise<{
    verified: boolean;
    entitlement?: SubscriptionState;
    error?: string;
  }>;
  getCustomerPortalUrl?: () => Promise<{ portalUrl?: string; error?: string }>;
}

/**
 * Secure Client Payment Provider Implementation
 * Connects to Cashfree serverless endpoints (/api/create-order, /api/verify-order).
 * No secret keys or credentials exist on the client side.
 */
export class SecureClientPaymentProvider implements PaymentProviderAdapter {
  id = 'cashfree-client-provider';
  name = 'Cashfree Payment Gateway';

  async createCheckoutSession(
    planId: SubscriptionPlanId,
    customerEmail?: string
  ): Promise<{ checkoutUrl?: string; sessionId?: string; error?: string; status: 'ready' | 'configuration_required' | 'failed' }> {
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, customerEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (data.code === 'GATEWAY_UNCONFIGURED') {
          return {
            status: 'configuration_required',
            error: data.error || 'Cashfree payment gateway configuration pending.',
          };
        }
        return {
          status: 'failed',
          error: data.error || 'Failed to create payment session.',
        };
      }

      return {
        status: 'ready',
        sessionId: data.payment_session_id,
      };
    } catch {
      return {
        status: 'failed',
        error: 'Network error connecting to payment gateway server.',
      };
    }
  }

  async verifyPaymentSession(sessionId: string): Promise<{
    verified: boolean;
    entitlement?: SubscriptionState;
    error?: string;
  }> {
    try {
      const res = await fetch(`/api/verify-order?order_id=${encodeURIComponent(sessionId)}`);
      if (!res.ok) {
        return { verified: false, error: 'Verification server endpoint unavailable.' };
      }
      const data = await res.json();
      return {
        verified: Boolean(data.verified),
        entitlement: data.entitlement,
        error: data.error,
      };
    } catch (err: any) {
      return {
        verified: false,
        error: err?.message || 'Failed to reach verification endpoint.',
      };
    }
  }

  async getCustomerPortalUrl(): Promise<{ portalUrl?: string; error?: string }> {
    return { error: 'To manage your subscription or request invoices, contact support@bizpilot.app' };
  }
}

export const paymentProvider = new SecureClientPaymentProvider();
