import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';

interface Props {
  onUploadComplete: () => void;
}

const DocumentUploader: React.FC<Props> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setStatus('📤 Uploading...');

      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setStatus('🔒 Authentication error. Please log in again.');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/docs/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const text = await res.text();
      const isHTML = text.startsWith('<!DOCTYPE');

      if (!res.ok) {
        throw new Error(isHTML ? '⚠️ Server returned HTML instead of JSON.' : text);
      }

      setStatus('✅ Upload successful!');
      setFile(null);
      onUploadComplete(); // 🔁 trigger dashboard refresh
    } catch (err: any) {
      console.error('Upload failed:', err);
      setStatus(err.message || '❌ Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded shadow text-white space-y-4">
      <label className="block text-sm font-semibold text-yellow-400">
        Upload a Legal Document (PDF/DOCX)
      </label>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full text-sm text-gray-300 file:bg-yellow-400 file:text-black file:rounded file:px-4 file:py-2 file:border-0 file:mr-3"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {status && (
        <p className="text-sm text-gray-400 transition-all duration-200">{status}</p>
      )}
    </div>
  );
};

export default DocumentUploader;
