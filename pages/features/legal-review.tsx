import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LegalReviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ai/legalReview', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setReviewResult(data.analysis || 'No analysis returned.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Legal Review</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Upload Document</label>
            <input type="file" onChange={handleFileChange} required className="w-full border p-2 rounded" />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Analyzing...' : 'Run Legal Review'}
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
