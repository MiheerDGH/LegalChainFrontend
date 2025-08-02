import { useState } from 'react';

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ai/analyze', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setAnalysisResult(data.analysis || 'No analysis returned.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Analysis</h1>

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
            {loading ? 'Analyzing...' : 'Analyze Document'}
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
