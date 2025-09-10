import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type Document = {
  id: string;
  title: string;
  previewUrl: string;
  createdAt: string;
  category: 'A' | 'B';
};

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/docs', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(`Failed to fetch documents: ${res.status} ${errorText}`);
        setLoading(false);
        return;
      }

      const rawData = await res.json();
      const normalized = rawData.map((doc: any) => ({
        id: doc.id,
        title: doc.title || doc.name || 'Untitled',
        previewUrl: doc.previewUrl || doc.url || '',
        createdAt: doc.createdAt,
        category: doc.category,
      }));
      setDocuments(normalized);
    } catch (err) {
      setError('Error fetching documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, category: 'A' | 'B') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 Uploading file to category ${category}:`, file);
      console.log(' File details:', {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        webkitRelativePath: file.webkitRelativePath,
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/docs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        setError(`Upload failed: ${res.status} ${errorText}`);
        return;
      }

      setFileA(null);
      setFileB(null);
      setMessage('Upload successful!');
      fetchDocuments();
    } catch (err) {
      setError('Upload error. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/docs/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        setMessage('Document deleted successfully.');
      } else {
        const errorText = await res.text();
        setError(`Delete failed: ${res.status} ${errorText}`);
      }
    } catch (err) {
      setError('Delete error. Please try again.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(' Current documents state:', documents);
    }
  }, [documents]);

  const documentsA = documents.filter((doc) => doc.category === 'A');
  const documentsB = documents.filter((doc) => doc.category === 'B');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        {/* Back Button */}
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

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">Document Management</h1>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Category A */}
          <div>
            <label className="block font-medium mb-1" htmlFor="fileA-upload">Upload Document A</label>
            <input
              id="fileA-upload"
              type="file"
              onChange={(e) => setFileA(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 mb-2"
              aria-label="Upload document to category A"
            />
            <button
              onClick={() => {
                if (!fileA) {
                  setError('No file selected for Category A');
                  return;
                }
                handleUpload(fileA, 'A');
              }}
              disabled={!fileA}
              className={`w-full py-2 px-4 rounded text-white ${
                fileA ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
              aria-label="Upload to Category A"
            >
              Upload to Category A
            </button>
          </div>

          {/* Category B */}
          <div>
            <label className="block font-medium mb-1" htmlFor="fileB-upload">Upload Document B</label>
            <input
              id="fileB-upload"
              type="file"
              onChange={(e) => setFileB(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 mb-2"
              aria-label="Upload document to category B"
            />
            <button
              onClick={() => {
                if (!fileB) {
                  setError('No file selected for Category B');
                  return;
                }
                handleUpload(fileB, 'B');
              }}
              disabled={!fileB}
              className={`w-full py-2 px-4 rounded text-white ${
                fileB ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
              aria-label="Upload to Category B"
            >
              Upload to Category B
            </button>
          </div>
        </div>

        {/* Documents by Category */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="ml-4 text-yellow-600 font-semibold">Loading documents...</span>
          </div>
        ) : (
          ['A', 'B'].map((category) => {
            const docs = category === 'A' ? documentsA : documentsB;
            return (
              <div key={category} className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Documents in Category {category}</h2>
                {docs.length === 0 ? (
                  <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {docs.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded p-4 shadow">
                        <h3 className="font-semibold">{doc.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Uploaded: {new Date(doc.createdAt).toLocaleString()}
                        </p>
                        <a
                          href={doc.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                          aria-label={`Preview document ${doc.title}`}
                        >
                          Preview Document
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="block text-red-500 mt-2 text-sm hover:underline"
                          aria-label={`Delete document ${doc.title}`}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
