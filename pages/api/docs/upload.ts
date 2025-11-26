// pages/api/docs/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 👇 prefer your actual env var name used in .env.local
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL

    if (!backendBase) return res.status(500).json({ error: 'BACKEND_URL not configured' });

    try {
        const { formData } = await parseMultipart(req); // expects 'document'

        // Forward auth if present
        const token = extractToken(req);
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const r = await fetch(`${backendBase}/api/docs/upload`, {
            method: 'POST',
            headers,
            body: formData as any,
        });

        const text = await r.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return res.status(r.status).json(data);
    } catch (err: any) {
        console.error('[FE] upload proxy error:', err?.stack || err?.message || err);
        return res.status(500).json({ error: 'Failed to upload document.', detail: err?.message || String(err) });
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

// Node 18 global FormData/Blob path
async function parseMultipart(req: NextApiRequest): Promise<{ formData: FormData }> {
    const form = new FormData(); // global in Node 18+
    return new Promise((resolve, reject) => {
        try {
            const bb = Busboy({ headers: req.headers });

            bb.on('file', (name, file, info) => {
                const chunks: Buffer[] = [];
                file.on('data', (d: Buffer) => chunks.push(d));
                file.on('limit', () => reject(new Error('File too large')));
                file.on('end', () => {
                    const buf = Buffer.concat(chunks);
                    const blob = new Blob([buf], { type: info.mimeType || 'application/octet-stream' });
                    // 🔧 normalize field name: backend expects 'document'
                    const fieldName = name === 'document' ? name : 'document';
                    form.append(fieldName, blob as any, info.filename || 'upload.bin');
                });
            });

            bb.on('field', (name, val) => form.append(name, val));
            bb.on('error', reject);
            bb.on('finish', () => resolve({ formData: form }));

            (req as any).pipe(bb);
        } catch (e) {
            reject(e);
        }
    });
}
