import React, { useState } from 'react';
import { uploadDocument } from '../lib/api';
import supabase from '../lib/supabaseClient'; // Make sure this points to your Supabase client

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

      const { data: sessionData, error } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setStatus('No valid token found.');
        return;
      }

      await uploadDocument(file, token);
      setStatus('Upload successful!');
      setFile(null);
      onUploadComplete();
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed');
    }
  };

  return (
    <div className="space-y-2">
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file} className="bg-blue-500 text-white px-3 py-1 rounded">
        Upload
      </button>
      <div className="text-sm text-gray-600">{status}</div>
    </div>
  );
};

export default DocumentUploader;
