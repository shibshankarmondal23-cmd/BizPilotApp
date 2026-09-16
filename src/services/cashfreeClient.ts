/**
 * BizPilot Cashfree Client SDK Integration
 * 
 * Manages Cashfree Web SDK loading, session initiation, and order verification.
 * NO SECRET KEYS ARE EVER STORED OR ACCESSED HERE.
 */

import { CashfreeOrderResponse, CashfreeVerificationResponse, CashfreeGatewayConfig, SubscriptionPlanId } from '../types';

declare global {
  interface Window {
    Cashfree?: (config: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_modal';
      }) => Promise<any>;
    };
  }
}

/**
 * Ensures the Cashfree JS SDK v3 is loaded into the browser
 */
export async function loadCashfreeSDK(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (typeof window.Cashfree === 'function') return true;

  const existingScript = document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]');
  if (existingScript) {
    return new Promise((resolve) => {
      if (typeof window.Cashfree === 'function') {
        return resolve(true);
      }
      existingScript.addEventListener('load', () => resolve(typeof window.Cashfree === 'function'));
      existingScript.addEventListener('error', () => resolve(false));
      // Safety timeout
      setTimeout(() => resolve(typeof window.Cashfree === 'function'), 3000);
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(typeof window.Cashfree === 'function');
    script.onerror = () => {
      console.warn('Failed to load Cashfree JS SDK from CDN.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export interface InitiateCheckoutParams {
  planId: SubscriptionPlanId;
  planName?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

/**
 * Calls secure server-side API to create order, then launches Cashfree Checkout
 */
export async function initiateCashfreeCheckout(params: InitiateCheckoutParams): Promise<{
  success: boolean;
  order_id?: string;
  payment_session_id?: string;
  environment?: 'sandbox' | 'production';
  isSandboxPreview?: boolean;
  error?: string;
  code?: string;
}> {
  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: params.planId,
        planName: params.planName,
        customerEmail: params.customerEmail,
        customerName: params.customerName,
        customerPhone: params.customerPhone,
      }),
    });

    const rawText = await res.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.error('[Cashfree Client] Non-JSON response received from /api/create-order:', rawText);
      return {
        success: false,
        error: `Invalid response format from payment server (status ${res.status}): ${rawText.slice(0, 100)}`,
        code: 'INVALID_RESPONSE_FORMAT',
      };
    }

    if (!res.ok || !data.success) {
      const detailedError = data.error || data.message || `Payment server error (${res.status})`;
      console.error('[Cashfree Client] Order creation failed:', {
        status: res.status,
        error: detailedError,
        code: data.code,
        details: data.details,
      });
      return {
        success: false,
        error: detailedError,
        code: data.code || 'CREATE_ORDER_FAILED',
      };
    }

    const paymentSessionId = (data.payment_session_id || data.paymentSessionId || '').trim();
    const orderId = (data.order_id || data.orderId || '').trim();

    // Requirement 7 & 6: Validate payment_session_id exists and is not order_id
    if (!paymentSessionId) {
      console.error('[Cashfree Client] Server did not return a valid payment_session_id:', data);
      return {
        success: false,
        error: data.error || 'Server did not return a valid Cashfree payment_session_id.',
        code: 'MISSING_PAYMENT_SESSION_ID',
      };
    }

    if (paymentSessionId === orderId) {
      console.error('[Cashfree Client] Invalid payment_session_id matched order_id:', { paymentSessionId, orderId });
      return {
        success: false,
        error: 'Invalid payment session ID: matched order ID.',
        code: 'INVALID_PAYMENT_SESSION_ID',
      };
    }

    // Requirement 8: Verify Cashfree Web Checkout SDK is loaded before calling checkout
    const isSdkLoaded = await loadCashfreeSDK();
    if (!isSdkLoaded || typeof (window as any).Cashfree !== 'function') {
      return {
        success: false,
        error: 'Cashfree Web Checkout SDK could not be loaded. Please check your internet connection or ad-blocker.',
        code: 'SDK_LOAD_FAILED',
      };
    }

    // Requirement 5 & 9: Initialize Cashfree instance with exact environment according to CASHFREE_ENV
    const targetMode = data.environment === 'production' ? 'production' : 'sandbox';
    const cashfree = (window as any).Cashfree({
      mode: targetMode,
    });

    if (!cashfree || typeof cashfree.checkout !== 'function') {
      return {
        success: false,
        error: 'Cashfree Web Checkout SDK failed to initialize.',
        code: 'SDK_INIT_FAILED',
      };
    }

    // Requirement 4: The frontend must use that exact returned payment_session_id when initializing Cashfree Web Checkout
    try {
      await cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: '_modal',
      });
    } catch (checkoutErr: any) {
      console.warn('Cashfree modal checkout notice:', checkoutErr?.message || checkoutErr);
    }

    return {
      success: true,
      order_id: orderId,
      payment_session_id: paymentSessionId,
      environment: data.environment,
    };
  } catch (err: any) {
    console.error('[Cashfree Client] Network error while initiating checkout:', err);
    return {
      success: false,
      error: err?.message || 'Network error while initiating payment checkout',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Verify order payment status with server
 */
export async function verifyPayment(orderId: string, planId?: string): Promise<CashfreeVerificationResponse> {
  try {
    const params = new URLSearchParams({ order_id: orderId });
    if (planId) params.append('plan_id', planId);

    const res = await fetch(`/api/verify-order?${params.toString()}`);
    const rawText = await res.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      console.error('[Cashfree Client] Non-JSON response received from /api/verify-order:', rawText);
      return {
        verified: false,
        order_id: orderId,
        order_status: 'UNKNOWN',
        error: `Invalid response format from verification server (${res.status})`,
      };
    }

    return {
      verified: Boolean(data.verified),
      order_id: data.order_id || orderId,
      cf_order_id: data.cf_order_id,
      order_status: data.order_status || (data.verified ? 'PAID' : 'FAILED'),
      plan_id: data.plan_id,
      plan_name: data.plan_name,
      amount: data.amount,
      currency: data.currency,
      customer_email: data.customer_email,
      customer_name: data.customer_name,
      paid_at: data.paid_at,
      entitlement: data.entitlement,
      error: data.error,
    };
  } catch (err: any) {
    console.error('[Cashfree Client] Verification network exception:', err);
    return {
      verified: false,
      order_id: orderId,
      order_status: 'NETWORK_ERROR',
      error: err?.message || 'Failed to communicate with verification server',
    };
  }
}

/**
 * Check whether Cashfree Gateway is configured on the server
 */
export async function getGatewayConfig(): Promise<CashfreeGatewayConfig> {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) {
      return { isConfigured: false, environment: 'sandbox', currency: 'USD' };
    }
    const data = await res.json();
    return {
      isConfigured: Boolean(data.isConfigured),
      environment: data.environment || 'sandbox',
      currency: data.currency || 'USD',
    };
  } catch {
    return { isConfigured: false, environment: 'sandbox', currency: 'USD' };
  }
}
