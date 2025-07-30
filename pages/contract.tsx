import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // 👈 Add router for redirect
import supabase from '../lib/supabaseClient'; // Supabase client for auth

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
  const router = useRouter(); // Initialize router

  // 🚨 Redirect if user not authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkSession();
  }, [router]);

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [clauses, setClauses] = useState(['']);
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState('');
  const [contractType, setContractType] = useState('Standard Contract');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        alert('You must be signed in to generate a contract.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/generateContract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contractType,
          partyA,
          partyB,
          effectiveDate,
          clauses,
          jurisdiction,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || 'Server returned an error.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setContract(data.result || '');
    } catch (err) {
      console.error(err);
      alert('Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 🧱 Your exact HTML and form layout preserved below
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Contract Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Party A</label>
            <input
              type="text"
              placeholder="e.g. Client Company LLC"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-blue-500"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Contract Type</label>
            <input
              type="text"
              placeholder="e.g. Service Agreement"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-blue-500"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Party B</label>
            <input
              type="text"
              placeholder="e.g. Legal Partner Inc."
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-blue-500"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Effective Date</label>
            <input
              type="date"
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-blue-500"
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
              className="w-full border px-4 py-3 rounded-md focus:ring focus:ring-blue-500"
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
                placeholder={`Clause ${index + 1}`}
                className="w-full border px-4 py-2 rounded-md mb-2 focus:ring focus:ring-blue-500"
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
              className="text-sm text-blue-600 mt-2 hover:underline"
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

        {contract && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-2">Generated Contract:</h2>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border text-sm">
              {contract}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
