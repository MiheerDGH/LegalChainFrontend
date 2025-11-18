import React, { useEffect, useState } from 'react';
import { api } from '../lib/contractApi';
import contractSchemas from '../src/config/contractSchemas';

// Note: DOMPurify requires a window to initialize with JSDOM in SSR-free codepath.
// We'll require it at runtime on the client only.
let createDOMPurify: any = null;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const DOMPurifyRaw = require('dompurify');
  createDOMPurify = DOMPurifyRaw.default || DOMPurifyRaw;
}

type FieldMeta = {
  key: string;
  label?: string;
  itemType?: string;
  options?: string[];
};

export default function ContractBuilder() {
  const [types, setTypes] = useState<Array<{ key: string; displayName: string }>>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [fieldsMeta, setFieldsMeta] = useState<FieldMeta[]>([]);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [parties, setParties] = useState<string[]>(['', '']);
  const [clauses, setClauses] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Prefer local schemas shipped in src/config/contractSchemas.js (from product sheet).
    try {
  // Include canonical contract types: STANDARD, SERVICE, NDA, EMPLOYMENT, SALES, LEASE
  const allowed = ['STANDARD', 'SERVICE', 'NDA', 'EMPLOYMENT', 'SALES', 'LEASE'];
      const local = Object.values(contractSchemas || {})
        .map((s: any) => ({ key: s.key, displayName: s.label || s.key }))
        .filter((t: any) => allowed.includes(String(t.key).toUpperCase()));
      setTypes(local);
      if (local.length > 0) setSelectedType(local[0].key);
      return;
    } catch (err) {
      // fallback to backend endpoint if local schema parsing fails
    }

    let mounted = true;
    api.getTypes().then((res) => {
      if (!mounted) return;
      const tlist = (res?.types || []).map((t: any) => ({ key: t.key, displayName: t.displayName || t.key }));
      setTypes(tlist);
      if (tlist.length > 0) setSelectedType(tlist[0].key);
    }).catch((e) => setError(String(e?.message || e)));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!selectedType) return;
    setFieldsMeta([]);
    setFormValues({});
    setError(null);

    // Load from local contractSchemas first
    const key = String(selectedType || '').toUpperCase();
    const localSchema = (contractSchemas as any)[key];
    if (localSchema && Array.isArray(localSchema.fields)) {
      const fields = localSchema.fields.map((f: any) => ({
        key: f.key,
        label: f.label || f.key,
        itemType: f.type === 'repeatable' ? (f.itemType || 'textarea') : (f.itemType || undefined),
        options: f.options || undefined,
      } as FieldMeta));

      setFieldsMeta(fields);
      const seed: Record<string, any> = {};
      fields.forEach((f: any) => {
        seed[f.key] = f.itemType === 'repeatable' ? [''] : '';
      });
      setFormValues(seed);
      setParties(['', '']);
      setClauses(['']);
      return;
    }

    // fallback: fetch from backend
    let mounted = true;
    api.getFields(selectedType).then((res) => {
      if (!mounted) return;
      const fields = res?.fields || [];
      setFieldsMeta(fields);
      const seed: Record<string, any> = {};
      fields.forEach((f: any) => {
        seed[f.key] = f.itemType === 'repeatable' || f.type === 'repeatable' ? [''] : '';
      });
      setFormValues(seed);
      setParties(['', '']);
      setClauses(['']);
    }).catch((e) => setError(String(e?.message || e)));
    return () => { mounted = false; };
  }, [selectedType]);

  const updateField = (key: string, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const addParty = () => setParties(prev => [...prev, '']);
  const removeParty = (idx: number) => setParties(prev => prev.filter((_, i) => i !== idx));
  const updateParty = (idx: number, val: string) => setParties(prev => { const next = [...prev]; next[idx] = val; return next; });

  const addClause = () => setClauses(prev => [...prev, '']);
  const removeClause = (idx: number) => setClauses(prev => prev.filter((_, i) => i !== idx));
  const updateClause = (idx: number, val: string) => setClauses(prev => { const next = [...prev]; next[idx] = val; return next; });

  const normalizeResponse = (resp: any) => {
    // backend may send different shapes; normalize to { html, text, warnings[], hallucinationWarning, references[] }
    if (!resp) return null;
    return {
      html: resp.html || (resp.isHtml ? resp.contractText || resp.contract : null) || null,
      text: resp.text || (!resp.isHtml ? resp.contractText || resp.contract : null) || null,
      warnings: Array.isArray(resp.warnings) ? resp.warnings : [],
      hallucinationWarning: !!resp.hallucinationWarning,
      references: resp.references || resp.authority_and_references || [],
      raw: resp,
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    // basic validation
    const goodParties = parties.map(p => (p || '').trim()).filter(Boolean);
    if (goodParties.length < 2) {
      setError('Please provide at least two parties.');
      return;
    }
    const goodClauses = clauses.map(c => (c || '').trim()).filter(Boolean);
    if (goodClauses.length === 0) {
      setError('Please add at least one clause.');
      return;
    }

    const payload: Record<string, any> = {
      type: selectedType,
      parties: goodParties,
      clauses: goodClauses.map((c: string) => ({ id: null, text: c })),
      jurisdiction: formValues.jurisdiction || formValues.governingLaw || '',
      effectiveDate: formValues.effectiveDate || undefined,
    };

    // attach per-type fields
    for (const f of fieldsMeta) {
      const k = f.key;
      if (k in formValues) payload[k] = formValues[k];
    }

    setLoading(true);
    try {
      const resp = await api.generate(payload);
      const normalized = normalizeResponse(resp);
      setResult(normalized);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const renderField = (f: FieldMeta) => {
    const key = f.key;
    const label = f.label || key;
    const value = formValues[key];

    // heuristics
    const lower = label.toLowerCase();
    if (f.options && Array.isArray(f.options)) {
      return (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1">{label}</label>
          <select className="w-full border px-3 py-2 rounded" value={value || ''} onChange={(e) => updateField(key, e.target.value)}>
            <option value="">--</option>
            {f.options!.map((o: string) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      );
    }

    if (lower.includes('date') || lower.includes('start') || lower.includes('end')) {
      return (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1">{label}</label>
          <input type="date" className="w-full border px-3 py-2 rounded" value={value || ''} onChange={(e) => updateField(key, e.target.value)} />
        </div>
      );
    }

    if (lower.includes('price') || lower.includes('fee') || lower.includes('rent') || lower.includes('amount')) {
      return (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1">{label}</label>
          <input type="number" step="0.01" className="w-full border px-3 py-2 rounded" value={value || ''} onChange={(e) => updateField(key, e.target.value)} />
        </div>
      );
    }

    if (f.itemType === 'textarea' || lower.includes('scope') || lower.includes('description') || lower.includes('clause') || lower.includes('deliverable') || lower.includes('fees')) {
      if (Array.isArray(value)) {
        // repeatable
        return (
          <div key={key} className="mb-4">
            <label className="block font-medium mb-1">{label}</label>
            {value.map((it: string, idx: number) => (
              <div key={idx} className="mb-2">
                <textarea className="w-full border px-3 py-2 rounded" value={it} onChange={(e) => {
                  const next = [...value]; next[idx] = e.target.value; updateField(key, next);
                }} />
                <div className="flex gap-2 mt-1">
                  <button type="button" className="text-sm text-red-600" onClick={() => { const next = value.filter((_: any, i: number) => i !== idx); updateField(key, next); }}>Remove</button>
                </div>
              </div>
            ))}
            <button type="button" className="text-sm text-blue-600" onClick={() => updateField(key, [...(value || []), ''])}>+ Add</button>
          </div>
        );
      }

      return (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1">{label}</label>
          <textarea className="w-full border px-3 py-2 rounded" value={value || ''} onChange={(e) => updateField(key, e.target.value)} />
        </div>
      );
    }

    // repeatable field type
    if (f.itemType === 'text' || f.itemType === 'repeatable') {
      const items = Array.isArray(value) ? value : [''];
      return (
        <div key={key} className="mb-4">
          <label className="block font-medium mb-1">{label}</label>
          {items.map((it: string, idx: number) => (
            <div key={idx} className="mb-2">
              <input className="w-full border px-3 py-2 rounded" value={it} onChange={(e) => { const next = [...items]; next[idx] = e.target.value; updateField(key, next); }} />
            </div>
          ))}
          <button type="button" className="text-sm text-blue-600" onClick={() => updateField(key, [...items, ''])}>+ Add</button>
        </div>
      );
    }

    // fallback
    return (
      <div key={key} className="mb-4">
        <label className="block font-medium mb-1">{label}</label>
        <input className="w-full border px-3 py-2 rounded" value={value || ''} onChange={(e) => updateField(key, e.target.value)} />
      </div>
    );
  };

  return (
    <div className="bg-white shadow rounded p-6 w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">Contract Builder</h2>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} aria-live="polite">
        <div className="mb-4">
          <label className="block font-medium mb-1">Contract Type</label>
          <select className="w-full border px-3 py-2 rounded" value={selectedType || ''} onChange={(e) => setSelectedType(e.target.value)}>
            {types.map(t => <option key={t.key} value={t.key}>{t.displayName}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Jurisdiction (Governing Law)</label>
          <input className="w-full border px-3 py-2 rounded" value={formValues.jurisdiction || ''} onChange={(e) => updateField('jurisdiction', e.target.value)} placeholder="e.g., California, United States or US-CA" />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Effective Date</label>
          <input type="date" className="w-full border px-3 py-2 rounded" value={formValues.effectiveDate || ''} onChange={(e) => updateField('effectiveDate', e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Parties</label>
          {parties.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="flex-1 border px-3 py-2 rounded" value={p} onChange={(e) => updateParty(i, e.target.value)} placeholder={i === 0 ? 'Party A' : `Party ${i + 1}`} />
              {parties.length > 2 && <button type="button" className="text-red-600" onClick={() => removeParty(i)}>Remove</button>}
            </div>
          ))}
          <button type="button" className="text-sm text-blue-600" onClick={addParty}>+ Add Party</button>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Clauses</label>
          {clauses.map((c, idx) => (
            <div key={idx} className="mb-2">
              <textarea className="w-full border px-3 py-2 rounded" value={c} onChange={(e) => updateClause(idx, e.target.value)} />
              <div className="flex gap-2 mt-1">
                {clauses.length > 1 && <button type="button" className="text-red-600" onClick={() => removeClause(idx)}>Remove</button>}
              </div>
            </div>
          ))}
          <button type="button" className="text-sm text-blue-600" onClick={addClause}>+ Add Clause</button>
        </div>

        {/* dynamic fields */}
        {fieldsMeta.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Additional Fields for {selectedType}</h3>
            {fieldsMeta.map((f) => renderField(f))}
          </div>
        )}

        <div className="flex gap-3 items-center">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{loading ? 'Generating...' : 'Generate Contract'}</button>
          <button type="button" onClick={() => { setFormValues({}); setParties(['', '']); setClauses(['']); setResult(null); setError(null); }} className="px-3 py-2 border rounded">Reset</button>
          <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={showAdvanced} onChange={() => setShowAdvanced(v => !v)} /> Show advanced fields</label>
        </div>
      </form>

      {/* results */}
      <div className="mt-6">
        {result?.hallucinationWarning && <div className="p-3 bg-yellow-100 text-yellow-800 rounded mb-3">Warning: The generated contract may contain hallucinated references or content. Review carefully.</div>}
        {Array.isArray(result?.warnings) && result.warnings.length > 0 && (
          <div className="mb-3">
            <strong>Warnings:</strong>
            <ul className="list-disc ml-5">
              {result.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        {result?.html ? (
          <div id="contract-preview" className="prose max-w-none">
            {/* sanitize */}
            {typeof window !== 'undefined' && createDOMPurify ? (
              <div dangerouslySetInnerHTML={{ __html: createDOMPurify(window).sanitize(result.html) }} />
            ) : (
              <div>{result.html}</div>
            )}
          </div>
        ) : result?.text ? (
          <pre id="contract-preview" className="whitespace-pre-wrap bg-gray-50 p-4 rounded">{result.text}</pre>
        ) : null}

        {result?.references && result.references.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium">References</h4>
            <ul className="list-disc ml-5">
              {result.references.map((r: any, i: number) => <li key={i}>{typeof r === 'string' ? r : JSON.stringify(r)}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
