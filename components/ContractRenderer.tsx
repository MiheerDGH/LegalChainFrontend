import React from 'react';

type Reference = { citation?: string; caseName?: string; court?: string; date?: string; url?: string };
type Section = { heading: string; id: string };

export default function ContractRenderer({
  contract,
  structure = [],
  references = [],
}: {
  contract: string;
  structure?: Section[];
  references?: Reference[];
}) {
  return (
    <div className="text-black">
      {structure.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Table of Contents</h3>
          <ul className="list-disc list-inside space-y-1">
            {structure.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-blue-600 hover:underline">
                  {s.heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* For now: render plain text. If backend includes IDs per section, you can split and add anchors */}
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap">{contract}</pre>
      </div>

      {references.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="font-bold text-lg mb-2">References</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {references.map((r, idx) => (
              <li key={idx}>
                {r.citation || r.caseName}
                {r.court ? ` — ${r.court}` : ''}{r.date ? ` (${r.date})` : ''}{' '}
                {r.url && (
                  <a href={r.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    link
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
