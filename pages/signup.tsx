import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // 👀 Password validation checks
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const allValid = Object.values(validations).every(Boolean);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;

    const { error } = await supabase.auth.signUp({ email, password });

    if (!error) {
      sessionStorage.setItem('tempLoginEmail', email);
      sessionStorage.setItem('tempLoginPassword', password);
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

          {/* 🔍 Password criteria list */}
          <ul className="text-sm mt-2 space-y-1 text-gray-300">
            <li className={validations.length ? 'text-green-400' : 'text-red-400'}>
              • Minimum 8 characters
            </li>
            <li className={validations.uppercase ? 'text-green-400' : 'text-red-400'}>
              • At least one uppercase letter
            </li>
            <li className={validations.lowercase ? 'text-green-400' : 'text-red-400'}>
              • At least one lowercase letter
            </li>
            <li className={validations.number ? 'text-green-400' : 'text-red-400'}>
              • At least one number
            </li>
            <li className={validations.special ? 'text-green-400' : 'text-red-400'}>
              • At least one special character
            </li>
          </ul>

          <button
            type="submit"
            disabled={!allValid}
            className={`w-full py-3 rounded font-semibold transition ${
              allValid
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
