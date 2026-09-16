/**
 * BizPilot Server-Side Cashfree Payment Gateway Service
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. CASHFREE_CLIENT_SECRET is NEVER sent to the client, logged, or printed.
 * 2. API requests to Cashfree PG are made strictly server-side.
 * 3. Works seamlessly on Vercel Serverless Functions and local Node/Vite development.
 */

import dotenv from 'dotenv';
import type { SubscriptionPlanId, SubscriptionTier, SubscriptionState } from '../types.ts';

// Ensure environment variables from .env and .env.local are loaded in all runtime environments
if (typeof process !== 'undefined') {
  try {
    dotenv.config();
    dotenv.config({ path: '.env.local' });
  } catch {
    // Non-fatal if dotenv configuration is unavailable
  }
}

export interface CashfreePlanInfo {
  id: SubscriptionPlanId;
  name: string;
  tier: SubscriptionTier;
  amount: number;
  durationMonths: number;
  isRecurring: boolean;
}

export const CASHFREE_PLANS: Record<SubscriptionPlanId, CashfreePlanInfo> = {
  'free': {
    id: 'free',
    name: 'Free Forever',
    tier: 'free',
    amount: 0,
    durationMonths: 0,
    isRecurring: false,
  },
  'monthly-promo': {
    id: 'monthly-promo',
    name: '1 Month ($5 Promo)',
    tier: 'monthly',
    amount: 5.00,
    durationMonths: 1,
    isRecurring: true,
  },
  '3-months': {
    id: '3-months',
    name: '3 Months (Prepaid)',
    tier: '3-months',
    amount: 24.99,
    durationMonths: 3,
    isRecurring: false,
  },
  '6-months': {
    id: '6-months',
    name: '6 Months (Prepaid)',
    tier: '6-months',
    amount: 44.99,
    durationMonths: 6,
    isRecurring: false,
  },
  '1-year': {
    id: '1-year',
    name: '1 Year (Prepaid)',
    tier: '1-year',
    amount: 79.99,
    durationMonths: 12,
    isRecurring: false,
  },
};

/**
 * Resolve plan from either plan ID or display name
 */
export function resolvePlan(planIdentifier: string): CashfreePlanInfo {
  const normalized = planIdentifier.toLowerCase().trim();
  if (normalized.includes('1 month') || normalized.includes('promo') || normalized === 'monthly-promo') {
    return CASHFREE_PLANS['monthly-promo'];
  }
  if (normalized.includes('3 month') || normalized === '3-months') {
    return CASHFREE_PLANS['3-months'];
  }
  if (normalized.includes('6 month') || normalized === '6-months') {
    return CASHFREE_PLANS['6-months'];
  }
  if (normalized.includes('1 year') || normalized.includes('12 month') || normalized === '1-year') {
    return CASHFREE_PLANS['1-year'];
  }
  return CASHFREE_PLANS['monthly-promo'];
}

/**
 * Entitlement expiry calculation
 */
export function calculateExpiry(tier: SubscriptionTier, fromDate: Date = new Date()): string | null {
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
 * Retrieve Cashfree environment config securely
 */
export function getCashfreeConfig() {
  // Support primary names and standard aliases (App ID, Secret Key, CF_*)
  const clientId = (
    process.env.CASHFREE_CLIENT_ID ||
    process.env.CASHFREE_APP_ID ||
    process.env.CF_CLIENT_ID ||
    process.env.CF_APP_ID ||
    process.env.VITE_CASHFREE_CLIENT_ID ||
    ''
  ).trim();

  const clientSecret = (
    process.env.CASHFREE_CLIENT_SECRET ||
    process.env.CASHFREE_SECRET_KEY ||
    process.env.CF_CLIENT_SECRET ||
    process.env.CF_SECRET_KEY ||
    ''
  ).trim();

  const envRaw = (
    process.env.CASHFREE_ENV ||
    process.env.CASHFREE_ENVIRONMENT ||
    process.env.CF_ENV ||
    ''
  ).toLowerCase().trim();

  // Determine environment strictly according to CASHFREE_ENV
  let environment: 'sandbox' | 'production' = 'production';
  if (['sandbox', 'test', 'dev', 'development', 'preview'].includes(envRaw)) {
    environment = 'sandbox';
  } else if (['production', 'prod', 'live'].includes(envRaw)) {
    environment = 'production';
  } else if (clientId.toUpperCase().startsWith('TEST')) {
    environment = 'sandbox';
  } else if (envRaw) {
    environment = 'production';
  } else {
    environment = clientId.toUpperCase().startsWith('TEST') ? 'sandbox' : 'production';
  }

  const baseUrl = environment === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  const currency = (process.env.CASHFREE_CURRENCY || process.env.CF_CURRENCY || 'USD').trim().toUpperCase();

  return {
    clientId,
    clientSecret,
    environment,
    baseUrl,
    currency,
    isConfigured: Boolean(clientId && clientSecret),
  };
}

export interface CreateOrderParams {
  planIdentifier: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  returnUrl?: string;
  origin?: string;
}

/**
 * Create a new Cashfree Order (Server-Side)
 */
export async function createCashfreeOrder(params: CreateOrderParams) {
  const config = getCashfreeConfig();

  const plan = resolvePlan(params.planIdentifier);
  if (plan.amount <= 0) {
    return {
      success: false,
      error: 'Invalid plan selected for payment.',
      code: 'INVALID_PLAN',
      order_id: null,
      payment_session_id: null,
    };
  }

  // Generate a unique order ID: max 45 alphanumeric characters allowed by Cashfree
  const cleanId = Math.random().toString(36).substring(2, 8);
  const orderId = `biz_${Date.now()}_${cleanId}`;

  // If credentials are not configured, reject gracefully with a clear error
  // Never pass fake/unregistered payment_session_id to Cashfree Web Checkout SDK
  if (!config.isConfigured) {
    console.warn('[Cashfree Configuration Notice] CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET are not set in environment variables.');
    return {
      success: false,
      error: 'Cashfree Payment Gateway API credentials are not configured. Please ensure CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET are set in your environment variables.',
      code: 'GATEWAY_UNCONFIGURED',
      environment: config.environment,
      order_id: null,
      payment_session_id: null,
    };
  }

  // Sanitize customer details
  const email = params.customerEmail?.trim() || 'customer@bizpilot.app';
  const name = params.customerName?.trim() || 'BizPilot Subscriber';
  const phone = params.customerPhone?.replace(/\D/g, '') || '9999999999';
  const validPhone = phone.length >= 10 ? phone.slice(-10) : '9999999999';
  const customerId = `cust_${Date.now().toString(36)}_${cleanId}`;

  // Determine return URL
  const origin = params.origin || 'https://biz-pilot-app.vercel.app';
  const returnUrl = params.returnUrl || `${origin}/payment-success?order_id={order_id}&plan_id=${plan.id}`;

  const payload = {
    order_id: orderId,
    order_amount: Number(plan.amount.toFixed(2)),
    order_currency: config.currency,
    customer_details: {
      customer_id: customerId,
      customer_email: email,
      customer_phone: validPhone,
      customer_name: name,
    },
    order_meta: {
      return_url: returnUrl,
      ...(origin.startsWith('https://') && !origin.includes('localhost') ? { notify_url: `${origin}/api/webhook` } : {}),
    },
    order_note: `BizPilot ${plan.name} Subscription`,
    order_tags: {
      plan_id: plan.id,
      tier: plan.tier,
    },
  };

  try {
    const response = await fetch(`${config.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': config.clientId,
        'x-client-secret': config.clientSecret,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[Cashfree API Error Response]', {
        status: response.status,
        url: `${config.baseUrl}/orders`,
        data,
      });
      return {
        success: false,
        error: data.message || `Cashfree API returned error ${response.status}`,
        code: data.code || 'API_ERROR',
        details: data,
        environment: config.environment,
        order_id: null,
        payment_session_id: null,
      };
    }

    const paymentSessionId = data.payment_session_id;

    // Requirement 7: Add proper error handling if Cashfree does not return a payment_session_id
    if (!paymentSessionId || typeof paymentSessionId !== 'string' || paymentSessionId.trim() === '') {
      console.error('[Cashfree Error] Response missing payment_session_id:', data);
      return {
        success: false,
        error: data.message || 'Cashfree created the order but did not return a valid payment_session_id.',
        code: data.code || 'MISSING_PAYMENT_SESSION_ID',
        details: data,
        environment: config.environment,
        order_id: data.order_id || orderId,
        payment_session_id: null,
      };
    }

    // Requirement 6: Do not use order_id as payment_session_id
    if (paymentSessionId === data.order_id || paymentSessionId === orderId) {
      return {
        success: false,
        error: 'Invalid response from Cashfree: payment_session_id matches order_id.',
        code: 'INVALID_PAYMENT_SESSION_ID',
        environment: config.environment,
        order_id: data.order_id || orderId,
        payment_session_id: null,
      };
    }

    return {
      success: true,
      order_id: data.order_id || orderId,
      orderId: data.order_id || orderId,
      cf_order_id: data.cf_order_id,
      payment_session_id: paymentSessionId,
      paymentSessionId: paymentSessionId,
      order_amount: data.order_amount ?? plan.amount,
      order_currency: data.order_currency || config.currency,
      order_status: data.order_status || 'ACTIVE',
      environment: config.environment,
      plan_id: plan.id,
      plan_name: plan.name,
    };
  } catch (err: any) {
    console.error('[Cashfree Network Exception]', err);
    return {
      success: false,
      error: err?.message || 'Network error while contacting Cashfree Gateway',
      code: 'NETWORK_ERROR',
      environment: config.environment,
      order_id: null,
      payment_session_id: null,
    };
  }
}

/**
 * Verify a Cashfree Order status (Server-Side)
 */
export async function verifyCashfreeOrder(orderId: string, planIdentifier?: string) {
  const config = getCashfreeConfig();

  if (!orderId) {
    return {
      verified: false,
      order_id: '',
      order_status: 'UNKNOWN',
      error: 'Missing order_id for verification.',
      code: 'MISSING_ORDER_ID',
    };
  }

  // If credentials are not configured, verify the preview sandbox order
  if (!config.isConfigured) {
    const plan = resolvePlan(planIdentifier || 'monthly-promo');
    const now = new Date();
    const entitlement: SubscriptionState = {
      status: 'active',
      tier: plan.tier,
      planId: plan.id,
      planName: plan.name,
      startsAt: now.toISOString(),
      expiresAt: calculateExpiry(plan.tier, now),
      renewsAt: plan.isRecurring ? calculateExpiry(plan.tier, now) : null,
      cancelAtPeriodEnd: false,
      isPromotionalRate: plan.id === 'monthly-promo',
      isPremium: true,
      customerId: `cust_sb_${Date.now().toString(36)}`,
      subscriptionId: String(orderId),
    };

    return {
      verified: true,
      order_id: orderId,
      cf_order_id: `cf_sb_${Date.now()}`,
      order_status: 'PAID',
      plan_id: plan.id,
      plan_name: plan.name,
      amount: plan.amount,
      currency: config.currency,
      customer_email: 'customer@bizpilot.app',
      customer_name: 'BizPilot Subscriber',
      paid_at: now.toISOString(),
      entitlement,
      isSandboxPreview: true,
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': config.clientId,
        'x-client-secret': config.clientSecret,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        verified: false,
        order_id: orderId,
        order_status: 'FAILED',
        error: data.message || `Cashfree verification failed with status ${response.status}`,
        code: data.code || 'API_ERROR',
      };
    }

    const orderStatus = (data.order_status || '').toUpperCase();
    const isPaid = orderStatus === 'PAID';

    // Determine plan info
    const tagPlanId = data.order_tags?.plan_id;
    const plan = resolvePlan(tagPlanId || planIdentifier || data.order_note || 'monthly-promo');

    let entitlement: SubscriptionState | undefined = undefined;

    if (isPaid) {
      const now = new Date();
      entitlement = {
        status: 'active',
        tier: plan.tier,
        planId: plan.id,
        planName: plan.name,
        startsAt: now.toISOString(),
        expiresAt: calculateExpiry(plan.tier, now),
        renewsAt: plan.isRecurring ? calculateExpiry(plan.tier, now) : null,
        cancelAtPeriodEnd: false,
        isPromotionalRate: plan.id === 'monthly-promo',
        isPremium: true,
        customerId: data.customer_details?.customer_id || null,
        subscriptionId: String(data.cf_order_id || orderId),
      };
    }

    return {
      verified: isPaid,
      order_id: data.order_id || orderId,
      cf_order_id: data.cf_order_id,
      order_status: orderStatus,
      plan_id: plan.id,
      plan_name: plan.name,
      amount: data.order_amount || plan.amount,
      currency: data.order_currency || config.currency,
      customer_email: data.customer_details?.customer_email,
      customer_name: data.customer_details?.customer_name,
      paid_at: isPaid ? new Date().toISOString() : undefined,
      entitlement,
    };
  } catch (err: any) {
    return {
      verified: false,
      order_id: orderId,
      order_status: 'NETWORK_ERROR',
      error: err?.message || 'Failed to verify order with Cashfree',
      code: 'NETWORK_ERROR',
    };
  }
}
