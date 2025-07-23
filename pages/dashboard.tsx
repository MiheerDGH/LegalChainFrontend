import React, { useState, useEffect } from 'react';
import DocumentUploader from '../components/DocumentUploader';
import AnalysisResult from '../components/AnalysisResult';
import axios from 'axios';

interface Document {
  id: string;
  name: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/docs');
      setDocuments(res.data as Document[]);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/docs/delete/${id}`);
    fetchDocuments();
  };

  const handleAnalyze = async (id: string) => {
    setSelectedDocId(id);
    setAnalysis(null);
    try {
      const res = await axios.post('/api/ai/analyze', { id });
      setAnalysis(res.data);
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
        <p className="text-gray-400">You haven't uploaded any documents yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-[#1a1a1a] p-5 rounded shadow">
              <p className="font-semibold">{doc.name}</p>
              <p className="text-sm text-gray-400 mb-3">Status: {doc.status}</p>
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
