import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { partyA, partyB, duration, confidentialInfo } = req.body;

  if (!partyA || !partyB || !duration || !confidentialInfo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const nda = `
NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement is entered into between ${partyA} ("Disclosing Party") and ${partyB} ("Receiving Party").

1. PURPOSE
The purpose of this Agreement is to protect the confidential information disclosed by the Disclosing Party to the Receiving Party.

2. DEFINITION OF CONFIDENTIAL INFORMATION
Confidential Information includes but is not limited to: ${confidentialInfo}.

3. OBLIGATIONS OF THE RECEIVING PARTY
The Receiving Party agrees to protect the Confidential Information and not to disclose it to any third party without the prior written consent of the Disclosing Party.

4. TERM
This Agreement shall remain in effect for ${duration} from the date of disclosure.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date below.

Disclosing Party: ${partyA}
Receiving Party: ${partyB}

Date: ______________________
  `.trim();

  return res.status(200).json({ nda });
}
