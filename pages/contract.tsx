import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import apiClient from '../lib/apiClient';
import contractTypes from '../config/contractTypes';
import contractSchemas from '../config/contractSchemas';
import dynamic from "next/dynamic";

const ContractRenderer = dynamic(() => import("../components/ContractRenderer"), {
  ssr: false,
});

const jurisdictions = [
  { id: 'US-CA', label: 'California, United States' },
  { id: 'US-NY', label: 'New York, United States' },
  { id: 'US-TX', label: 'Texas, United States' },
  { id: 'UK-ENG', label: 'England, United Kingdom' },
  { id: 'CA-ON', label: 'Ontario, Canada' },
  { id: 'AU-NSW', label: 'New South Wales, Australia' },
  { id: 'IN-DL', label: 'Delhi, India' },
];

export default function ContractCreationPage() {
  const router = useRouter();

  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [clauses, setClauses] = useState(['']);
  const [jurisdiction, setJurisdiction] = useState('');
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState('');
  const [references, setReferences] = useState([]);
  const [structure, setStructure] = useState([]);
  const [hallucinationWarning, setHallucinationWarning] = useState<boolean>(false);
  const [warningsList, setWarningsList] = useState<string[]>([]);
  const [contractType, setContractType] = useState(() => contractTypes?.[0]?.value || 'standard');
  const [error, setError] = useState<string | null>(null);
  // For dev debug: capture last request and raw response
  const [lastRequestPayload, setLastRequestPayload] = useState<any | null>(null);
  const [lastResponseRaw, setLastResponseRaw] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);

  // When contract type changes, seed form fields from schema
  useEffect(() => {
    try {
      const key = (contractType || 'standard').toString().toUpperCase();
      const schema = (contractSchemas as any)[key];
      if (!schema) return;

      // initialize formValues for this schema if not already set
      const nextValues: Record<string, any> = {};
      for (const f of schema.fields || []) {
        if (f.type === 'parties') {
          nextValues['parties'] = formValues['parties'] && Array.isArray(formValues['parties']) ? formValues['parties'] : ['', ''];
        } else if (f.type === 'repeatable' || f.key === 'clauses') {
          nextValues[f.key] = formValues[f.key] && Array.isArray(formValues[f.key]) ? formValues[f.key] : [''];
        } else if (f.type === 'date') {
          nextValues[f.key] = formValues[f.key] ?? '';
        } else {
          nextValues[f.key] = formValues[f.key] ?? '';
        }
      }
      setFormValues((prev) => ({ ...nextValues, ...prev }));
    } catch (e) {
      // ignore
    }
  }, [contractType]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/login');
    };
    checkSession();
  }, [router]);

  const makeClauseKeywords = (list: string[]) =>
    Array.from(
      new Set(
        (list || [])
          .map(c => (c || '').toLowerCase())
          .flatMap(c =>
            c
              .replace(/[^a-z0-9\s]/gi, ' ')
              .split(/\s+/)
              .filter(w => w.length > 3)
          )
      )
    ).slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    // Basic client-side validation using formValues and schema
    const key = (contractType || 'standard').toString().toUpperCase();
    const schema = (contractSchemas as any)[key] || (contractSchemas as any).STANDARD;

    const parties = (formValues.parties && Array.isArray(formValues.parties)) ? formValues.parties.filter(Boolean) : [partyA, partyB].filter(Boolean);
    const minPartiesField = schema.fields?.find((f: any) => f.key === 'parties');
    const minParties = minPartiesField?.min || 2;
    if (parties.length < minParties) {
      setError(`Please provide at least ${minParties} parties.`);
      setLoading(false);
      return;
    }

    const rawClauses = (formValues.clauses && Array.isArray(formValues.clauses)) ? formValues.clauses : clauses;
    const clauseObjects = (rawClauses || []).map((c: any, idx: number) =>
      typeof c === 'string' ? { id: `c${idx + 1}`, text: c } : c
    ).filter((c: any) => c && c.text && String(c.text).trim().length > 0);

    const schemaHasClauses = schema.fields?.some((f: any) => f.key === 'clauses' || f.type === 'repeatable');

    // If schema doesn't expose repeatable clauses but user didn't provide clauses,
    // synthesize a clause from other schema fields (e.g., 'scope', 'description') so backend receives a usable clauses[] payload.
    if (clauseObjects.length === 0 && !schemaHasClauses) {
      const textCandidates: string[] = [];
      for (const f of schema.fields || []) {
        const k = f.key;
        if (['parties', 'jurisdiction', 'effectiveDate', 'clauses'].includes(k)) continue;
        const v = formValues[k];
        if (Array.isArray(v)) {
          textCandidates.push(...v.filter(Boolean).map(String));
        } else if (v && String(v).trim()) {
          textCandidates.push(String(v).trim());
        }
      }
      if (textCandidates.length > 0) {
        clauseObjects.push({ id: 'c1', text: textCandidates.join('\n\n') });
      }
    }

    if (schemaHasClauses && clauseObjects.length === 0) {
      setError('Please add at least one clause.');
      setLoading(false);
      return;
    }
    try {
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      const session = refreshData?.session;

      if (refreshError || !session) {
        console.error('❌ Session refresh failed:', refreshError);
        alert('Please re-login.');
        setLoading(false);
        return;
      }

      const token = session.access_token;
      console.log('🪪 Refreshed Supabase token sent:', token);

      if (!token) {
        alert('You must be signed in to generate a contract.');
        setLoading(false);
        return;
      }

      // Build payload matching backend expectations
      const payload = {
        type: contractType || 'service',
        parties,
        jurisdiction: formValues.jurisdiction || jurisdiction,
        effectiveDate: formValues.effectiveDate || effectiveDate || undefined,
        clauses: clauseObjects,
        clauseKeywords: makeClauseKeywords(rawClauses || []),
      };

      try {
        setLastRequestPayload(payload);
        const result = await apiClient.post('/api/ai/generateContract', payload, { headers: { Authorization: `Bearer ${token}` } });
        const responseData = result.data || {};
        setLastResponseRaw(result.raw || null);
        console.log('🧾 Contract response:', responseData, 'normalized:', result.normalizedContract);

        // Prefer normalizedContract provided by apiClient adapter
        const normalized = result.normalizedContract || (responseData && typeof responseData === 'object' ? null : null);
        if (normalized) {
          setContract(normalized.html ?? (normalized.text || 'No contract generated.'));
          setReferences((normalized.references || []) as any);
          // structure may still be provided at top-level
          setStructure((responseData.structure || []) as any);
          setHallucinationWarning(Boolean(normalized.hallucinationWarning));
          setWarningsList(Array.isArray(normalized.warnings) ? normalized.warnings : []);
        } else {
          // fallback to legacy fields
          setContract(responseData.contractText || responseData.contract || 'No contract generated.');
          setReferences((responseData.references || responseData.authority_and_references || []) as any);
          setStructure(responseData.structure || []);
          setHallucinationWarning(Boolean(responseData.hallucinationWarning));
          setWarningsList(Array.isArray(responseData.warnings) ? responseData.warnings : []);
        }
      } catch (err: any) {
        // Prefer error.raw if available for debugging snippets
        const rawSnippet = err?.raw ? String(err.raw).slice(0, 1000) : undefined;
        const msg = err?.message || 'An error occurred while generating the contract.';
        setLastResponseRaw(err?.raw ? String(err.raw) : null);
        setError(rawSnippet ? `${msg} — Response snippet: ${rawSnippet}` : msg);
      }
    } catch (err) {
      console.error('Error generating contract:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = async () => {
    const element = document.getElementById('contract-preview');
    if (!element) return;

    const html2pdf = (await import('html2pdf.js')).default;

    html2pdf().from(element).set({
      margin: 0.5,
      filename: `${contractType.replace(/\s+/g, '_')}_Contract.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    }).save();
  };

  const downloadAsTXT = () => {
    const blob = new Blob([contract], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${contractType.replace(/\s+/g, '_')}_Contract.txt`;
    link.click();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-800 py-10 px-4 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Contract Generator</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Type selector first */}
          <div>
            <label className="block font-medium mb-1" htmlFor="contract-type">Contract Type</label>
            <select
              id="contract-type"
              className="w-full border px-4 py-3 rounded-md"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              required
              aria-label="Contract Type"
            >
              {contractTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>{ct.label}</option>
              ))}
            </select>
          </div>

          {/* Jurisdiction is required for all contract types -> render globally */}
          <div>
            <label htmlFor="jurisdiction" className="block font-medium mb-1">
              Jurisdiction (Governing Law)
            </label>
            <select
              id="jurisdiction"
              value={formValues.jurisdiction ?? jurisdiction}
              onChange={(e) => { setFormValues(prev => ({ ...prev, jurisdiction: e.target.value })); setJurisdiction(e.target.value); }}
              className="w-full border px-4 py-3 rounded-md"
              required
            >
              <option value="">Select a state or country</option>
              {jurisdictions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              The legal region whose laws apply to this agreement.
            </p>
          </div>

          {/* Render form fields dynamically based on selected schema */}
          {(() => {
            const key = (contractType || 'standard').toString().toUpperCase();
            const schema = (contractSchemas as any)[key] || (contractSchemas as any).STANDARD;
            return (
              <>
                {schema.fields.map((f: any) => {
                  const value = formValues[f.key] ?? '';
                  if (f.type === 'parties') {
                    const partiesArr: string[] = (formValues.parties && Array.isArray(formValues.parties)) ? formValues.parties : ['', ''];
                    return (
                      <div key={f.key}>
                        <label className="block font-medium mb-1">{f.label}</label>
                        {partiesArr.map((p, i) => (
                          <input
                            key={i}
                            type="text"
                            className="w-full border px-4 py-3 rounded-md mb-2"
                            placeholder={i === 0 ? 'Party A' : `Party ${i + 1}`}
                            value={p}
                            onChange={(e) => {
                              const next = [...partiesArr];
                              next[i] = e.target.value;
                              setFormValues(prev => ({ ...prev, parties: next }));
                            }}
                          />
                        ))}
                        <div className="flex gap-2">
                          <button type="button" className="text-sm text-blue-600" onClick={() => {
                            const next = [...(formValues.parties || ['', ''])];
                            next.push('');
                            setFormValues(prev => ({ ...prev, parties: next }));
                          }}>+ Add Party</button>
                        </div>
                      </div>
                    );
                  }

                  if (f.type === 'date') {
                    return (
                      <div key={f.key}>
                        <label className="block font-medium mb-1">{f.label}</label>
                        <input
                          type="date"
                          className="w-full border px-4 py-3 rounded-md"
                          value={formValues[f.key] || ''}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                        />
                      </div>
                    );
                  }

                  if (f.type === 'textarea') {
                    return (
                      <div key={f.key}>
                        <label className="block font-medium mb-1">{f.label}</label>
                        <textarea
                          className="w-full border px-4 py-2 rounded-md"
                          placeholder={f.placeholder || ''}
                          value={formValues[f.key] || ''}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                        />
                      </div>
                    );
                  }

                  if (f.type === 'repeatable') {
                    const items: string[] = (formValues[f.key] && Array.isArray(formValues[f.key])) ? formValues[f.key] : [''];
                    return (
                      <div key={f.key}>
                        <label className="block font-medium mb-1">{f.label}</label>
                        {items.map((it, idx) => (
                          <textarea
                            key={idx}
                            className="w-full border px-4 py-2 rounded-md mb-2"
                            placeholder={f.placeholder || `Item ${idx + 1}`}
                            value={it}
                            onChange={(e) => {
                              const next = [...items];
                              next[idx] = e.target.value;
                              setFormValues(prev => ({ ...prev, [f.key]: next }));
                            }}
                          />
                        ))}
                        <button type="button" onClick={() => {
                          const next = [...(formValues[f.key] || [''])];
                          next.push('');
                          setFormValues(prev => ({ ...prev, [f.key]: next }));
                        }} className="text-sm text-blue-600">+ Add {f.label}</button>
                      </div>
                    );
                  }

                  // default to simple text input
                  return (
                    <div key={f.key}>
                      <label className="block font-medium mb-1">{f.label}</label>
                      <input
                        type="text"
                        className="w-full border px-4 py-3 rounded-md"
                        placeholder={f.placeholder || ''}
                        value={formValues[f.key] || ''}
                        onChange={(e) => setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  );
                })}
              </>
            );
          })()}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Contract'}
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-sm">
                Error: {error}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Inline Preview Section */}
      {contract && (
        <div className="bg-white mt-10 p-6 rounded-xl shadow-md w-full max-w-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Generated Contract</h2>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Use ContractRenderer for preview */}
          <div id="contract-preview">
            {/* Warnings / hallucination banner */}
            {(hallucinationWarning || (warningsList && warningsList.length > 0)) && (
              <div className="mb-4 p-3 rounded bg-yellow-50 border border-yellow-200 text-yellow-800">
                <div className="flex items-start justify-between">
                  <div>
                    <strong>Warning:</strong> The generator reported possible issues. Please review the warnings below.
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowWarnings((s) => !s)}
                      className="text-sm text-yellow-800 underline"
                      aria-expanded={Boolean(warningsList && warningsList.length > 0)}
                    >
                      {showWarnings ? 'Hide details' : 'Show details'}
                    </button>
                    {/* dev debug toggle removed to avoid exposing raw responses in the preview */}
                  </div>
                </div>

                {showWarnings && warningsList && warningsList.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc list-inside text-sm text-yellow-900">
                    {warningsList.map((w, i) => (
                      <li key={i} className="mb-1">
                        <div className="flex items-start justify-between">
                          <div className="mr-4">{w}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigator.clipboard?.writeText(w)}
                              className="text-xs text-yellow-900 underline"
                              aria-label={`Copy warning ${i + 1}`}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Debug panel toggle shown above; actual debug panel is rendered as a fixed, dev-only sidebar to avoid overlapping the contract preview */}
              </div>
            )}
            <ContractRenderer
              contract={contract}
              references={references}
              structure={structure}
            />
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={downloadAsPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              onClick={downloadAsTXT}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Download TXT
            </button>
          </div>
        </div>
      )}
      </div>

      {/* Dev-only floating debug panel: non-intrusive, collapsible sidebar */}
      {/* Dev debug panel removed from UI to avoid overlapping and exposure of raw server responses. */}
    </>
  );
}

// Dev-only floating debug panel (rendered outside component to keep file scoped)
if (process.env.NODE_ENV === 'development') {
  // append a small floating panel when in dev mode by patching the default export's render is not trivial here,
  // so instead we rely on the page component's showDebug state and render a portal-style element inside the DOM.
}
