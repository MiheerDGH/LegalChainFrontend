// pages/api/ai/review.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing bearer token" });

  const supabase = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: userResult, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userResult?.user) return res.status(401).json({ error: "Invalid or expired token" });

  // Expect either raw text or a documentId to fetch stored text
  const { text, documentId } = req.body || {};
  if (!text && !documentId) return res.status(400).json({ error: "Provide 'text' or 'documentId'" });

  // If documentId provided, pull from DB (adjust table/columns to your schema)
  let docText = text;
  if (!docText && documentId) {
    const { data, error } = await supabase.from("documents").select("finalContract").eq("id", documentId).single();
    if (error || !data) return res.status(404).json({ error: "Document not found" });
    docText = data.finalContract as string;
  }

  // TODO: Replace this stub with your real service call to legalResearchService/openAI checks.
  // This shape matches the sprint contract.
  const result = {
    issues: [
      { section: "Liability", severity: "high", finding: "No cap on liability.", recommendation: "Add mutual cap tied to fees." },
      { section: "Force Majeure", severity: "medium", finding: "Clause missing.", recommendation: "Insert standard FM language." },
    ],
    suggestions: [
      "Add explicit GDPR/CCPA references in Data Protection.",
      "Include 30–60 day notice for auto-renewal."
    ],
    authorities: [
      { citation: "123 F.3d 456", caseName: "Acme v. Beta", court: "9th Cir.", date: "1999", url: "https://example.com" },
      { citation: "2019 WL 12345", caseName: "ClientCo v. VendorCo", court: "S.D.N.Y.", date: "2019", url: "https://example.com" }
    ]
  };

  return res.status(200).json(result);
}
