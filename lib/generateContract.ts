import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    // Return raw text under a key for debugging
    return { __rawText: text };
  }
}

export async function generateContract(payload: any) {
  const supabase = createClientComponentClient();
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const url = `${API_BASE}/api/ai/generateContract`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    // include credentials if backend relies on cookies
    credentials: 'include',
  });

  const parsed = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = parsed?.message || parsed?.error || parsed?.__rawText || `HTTP ${res.status}`;
    throw new Error(String(msg));
  }

  // Return the parsed object (may include __rawText if backend returned non-JSON)
  return parsed;
}
