'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GithubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      router.push('/profile');
    } else {
      router.push('/login');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-center text-sm text-gray-500">🔁 Processing GitHub login...</p>
    </div>
  );
}
