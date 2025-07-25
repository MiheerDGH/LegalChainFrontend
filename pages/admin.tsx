import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminStats from '../components/AdminStats';
import Button from '../components/ui/Button'; 
import NavBar from '../components/ui/NavBar';
import Link from 'next/link';

export default function AdminPage() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const session = useSession();

  return (
    <ProtectedRoute>
      <NavBar />
      <main className="min-h-screen bg-[#111] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 text-blue-400">Admin Dashboard</h1>
          <p className="text-lg text-gray-300 mb-8">Welcome, admin. You have higher access privileges.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* 🔐 User Management */}
            <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-300">
              <h2 className="text-xl font-semibold mb-2 text-white">User Management</h2>
              <p className="text-sm text-gray-400 mb-2">Add or remove users and assign roles.</p>
              <Link href="/admin/users">
                {/* ✅ Variant prop is now supported */}
                <Button variant="secondary">Manage Users</Button>
              </Link>
            </div>

            {/* 📊 Analytics */}
            <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-300">
              <h2 className="text-xl font-semibold mb-2 text-white">Analytics</h2>
              <p className="text-sm text-gray-400 mb-2">View platform usage and traffic trends.</p>
              <button
                onClick={() => setShowAnalytics((prev) => !prev)}
                className="mt-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            </div>

            {/* 🧾 System Logs */}
            <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-xl transition duration-300">
              <h2 className="text-xl font-semibold mb-2 text-white">System Logs</h2>
              <p className="text-sm text-gray-400">Track recent activity and login attempts.</p>
            </div>
          </div>

          {/* 📈 Conditional Analytics */}
          {showAnalytics && session && (
            <div className="mt-10">
              <AdminStats token={session.access_token} />
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
