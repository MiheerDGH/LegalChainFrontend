const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 border rounded shadow-sm bg-white">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);
export default Card;
