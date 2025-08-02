import { useEffect, useState } from 'react';

type Document = {
  id: string;
  name: string;
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
    const res = await fetch('/api/docs');
    const data = await res.json();
    setDocuments(data || []);
    setLoading(false);
  };

  const handleUpload = async (file: File, category: 'A' | 'B') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const res = await fetch('/api/docs/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      fetchDocuments();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    const res = await fetch(`/api/docs/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const documentsA = documents.filter((doc) => doc.category === 'A');
  const documentsB = documents.filter((doc) => doc.category === 'B');

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Document Management</h1>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block font-medium mb-1">Upload Document A</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileA(file || null);
                if (file) handleUpload(file, 'A');
              }}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Document B</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileB(file || null);
                if (file) handleUpload(file, 'B');
              }}
              className="w-full border rounded p-2"
            />
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
                        <h3 className="font-semibold">{doc.name}</h3>
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
