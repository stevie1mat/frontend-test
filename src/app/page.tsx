'use client';

import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold text-blue-700">Trade<span className="text-black">Minutes</span></div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <span className="hover:text-black cursor-pointer">How it works</span>
          <span className="hover:text-black cursor-pointer">Features</span>
          <span className="hover:text-black cursor-pointer">Pricing</span>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-4 pt-16 pb-10">
        <div className="w-10 h-10 mx-auto mb-4">
          <Image src="/refresh-icon.png" alt="refresh icon" width={40} height={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Exchange Skills, Not Money
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-6">
          Swap your skills for time credits to get the help you need, all in one app
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition">
          Get started
        </button>
      </section>

      {/* Visuals Section */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 px-6 pb-20">
        {/* Clock Image */}
        <div className="flex-shrink-0">
          <Image
            src="/clock-hand.png"
            alt="Holding clock"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>

        {/* Map Visualization */}
        <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-lg">
          <Image
            src="/map-markers.png"
            alt="Map with markers"
            width={400}
            height={300}
            className="rounded-xl"
          />
        </div>
      </section>
    </main>
  );
}
