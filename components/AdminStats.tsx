import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = ({ token }: { token: string }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p className="text-gray-400">Loading stats...</p>;

  return (
    <div className="bg-[#1a1a1a] p-6 rounded text-white shadow space-y-4">
      <h2 className="text-2xl font-bold text-yellow-400">Platform Stats</h2>
      <p>Total Users: <span className="text-gray-300">{stats.totalUsers}</span></p>
      <p>Total Documents: <span className="text-gray-300">{stats.totalDocuments}</span></p>
      <p>Most Active User: <span className="text-gray-300">{stats.topUserEmail}</span></p>
    </div>
  );
};

export default AdminStats;
