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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 relative">
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

      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative overflow-hidden z-10"
      >
        {loading && (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
    <img src="/loader.gif" alt="Loading..." className="w-15 h-12" />
  </div>
)}
        {/* Optional Background Logo */}
        <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-end pointer-events-none select-none">
        
        </div>

        {/* Foreground Logo & Title */}
        <div className="flex flex-col items-center mb-6 relative z-10">
         
          <h1 className="text-2xl font-bold text-center text-gray-800">Login to TradeMinutes</h1>
        </div>

        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm text-gray-700 placeholder:text-gray-700"
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md text-sm text-gray-700 placeholder:text-gray-700"
          required
          disabled={loading}
        />

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

        {/* GitHub Login */}
        <button
          type="button"
          onClick={() => {
            addLog('🔗 Redirecting to GitHub login...');
            signIn('github');
          }}
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
      </form>
    </div>
  );
}
