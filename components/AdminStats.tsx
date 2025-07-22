import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = ({ token }: { token: string }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    };
    fetchStats();
  }, [token]);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Admin Stats</h2>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Documents: {stats.totalDocuments}</p>
      <p>Top User: {stats.topUserEmail}</p>
    </div>
  );
};

export default AdminStats;
