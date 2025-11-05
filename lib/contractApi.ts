export const api = {
  getTypes: async () => {
    const res = await fetch('/api/ai/contractTypes');
    if (!res.ok) throw new Error(`Failed to load contract types: ${res.status}`);
    return res.json();
  },
  getFields: async (type: string) => {
    const res = await fetch(`/api/ai/contractFields?type=${encodeURIComponent(type)}`);
    if (!res.ok) throw new Error(`Failed to load fields for ${type}: ${res.status}`);
    return res.json();
  },
  generate: async (payload: any, opts: any = {}) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const res = await fetch('/api/ai/generateContract', { method: 'POST', headers, body: JSON.stringify(payload) });
    if (!res.ok) {
      // try to pull JSON error
      let body: any = null;
      try { body = await res.text(); } catch (e) { body = String(e); }
      throw new Error(`Failed to generate contract: ${res.status} - ${String(body).slice(0, 200)}`);
    }
    const json = await res.json();
    return json;
  }
};
