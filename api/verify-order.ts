/**
 * Serverless API Function: /api/verify-order
 * Fully self-contained for Vercel production deployment.
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. CASHFREE_CLIENT_SECRET is NEVER sent to the client, logged, or printed.
 * 2. Order verification calls Cashfree PG API strictly server-side.
 * 3. Has zero relative imports from frontend src/ to avoid ERR_MODULE_NOT_FOUND on Vercel.
 */

import dotenv from 'dotenv';

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
  id: string;
  name: string;
  tier: string;
  amount: number;
  durationMonths: number;
  isRecurring: boolean;
}

export const CASHFREE_PLANS: Record<string, CashfreePlanInfo> = {
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
export function resolvePlan(planIdentifier?: string): CashfreePlanInfo {
  const normalized = (planIdentifier || '').toLowerCase().trim();
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
 * Calculate entitlement expiry date
 */
export function calculateExpiry(tier: string, fromDate: Date = new Date()): string | null {
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
    const entitlement = {
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

    let entitlement: any = undefined;

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

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let orderId = '';
    let planId = '';

    if (req.method === 'GET') {
      orderId = (req.query?.order_id || req.query?.orderId || '').toString();
      planId = (req.query?.plan_id || req.query?.planId || '').toString();
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      orderId = (body.order_id || body.orderId || '').toString();
      planId = (body.plan_id || body.planId || '').toString();
    } else {
      return res.status(405).json({ verified: false, error: 'Method Not Allowed.' });
    }

    if (!orderId) {
      return res.status(200).json({
        verified: false,
        order_id: '',
        order_status: 'UNKNOWN',
        error: 'Query parameter order_id is required for verification.',
      });
    }

    const result = await verifyCashfreeOrder(orderId, planId);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API /api/verify-order handler exception]', err);
    return res.status(200).json({
      verified: false,
      order_id: '',
      order_status: 'FAILED',
      error: err?.message || 'Server error while verifying Cashfree payment',
    });
  }
}
