import { useSession } from '@supabase/auth-helpers-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminStats from '../components/AdminStats';

export default function AdminPage() {
  const session = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111] text-white p-6">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {session && <AdminStats token={session.access_token} />}
      </div>
    </ProtectedRoute>
  );
}
