'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

      // Log token and reset link in console (for development/testing only)
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          {message && <p className="text-green-600 text-sm mb-3 text-center">{message}</p>}
          {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-blue-500 text-gray-900"
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
  );
}
