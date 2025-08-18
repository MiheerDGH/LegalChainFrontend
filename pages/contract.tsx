import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

const jurisdictions = [
  { id: 'US-CA', label: 'California, United States' },
  { id: 'US-NY', label: 'New York, United States' },
  { id: 'US-TX', label: 'Texas, United States' },
  { id: 'UK-ENG', label: 'England, United Kingdom' },
  { id: 'CA-ON', label: 'Ontario, Canada' },
  { id: 'AU-NSW', label: 'New South Wales, Australia' },
  { id: 'IN-DL', label: 'Delhi, India' },
];

export default function ContractCreationPage() {
  const router = useRouter();

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [clauses, setClauses] = useState(['']);
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState('');
  const [contractType, setContractType] = useState('Standard Contract');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkSession();
  }, [router]);

  const makeClauseKeywords = (list: string[]) =>
    Array.from(
      new Set(
        (list || [])
          .map(c => (c || '').toLowerCase())
          .flatMap(c =>
            c
              .replace(/[^a-z0-9\s]/gi, ' ')
              .split(/\s+/)
              .filter(w => w.length > 3)
          )
      )
    ).slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      const session = refreshData?.session;

      if (refreshError || !session) {
        console.error("❌ Session refresh failed:", refreshError);
        alert('Please re-login.');
        setLoading(false);
        return;
      }

      const token = session.access_token;
      console.log("🪪 Refreshed Supabase token sent:", token);

      if (!token) {
        alert('You must be signed in to generate a contract.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/generateContract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractType,
          partyA,
          partyB,
          effectiveDate,
          clauses,
          jurisdiction,
          clauseKeywords: makeClauseKeywords(clauses),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ API error ${res.status}:`, errorText);
        throw new Error(`Request failed with status ${res.status}`);
      }

      const responseData = await res.json();
      console.log("🧾 Contract response:", responseData);
      setContract(responseData.contract || 'No contract generated.');
    } catch (err) {
      console.error(err);
      alert('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = async () => {
    const element = document.getElementById('contract-preview');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf().from(element).set({
      margin: 0.5,
      filename: `${contractType.replace(/\s+/g, '_')}_Contract.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  const downloadAsTXT = () => {
    const blob = new Blob([contract], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${contractType.replace(/\s+/g, '_')}_Contract.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Contract Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Party A</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md"
              placeholder="e.g. Client Company LLC"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Contract Type</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md"
              placeholder="e.g. Service Agreement"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Party B</label>
            <input
              type="text"
              className="w-full border px-4 py-3 rounded-md"
              placeholder="e.g. Legal Partner Inc."
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Effective Date</label>
            <input
              type="date"
              className="w-full border px-4 py-3 rounded-md"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="jurisdiction" className="block font-medium mb-1">
              Jurisdiction (Governing Law)
            </label>
            <select
              id="jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full border px-4 py-3 rounded-md"
              required
            >
              <option value="">Select a state or country</option>
              {jurisdictions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              The legal region whose laws apply to this agreement.
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Clause Types</label>
            {clauses.map((clause, index) => (
              <input
                key={index}
                type="text"
                className="w-full border px-4 py-2 rounded-md mb-2"
                placeholder={`Clause ${index + 1}`}
                value={clause}
                onChange={(e) => {
                  const updated = [...clauses];
                  updated[index] = e.target.value;
                  setClauses(updated);
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => setClauses([...clauses, ''])}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add Clause
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Contract'}
          </button>
        </form>
      </div>

      {/* ✅ Inline Preview Section */}
      {contract && (
        <div className="bg-white mt-10 p-6 rounded-xl shadow-md w-full max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Generated Contract</h2>
          <div
            id="contract-preview"
            className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed border p-4 rounded bg-gray-50"
          >
            {contract}
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
