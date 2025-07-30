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
  const [file, setFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<'A' | 'B'>('A');

  const fetchDocuments = async () => {
    setLoading(true);
    const res = await fetch('/api/docs');
    const data = await res.json();
    setDocuments(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this document?');
    if (!confirmed) return;

    const res = await fetch(`/api/docs/delete/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', fileCategory);

    const res = await fetch('/api/docs/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setFile(null);
      fetchDocuments();
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const documentsA = documents.filter((doc) => doc.category === 'A');
  const documentsB = documents.filter((doc) => doc.category === 'B');

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Document Management</h1>

      {/* ⬆️ Upload Section */}
      <div className="mb-6 text-center space-y-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block mx-auto"
        />
        <select
          value={fileCategory}
          onChange={(e) => setFileCategory(e.target.value as 'A' | 'B')}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="A">Document A</option>
          <option value="B">Document B</option>
        </select>
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!file}
        >
          Upload Document
        </button>
      </div>

      {/* ⬇️ Documents by Category */}
      {loading ? (
        <p className="text-center">Loading documents...</p>
      ) : (
        ['A', 'B'].map((category) => {
          const docs = category === 'A' ? documentsA : documentsB;
          return (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold my-4 text-center">Document {category}</h2>
              {docs.length === 0 ? (
                <p className="text-center text-gray-500">No documents in this category.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {docs.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-md p-4">
                      <h3 className="font-semibold mb-2">{doc.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Uploaded: {new Date(doc.createdAt).toLocaleString()}
                      </p>
                      <a
                        href={doc.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 mb-2 hover:underline"
                      >
                        Preview Document
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:underline text-sm"
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
  );
}
