export type TocItem = { id:string; title:string; level:number };
export type Reference = { citation:string; caseName?:string; court?:string; date?:string; url?:string };

export type GenerateResponse = {
  contract: string;          // HTML or markdown string
  references: Reference[];   // numbered in order
  structure: TocItem[];      // headings with ids
  documentId?: string;
};

export async function generateContract(payload: any): Promise<GenerateResponse> {
  const res = await fetch("/api/ai/generateContract", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error("AUTH_REQUIRED");
  if (!res.ok) throw new Error("UPSTREAM_ERROR");
  return res.json();
}
