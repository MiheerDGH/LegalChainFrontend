import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from '@/lib/ai/generateContract'; // Or however you’ve configured it

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Backend service key
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing Supabase token' });

  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData) return res.status(401).json({ message: 'Invalid Supabase token' });

  const {
    contractType,
    partyA,
    partyB,
    effectiveDate,
    clauses,
    jurisdiction,
  } = req.body;

  if (!partyA || !partyB || !effectiveDate || !jurisdiction || !contractType)
    return res.status(400).json({ message: 'Missing required fields' });

  // 🧠 Base prompt builder
  const basePrompt = `
Generate a ${contractType} between "${partyA}" and "${partyB}" with an effective date of ${effectiveDate}.
Governing law: ${jurisdiction}.
Include the following clauses:
${clauses.map((c, i) => `Clause ${i + 1}: ${c}`).join('\n')}

${contractType.toLowerCase().includes('nda') ? `
Reuse standard NDA structure:
- Definitions of Confidential Information
- Obligations of Receiving Party
- Duration of confidentiality
- Remedies in case of breach
` : ''}

Output professional legal language, formatted contract style.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: basePrompt }],
      temperature: 0.3,
    });

    const contractText = completion.choices[0]?.message?.content;
    return res.status(200).json({ result: contractText });
  } catch (err) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ message: 'Failed to generate contract' });
  }
}
