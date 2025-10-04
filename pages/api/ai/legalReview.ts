// pages/api/ai/legalReview.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'node:fs/promises';

export const config = { api: { bodyParser: false } };

type Review = {
    complianceScore: number;
    issues: string[];
    suggestions: string[];
    summary: string;
};

function first<T>(v: T | T[] | undefined): T | undefined {
    if (Array.isArray(v)) return v[0];
    return v;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    try {
        const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
            const form = formidable({ multiples: false, keepExtensions: true });
            form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
        });

        // Normalize role (could be string | string[] | undefined)
        const rawRole = first(fields.role as unknown as string | string[] | undefined);
        const role = typeof rawRole === 'string' ? rawRole.toLowerCase() : '';

        if (role !== 'sender' && role !== 'recipient') {
            res.status(400).send('Missing or invalid role. Expected "sender" or "recipient".');
            return;
        }

        // Normalize file (could be File | File[] | undefined)
        const rawFile = first(files.document as unknown as FormidableFile | FormidableFile[] | undefined);
        if (!rawFile) {
            res.status(400).send('Missing file. Use field name "document".');
            return;
        }

        const name = (rawFile.originalFilename || '').toLowerCase();
        if (!name.endsWith('.txt')) {
            res.status(400).send('Only .txt files are supported in v1.');
            return;
        }

        const text = await fs.readFile(rawFile.filepath, 'utf8');

        // --- TEMP REVIEW OBJECT (stubbed) ---
        const review: Review = {
            complianceScore: 42,
            issues: [
                'Uncapped punitive/consequential damages detected',
                'Termination without notice detected',
                'Overbroad confidentiality carve-out detected',
                'Invalid governing law detected',
            ],
            suggestions: [
                'Add a clear liability cap (e.g., fees paid in last 12 months).',
                'Require a minimum notice period (e.g., 30 days).',
                'Remove discretionary disclosure carve-out or restrict to legal/regulatory.',
                'Use a valid governing law for your jurisdiction.',
            ],
            summary: `Reviewed ${name} for role: ${role}.`,
        };

        res.status(200).json({ review, role });
    } catch (e: any) {
        res.status(500).send(e?.message ?? 'Unexpected error');
    }
}