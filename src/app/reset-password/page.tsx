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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-blue-500 text-gray-900"
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
          <div className="absolute inset-0 bg-white/90 flex flex-col justify-center items-center rounded-lg">
            <p className="text-green-700 font-semibold text-center mb-2">✅ Password changed successfully!</p>
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
  );
}
