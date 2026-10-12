/**
 * Serverless API Function: /api/paddle-config
 * Fully self-contained for production deployment.
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. ZERO secret keys are ever handled or returned here.
 * 2. Only public, client-safe Paddle parameters (client-side token, live price ID, environment) are returned.
 * 3. Never returns or exposes Paddle API Secret Keys.
 */

import dotenv from 'dotenv';

if (typeof process !== 'undefined') {
  try {
    dotenv.config();
    dotenv.config({ path: '.env.local' });
  } catch {
    // Non-fatal
  }
}

export const LIVE_PADDLE_PRICE_ID = 'pri_01m2savsge647877w8vv6mvbjy';
export const DEFAULT_PAYMENT_LINK = 'https://bizpilot-2264.ai.studio';

export function getPaddleServerConfig() {
  const clientToken = (
    process.env.PADDLE_CLIENT_TOKEN ||
    process.env.VITE_PADDLE_CLIENT_TOKEN ||
    process.env.PADDLE_CLIENT_SIDE_TOKEN ||
    process.env.PADDLE_LIVE_CLIENT_TOKEN ||
    process.env.LIVE_PADDLE_CLIENT_TOKEN ||
    process.env.PADDLE_TOKEN ||
    process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
    ''
  ).trim();

  const priceId = (
    process.env.PADDLE_PRICE_ID ||
    process.env.VITE_PADDLE_PRICE_ID ||
    process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ||
    LIVE_PADDLE_PRICE_ID
  ).trim();

  const envRaw = (
    process.env.PADDLE_ENV ||
    process.env.VITE_PADDLE_ENV ||
    process.env.NEXT_PUBLIC_PADDLE_ENV ||
    ''
  ).toLowerCase().trim();

  // If token starts with live_ or environment is not explicitly sandbox, strictly use production
  const environment = (envRaw === 'sandbox' || clientToken.startsWith('test_')) ? 'sandbox' : 'production';

  return {
    clientToken,
    priceId: priceId || LIVE_PADDLE_PRICE_ID,
    environment,
    isConfigured: Boolean(clientToken),
    planName: 'BizPilot Pro',
    price: '$9.99',
    billingCycle: 'month',
    defaultPaymentLink: DEFAULT_PAYMENT_LINK,
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const config = getPaddleServerConfig();

  return res.status(200).json(config);
}
