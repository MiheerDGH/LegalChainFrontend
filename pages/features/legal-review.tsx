// frontend/pages/features/legal-review.tsx (or your path)
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LegalReviewPage() {
    const [file, setFile] = useState<File | null>(null);
    const [role, setRole] = useState<'sender' | 'recipient' | ''>('');
    const [loading, setLoading] = useState(false);
    const [reviewResult, setReviewResult] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setFile(f);
        setError(null);
        if (f && f.type !== 'text/plain' && !f.name.toLowerCase().endsWith('.txt')) {
            setError('Please upload a .txt file for v1.');
            setFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (!file || !role) {
            setError('Please choose a role and a .txt document.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('document', file);       // << required name
            formData.append('role', role);           // << required field

            const res = await fetch('/api/ai/legalReview', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const txt = await res.text().catch(()=>'');
                setError(`Failed to run legal review. Please try again. ${txt ? `Details: ${txt}` : ''}`);
                return;
            }
            const data = await res.json();
            // The temp API should return { review, role }
            setReviewResult(JSON.stringify(data.review ?? data, null, 2));
            setMessage('Legal review complete!');
        } catch {
            setError('Error running legal review. Please try again.');
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
                        <label className="block font-medium mb-2" htmlFor="file-upload">Upload Document (.txt only)</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".txt,text/plain"
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

                {reviewResult && (
                    <div className="mt-6 border-t pt-4">
                        <h2 className="text-lg font-semibold mb-2">Analysis Result:</h2>
                        <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{reviewResult}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
