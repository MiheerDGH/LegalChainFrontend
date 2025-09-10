import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import DocumentUploader from '../components/DocumentUploader';
import AnalysisResult from '../components/AnalysisResult';
import supabase from '../lib/supabaseClient';

interface Document {
  id: string;
  name: string;
  url: string;
  analysis?: string;
  createdAt: string;
}

interface Analysis {
  summary: string;
  clauses: string[];
  risks: string[];
}

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(`Failed to fetch documents: ${res.status} ${errorText}`);
        return;
      }
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError('Fetch failed. Please try again.');
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDocuments();
    (async () => {
      const { data } = await supabase.auth.getSession();
      console.log('Access token:', data?.session?.access_token);
    })();
  }, [fetchDocuments]);

  const handleUploadComplete = async () => {
  setHasUploaded(true);
  setMessage('Upload successful!');
  await fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    setMessage(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        setError('Delete failed. Please try again.');
        return;
      }
      setMessage('Document deleted successfully.');
      fetchDocuments();
    } catch (err) {
      setError('Delete failed. Please try again.');
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAnalyze = async (docId: string) => {
    setSelectedDocId(docId);
    setAnalysis(null);
    setAnalyzingId(docId);
    setError(null);
    setMessage(null);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setError('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: docId }),
      });

      if (!res.ok) {
        setError('Failed to analyze document.');
        return;
      }
      const data = await res.json();
      setAnalysis(data);
      setMessage('Analysis complete!');
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
  <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
  {/* Back Button & Past Contracts Link */}
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={() => router.push('/past-contracts')}
          className="inline-flex items-center gap-2 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
          aria-label="View past contracts"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v10M16 7v10" />
          </svg>
          Past Contracts
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Legal Documents</h1>
      {/* Success/Error Messages */}
      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
      )}

      {/* Upload Component */}
      <div className="mb-10">
        <DocumentUploader onUploadComplete={handleUploadComplete} />
      </div>

      {/* Documents Grid & Analysis */}
      {hasUploaded && (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="ml-4 text-yellow-600 font-semibold">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <p className="text-gray-400">No documents found. Upload a document to get started.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#1a1a1a] p-5 rounded shadow">
                  <p className="font-semibold break-all">{doc.name}</p>
                  <p className="text-sm text-gray-400 mb-3">
                    Uploaded: {new Date(doc.createdAt).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnalyze(doc.id)}
                      disabled={analyzingId === doc.id}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                      aria-label={`Analyze document ${doc.name}`}
                    >
                      {analyzingId === doc.id ? 'Analyzing...' : 'Analyze'}
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      aria-label={`Delete document ${doc.name}`}
                    >
                      {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {analysis && selectedDocId && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
              <AnalysisResult data={analysis} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
