'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDarkMode(saved === 'dark');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();
      console.log('🧪 Raw response text:', text);

      if (!res.ok) {
        throw new Error(text || 'Failed to send reset link');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      setMessage('✅ Password reset link sent to your email.');

      if (data.token) {
        console.log('🛠️ Token:', data.token);
        console.log('🔗 Reset Link:', `http://localhost:3001/reset-password?token=${data.token}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-black' : 'bg-gray-100'} min-h-screen transition-colors duration-300`}>
      {/* Navbar */}
      <nav className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'} shadow-md py-4 px-6 flex justify-between items-center`}>
        <h1
          className="text-2xl font-bold font-mono cursor-pointer hover:underline"
          onClick={() => router.push('/')}
        >
          TradeMinutes
        </h1>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-sm rounded border px-3 py-1 border-gray-400 bg-zinc-700 text-white hover:bg-zinc-600"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>

      {/* Forgot Password Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6 w-full max-w-sm transition-colors duration-300`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

          <form onSubmit={handleForgotPassword}>
            {message && <p className="text-green-500 text-sm mb-3 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 mb-4 rounded-md border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-blue-500`}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
