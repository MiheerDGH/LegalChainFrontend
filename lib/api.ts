export type TocItem = { id:string; title:string; level:number };
export type Reference = { citation:string; caseName?:string; court?:string; date?:string; url?:string };

export type GenerateResponse = {
  contract: string;          // HTML or markdown string
  references: Reference[];   // numbered in order
  structure: TocItem[];      // headings with ids
  documentId?: string;
};

export async function generateContract(payload: any): Promise<GenerateResponse> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = `${API_BASE}/api/ai/generateContract`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    // If backend returned non-JSON, surface raw text for debugging
    throw new Error(`Non-JSON response from server: ${text.slice(0, 1000)}`);
  }

  if (res.status === 401) throw new Error('AUTH_REQUIRED');
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data as GenerateResponse;
}
