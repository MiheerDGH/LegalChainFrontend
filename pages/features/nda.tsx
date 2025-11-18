import { useState } from 'react';
import ReviewResults from '../../components/ReviewResults';
import apiClient from '../../lib/apiClient';

export default function NdaGeneratorPage() {
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [duration, setDuration] = useState('');
  const [confidentialInfo, setConfidentialInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [reviewResults, setReviewResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      try {
        const result = await apiClient.post('/api/ai/generateNDA', { partyA, partyB, duration, confidentialInfo });
        const data = result.data;
        setPreviewContent(data?.nda || data?.text || 'No content returned.');
      } catch (err: any) {
        setError('Failed to generate NDA. Please try again.');
        setLoading(false);
        return;
      }
      setReviewResults(null);
      setMessage('NDA generated successfully!');
    } catch (err) {
      setError('Error generating NDA. Please try again.');
      setPreviewContent('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!previewContent) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      try {
        const result = await apiClient.post('/api/ai/review', { ndaContent: previewContent });
        setReviewResults(result.data);
        setMessage('NDA review complete!');
      } catch (err: any) {
        setError('Failed to review NDA. Please try again.');
        setReviewResults({ issues: ['Review failed. Please try again.'], suggestions: [], authorities: [] });
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Error reviewing NDA. Please try again.');
      setReviewResults({ issues: ['An error occurred during review.'], suggestions: [], authorities: [] });
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = () => {
    const element = document.getElementById('nda-preview');
    if (!element) return;
    // load html2pdf only on the client when needed (avoid SSR issues)
    (async () => {
      try {
        const mod = await import('html2pdf.js');
        const html2pdf = (mod && (mod as any).default) || mod;
        const opt = {
          margin: 0.5,
          filename: 'nda.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {},
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };
        html2pdf().from(element).set(opt).save();
      } catch (err) {
        console.error('Failed to load html2pdf:', err);
        setError('PDF download is not available in this environment.');
      }
    })();
  };

  const downloadAsTXT = () => {
    if (!previewContent) return;
    const blob = new Blob([previewContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nda.txt';
    link.click();
  };

  return (
  <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4 flex flex-col items-center">
      {/* 🔙 Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => (window.location.href = 'http://localhost:3000/')}
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Home
        </button>
      </div>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">NDA Generator</h1>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1" htmlFor="partyA">Disclosing Party (Party A)</label>
            <input
              id="partyA"
              type="text"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Startup Inc."
              required
              aria-label="Disclosing Party"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="partyB">Receiving Party (Party B)</label>
            <input
              id="partyB"
              type="text"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Developer LLC"
              required
              aria-label="Receiving Party"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="duration">NDA Duration</label>
            <input
              id="duration"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. 2 years"
              required
              aria-label="NDA Duration"
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="confidentialInfo">Confidential Information Description</label>
            <textarea
              id="confidentialInfo"
              value={confidentialInfo}
              onChange={(e) => setConfidentialInfo(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Source code, business plans"
              required
              rows={4}
              aria-label="Confidential Information Description"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-500 text-white py-3 rounded font-bold ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
              }`}
              aria-label="Generate NDA"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating NDA...
                </span>
              ) : 'Generate NDA'}
            </button>
          </div>
        </form>
      </div>

      {/* Inline Preview Section */}
      {previewContent && (
        <div className="bg-white mt-10 p-6 rounded-xl shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Generated NDA</h2>
          <div
            id="nda-preview"
            className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed border p-4 rounded bg-gray-50"
          >
            {previewContent}
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={downloadAsPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              aria-label="Download NDA as PDF"
            >
              Download PDF
            </button>
            <button
              onClick={downloadAsTXT}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              aria-label="Download NDA as TXT"
            >
              Download TXT
            </button>
          </div>

          {/* Review Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Review NDA</h3>
            <button
              onClick={handleReview}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              aria-label="Review NDA"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Reviewing...
                </span>
              ) : 'Review NDA'}
            </button>

            {reviewResults && (
              <ReviewResults results={reviewResults} className="mt-4" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
