/**
 * Serverless API Function: /api/config
 * Fully self-contained for Vercel production deployment.
 * 
 * CRITICAL SECURITY DIRECTIVES:
 * 1. CASHFREE_CLIENT_SECRET and CASHFREE_CLIENT_ID are NEVER returned to the browser.
 * 2. Only public gateway state (isConfigured, environment, currency) is exposed.
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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const config = getCashfreeConfig();

  // Return public config safely — NEVER expose secret key or client id if not needed
  return res.status(200).json({
    isConfigured: config.isConfigured,
    environment: config.environment,
    currency: config.currency,
  });
}
