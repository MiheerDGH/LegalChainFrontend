Dev backend debug middleware (Next.js API routes)

Purpose:
- In development, make API routes return structured JSON on errors and log request body + headers. This helps the frontend avoid HTML 500 pages and makes debugging easier.

Usage:
- Place the helper below in your backend repo (next.js API route project). Import and wrap API handlers in development only.

Example wrapper (Next.js API route):

```ts
// utils/devApiWrapper.ts
import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';

export function devApiWrapper(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (err) {
      // Log request body + headers for dev
      // eslint-disable-next-line no-console
      console.error('DEV API ERROR:', {
        path: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body,
        error: err,
      });

      if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
          error: String(err?.message || err || 'Internal Server Error'),
          stack: String(err?.stack || ''),
          request: {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
          },
        });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
```

How to use in an API route:

```ts
import { devApiWrapper } from '../../utils/devApiWrapper';

async function handler(req, res) {
  // your route logic
}

export default devApiWrapper(handler);
```

Note: This wrapper only catches synchronous and asynchronous exceptions thrown from the handler. For errors returned as statuses, make sure to `throw new Error('...')` or `res.status(500).json(...)` as appropriate in your handler.

If your backend is not Next.js (Express, Fastify, etc.), the same pattern applies: add a small top-level error handler that logs the request body + headers and returns JSON when NODE_ENV=development.

Security note: Only enable this in development. Do not ship request bodies or headers to logs in production.
