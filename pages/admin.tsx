import { useSession } from '@supabase/auth-helpers-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminStats from '../components/AdminStats';

export default function AdminPage() {
  const session = useSession();

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {session && <AdminStats token={session.access_token} />}
      </div>
    </ProtectedRoute>
  );
}
