type ApiResult<T = any> = {
  ok: boolean;
  status: number;
  data?: T | null;
  raw?: string;
  // normalizedContract is optional and may be present for contract endpoints
  normalizedContract?: {
    html: string | null;
    text: string | null;
    warnings: string[];
    hallucinationWarning: boolean;
    references: any[];
  } | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

import debugStore from './devDebugStore';

async function parseTextThenJson(res: Response) {
  const text = await res.text();
  if (!text) return { data: null, raw: '' };
  try {
    const data = JSON.parse(text);
    return { data, raw: text };
  } catch (err) {
    return { data: null, raw: text };
  }
}

function adaptContractResponse(serverResp: any = {}) {
  const warnings = Array.isArray(serverResp.warnings) ? serverResp.warnings : [];
  const hallucinationWarning = !!serverResp.hallucinationWarning;
  const references = Array.isArray(serverResp.references)
    ? serverResp.references
    : Array.isArray(serverResp.authority_and_references)
    ? serverResp.authority_and_references
    : [];
  const contractText = serverResp.contractText ?? serverResp.contract ?? '';
  const isHtml = !!serverResp.isHtml;
  if (isHtml) return { html: contractText, text: null, warnings, hallucinationWarning, references };
  return { html: null, text: contractText, warnings, hallucinationWarning, references };
}

export async function post(path: string, body?: any, options?: { headers?: Record<string,string> }) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(url, {
    method: 'POST',
    headers: isForm ? (options?.headers || {}) : { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  const { data, raw } = await parseTextThenJson(res);

  // populate debug store in development
  try {
    debugStore.setLast({
      timestamp: Date.now(),
      method: 'POST',
      url,
      request: isForm ? undefined : body,
      status: res.status,
      response: data,
      raw,
    });
  } catch (e) {
    // ignore
  }

  if (!res.ok) {
    const message = data?.message || data?.error || raw?.slice?.(0, 1000) || `HTTP ${res.status}`;
    const error: any = new Error(String(message));
    error.status = res.status;
    error.raw = raw;
    throw error;
  }

  // If this looks like a contract response, expose a normalizedContract for callers
  let normalized: any = null;
  try {
    // adapt when data is an object
    if (data && typeof data === 'object') {
      // some backends use top-level fields
      if (data.contractText || data.contract || data.isHtml !== undefined || data.warnings || data.references) {
        normalized = adaptContractResponse(data);
      }
      // also handle legacy wrappers
      if (!normalized && data.data && typeof data.data === 'object') {
        if (data.data.contractText || data.data.contract) {
          normalized = adaptContractResponse(data.data);
        }
      }
    }
  } catch (e) {
    // ignore adapter errors
    normalized = null;
  }

  return { ok: true, status: res.status, data: data ?? null, raw, normalizedContract: normalized } as ApiResult;
}

export async function get(path: string, options?: { headers?: Record<string,string> }) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, { headers: options?.headers || {}, credentials: 'include' });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    // debug
    try { debugStore.setLast({ timestamp: Date.now(), method: 'GET', url, request: undefined, status: res.status, response: data, raw: text }); } catch(e){}
    if (!res.ok) {
      const err: any = new Error(data?.message || data?.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.raw = text;
      throw err;
    }
    return { ok: true, status: res.status, data } as ApiResult;
  } catch (err: any) {
    if (!res.ok) throw err;
    // non-json but 200
    try { debugStore.setLast({ timestamp: Date.now(), method: 'GET', url, request: undefined, status: res.status, response: null, raw: text }); } catch(e){}
    return { ok: true, status: res.status, data: null, raw: text } as ApiResult;
  }
}

export async function del(path: string, options?: { headers?: Record<string,string> }) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, { method: 'DELETE', headers: options?.headers || {}});
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    try { debugStore.setLast({ timestamp: Date.now(), method: 'DELETE', url, request: undefined, status: res.status, response: data, raw: text }); } catch(e){}
    if (!res.ok) {
      const err: any = new Error(data?.message || data?.error || `HTTP ${res.status}`);
      err.status = res.status;
      err.raw = text;
      throw err;
    }
    return { ok: true, status: res.status, data } as ApiResult;
  } catch (err: any) {
    if (!res.ok) throw err;
    return { ok: true, status: res.status, data: null, raw: text } as ApiResult;
  }
}

export default { post, get, del };
