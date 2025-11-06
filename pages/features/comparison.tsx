import { useState } from 'react';
import apiClient from '../../lib/apiClient';

export default function DocumentComparisonPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [differences, setDifferences] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile1(e.target.files?.[0] || null);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile2(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!file1 || !file2) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);

      try {
        const result = await apiClient.post('/api/ai/compareDocuments', formData);
        const data = result.data;
        setDifferences(data?.differences || 'No differences returned.');
        setMessage('Comparison complete!');
      } catch (err) {
        setError('Failed to compare documents. Please try again.');
      }
    } catch (err) {
      setError('Error comparing documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Comparison</h1>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="file1-upload">Upload First Document</label>
            <input id="file1-upload" type="file" onChange={handleFile1Change} required className="w-full border rounded p-2" aria-label="Upload first document for comparison" />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="file2-upload">Upload Second Document</label>
            <input id="file2-upload" type="file" onChange={handleFile2Change} required className="w-full border rounded p-2" aria-label="Upload second document for comparison" />
          </div>

          <button
            type="submit"
            disabled={loading || !file1 || !file2}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            aria-label="Compare documents"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Comparing...
              </span>
            ) : 'Compare Documents'}
          </button>
        </form>

        {differences && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold mb-2">Differences:</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{differences}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
