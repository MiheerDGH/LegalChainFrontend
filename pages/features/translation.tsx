import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/apiClient';

const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

export default function TranslationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!file || !language) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      try {
        const result = await apiClient.post('/api/ai/translate', formData);
        const data = result.data;
        setTranslatedText(data?.translation || 'No translation returned.');
        setMessage('Translation complete!');
      } catch (err) {
        setError('Failed to translate document. Please try again.');
      }
    } catch (err) {
      setError('Error translating document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            aria-label="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">{error}</div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">Translation Service</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2" htmlFor="file-upload">Upload Document</label>
            <input id="file-upload" type="file" onChange={handleFileChange} required className="w-full border p-2 rounded" aria-label="Upload document for translation" />
          </div>

          <div>
            <label className="block font-medium mb-2" htmlFor="language-select">Select Language</label>
            <select
              id="language-select"
              className="w-full border p-2 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              aria-label="Select language for translation"
            >
              <option value="">-- Select a language --</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !file || !language}
            className={`w-full py-3 bg-blue-600 text-white font-semibold rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            aria-label="Translate document"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Translating...
              </span>
            ) : 'Translate Document'}
          </button>
        </form>

        {translatedText && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Translated Text:</h2>
            <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{translatedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
