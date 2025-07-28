import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tempEmail = sessionStorage.getItem('tempLoginEmail');
    const tempPassword = sessionStorage.getItem('tempLoginPassword');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');

    if (tempEmail) setEmail(tempEmail);
    else if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }

    if (tempPassword) setPassword(tempPassword);
    else if (rememberedPassword) {
      setPassword(rememberedPassword);
      setRememberMe(true);
    }

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
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gradient-to-tr from-yellow-500 to-yellow-300 rounded-xl p-[2px]">
        <div className="bg-black rounded-xl p-6 shadow-xl text-white">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Legal Chain</h1>
          <p className="text-gray-400 text-center mb-6 text-sm">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="email"
                aria-label="Email"
                placeholder="user@example.com"
                className="w-full bg-transparent border border-gray-700 text-white px-4 py-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <input
                type="password"
                aria-label="Password"
                placeholder="Your Password"
                className="w-full bg-transparent border border-gray-700 text-white px-4 py-3 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-yellow-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="hover:underline text-yellow-400">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-full transition transform ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : '→'}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center border border-red-700 rounded p-2 bg-red-900/20 mt-2">
                {error}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-yellow-400 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
