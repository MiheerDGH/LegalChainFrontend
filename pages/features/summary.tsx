import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DocumentSummaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ai/summarizeDocument', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setSummary(data.summary || 'No summary returned.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
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

        <h1 className="text-2xl font-bold mb-4 text-center">Document Summary</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Upload Document</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Summarizing...' : 'Generate Summary'}
          </button>
        </form>

        {summary && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold mb-2">Summary:</h2>
            <p className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
