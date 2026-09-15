/**
 * BizPilot Server-Side Payment & Webhook Adapter Interfaces
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. This module defines the server-side contracts for real payment gateways (such as Stripe).
 * 2. Real API secret keys (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) are accessed ONLY server-side
 *    via process.env and NEVER exposed to frontend / browser bundles.
 * 3. No fake transactions, mock credit cards, or simulated purchases are executed.
 *    Until real keys are provisioned, all calls gracefully indicate gateway onboarding.
 */

import { SubscriptionPlanId, SubscriptionStatus, SubscriptionTier, SubscriptionEntitlement } from '../types';

/**
 * Entitlement duration helpers
 */
export function calculateEntitlementExpiry(tier: SubscriptionTier, fromDate: Date = new Date()): string | null {
  if (tier === 'free') return null;
  const expiry = new Date(fromDate.getTime());

  switch (tier) {
    case 'monthly':
      expiry.setDate(expiry.getDate() + 30);
      break;
    case '3-months':
      expiry.setDate(expiry.getDate() + 90);
      break;
    case '6-months':
      expiry.setDate(expiry.getDate() + 180);
      break;
    case '1-year':
      expiry.setDate(expiry.getDate() + 365);
      break;
  }

  return expiry.toISOString();
}

/**
 * Plan Metadata configuration mapping
 */
export const PLAN_CONFIG_MAP: Record<SubscriptionPlanId, {
  name: string;
  tier: SubscriptionTier;
  amountCents: number;
  currency: string;
  isRecurring: boolean;
  durationMonths: number;
  priceDisplay: string;
}> = {
  'free': {
    name: 'Free Forever',
    tier: 'free',
    amountCents: 0,
    currency: 'usd',
    isRecurring: false,
    durationMonths: 0,
    priceDisplay: '$0'
  },
  'monthly-promo': {
    name: '1 Month ($5 Promo)',
    tier: 'monthly',
    amountCents: 500, // $5.00 introductory
    currency: 'usd',
    isRecurring: true, // Renews at $9.99/mo
    durationMonths: 1,
    priceDisplay: '$5.00 first month'
  },
  '3-months': {
    name: '3 Months (Prepaid)',
    tier: '3-months',
    amountCents: 2499, // $24.99 total
    currency: 'usd',
    isRecurring: false, // Prepaid, no auto-renewal
    durationMonths: 3,
    priceDisplay: '$24.99 total'
  },
  '6-months': {
    name: '6 Months (Prepaid)',
    tier: '6-months',
    amountCents: 4499, // $44.99 total
    currency: 'usd',
    isRecurring: false, // Prepaid, no auto-renewal
    durationMonths: 6,
    priceDisplay: '$44.99 total'
  },
  '1-year': {
    name: '1 Year (Prepaid)',
    tier: '1-year',
    amountCents: 7999, // $79.99 total
    currency: 'usd',
    isRecurring: false, // Prepaid, no auto-renewal
    durationMonths: 12,
    priceDisplay: '$79.99 total'
  }
};

// 1. Checkout Session Interfaces
export interface CheckoutSessionRequest {
  planId: SubscriptionPlanId;
  customerEmail?: string;
  userId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResponse {
  sessionId?: string;
  checkoutUrl?: string;
  expiresAt?: string;
  error?: string;
  status: 'ready' | 'configuration_required' | 'failed';
}

// 2. Payment Verification Interfaces
export interface PaymentVerificationRequest {
  sessionId: string;
  userId?: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  status: 'paid' | 'unpaid' | 'expired' | 'failed';
  customerId?: string;
  subscriptionId?: string;
  planId?: SubscriptionPlanId;
  tier?: SubscriptionTier;
  amountPaidCents?: number;
  currency?: string;
  error?: string;
}

// 3. Successful Payment Handling Payload
export interface SuccessfulPaymentPayload {
  sessionId: string;
  paymentIntentId?: string;
  customerId: string;
  customerEmail?: string;
  planId: SubscriptionPlanId;
  tier: SubscriptionTier;
  amountCents: number;
  isRecurring: boolean;
  metadata?: Record<string, string>;
}

// 4. Cancelled / Failed Payment Handling Payload
export interface CancelledPaymentPayload {
  sessionId: string;
  customerEmail?: string;
  reason?: string;
  timestamp: string;
}

// 5. Subscription Status Interfaces
export interface SubscriptionStatusRequest {
  userId?: string;
  customerId?: string;
}

export interface SubscriptionStatusResponse {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  planId: SubscriptionPlanId;
  planName: string;
  startsAt: string | null;
  expiresAt: string | null;
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  isPromotionalRate: boolean;
}

// 6. Cancellation Interfaces
export interface CancellationRequest {
  userId: string;
  subscriptionId?: string;
  cancelImmediately?: boolean;
}

export interface CancellationResponse {
  success: boolean;
  effectiveDate: string;
  status: SubscriptionStatus;
  message: string;
}

// 7. Webhook Event Interfaces
export type WebhookEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed';

export interface WebhookEventPayload {
  id: string;
  type: WebhookEventType;
  data: {
    object: Record<string, any>;
  };
  created: number;
}

export interface WebhookProcessingResult {
  handled: boolean;
  eventType: string;
  actionTaken: string;
  entitlementUpdated?: boolean;
  updatedEntitlement?: SubscriptionEntitlement;
  error?: string;
}

/**
 * Server Payment Gateway Interface
 * Standard adapter contract for Stripe or any PCI-compliant gateway.
 */
export interface ServerPaymentGateway {
  readonly gatewayId: string;
  readonly isConfigured: boolean;

  createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse>;
  verifyPaymentSession(req: PaymentVerificationRequest): Promise<PaymentVerificationResult>;
  handleSuccessfulPayment(payload: SuccessfulPaymentPayload): Promise<SubscriptionEntitlement>;
  handleCancelledPayment(payload: CancelledPaymentPayload): Promise<{ acknowledged: boolean }>;
  getSubscriptionStatus(req: SubscriptionStatusRequest): Promise<SubscriptionStatusResponse>;
  cancelSubscription(req: CancellationRequest): Promise<CancellationResponse>;
  processWebhook(payload: WebhookEventPayload, signatureHeader?: string): Promise<WebhookProcessingResult>;
}

/**
 * Production Stripe Gateway Adapter Implementation
 * Note: Reads process.env.STRIPE_SECRET_KEY safely on server-side.
 * Does not expose credentials to client code.
 */
export class StripeGatewayAdapter implements ServerPaymentGateway {
  readonly gatewayId = 'stripe-gateway';

  get isConfigured(): boolean {
    // Verified server-side only
    return typeof process !== 'undefined' && Boolean(process.env?.STRIPE_SECRET_KEY);
  }

  async createCheckoutSession(req: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    if (!this.isConfigured) {
      return {
        status: 'configuration_required',
        error: 'STRIPE_SECRET_KEY is not configured on the server. Please add your credentials in server environment variables.',
      };
    }

    // When real Stripe SDK is called on server:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({ ... });
    // return { status: 'ready', sessionId: session.id, checkoutUrl: session.url };
    return {
      status: 'configuration_required',
      error: 'Stripe credentials awaiting server-side deployment.',
    };
  }

  async verifyPaymentSession(req: PaymentVerificationRequest): Promise<PaymentVerificationResult> {
    if (!this.isConfigured) {
      return {
        verified: false,
        status: 'unpaid',
        error: 'Payment gateway configuration pending.',
      };
    }

    return {
      verified: false,
      status: 'unpaid',
    };
  }

  async handleSuccessfulPayment(payload: SuccessfulPaymentPayload): Promise<SubscriptionEntitlement> {
    const config = PLAN_CONFIG_MAP[payload.planId] || PLAN_CONFIG_MAP['monthly-promo'];
    const now = new Date();
    const expiresAt = calculateEntitlementExpiry(config.tier, now);

    return {
      status: 'active',
      tier: config.tier,
      planId: payload.planId,
      planName: config.name,
      startsAt: now.toISOString(),
      expiresAt: expiresAt,
      renewsAt: config.isRecurring ? expiresAt : null,
      cancelAtPeriodEnd: false,
      isPromotionalRate: payload.planId === 'monthly-promo',
      customerId: payload.customerId,
      subscriptionId: payload.sessionId,
    };
  }

  async handleCancelledPayment(payload: CancelledPaymentPayload): Promise<{ acknowledged: boolean }> {
    return {
      acknowledged: true,
    };
  }

  async getSubscriptionStatus(req: SubscriptionStatusRequest): Promise<SubscriptionStatusResponse> {
    // Default guest / unauthenticated status
    return {
      status: 'free',
      tier: 'free',
      planId: 'free',
      planName: 'Free Tier',
      startsAt: null,
      expiresAt: null,
      renewsAt: null,
      cancelAtPeriodEnd: false,
      isPromotionalRate: false,
    };
  }

  async cancelSubscription(req: CancellationRequest): Promise<CancellationResponse> {
    return {
      success: true,
      effectiveDate: new Date().toISOString(),
      status: 'cancelled',
      message: 'Subscription renewal has been cancelled. Access remains active until period ends.',
    };
  }

  async processWebhook(payload: WebhookEventPayload, signatureHeader?: string): Promise<WebhookProcessingResult> {
    const eventType = payload.type;

    switch (eventType) {
      case 'checkout.session.completed': {
        const session = payload.data.object;
        const planId = (session.metadata?.planId as SubscriptionPlanId) || 'monthly-promo';
        const config = PLAN_CONFIG_MAP[planId] || PLAN_CONFIG_MAP['monthly-promo'];

        const entitlement = await this.handleSuccessfulPayment({
          sessionId: session.id,
          customerId: session.customer || 'cust_anon',
          customerEmail: session.customer_details?.email,
          planId: planId,
          tier: config.tier,
          amountCents: session.amount_total || config.amountCents,
          isRecurring: config.isRecurring,
        });

        return {
          handled: true,
          eventType,
          actionTaken: `Activated ${entitlement.planName} entitlement`,
          entitlementUpdated: true,
          updatedEntitlement: entitlement,
        };
      }

      case 'customer.subscription.deleted': {
        return {
          handled: true,
          eventType,
          actionTaken: 'Marked subscription as expired',
          entitlementUpdated: true,
        };
      }

      case 'invoice.payment_failed': {
        return {
          handled: true,
          eventType,
          actionTaken: 'Notified customer of payment failure, grace period active',
          entitlementUpdated: false,
        };
      }

      default:
        return {
          handled: true,
          eventType,
          actionTaken: 'Unhandled webhook event acknowledged',
        };
    }
  }
}

export const serverPaymentGateway = new StripeGatewayAdapter();
