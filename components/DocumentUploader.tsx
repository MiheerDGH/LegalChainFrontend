import React, { useState } from 'react';
import supabase from '../lib/supabaseClient';
import apiClient from '../lib/apiClient';

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
    setUploading(true);
    setStatus('Uploading...');

    try {
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token;

      if (!token) {
        setStatus('Authentication error. Please log in again.');
        setUploading(false);
        return;
      }

      // Use XMLHttpRequest to provide upload progress feedback
      const formData = new FormData();
      formData.append('file', file);

      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = `${base.replace(/\/$/, '')}/api/docs/upload`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setStatus(`Uploading... ${pct}%`);
          }
        };

        xhr.onload = () => {
          const text = xhr.responseText || '';
          // Try to parse JSON response
          let data: any = null;
          try {
            data = text ? JSON.parse(text) : null;
          } catch (parseErr) {
            // non-json response
            console.error('Upload returned non-json response:', text);
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            setStatus('Upload successful!');
            setFile(null);
            onUploadComplete();
            resolve();
          } else {
            const msg = data?.message || data?.error || text || `HTTP ${xhr.status}`;
            reject(new Error(String(msg)));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Upload failed due to a network error.'));
        };

        xhr.send(formData);
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed.';
      console.error('Upload failed:', err);
      setStatus(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow text-gray-800 space-y-4">
      <label className="block text-sm font-semibold text-yellow-600">
        Upload a Legal Document (PDF/DOCX)
      </label>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full text-sm text-gray-800 file:bg-yellow-400 file:text-black file:rounded file:px-4 file:py-2 file:border-0 file:mr-3"
      />

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {status && (
        <p className="text-sm text-gray-600 transition-all duration-200">{status}</p>
      )}
    </div>
  );
};

export default DocumentUploader;
