import { useState } from 'react';

export default function NdaGeneratorPage() {
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [duration, setDuration] = useState('');
  const [confidentialInfo, setConfidentialInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [ndaText, setNdaText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ai/generateNDA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partyA, partyB, duration, confidentialInfo }),
    });

    const data = await res.json();
    setNdaText(data.nda || '');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">NDA Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Party A */}
          <div>
            <label className="block font-medium mb-1">Disclosing Party (Party A)</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-yellow-500"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              placeholder="e.g. Startup Inc."
              required
            />
          </div>

          {/* Party B */}
          <div>
            <label className="block font-medium mb-1">Receiving Party (Party B)</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-yellow-500"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              placeholder="e.g. Developer LLC"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block font-medium mb-1">NDA Duration</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-yellow-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 2 years"
              required
            />
          </div>

          {/* Confidential Info */}
          <div>
            <label className="block font-medium mb-1">Confidential Information Description</label>
            <textarea
              rows={3}
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-yellow-500"
              value={confidentialInfo}
              onChange={(e) => setConfidentialInfo(e.target.value)}
              placeholder="e.g. Source code, business plans, client data"
              required
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-yellow-500 text-white font-semibold rounded-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
            }`}
          >
            {loading ? 'Generating NDA...' : 'Generate NDA'}
          </button>
        </form>

        {/* NDA Output */}
        {ndaText && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-2">Generated NDA:</h2>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border text-sm">{ndaText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

