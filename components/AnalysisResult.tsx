const AnalysisResult = ({ result }: { result: any }) => {
  if (!result) return null;

  return (
    <div className="border p-4 mt-4 rounded bg-gray-50">
      <h3 className="font-bold text-lg">AI Summary</h3>
      <p className="mb-2">{result.summary}</p>
      <h4 className="font-semibold">Key Clauses</h4>
      <ul className="list-disc list-inside">
        {result.clauses.map((clause: string, idx: number) => (
          <li key={idx}>{clause}</li>
        ))}
      </ul>
      <h4 className="font-semibold mt-2">Risks</h4>
      <p>{result.risks}</p>
    </div>
  );
};

export default AnalysisResult;
