// frontend/lib/legalReview.ts
// Calls the BACKEND /api/review endpoint with Supabase JWT and FormData.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g., http://localhost:5000

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ReviewFinding = {
    id: string;
    clauseId?: string;
    clauseTitle?: string;
    clauseText: string;
    issueCode: string;
    issueText: string;
    severity: 'low' | 'med' | 'high';
    references?: { citation: string; caseName?: string; court?: string; date?: string; url?: string }[];
};

export type ReviewResponse = {
    documentId?: string;
    findings?: ReviewFinding[];
    summary?: string;
    role?: 'sender' | 'recipient';
    complianceScore?: number;
    // older temp shape support (if backend still returns it)
    review?: {
        complianceScore: number;
        issues: string[];
        suggestions: string[];
        summary: string;
    };
};

export async function postLegalReviewToBackend(opts: {
    file: File;
    role: 'sender' | 'recipient';
    documentId?: string; // optional if you already created a Document row
}): Promise<ReviewResponse> {
    const { file, role, documentId } = opts;

    // v1 requires .txt (keep the guard client-side too)
    if (!file.name.toLowerCase().endsWith('.txt')) {
        throw new Error('Only .txt files are supported in v1.');
    }

    // Supabase session → access token
    const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
    if (sessErr) throw new Error(`Auth error: ${sessErr.message}`);
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error('You must be logged in to run Legal Review.');

    const form = new FormData();
    form.append('document', file);      // FIELD NAME MUST BE 'document'
    form.append('role', role);          // 'sender' | 'recipient'
    if (documentId) form.append('documentId', documentId);

    const res = await fetch(`${API_BASE}/api/review`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`, // backend will verify
            // DO NOT set Content-Type; the browser sets multipart boundary for FormData
        },
        body: form,
    });

    // Helpful error surfacing for the UI
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const msg = text || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return (await res.json()) as ReviewResponse;
}