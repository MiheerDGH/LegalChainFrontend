import React, { useRef } from 'react';

type Reference = { citation?: string; caseName?: string; court?: string; date?: string; url?: string };
type Section = { heading: string; id: string };

function sanitizeHtml(input: string) {
  if (!input) return '';
  // Use DOMPurify for robust sanitization; allow target attribute for links
  try {
    if (typeof window !== 'undefined') {
      // Load DOMPurify on the client only to avoid SSR errors
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const DOMPurifyRaw = require('dompurify');
      const createDOMPurify = DOMPurifyRaw.default || DOMPurifyRaw;
      const dp = createDOMPurify(window as any);
      return dp.sanitize(input, { ADD_ATTR: ['target'] });
    }
    // If no window (SSR), fall through to naive sanitizer below
  } catch (e) {
    // Fallback to naive sanitizer if DOMPurify fails
    let out = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    out = out.replace(/ on[a-zA-Z]+=\"[\s\S]*?\"/gi, '');
    out = out.replace(/ on[a-zA-Z]+=\'[\s\S]*?\'/gi, '');
    out = out.replace(/href=\"javascript:[^\"]*\"/gi, '');
    out = out.replace(/src=\"javascript:[^\"]*\"/gi, '');
    return out;
  }
}

export default function ContractRenderer({
  contract,
  structure = [],
  references = [],
}: {
  contract: string;
  structure?: Section[];
  references?: Reference[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (id?: string, heading?: string) => {
    // Try by id first
    if (id) {
      const elById = document.getElementById(id);
      if (elById) return elById.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Fallback: search for heading text inside the rendered container
    if (heading && containerRef.current) {
      const children = Array.from(containerRef.current.querySelectorAll('*')) as HTMLElement[];
      for (const el of children) {
        if (el.innerText && el.innerText.trim().toLowerCase().includes(heading.trim().toLowerCase())) {
          return el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const looksLikeHtml = (s: string) => /<[^>]+>/.test(s || '');

  return (
    <div className="text-black">
      {structure.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Table of Contents</h3>
          <ul className="list-disc list-inside space-y-1">
            {structure.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToSection(s.id, s.heading)}
                  className="text-blue-600 hover:underline text-left"
                >
                  {s.heading}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div ref={containerRef} className="prose max-w-none">
        {looksLikeHtml(contract) ? (
          // Minimal sanitization; backend should provide safe HTML when possible
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contract) }} />
        ) : (
          <pre className="whitespace-pre-wrap">{contract}</pre>
        )}
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
