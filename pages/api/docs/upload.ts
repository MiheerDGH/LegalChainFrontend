export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle file logic
    return res.status(200).json({ message: 'File uploaded successfully' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
