'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(
          message.toLowerCase().includes('user') ? 'Incorrect email or password' : message
        );
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative overflow-hidden"
      >
         {/* GIF Loader */}
  {loading && (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 rounded-xl">
      <img src="/loader.gif" alt="Loading..." className="w-15 h-12" />
    </div>
  )}
        {/* Background Logo */}
        <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-end pointer-events-none select-none">
         
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          {/* Top Logo */}
          <div className="flex flex-col items-center mb-6">
            
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Login to TradeMinutes
            </h1>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm text-gray-700 placeholder:text-gray-700"
            required
            disabled={loading}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-md text-sm text-gray-700 placeholder:text-gray-700"
            required
            disabled={loading}
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white py-3 rounded-md w-full transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="my-6 text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">or</div>
          </div>

          {/* GitHub Button */}
          <button
            type="button"
            onClick={() => signIn('github')}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
          >
            Continue with GitHub
          </button>

          {/* Links */}
          <div className="flex justify-between mt-6 text-sm text-blue-600">
            <button
              type="button"
              className="hover:underline"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="hover:underline"
              onClick={() => router.push('/register')}
            >
              Register New Account
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
