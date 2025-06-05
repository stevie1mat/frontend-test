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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-4">
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-6xl w-full">
        {/* Left: Image mockup */}
        <div className="hidden md:block">
          <img
            src="/clock-1.jpg"
            alt="Phone preview"
            className="h-[500px]"
          />
        </div>

        {/* Right: Login form */}
        <div className="bg-zinc-900 rounded-md p-8 w-full max-w-sm text-white">
          <h1 className="text-4xl font-bold text-center mb-6 font-mono">TradeMinutes</h1>

          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded bg-zinc-800 border border-zinc-700 text-white"
              disabled={loading}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded bg-zinc-800 border border-zinc-700 text-white"
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-zinc-700" />
            <span className="px-2 text-zinc-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-zinc-700" />
          </div>

          <button
            onClick={() => signIn('facebook')}
            className="flex items-center justify-center gap-2 text-blue-400 hover:underline w-full text-sm"
          >
            <img src="/github.png" alt="Facebook" className="w-4 h-4" />
            Log in with Github
          </button>

          <p
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-blue-400 text-center mt-3 hover:underline cursor-pointer"
          >
            Forgot password?
          </p>

          <p className="text-sm text-center mt-4 text-white">
            Don’t have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
