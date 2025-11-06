import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/apiClient';

export default function DocumentSummaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await apiClient.post('/api/ai/summarizeDocument', formData);
        const data = result.data;
        setSummary(data?.summary || 'No summary returned.');
        setMessage('Summary generated successfully!');
      } catch (err) {
        setError('Failed to generate summary. Please try again.');
      }
    } catch (err) {
      setError('Error generating summary. Please try again.');
    } finally {
      setLoading(false);
    }
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
            aria-label="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <h1 className="text-2xl font-bold mb-4 text-center">Document Summary</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="file-upload">Upload Document</label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              required
              aria-label="Upload document for summary"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Generate summary"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Summarizing...
              </span>
            ) : 'Generate Summary'}
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
