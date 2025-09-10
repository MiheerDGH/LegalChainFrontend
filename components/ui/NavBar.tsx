// components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import supabase from '../../lib/supabaseClient';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-black text-yellow-400 p-4 flex justify-between">
      <Link href="/">Legal Chain</Link>
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/past-contracts">Past Contracts</Link>
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      </div>
    </nav>
  );
}
