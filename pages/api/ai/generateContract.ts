import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const USE_EXTERNAL_GENERATOR = false; // toggle as needed

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    console.log('Payload received:', payload);

    let ndaText = '';

    if (USE_EXTERNAL_GENERATOR) {
      const externalUrl = process.env.NDA_API_URL || 'http://localhost:5000/generate-nda';
      const response = await fetch(externalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`External generator failed: ${text}`);
      }

      const data = await response.json();
      ndaText = data.nda;
    } else {
      ndaText = `This NDA is between ${payload.partyOne} and ${payload.partyTwo}, effective ${payload.effectiveDate}. It covers the following confidential information: ${payload.description}, and remains valid for ${payload.termLength} years.`;
    }

    // Store NDA in Supabase
    const { data: savedDoc, error } = await supabase
      .from('Document')
      .insert([
        {
          party_one: payload.partyOne,
          party_two: payload.partyTwo,
          nda_text: ndaText,
        },
      ]);

    if (error) {
      console.error('📉 Supabase insert failed:', error);
      return res.status(500).json({ message: 'Database error', detail: error.message });
    }

    return res.status(200).json({ nda: ndaText });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Generation error:', errorMessage);
    return res.status(500).json({
      message: 'Failed to generate contract',
      detail: errorMessage,
    });
  }
}
