import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('🔁 Forwarding to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/generateContract`);

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ai/generateContract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
      },
      body: JSON.stringify(req.body),
    });

    const text = await backendResponse.text(); // 👈 always get raw response
    try {
      const result = JSON.parse(text); // 👈 try parsing as JSON
      return res.status(backendResponse.status).json(result);
    } catch (jsonErr) {
      console.error('❌ Invalid JSON from backend:', text);
      return res.status(backendResponse.status).json({ message: 'Invalid response from backend', raw: text });
    }
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ message: 'Proxy failed to reach backend' });
  }
}
