'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function GoogleAuthPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncWithBackend = async () => {
      if (status !== 'authenticated' || !session?.user?.email) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
          }),
        });

        const data = await res.json();
        localStorage.setItem('token', data.token);
        router.push('/profile');
      } catch (error) {
        console.error('❌ Google sync failed', error);
      }
    };

    syncWithBackend();
  }, [session, status, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500 text-sm">⏳ Syncing with backend, please wait...</p>
    </div>
  );
}
