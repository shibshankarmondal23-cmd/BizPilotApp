import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import { createCashfreeOrder, verifyCashfreeOrder, getCashfreeConfig } from './src/server/cashfreeService';

function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
    if (req.readableEnded) {
      resolve({});
    }
  });
}

function cashfreeApiPlugin(): Plugin {
  return {
    name: 'cashfree-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
        const hostStr = typeof rawHost === 'string' ? rawHost : 'localhost:3000';
        const url = new URL(req.url || '', `http://${hostStr}`);
        const pathname = (url.pathname || '').replace(/\/+$/, '');

        if (!pathname.startsWith('/api')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        if (pathname === '/api/config') {
          const config = getCashfreeConfig();
          res.statusCode = 200;
          return res.end(JSON.stringify({
            isConfigured: config.isConfigured,
            environment: config.environment,
            currency: config.currency,
          }));
        }

        if (pathname === '/api/create-order') {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            return res.end(JSON.stringify({
              success: false,
              error: 'Method Not Allowed. Use POST.',
              order_id: null,
              payment_session_id: null,
            }));
          }

          try {
            const body = await parseRequestBody(req);
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const origin = `${protocol}://${hostStr}`;

            const result = await createCashfreeOrder({
              planIdentifier: body.planId || body.planName || 'monthly-promo',
              customerEmail: body.customerEmail,
              customerName: body.customerName,
              customerPhone: body.customerPhone,
              returnUrl: body.returnUrl,
              origin,
            });

            // Return 200 with standard JSON response body
            // Prevents Nginx/Cloud Run reverse proxies from intercepting with an HTML error page
            res.statusCode = 200;
            return res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('[API /api/create-order Error]', err);
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: false,
              error: err?.message || 'Server error while processing order creation',
              code: 'INTERNAL_ERROR',
              order_id: null,
              payment_session_id: null,
            }));
          }
        }

        if (pathname === '/api/verify-order') {
          let orderId = url.searchParams.get('order_id') || url.searchParams.get('orderId') || '';
          let planId = url.searchParams.get('plan_id') || url.searchParams.get('planId') || '';

          if (req.method === 'POST') {
            try {
              const body = await parseRequestBody(req);
              orderId = orderId || body.order_id || body.orderId || '';
              planId = planId || body.plan_id || body.planId || '';
            } catch {
              // ignore
            }
          }

          if (!orderId) {
            res.statusCode = 200;
            return res.end(JSON.stringify({
              verified: false,
              error: 'order_id parameter is required for payment verification',
            }));
          }

          try {
            const result = await verifyCashfreeOrder(orderId, planId);
            res.statusCode = 200;
            return res.end(JSON.stringify(result));
          } catch (err: any) {
            console.error('[API /api/verify-order Error]', err);
            res.statusCode = 200;
            return res.end(JSON.stringify({
              verified: false,
              order_id: orderId,
              order_status: 'FAILED',
              error: err?.message || 'Server verification error',
            }));
          }
        }

        if (pathname === '/api/webhook') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ status: 'received' }));
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of Object.keys(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = env[key];
    }
  }

  return {
    plugins: [react(), tailwindcss(), cashfreeApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
