'use client';

import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-blue-600">TradeMinutes</div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-blue-600">How it works</a>
          <a href="#" className="hover:text-blue-600">Features</a>
          <a href="#" className="hover:text-blue-600">Pricing</a>
        </nav>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign up</button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-2 rounded-full shadow-md">
              <span className="text-2xl">🔁</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exchange Skills, Not Money</h1>
          <p className="text-lg text-gray-600 mb-8">
            Swap your skills for time credits to get the help you need, all in one app
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium text-lg hover:bg-blue-700">
            Get started
          </button>
        </div>

        {/* Fixed: Use Image for both assets */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-16">
          <Image
            src="/logo.png"
            alt="Clock in hand"
            width={200}
            height={200}
            className="rounded-lg"
          />
          <Image
            src="/map.jpg" // Replace with actual path
            alt="Map with pins"
            width={300}
            height={200}
            className="rounded-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-center md:text-left">
          <div>
            <h3 className="font-semibold text-lg mb-2">Smart Map & Task Matching</h3>
            <p className="text-gray-600">Browse nearby service requests and offers on an interactive map</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Time Credit & Scheduling System</h3>
            <p className="text-gray-600">Earn and spend time credits for each completed or requested task</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Time Credit & Scheduling System</h3>
            <p className="text-gray-600">Earn and spend time credits for each completed or requested task</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Trust & Community Profiles</h3>
            <p className="text-gray-600">Verified profiles show ID, neighborhood status, completed tasks, and skills</p>
          </div>
        </div>

        {/* Trusted By */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p className="mb-2 font-medium">Trusted by</p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400">
            <span>🌐 GlobalBank</span>
            <span>🍴 Epicurious</span>
            <span>🏢 Acme Corp</span>
            <span>🏢 Acme Corp</span>
          </div>
        </div>
      </section>
    </div>
  );
}
