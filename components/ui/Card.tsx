const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#1a1a1a] text-white p-5 rounded shadow">
    <h3 className="text-yellow-400 text-xl font-bold mb-2">{title}</h3>
    {children}
  </div>
);

export default Card;
