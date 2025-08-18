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
  const [hasUploaded, setHasUploaded] = useState(false); // 🆕 track upload trigger
  const router = useRouter();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
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
    setHasUploaded(true); // 
    await fetchDocuments();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        alert('Session expired. Please log in again.');
        router.push('/login');
        return;
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAnalyze = async (docId: string) => {
    setSelectedDocId(docId);
    setAnalysis(null);
    setAnalyzingId(docId);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        alert('Session expired. Please log in again.');
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

      if (!res.ok) throw new Error('Failed to analyze document');
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Legal Documents</h1>

      {/* Upload Component */}
      <div className="mb-10">
        <DocumentUploader onUploadComplete={handleUploadComplete} />
      </div>

      {/* Documents Grid & Analysis - conditional render */}
      {hasUploaded && (
        <>
          {loading ? (
            <p>Loading documents...</p>
          ) : documents.length === 0 ? (
            <p className="text-gray-400">No documents found.</p>
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
                    >
                      {analyzingId === doc.id ? 'Analyzing...' : 'Analyze'}
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deletingId === doc.id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI Analysis Output */}
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
