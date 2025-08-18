import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import nlp from "compromise";

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle file uploads
  },
};

const analyzeLegalDocument = (text: string) => {
  const doc = nlp(text);
  const issues: string[] = [];
  const suggestions: string[] = [];

  const hasGoverningLaw = /governing law|jurisdiction/i.test(text);
  const hasIndemnification = /indemnif(y|ication)/i.test(text);
  const hasLiabilityLimit = /limitation of liability|liability cap/i.test(text);
  const hasRenewal = /automatic renewal|renewal term/i.test(text);
  const hasTermination = /termination|cancel|exit clause/i.test(text);
  const hasForceMajeure = /force majeure/i.test(text);

  const verbs = doc.verbs().out("array");
  const legalVerbs = verbs.filter(v =>
    ["indemnify", "terminate", "govern", "renew", "compensate"].includes(v.toLowerCase())
  );

  if (!hasGoverningLaw) {
    issues.push("Missing governing law clause");
    suggestions.push("Add a clause specifying jurisdiction and applicable law.");
  }

  if (hasIndemnification && !hasLiabilityLimit) {
    issues.push("Indemnification clause without liability cap");
    suggestions.push("Add a limitation of liability to balance risk exposure.");
  }

  if (hasRenewal) {
    suggestions.push("Clarify renewal terms and opt-out procedures.");
  }

  if (!hasTermination) {
    issues.push("No termination clause found");
    suggestions.push("Include terms for early termination or breach.");
  }

  if (!hasForceMajeure) {
    suggestions.push("Consider adding a force majeure clause to cover unforeseeable events.");
  }

  const complianceScore = Math.min(100, 60 + (5 * legalVerbs.length) - (10 * issues.length));

  return {
    complianceScore,
    issues,
    suggestions,
    summary: `Document reviewed for legal compliance and enforceability. Found ${issues.length} issue(s).`,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.document) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: "Failed to parse uploaded document" });
    }

    const file = files.document as formidable.File;
    const buffer = fs.readFileSync(file.filepath);
    const text = buffer.toString("utf-8");

    try {
      const review = analyzeLegalDocument(text);
      res.status(200).json({ message: "Legal review complete", review });
    } catch (error) {
      console.error("Review error:", error);
      res.status(500).json({ error: "Failed to review document" });
    }
  });
}
