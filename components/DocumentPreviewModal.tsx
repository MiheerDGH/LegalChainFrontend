import React from 'react';
import html2pdf from 'html2pdf.js';

type Props = {
  content: string;
  onClose: () => void;
};

export default function DocumentPreviewModal({ content, onClose }: Props) {
  const handleDownload = (format: 'pdf' | 'txt') => {
    if (format === 'pdf') {
      const opt = {
        margin: 0.5,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {},
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(document.getElementById('doc-content')!).set(opt).save();
    } else if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'document.txt';
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6 relative text-black overflow-y-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Document Preview</h2>
        <div id="doc-content" className="whitespace-pre-wrap text-sm text-gray-800">
          {content}
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={() => handleDownload('pdf')}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Download PDF
          </button>
          <button
            onClick={() => handleDownload('txt')}
            className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
          >
            Download TXT
          </button>
        </div>
      </div>
    </div>
  );
}
