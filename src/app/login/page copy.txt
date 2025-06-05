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
  const [logs, setLogs] = useState<string[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${message}`]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLogs([]);

    try {
      addLog('🔌 Connecting to auth server...');
      const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      addLog('📤 Sent credentials...');

      if (!res.ok) {
        const message = await res.text();
        addLog(`❌ Error response: ${message}`);
        throw new Error(
          message.toLowerCase().includes('user') ? 'Incorrect email or password' : message
        );
      }

      const data = await res.json();
      addLog('✅ Token received');
      localStorage.setItem('token', data.token);
      addLog('➡️ Redirecting to profile...');
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        addLog(`❌ Login failed: ${err.message}`);
      } else {
        setError('Something went wrong');
        addLog('❌ Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 relative">
      {/* Debug Toggle Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsDebugOpen(!isDebugOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-gray-800 transition"
        title="Toggle Debug"
      >
        🐞
      </button>

      {/* Slide-in Debug Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-black text-white p-4 text-xs shadow-xl overflow-y-auto transform transition-transform z-30 ${
        isDebugOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <h2 className="font-bold text-sm mb-2">🧪 Debug Log</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">Waiting for login...</p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, i) => (
              <li key={i} className="text-green-300">{log}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center max-w-6xl w-full gap-10">
        {/* Left side message */}
        <div className="text-center md:text-left">
          <h1 className="text-blue-600 text-5xl font-bold mb-4">TradeMinutes</h1>
          <p className="text-xl text-gray-800 max-w-sm">
            Connect with friends and the world around you on TradeMinutes.
          </p>
        </div>

        {/* Right side login form */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
          <form onSubmit={handleLogin}>
            {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

            <input
              type="email"
              aria-label="Email address"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-blue-500 text-gray-900"
              required
              disabled={loading}
            />

            <input
              type="password"
              aria-label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-blue-500 text-gray-900"
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <hr className="my-4" />

            <button
              type="button"
              onClick={() => router.push('/register')}
              className="w-fit mx-auto block bg-green-600 text-white font-bold px-4 py-2 rounded hover:bg-green-700"
            >
              Create new account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
