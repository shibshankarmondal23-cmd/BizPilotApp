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

import { SubscriptionPlanId, SubscriptionState, SubscriptionStatus } from '../types';

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
  'client-email',
  'client-email-gen',
  'social-caption',
  'social-caption-gen',
]);

/**
 * Configuration for future strict gate enforcement
 * When false: Free/guest users can interact with premium tools in preview mode with upgrade banners.
 * When true (after payment provider & auth are active): Free users are hard-gated from premium tools.
 */
export const ENFORCE_STRICT_PREMIUM_LOCK = false;

/**
 * Default subscription state for guest/anonymous users.
 * IMPORTANT: User is NOT hardcoded as premium.
 */
export const DEFAULT_GUEST_SUBSCRIPTION: SubscriptionState = {
  status: 'free',
  planId: 'free',
  planName: 'Free Tier',
  expiresAt: null,
  isTrialPromo: false,
  renewsAt: null,
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
 * Check whether a user with given subscription state can access a tool
 */
export function canUserAccessTool(
  toolIdOrSlug: string,
  subscription: SubscriptionState = DEFAULT_GUEST_SUBSCRIPTION
): boolean {
  // Free tools are always accessible to all users (including guests)
  if (isToolFree(toolIdOrSlug)) {
    return true;
  }

  // If the tool is premium, active premium subscribers always have access
  if (subscription.status === 'premium') {
    return true;
  }

  // If strict locking is disabled, allow preview mode
  if (!ENFORCE_STRICT_PREMIUM_LOCK) {
    return true;
  }

  // Otherwise, locked for non-premium users
  return false;
}

/**
 * Interface for future payment provider adapters (e.g. Stripe, LemonSqueezy)
 */
export interface PaymentProviderAdapter {
  id: string;
  name: string;
  createCheckoutSession: (planId: SubscriptionPlanId, customerEmail?: string) => Promise<{
    checkoutUrl?: string;
    sessionId?: string;
    error?: string;
  }>;
  getCustomerPortalUrl?: () => Promise<{ portalUrl?: string; error?: string }>;
}

/**
 * Future Payment Provider Placeholder / Adapter
 * NOTE: We do NOT implement fake payments or mock credit card forms.
 * This adapter documents the exact contract needed when Stripe or another provider is ready.
 */
export class DeferredPaymentProvider implements PaymentProviderAdapter {
  id = 'deferred-provider';
  name = 'Stripe / Merchant Gateway (Launching Soon)';

  async createCheckoutSession(
    planId: SubscriptionPlanId,
    customerEmail?: string
  ): Promise<{ checkoutUrl?: string; sessionId?: string; error?: string }> {
    // In production with real backend, this will call:
    // const res = await fetch('/api/stripe/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ planId, customerEmail })
    // });
    // const data = await res.json();
    // return { checkoutUrl: data.url, sessionId: data.sessionId };

    return {
      error: 'PAYMENT_GATEWAY_PENDING_LAUNCH',
    };
  }

  async getCustomerPortalUrl(): Promise<{ portalUrl?: string; error?: string }> {
    return {
      error: 'PORTAL_PENDING_LAUNCH',
    };
  }
}

export const paymentProvider = new DeferredPaymentProvider();
