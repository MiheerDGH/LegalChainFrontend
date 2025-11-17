import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import nlp from "compromise";
import mammoth from "mammoth";

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
  const legalVerbs = verbs.filter((v) =>
    ["indemnify", "terminate", "govern", "renew", "compensate"].includes(
      v.toLowerCase()
    )
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
    suggestions.push(
      "Consider adding a force majeure clause to cover unforeseeable events."
    );
  }

  const complianceScore = Math.min(
    100,
    60 + 5 * legalVerbs.length - 10 * issues.length
  );

  return {
    complianceScore,
    issues,
    suggestions,
    summary: `Document reviewed for legal compliance and enforceability. Found ${issues.length} issue(s).`,
  };
};

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({
  multiples: false,
  uploadDir: "/tmp",         // or "./uploads"
  keepExtensions: true,       // preserves .pdf/.docx/etc
});

  form.parse(req, async (err, fields, files) => {
    try {
      if (err || !files.file) {
        console.error("Upload error:", err);
        return res
          .status(400)
          .json({ error: "Failed to parse uploaded document" });
      }

      const file = files.file as formidable.File;
      const filepath = file.filepath;
      const mimetype = file.mimetype || "";
      const originalName = file.originalFilename || "";

      let text = "";

      if (mimetype === "application/pdf" || originalName.endsWith(".pdf")) {
        const mod = await import("pdf-parse");

        // Cast through `unknown` to satisfy TS
        const pdfParse = mod.default as unknown as (
        data: Buffer
        ) => Promise<{ text: string }>;

        const data = await pdfParse(fs.readFileSync(filepath));
        text = data.text;
      } else if (
        mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        originalName.endsWith(".docx")
      ) {
        // DOCX handling
        const result = await mammoth.extractRawText({ path: filepath });
        text = result.value;
      } else if (
        mimetype === "text/plain" ||
        originalName.endsWith(".txt") ||
        !mimetype // fallback
      ) {
        // Plain text
        text = fs.readFileSync(filepath, "utf-8");
      } else {
        return res.status(400).json({
          error: "Unsupported file type. Please upload a TXT, PDF, or DOCX file.",
        });
      }

      if (!text || text.trim().length === 0) {
        return res
          .status(400)
          .json({ error: "Unable to extract text from the document." });
      }

      const review = analyzeLegalDocument(text);
      return res.status(200).json({ message: "Legal review complete", review });
    } catch (error) {
      console.error("Review error:", error);
      return res.status(500).json({ error: "Failed to review document" });
    }
  });
}
