import { useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import apiClient from '../lib/apiClient';

type Doc = { id: string; name: string; createdAt: string; url?: string };

export default function PastContractsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) router.push('/login');
    })();
  }, [router]);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (!token) {
        setError('Session expired. Please sign in again.');
        router.push('/login');
        return;
      }

      const res = await apiClient.get('/api/docs', { headers: { Authorization: `Bearer ${token}` } });
      setDocs(res.data || []);
    } catch (err: any) {
      console.error('Failed to fetch past contracts:', err);
      setError(err?.message || 'Failed to fetch documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDownload = async (id: string) => {
    setError(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;
      if (!token) {
        setError('Session expired. Please sign in again.');
        router.push('/login');
        return;
      }

      // Try to get a signed url from backend
      try {
        const res = await apiClient.get(`/api/docs/download/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = res.data || {};
        if (data?.url) {
          window.open(data.url, '_blank');
          return;
        }
      } catch (e) {
        // fallback to proxy download below
        console.warn('Signed url fetch failed, falling back to proxy download', e);
      }

      // Fallback: fetch blob from proxy endpoint and download
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const dlUrl = `${base.replace(/\/$/, '')}/api/docs/download/${id}`;
      const resp = await fetch(dlUrl, { headers: { Authorization: `Bearer ${session.data?.session?.access_token}` } });
      if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
      const blob = await resp.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const item = docs.find(d => d.id === id);
      a.download = item?.name || 'document.pdf';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err?.message || 'Download failed.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Past Contracts</h1>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-blue-600 underline">Back to Dashboard</button>
        </div>

        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div>Loading documents...</div>
        ) : docs.length === 0 ? (
          <div>No past contracts found.</div>
        ) : (
          <ul className="space-y-3">
            {docs.map((d) => (
              <li key={d.id} className="p-4 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium break-all">{d.name}</div>
                  <div className="text-xs text-gray-500">Uploaded: {new Date(d.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleDownload(d.id)} className="bg-blue-600 text-white px-3 py-1 rounded">Download</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
