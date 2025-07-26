// /pages/api/docs.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mockDocs = [
    { id: '1', name: 'Contract A', status: 'Pending' },
    { id: '2', name: 'Contract B', status: 'Reviewed' },
  ];

  res.status(200).json(mockDocs);
}
