import { useState } from 'react';
import html2pdf from 'html2pdf.js';

export default function NdaGeneratorPage() {
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [duration, setDuration] = useState('');
  const [confidentialInfo, setConfidentialInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/generateNDA', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyA, partyB, duration, confidentialInfo }),
      });

      const data = await res.json();
      setPreviewContent(data.nda || data.text || 'No content returned.');
    } catch (err) {
      console.error('Error generating NDA:', err);
      setPreviewContent('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const downloadAsPDF = () => {
    const element = document.getElementById('nda-preview');
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: 'nda.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
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
      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">NDA Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Disclosing Party (Party A)</label>
            <input
              type="text"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Startup Inc."
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Receiving Party (Party B)</label>
            <input
              type="text"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Developer LLC"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">NDA Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. 2 years"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Confidential Information Description</label>
            <textarea
              value={confidentialInfo}
              onChange={(e) => setConfidentialInfo(e.target.value)}
              className="w-full border px-4 py-2 rounded"
              placeholder="e.g. Source code, business plans"
              required
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-500 text-white py-3 rounded font-bold ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
            }`}
          >
            {loading ? 'Generating NDA...' : 'Generate NDA'}
          </button>
        </form>
      </div>

      {/* ✅ Inline Preview Section */}
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
            >
              Download PDF
            </button>
            <button
              onClick={downloadAsTXT}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Download TXT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
