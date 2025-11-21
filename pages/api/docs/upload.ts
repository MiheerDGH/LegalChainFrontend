// pages/api/docs/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Busboy from 'busboy';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL;
    if (!backendBase) return res.status(500).json({ error: 'BACKEND_URL not configured' });

    try {
        const { formData } = await parseMultipart(req); // expects field name 'document'

        const headers: Record<string, string> = {};
        const token = extractToken(req);
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const r = await fetch(`${backendBase}/api/docs/upload`, { method: 'POST', headers, body: formData as any });
        const text = await r.text();
        let data: any;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return res.status(r.status).json(data);
    } catch (err: any) {
        console.error('[FE] upload proxy error:', err?.message || err);
        return res.status(500).json({ error: 'Failed to upload document.' });
    }
}

function extractToken(req: NextApiRequest): string | undefined {
    const auth = req.headers['authorization'];
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7);
    const cookie = req.headers.cookie || '';
    const m = cookie.match(/(?:^|;\s*)token=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Parse multipart with Busboy and build a native FormData using Node 18's global Web APIs.
 * We avoid importing 'undici' entirely.
 */
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
                    // Append Blob with a filename; Node’s fetch will send it as a file part
                    form.append(name, blob as any, info.filename || 'upload.bin');
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
