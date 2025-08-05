import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const USE_EXTERNAL_GENERATOR = false;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      contractType,
      partyA,
      partyB,
      effectiveDate,
      clauses,
      jurisdiction,
    } = req.body;

    let contractText = '';

    if (USE_EXTERNAL_GENERATOR) {
      const externalUrl = process.env.CONTRACT_API_URL || 'http://localhost:5000/generate-contract';
      const response = await fetch(externalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`External generator failed: ${text}`);
      }

      const data = await response.json();
      contractText = data.contract;
    } else {
      contractText = `
${contractType.toUpperCase()}

This Agreement is entered into on ${effectiveDate} between ${partyA} ("Party A") and ${partyB} ("Party B").

1. GOVERNING LAW
This agreement is governed by the laws of ${jurisdiction}.

2. CLAUSES
${clauses.map((clause: string, idx: number) => `${idx + 1}. ${clause}`).join('\n')}

IN WITNESS WHEREOF, the parties have executed this Agreement on the date written above.

Party A: ${partyA}
Party B: ${partyB}
      `.trim();
    }

    const { data: savedDoc, error } = await supabase
      .from('Document')
      .insert([
        {
          party_one: partyA,
          party_two: partyB,
          contract_text: contractText,
          document_type: contractType,
        },
      ]);

    if (error) {
      console.error('❌ Supabase insert failed:', error);
      return res.status(500).json({ message: 'Database error', detail: error.message });
    }

    // ✅ Return contract back to frontend
    return res.status(200).json({ contract: contractText });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Generation error:', errorMessage);
    return res.status(500).json({
      message: 'Failed to generate contract',
      detail: errorMessage,
    });
  }
}
