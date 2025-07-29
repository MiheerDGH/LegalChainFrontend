import { useEffect, useState } from 'react';

type Document = {
  id: string;
  name: string;
  previewUrl: string;
  createdAt: string;
};

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Document Management</h1>

      {loading ? (
        <p className="text-center">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-center text-gray-500">No documents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">{doc.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Uploaded: {new Date(doc.createdAt).toLocaleString()}</p>
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
}
