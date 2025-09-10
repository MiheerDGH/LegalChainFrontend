import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export async function generateContract(payload: any) {
  const supabase = createClientComponentClient();
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/ai/generateContract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Generation failed');
  return res.json(); // { contract, references, structure, documentId }
}
