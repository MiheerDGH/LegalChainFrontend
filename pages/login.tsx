import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✨ Prefill inputs if redirected from signup
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('tempLoginEmail');
    const savedPassword = sessionStorage.getItem('tempLoginPassword');

    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);

    // Clear after prefill
    sessionStorage.removeItem('tempLoginEmail');
    sessionStorage.removeItem('tempLoginPassword');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-black px-4">
      <div className="bg-[#111] text-yellow-100 w-full max-w-md p-8 rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.2)] border border-yellow-700">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center tracking-wide">LOGIN</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-64 mx-auto block px-4 py-4 rounded-md bg-black border border-yellow-600 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-64 mx-auto block px-4 py-4 rounded-md bg-black border border-yellow-600 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <div className="flex flex-col items-center gap-2 w-64 mx-auto text-sm text-yellow-300 mt-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-yellow-500" />
              Remember me
            </label>
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className={`w-64 mx-auto block bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-3 rounded-md font-bold transition shadow hover:shadow-yellow-400/30 mt-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center border border-red-500 rounded p-2 bg-red-900/20 w-64 mx-auto mt-2">
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-yellow-300 mt-6">
          Not a member?{' '}
          <Link href="/signup">
            <span className="text-yellow-400 hover:underline">Sign up now</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
