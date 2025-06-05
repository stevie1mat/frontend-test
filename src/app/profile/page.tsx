// ProfileDashboardPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileDashboardPage() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      try {
        const res = await fetch('https://trademinutes-auth.onrender.com/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Something went wrong');
      }
    };

    fetchProfile();
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

  return (
    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex`}>
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-800 text-white min-h-screen p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-8 cursor-pointer" onClick={() => router.push('/')}>TradeMinutes</h2>
        <nav className="space-y-2">
          <button className="block w-full text-left py-2 px-4 rounded bg-violet-600">Dashboard</button>
          <button className="block w-full text-left py-2 px-4 hover:bg-zinc-700">Settings</button>
          <button onClick={handleLogout} className="block w-full text-left py-2 px-4 hover:bg-red-600 text-left">Logout</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-sm rounded border px-3 py-1 border-gray-400 bg-zinc-700 text-white hover:bg-zinc-600"
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md col-span-2">
              <h2 className="text-lg text-gray-800 dark:text-white font-semibold mb-4">Welcome, {profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">Email: <span className="font-medium text-gray-800 dark:text-white">{profile.email}</span></p>
              <p className="text-sm text-gray-400">Your dashboard metrics will appear below.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md">
              <h2 className="text-lg text-gray-500 dark:text-gray-300 font-semibold mb-4">Engagement</h2>
              <p className="text-5xl font-bold text-green-600 text-center mb-2">4.85</p>
              <div className="flex justify-center space-x-2 text-xs text-gray-500">
                <span>⭐ 3.2k reviews</span>
                <span>👍 High engagement</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md col-span-2">
              <h2 className="text-lg text-gray-500 dark:text-gray-300 font-semibold mb-4">Audience Locations</h2>
              <div className="h-32 bg-gray-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400">
                Map Placeholder
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-md">
              <h2 className="text-lg text-gray-500 dark:text-gray-300 font-semibold mb-4">Audience Growth</h2>
              <div className="h-24 bg-gray-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-gray-400">
                Chart Here
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}