import { useState } from 'react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !language) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const res = await fetch('/api/ai/translate', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setTranslatedText(data.translation || 'No translation returned.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Translation Service</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Upload Document</label>
            <input type="file" onChange={handleFileChange} required className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block font-medium mb-2">Select Language</label>
            <select
              className="w-full border p-2 rounded"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
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
          >
            {loading ? 'Translating...' : 'Translate Document'}
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
