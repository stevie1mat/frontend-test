'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
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

  // Extract token from URL on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) setToken(t);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to reset password');
      }

      setSuccessDialog(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong.');
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

      {/* Form */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className={`${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6 w-full max-w-sm relative transition-colors duration-300`}>
          <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>

          <form onSubmit={handleResetPassword}>
            {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-3 mb-4 rounded-md border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-black'} focus:outline-blue-500`}
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Success Dialog */}
          {successDialog && (
            <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col justify-center items-center rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-semibold text-center mb-2">
                ✅ Password changed successfully!
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
