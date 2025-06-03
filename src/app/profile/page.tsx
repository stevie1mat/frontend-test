'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Profile = {
  name: string;
  email: string;
  createdAt?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  useEffect(() => {
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
        if (err instanceof Error) {
          setError(err.message || 'Something went wrong');
        } else {
          setError('Something went wrong');
        }
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info and Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
            <h2 className="text-lg text-gray-800 font-semibold mb-4">Dashboard</h2>
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-6">
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{profile.name || 'N/A'}</p>
              </div>
              <div className="col-span-6">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{profile.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Audience Growth */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Audience Growth</h2>
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Chart Here
            </div>
          </div>

          {/* Audience Locations */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Audience Locations</h2>
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Map Placeholder
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg text-gray-500 font-semibold mb-4">Engagement</h2>
            <p className="text-5xl font-bold text-green-600 text-center mb-2">4.85</p>
            <div className="flex justify-center space-x-2 text-xs text-gray-500">
              <span>⭐ 3.2k reviews</span>
              <span>👍 High engagement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
