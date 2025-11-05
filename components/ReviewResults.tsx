import React from 'react';

type Authority = {
  caseName?: string;
  citation?: string;
  court?: string;
  date?: string;
  url?: string;
};

type ReviewResultsProps = {
  results: any; // string or structured object { issues, suggestions, authorities }
  className?: string;
};

export default function ReviewResults({ results, className = '' }: ReviewResultsProps) {
  if (!results) return null;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'review-results.json';
    link.click();
  };

  const downloadTXT = () => {
    const text = typeof results === 'string' ? results : JSON.stringify(results, null, 2);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'review-results.txt';
    link.click();
  };

  // If results is a plain string, show it in a pre block
  if (typeof results === 'string') {
    return (
      <div className={`mt-6 border-t pt-4 ${className}`}>
        <h4 className="font-semibold mb-2">Analysis Result</h4>
        <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{results}</pre>
        <div className="mt-3 flex gap-2 justify-end">
          <button onClick={downloadTXT} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Download TXT</button>
          <button onClick={downloadJSON} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Download JSON</button>
        </div>
      </div>
    );
  }

  const { issues, suggestions, authorities } = results || {};

  return (
    <div className={`mt-4 p-4 border rounded bg-gray-50 ${className}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">Review Results</h4>
        <div className="flex gap-2">
          <button onClick={downloadTXT} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Download TXT</button>
          <button onClick={downloadJSON} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Download JSON</button>
        </div>
      </div>

      {issues && issues.length > 0 && (
        <div className="mt-2">
          <span className="font-medium">Issues:</span>
          <ul className="list-disc list-inside ml-4 mt-1">
            {issues.map((issue: any, idx: number) => (
              <li key={idx} className="text-red-600">
                {typeof issue === 'string' ? issue : `${issue.section ? issue.section + ': ' : ''}${issue.finding || ''}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-2">
          <span className="font-medium">Suggestions:</span>
          <ul className="list-disc list-inside ml-4 mt-1">
            {suggestions.map((s: string, idx: number) => (
              <li key={idx} className="text-green-600">{s}</li>
            ))}
          </ul>
        </div>
      )}

      {authorities && authorities.length > 0 && (
        <div className="mt-2">
          <span className="font-medium">Authorities:</span>
          <ul className="list-disc list-inside ml-4 mt-1">
            {authorities.map((a: Authority, idx: number) => (
              <li key={idx} className="text-blue-600">
                {a.caseName ? `${a.caseName} (${a.citation})` : a.citation}
                {a.court ? ` — ${a.court}` : ''}
                {a.date ? ` (${a.date})` : ''}
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer" className="ml-2 text-blue-700 underline">link</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
