import { useState } from 'react';

export default function DocumentComparisonPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [differences, setDifferences] = useState('');

  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile1(e.target.files?.[0] || null);
  };

  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile2(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    const res = await fetch('/api/ai/compareDocuments', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setDifferences(data.differences || 'No differences returned.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Comparison</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Upload First Document</label>
            <input type="file" onChange={handleFile1Change} required className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Second Document</label>
            <input type="file" onChange={handleFile2Change} required className="w-full border rounded p-2" />
          </div>

          <button
            type="submit"
            disabled={loading || !file1 || !file2}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Comparing...' : 'Compare Documents'}
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
