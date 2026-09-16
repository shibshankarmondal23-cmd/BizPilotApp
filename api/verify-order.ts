import { verifyCashfreeOrder } from '../src/server/cashfreeService.ts';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
