/**
 * Serverless API Function: /api/create-order
 * Fully self-contained for Vercel production deployment.
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. CASHFREE_CLIENT_SECRET is NEVER sent to the client, logged, or printed.
 * 2. API requests to Cashfree PG are made strictly server-side.
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

export interface CreateOrderParams {
  planIdentifier?: string;
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

    // Requirement: Add proper error handling if Cashfree does not return a payment_session_id
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

    // Requirement: Do not use order_id as payment_session_id
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

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Use POST.',
      order_id: null,
      payment_session_id: null,
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { planId, planName, customerEmail, customerName, customerPhone, returnUrl } = body;

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'biz-pilot-app.vercel.app';
    const origin = `${protocol}://${host}`;

    const result = await createCashfreeOrder({
      planIdentifier: planId || planName || 'monthly-promo',
      customerEmail,
      customerName,
      customerPhone,
      returnUrl,
      origin,
    });

    // Always deliver valid JSON response with HTTP 200 so reverse proxies never intercept with HTML
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('[API /api/create-order handler exception]', err);
    return res.status(200).json({
      success: false,
      error: err?.message || 'Internal server error while initiating Cashfree checkout',
      code: 'INTERNAL_ERROR',
      order_id: null,
      payment_session_id: null,
    });
  }
}
