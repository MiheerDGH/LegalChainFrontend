import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

interface Contract {
  id: string;
  title: string;
  partyA: string;
  partyB: string;
  createdAt: string;
  downloadUrl?: string;
}

export default function PastContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      setError(null);
      try {
        const session = await supabase.auth.getSession();
        const token = session.data?.session?.access_token;
        if (!token) {
          setError('Session expired. Please log in again.');
          router.push('/login');
          return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contracts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          setError('Failed to fetch contracts.');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setContracts(data);
      } catch (err) {
        setError('Error fetching contracts.');
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Past Contracts</h1>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="ml-4 text-yellow-600 font-semibold">Loading contracts...</span>
          </div>
        ) : error ? (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        ) : contracts.length === 0 ? (
          <p className="text-sm text-gray-500">No contracts found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-gray-50 rounded p-4 shadow">
                <h3 className="font-semibold">{contract.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Parties: {contract.partyA} &amp; {contract.partyB}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Created: {new Date(contract.createdAt).toLocaleString()}
                </p>
                {contract.downloadUrl && (
                  <a
                    href={contract.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                    aria-label={`Download contract ${contract.title}`}
                  >
                    Download Contract
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
