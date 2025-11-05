import React, { useState } from 'react';
import ReviewResults from '../../components/ReviewResults';
import ContractRenderer from '../../components/ContractRenderer';

export default function ReviewDemoPage() {
  const [which, setWhich] = useState<'string' | 'structured'>('structured');

  const stringResult = `The document appears generally well-drafted. Suggested edits:\n- Clarify the term "Confidential Information" to list examples.\n- Add an explicit governing law clause.\n\nNo clear authorities were cited.`;

  const structuredResult = {
    issues: [
      { section: 'Section 2', finding: 'Definition of Confidential Information is too broad.' },
      { section: 'Section 7', finding: 'Termination notice period missing.' },
    ],
    suggestions: [
      'Narrow the definition of Confidential Information to specific categories.',
      'Add a 30-day termination notice clause.',
    ],
    authorities: [
      { caseName: 'Smith v. Jones', citation: '123 F.3d 456', court: '9th Cir.', date: '2019', url: 'https://example.com' },
    ],
  };

  const sampleContract = `AGREEMENT\n\n1. Parties\nThis Agreement is between Alice and Bob.\n\n2. Confidentiality\nConfidential information means...\n`;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">ReviewResults Demo</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setWhich('structured')}
            className={`px-3 py-1 rounded ${which === 'structured' ? 'bg-yellow-400' : 'bg-gray-200'}`}
          >
            Structured Result
          </button>
          <button
            onClick={() => setWhich('string')}
            className={`px-3 py-1 rounded ${which === 'string' ? 'bg-yellow-400' : 'bg-gray-200'}`}
          >
            Plain Text
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Rendered Review</h3>
            <ReviewResults results={which === 'string' ? stringResult : structuredResult} />
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sample Contract Preview</h3>
            <div className="bg-gray-50 p-4 rounded">
              <ContractRenderer contract={sampleContract} structure={[]} references={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
