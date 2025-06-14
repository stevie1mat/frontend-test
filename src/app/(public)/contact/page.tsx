'use client';

import Navbar from '@/components/Navbar';
import ContactHeader from '@/components/ContactHeader';

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        <ContactHeader />
        {/* More components like contact form, address, map, etc. */}
      </main>
    </>
  );
}
