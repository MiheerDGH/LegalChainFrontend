import { useState } from 'react';
import apiClient from '../../lib/apiClient';

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
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
        const result = await apiClient.post('/api/ai/analyze', formData);
        const data = result.data;
        setAnalysisResult(data?.analysis || 'No analysis returned.');
        setMessage('Analysis complete!');
      } catch (err) {
        setError('Analysis failed. Please try again.');
      }
      setMessage('Analysis complete!');
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Analysis</h1>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2" htmlFor="file-upload">Upload Document</label>
            <input id="file-upload" type="file" onChange={handleFileChange} required className="w-full border p-2 rounded" aria-label="Upload document for analysis" />
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            aria-label="Analyze document"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze Document'}
          </button>
        </form>

        {analysisResult && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">AI Analysis:</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{analysisResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
