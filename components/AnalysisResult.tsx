const AnalysisResult = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg shadow mt-8 text-white">
      <h3 className="text-2xl font-bold text-yellow-400 mb-4">AI Summary</h3>
      <p className="text-gray-300 mb-6">{data.summary || 'No summary available.'}</p>

      <h4 className="text-xl font-semibold mb-2 text-yellow-300">Key Clauses</h4>
      {data.clauses?.length ? (
        <ul className="list-disc list-inside text-gray-300 mb-6">
          {data.clauses.map((clause: string, idx: number) => (
            <li key={idx}>{clause}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No key clauses found.</p>
      )}

      <h4 className="text-xl font-semibold mb-2 text-yellow-300">Risk Flags</h4>
      <p className="text-gray-300">{data.risks || 'No risks detected.'}</p>
    </div>
  );
};

export default AnalysisResult;
