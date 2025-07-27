import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (!error) {
      // ✨ Temporarily store credentials (only for dev/staging)
      sessionStorage.setItem('tempLoginEmail', email);
      sessionStorage.setItem('tempLoginPassword', password);

      // ✨ Redirect to login for pre-filled auth flow
      router.push('/login');
    } else {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Create Your Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#222] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#222] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-500 transition">
            Sign Up
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
