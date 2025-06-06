'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // set default, override in useEffect

  // Set initial theme based on localStorage after client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Apply theme to root element on change
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
    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} min-h-screen flex justify-center items-center px-4 transition-colors duration-300`}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 px-3 py-1 text-sm rounded border border-gray-400 text-white bg-zinc-700 hover:bg-zinc-600 dark:text-white dark:bg-zinc-700 dark:border-gray-500"
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

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
        <div className={`rounded-md p-8 w-full max-w-sm ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-black'} transition-colors duration-300`}>
          <h1
            onClick={() => router.push('/')}
            className="text-4xl font-bold text-center mb-6 font-mono cursor-pointer hover:underline"
          >
            TradeMinutes
          </h1>

          <form onSubmit={handleLogin}>
            {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 mb-3 rounded border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-black'}`}
              disabled={loading}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 mb-4 rounded border ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-black'}`}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold text-white"
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
            onClick={() => signIn('github')}
            className="flex items-center justify-center gap-2 text-blue-400 hover:underline w-full text-sm"
          >
            <img src="/github.png" alt="GitHub" className="w-4 h-4" />
            Log in with Github
          </button>

          <p
            onClick={() => router.push('/forgot-password')}
            className="text-sm text-blue-400 text-center mt-3 hover:underline cursor-pointer"
          >
            Forgot password?
          </p>

          <p className={`text-sm text-center mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
