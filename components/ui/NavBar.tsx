"use client";

import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
