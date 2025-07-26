// pages/api/docs/delete/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    query: { id },
  } = req;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid document ID' });
  }

  try {
    // TODO: add logic to delete the document from your DB or Supabase
    console.log(`Deleting document with ID: ${id}`);

    return res.status(200).json({ message: `Document ${id} deleted successfully` });
  } catch (error) {
    console.error('Delete failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
