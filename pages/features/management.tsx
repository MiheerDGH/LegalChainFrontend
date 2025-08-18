import { useEffect, useState } from 'react';

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

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/docs', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('📡 Response status:', res.status);
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Failed to fetch documents:', res.status, errorText);
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

      if (process.env.NODE_ENV === 'development') {
        console.log('📄 Freshly fetched documents:', normalized);
      }

      setDocuments(normalized);
    } catch (err) {
      console.error('🔥 Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File, category: 'A' | 'B') => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 Uploading file to category ${category}:`, file);
      console.log('📦 File details:', {
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        webkitRelativePath: file.webkitRelativePath,
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const res = await fetch('/api/docs/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ Upload failed: ${res.status}`, errorText);
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Upload successful');
      }

      setFileA(null);
      setFileB(null);
      fetchDocuments();
    } catch (err) {
      console.error('🔥 Upload error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`/api/docs/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        const errorText = await res.text();
        console.error(`❌ Delete failed: ${res.status}`, errorText);
      }
    } catch (err) {
      console.error('🔥 Delete error:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Current documents state:', documents);
    }
  }, [documents]);

  const documentsA = documents.filter((doc) => doc.category === 'A');
  const documentsB = documents.filter((doc) => doc.category === 'B');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Management</h1>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Category A */}
          <div>
            <label className="block font-medium mb-1">Upload Document A</label>
            <input
              type="file"
              onChange={(e) => setFileA(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 mb-2"
            />
            <button
              onClick={() => {
                if (!fileA) {
                  console.warn('⚠️ No file selected for Category A');
                  return;
                }
                handleUpload(fileA, 'A');
              }}
              disabled={!fileA}
              className={`w-full py-2 px-4 rounded text-white ${
                fileA ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Upload to Category A
            </button>
          </div>

          {/* Category B */}
          <div>
            <label className="block font-medium mb-1">Upload Document B</label>
            <input
              type="file"
              onChange={(e) => setFileB(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 mb-2"
            />
            <button
              onClick={() => {
                if (!fileB) {
                  console.warn('⚠️ No file selected for Category B');
                  return;
                }
                handleUpload(fileB, 'B');
              }}
              disabled={!fileB}
              className={`w-full py-2 px-4 rounded text-white ${
                fileB ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Upload to Category B
            </button>
          </div>
        </div>

        {/* Documents by Category */}
        {loading ? (
          <p className="text-center">Loading documents...</p>
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
                        >
                          Preview Document
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="block text-red-500 mt-2 text-sm hover:underline"
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
