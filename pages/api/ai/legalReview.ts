// pages/api/ai/legalReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 👇 prefer your actual env var name used in .env.local
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendBase) return res.status(500).json({ error: 'BACKEND_URL not configured' });

    try {
        const { documentId, role } = req.body || {};
        if (!documentId || !role) return res.status(400).json({ error: 'documentId and role are required' });

        const token = extractToken(req);
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const r = await fetch(`${backendBase}/api/docs/review`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ documentId, role }),
        });

        const text = await r.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return res.status(r.status).json(data);
    } catch (err: any) {
        console.error('[FE] legalReview proxy error:', err?.stack || err?.message || err);
        return res.status(500).json({ error: 'Failed to run legal review. Please try again.', detail: err?.message || String(err) });
    }
}

function extractToken(req: NextApiRequest): string | undefined {
    const auth = req.headers['authorization'];
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7);
    const cookie = req.headers.cookie || '';
    const pick = (name: string) => {
        const m = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
        return m ? decodeURIComponent(m[1]) : undefined;
    };
    return pick('token') || pick('access_token') || pick('sb-access-token') || pick('sb:token') || undefined;
}
