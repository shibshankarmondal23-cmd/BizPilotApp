import { createCashfreeOrder } from '../src/server/cashfreeService.ts';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
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
