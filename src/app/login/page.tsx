'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const message = await res.text(); // handle plain-text error
      throw new Error(
        message.toLowerCase().includes('user') ? 'Incorrect email or password' : message
      );
    }

    const data = await res.json(); // this is safe only when res.ok is true
    localStorage.setItem('token', data.token);
    router.push('/profile');
  }catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message || 'Something went wrong');
  } else {
    setError('Something went wrong');
  }
}
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to TradeMinutes</h1>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-700 placeholder:text-gray-700 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md text-gray-700 placeholder:text-gray-700 text-sm"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-md w-full hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
