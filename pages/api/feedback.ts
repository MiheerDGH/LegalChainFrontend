import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, email, feedback_type, feedback_text } = req.body;

    // Validate required fields
    if (!feedback_text || !feedback_text.trim()) {
      return res.status(400).json({ error: 'Feedback text is required' });
    }

    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert([
        {
          user_id: user_id || null,
          email: email || 'anonymous',
          feedback_type: feedback_type || 'general',
          feedback_text: feedback_text.trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: `Failed to save feedback: ${error.message}` });
    }

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      data: data,
    });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return res.status(500).json({ error: `Server error: ${err?.message || String(err)}` });
  }
}
