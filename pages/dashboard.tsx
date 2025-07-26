import React, { useState, useEffect } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import AnalysisResult from '../components/AnalysisResult';
import supabase from '../lib/supabaseClient';

interface Document {
  id: string;
  fileName: string;
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

  const fetchDocuments = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDocuments(data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/docs/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchDocuments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleAnalyze = async (docId: string) => {
    setSelectedDocId(docId);
    setAnalysis(null);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;


      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: docId }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Legal Documents</h1>

      {/* Upload Component */}
      <div className="mb-10">
        <DocumentUploader onUploadComplete={fetchDocuments} />
      </div>

      {/* Documents */}
      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-400">You haven&apos;t uploaded any documents yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-[#1a1a1a] p-5 rounded shadow">
              <p className="font-semibold break-all">{doc.fileName}</p>
              <p className="text-sm text-gray-400 mb-3">Uploaded: {new Date(doc.createdAt).toLocaleString()}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnalyze(doc.id)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Analyze
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Result */}
      {analysis && selectedDocId && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
          <AnalysisResult data={analysis} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
