'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} — ${message}`]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setLogs([]);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      addLog('🔌 Connecting to register endpoint...');
      const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      addLog('📤 Sent registration data...');

      const data = await res.text();

      if (!res.ok) {
        addLog(`❌ Error response: ${data}`);
        throw new Error(data || 'Registration failed');
      }

      addLog('✅ Account created successfully');
      addLog('➡️ Redirecting to login page...');
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        addLog(`❌ Registration failed: ${err.message}`);
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
      {/* Debug Toggle Button */}
      <button
        type="button"
        onClick={() => setIsDebugOpen(!isDebugOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-gray-800 transition"
        title="Toggle Debug"
      >
        🐞
      </button>

      {/* Debug Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-black text-white p-4 text-xs shadow-xl overflow-y-auto transform transition-transform z-30 ${
        isDebugOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <h2 className="font-bold text-sm mb-2">🧪 Debug Log</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">Waiting for registration...</p>
        ) : (
          <ul className="space-y-1">
            {logs.map((log, i) => (
              <li key={i} className="text-green-300">{log}</li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleRegister}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative overflow-hidden z-10"
      >
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <img src="/loader.gif" alt="Loading..." className="w-15 h-12" />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create your TradeMinutes account</h1>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm placeholder:text-gray-700 text-gray-700"
          required
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm placeholder:text-gray-700 text-gray-700"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md text-sm placeholder:text-gray-700 text-gray-700"
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
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="flex justify-start mt-6 text-sm">
          Have an account?
          <span className="mx-1" />
          <button
            type="button"
            className="hover:underline text-blue-600"
            onClick={() => router.push('/login')}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
