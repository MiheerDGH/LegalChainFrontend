import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';

const DocumentUploader = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus('Uploading...');

      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setStatus('Authentication error. Please log in again.');
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

      if (!res.ok) {
        const text = await res.text();
        const isHTML = text.startsWith('<!DOCTYPE');

        throw new Error(isHTML ? 'Server returned HTML instead of JSON' : text);
      }

      setStatus('Upload successful!');
      setFile(null);
      onUploadComplete();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setStatus(err.message || 'Upload failed. Try again.');
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded shadow text-white space-y-3">
      <label className="block text-sm font-semibold text-yellow-400">Upload a Legal Document (PDF/DOCX)</label>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-300 file:bg-yellow-400 file:text-black file:rounded file:px-4 file:py-2 file:border-0 file:mr-3"
      />
      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
      >
        Upload
      </button>
      {status && <p className="text-sm text-gray-400">{status}</p>}
    </div>
  );
};

export default DocumentUploader;
