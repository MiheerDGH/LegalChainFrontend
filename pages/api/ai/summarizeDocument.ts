import type { NextApiRequest, NextApiResponse } from 'next';

type SummaryResponse = {
  summary: string;
  highlights: string[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SummaryResponse | { error: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid document content' });
  }

  try {
    // 🧠 Placeholder summarization logic — replace with actual AI call
    const summary = generateLegalSummary(content);

    res.status(200).json(summary);
  } catch (err) {
    console.error('🧨 Error summarizing document:', err);
    res.status(500).json({ error: 'Failed to summarize document' });
  }
}

// 📝 Replace this with actual AI integration
function generateLegalSummary(content: string): SummaryResponse {
  // Simulated summary logic
  return {
    summary: `This document outlines key obligations, deadlines, and risk factors relevant to the agreement. It is intended to provide a quick overview for decision-makers.`,
    highlights: [
      'Effective date and jurisdiction',
      'Obligations of Party A and Party B',
      'Termination clauses and renewal terms',
      'Payment schedules and penalties',
      'Confidentiality and dispute resolution'
    ]
  };
}
