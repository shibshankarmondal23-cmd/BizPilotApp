import { getCashfreeConfig } from '../src/server/cashfreeService.ts';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
