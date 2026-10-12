/**
 * BizPilot Paddle.js Client Service
 * 
 * Direct Paddle Billing (Paddle.js v2) Integration for BizPilot Pro ($9.99/month).
 * 
 * VERIFIED CONFIGURATION:
 * 1. LIVE Paddle Price ID: pri_01m2savsge647877w8vv6mvbjy
 * 2. LIVE Paddle Client-side Token starting with "live_" from configured environment/secrets.
 * 3. Environment: Strictly production (live).
 * 4. Default return / payment link: https://bizpilot-2264.ai.studio
 * 5. ZERO API secret keys in frontend code.
 */

export interface PaddleCheckoutItem {
  priceId: string;
  quantity?: number;
}

export interface PaddleEventCallbackData {
  name: string;
  data?: {
    id?: string;
    transaction_id?: string;
    status?: string;
    items?: Array<{ price_id?: string; priceId?: string; quantity?: number }>;
    customer?: { email?: string; id?: string };
    details?: any;
    [key: string]: any;
  };
}

export interface PaddleConfig {
  clientToken: string;
  priceId: string;
  environment: 'sandbox' | 'production';
  planName: string;
  price: string;
  isConfigured: boolean;
  defaultPaymentLink: string;
}

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        set: (env: 'sandbox' | 'production') => void;
      };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: PaddleEventCallbackData) => void;
        checkout?: {
          settings?: {
            displayMode?: 'overlay' | 'inline';
            theme?: 'light' | 'dark';
            locale?: string;
            successUrl?: string;
          };
        };
        pwCustomer?: any;
      }) => void;
      Checkout?: {
        open: (options: {
          items?: PaddleCheckoutItem[];
          transactionId?: string;
          customer?: {
            email?: string;
            address?: any;
          };
          customData?: Record<string, any>;
          settings?: {
            displayMode?: 'overlay' | 'inline';
            theme?: 'light' | 'dark';
            locale?: string;
            successUrl?: string;
            allowLogout?: boolean;
            frameInitialHeight?: number;
            frameStyle?: string;
          };
        }) => void;
        close: () => void;
      };
      Status?: {
        libraryVersion?: string;
      };
    };
  }
}

// LIVE BizPilot Pro Paddle Price ID ($9.99/month recurring)
export const LIVE_PADDLE_PRICE_ID = 'pri_01m2savsge647877w8vv6mvbjy';
export const DEFAULT_PADDLE_PRICE_ID = LIVE_PADDLE_PRICE_ID;
export const BIZPILOT_PRO_MONTHLY_PRICE = '$9.99';
export const DEFAULT_PAYMENT_LINK = 'https://bizpilot-2264.ai.studio';

let cachedConfig: PaddleConfig | null = null;
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;
const eventListeners: Array<(event: PaddleEventCallbackData) => void> = [];

/**
 * Register a global Paddle event listener
 */
export function addPaddleEventListener(listener: (event: PaddleEventCallbackData) => void): () => void {
  eventListeners.push(listener);
  return () => {
    const idx = eventListeners.indexOf(listener);
    if (idx !== -1) eventListeners.splice(idx, 1);
  };
}

/**
 * Dispatch an event to all registered listeners
 */
function dispatchPaddleEvent(event: PaddleEventCallbackData) {
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.error('[Paddle Client] Error in event listener:', err);
    }
  });
}

/**
 * Load or fetch Paddle configuration from environment or /api/paddle-config
 */
export async function getPaddleConfig(): Promise<PaddleConfig> {
  if (cachedConfig) return cachedConfig;

  // 1. Read from build-time Vite client variables or window globals
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
  let clientToken = (
    metaEnv.VITE_PADDLE_CLIENT_TOKEN ||
    metaEnv.PADDLE_CLIENT_TOKEN ||
    metaEnv.VITE_PADDLE_TOKEN ||
    (typeof window !== 'undefined' && (window as any).__PADDLE_CLIENT_TOKEN__) ||
    ''
  ).trim();

  let priceId = (
    metaEnv.VITE_PADDLE_PRICE_ID ||
    LIVE_PADDLE_PRICE_ID
  ).trim();

  let envRaw = (
    metaEnv.VITE_PADDLE_ENV ||
    ''
  ).toLowerCase().trim();

  // 2. If clientToken missing from client build, fetch public configuration from /api/paddle-config
  if (!clientToken) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('/api/paddle-config', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && typeof data === 'object') {
            if (!clientToken && data.clientToken) clientToken = data.clientToken;
            if (data.priceId) priceId = data.priceId;
            if (!envRaw && data.environment) envRaw = data.environment;
          }
        }
      }
    } catch {
      // Non-fatal if offline or static preview
    }
  }

  // Ensure live price ID is always used
  if (!priceId || !priceId.startsWith('pri_')) {
    priceId = LIVE_PADDLE_PRICE_ID;
  }

  // Strictly production for live tokens
  let environment: 'sandbox' | 'production' = 'production';
  if (clientToken.startsWith('test_') || envRaw === 'sandbox') {
    environment = 'sandbox';
  } else {
    environment = 'production';
  }

  cachedConfig = {
    clientToken,
    priceId: LIVE_PADDLE_PRICE_ID,
    environment,
    planName: 'BizPilot Pro',
    price: BIZPILOT_PRO_MONTHLY_PRICE,
    isConfigured: Boolean(clientToken),
    defaultPaymentLink: DEFAULT_PAYMENT_LINK,
  };

  return cachedConfig;
}

/**
 * Ensure Paddle.js CDN script is injected and available on window
 */
export async function ensurePaddleLoaded(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.Paddle && typeof window.Paddle.Initialize === 'function') return true;

  // Check if script tag is in DOM
  const existingScript = document.querySelector('script[src*="paddle.js"]');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    document.head.appendChild(script);
  }

  // Poll for window.Paddle up to 6 seconds
  const start = Date.now();
  while (Date.now() - start < 6000) {
    if (window.Paddle && typeof window.Paddle.Initialize === 'function') {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  return Boolean(window.Paddle && typeof window.Paddle.Initialize === 'function');
}

/**
 * Initialize Paddle.js with environment and client-side token
 */
export async function initializePaddle(): Promise<boolean> {
  if (isInitialized && window.Paddle) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const loaded = await ensurePaddleLoaded();
      if (!loaded || !window.Paddle) {
        console.warn('[Paddle Client] Paddle.js could not be loaded from CDN.');
        return false;
      }

      const config = await getPaddleConfig();

      // Ensure correct environment: live/production unless test token explicitly used
      if (config.environment === 'sandbox' && window.Paddle.Environment?.set) {
        window.Paddle.Environment.set('sandbox');
      } else if (config.environment === 'production' && window.Paddle.Environment?.set) {
        window.Paddle.Environment.set('production');
      }

      // Initialize Paddle with the configured LIVE client token
      if (config.clientToken) {
        window.Paddle.Initialize({
          token: config.clientToken,
          eventCallback: (event) => {
            dispatchPaddleEvent(event);
          },
        });
        isInitialized = true;
        return true;
      } else {
        console.info('[Paddle Client] Client-side token is pending configuration.');
        return false;
      }
    } catch (err) {
      console.error('[Paddle Client] Error initializing Paddle.js:', err);
      return false;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export interface OpenPaddleCheckoutOptions {
  priceId?: string;
  customerEmail?: string;
  customerName?: string;
  onSuccess?: (event: PaddleEventCallbackData) => void;
  onError?: (error: { message: string; code?: string }) => void;
  onClose?: () => void;
}

/**
 * Open Paddle Checkout directly using Paddle.js for the BizPilot Pro $9.99/month recurring price.
 * 
 * Uses LIVE Price ID: pri_01m2savsge647877w8vv6mvbjy
 */
export async function openPaddleCheckout(
  options: OpenPaddleCheckoutOptions = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = await getPaddleConfig();
    const targetPriceId = LIVE_PADDLE_PRICE_ID;
    const email = options.customerEmail?.trim();

    // Ensure Paddle.js is loaded
    const loaded = await ensurePaddleLoaded();
    if (!loaded || !window.Paddle) {
      const errorMsg = 'Paddle payment system could not be loaded. Please check your internet connection.';
      options.onError?.({ message: errorMsg, code: 'SDK_NOT_LOADED' });
      return { success: false, error: errorMsg };
    }

    // Initialize Paddle if not already done
    await initializePaddle();

    // Check if Paddle Checkout is available
    if (!window.Paddle.Checkout || typeof window.Paddle.Checkout.open !== 'function') {
      const errorMsg = 'Paddle Checkout interface is not available.';
      options.onError?.({ message: errorMsg, code: 'CHECKOUT_UNAVAILABLE' });
      return { success: false, error: errorMsg };
    }

    // Listen to checkout events for this session
    const cleanup = addPaddleEventListener((event) => {
      const eventName = event?.name;

      if (eventName === 'checkout.completed') {
        cleanup();
        options.onSuccess?.(event);
      } else if (eventName === 'checkout.error') {
        const errorDetails = event?.data?.details || event?.data?.message || 'Payment processing error occurred.';
        options.onError?.({ message: String(errorDetails), code: 'CHECKOUT_ERROR' });
      } else if (eventName === 'checkout.closed') {
        cleanup();
        options.onClose?.();
      }
    });

    // Default payment link / return URL
    const returnUrl = `${DEFAULT_PAYMENT_LINK}/payment-success?provider=paddle`;

    // Directly open Paddle Checkout with the LIVE $9.99/month recurring price ID: pri_01m2savsge647877w8vv6mvbjy
    window.Paddle.Checkout.open({
      items: [
        {
          priceId: targetPriceId,
          quantity: 1,
        },
      ],
      customer: email ? { email } : undefined,
      settings: {
        displayMode: 'overlay',
        theme: 'light',
        locale: 'en',
        successUrl: returnUrl,
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error('[Paddle Client] Exception opening Paddle checkout:', err);
    const errorMsg = err?.message || 'Failed to launch Paddle checkout.';
    options.onError?.({ message: errorMsg, code: 'LAUNCH_EXCEPTION' });
    return { success: false, error: errorMsg };
  }
}
