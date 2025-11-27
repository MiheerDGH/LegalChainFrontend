// pages/features/legal-review.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import ReviewResults from '../../components/ReviewResults';
import { createClient } from '@supabase/supabase-js';

// ---- Supabase client (browser) ----
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Call Render backend directly
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // e.g. https://legalchainbackend.onrender.com

export default function LegalReviewPage() {
    const [file, setFile] = useState<File | null>(null);
    const [role, setRole] = useState<'sender' | 'recipient' | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [reviewPayload, setReviewPayload] = useState<any>(null);
    const router = useRouter();

    // Prefer Supabase session; fallback to scanning localStorage
    const getAccessToken = async (): Promise<string | null> => {
        try {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.access_token) return data.session.access_token;
        } catch (_) {
            /* ignore */
        }

        if (typeof window !== 'undefined') {
            // Robust scan of localStorage for a JWT or JSON with access_token
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i)!;
                const v = localStorage.getItem(k);
                if (!v) continue;

                // Direct JWT string?
                if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(v)) return v;

                // JSON containers used by various auth libs/Supabase
                try {
                    const o = JSON.parse(v);
                    if (o?.access_token) return o.access_token;
                    if (o?.token) return o.token;
                    if (o?.currentSession?.access_token) return o.currentSession.access_token;
                    if (o?.data?.session?.access_token) return o.data.session.access_token;
                } catch {
                    /* not JSON */
                }
            }
        }
        return null;
    };

    const buildAuthHeaders = async (): Promise<Record<string, string>> => {
        const token = await getAccessToken();
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setError(null);
        setFile(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setReviewPayload(null);

        if (!file || !role) {
            setError('Please choose a role and a document (.txt, .pdf, or .docx).');
            return;
        }

        setLoading(true);
        try {
            const authHeaders = await buildAuthHeaders();
            if (!authHeaders.Authorization) {
                throw new Error('You are not logged in. Please log in to continue.');
            }

            // 1) Upload to get documentId
            const fd = new FormData();
            fd.set('document', file); // FIELD NAME MUST BE 'document'
            const up = await fetch(`${API_BASE}/api/docs/upload`, {
                method: 'POST',
                headers: authHeaders,
                body: fd,
            });
            const upJson = await up.json();
            if (!up.ok) throw new Error(upJson?.error || `Upload failed (${up.status})`);

            const documentId = upJson?.documentId || upJson?.id;
            if (!documentId) throw new Error('Upload response missing documentId');

            // 2) Review by documentId (server reads text from DB/storage)
            const r = await fetch(`${API_BASE}/api/docs/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders },
                body: JSON.stringify({ documentId, role }),
            });
            const reviewJson = await r.json();
            if (!r.ok) throw new Error(reviewJson?.error || `Review failed (${r.status})`);

            setReviewPayload(reviewJson);
            setMessage('Legal review complete!');
        } catch (err: any) {
            console.error('[FE] legal review flow error:', err?.message || err);
            setError(err?.message || 'Failed to run legal review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <div className="mb-4">
                    <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
                        ← Back to Home
                    </button>
                </div>

                {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>}
                {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>}

                <h1 className="text-2xl font-bold mb-6 text-center">Legal Review</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'sender' | 'recipient' | '')}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select role…</option>
                            <option value="sender">Sender</option>
                            <option value="recipient">Recipient</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-2" htmlFor="file-upload">Upload Document (.txt, .pdf, .docx)</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".txt,text/plain,application/pdf,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
                            onChange={handleFileChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file || !role}
                        className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        {loading ? 'Analyzing…' : 'Run Legal Review'}
                    </button>
                </form>

                {reviewPayload && (
                    <ReviewResults results={reviewPayload} className="mt-6 border-t pt-4" />
                )}
            </div>
        </div>
    );
}
