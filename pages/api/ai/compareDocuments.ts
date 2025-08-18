import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { diffLines } from 'diff';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle multipart/form-data
  },
};

const parseForm = async (
  req: NextApiRequest
): Promise<{ original: Buffer; updated: Buffer }> => {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('❌ Formidable parse error:', err);
        return reject('Failed to parse form data');
      }

      const originalFile = Array.isArray(files.original)
        ? files.original[0]
        : files.original;
      const updatedFile = Array.isArray(files.updated)
        ? files.updated[0]
        : files.updated;

      if (!originalFile?.filepath || !updatedFile?.filepath) {
        console.error('⚠️ Missing file paths:', { originalFile, updatedFile });
        return reject('Missing uploaded files');
      }

      try {
        const original = fs.readFileSync(originalFile.filepath);
        const updated = fs.readFileSync(updatedFile.filepath);
        resolve({ original, updated });
      } catch (readErr) {
        console.error('📂 File read error:', readErr);
        reject('Failed to read uploaded files');
      }
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { original, updated } = await parseForm(req);

    const originalText = original.toString('utf-8');
    const updatedText = updated.toString('utf-8');

    const differences = diffLines(originalText, updatedText);

    const summary = differences.map((part) => ({
      type: part.added
        ? 'addition'
        : part.removed
        ? 'deletion'
        : 'unchanged',
      content: part.value.trim(),
    }));

    res.status(200).json({
      message: 'Comparison complete',
      summary,
    });
  } catch (err) {
    console.error('🔥 Internal server error:', err);
    res.status(500).json({
      error: typeof err === 'string' ? err : 'Internal Server Error',
    });
  }
}
