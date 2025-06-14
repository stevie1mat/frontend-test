"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-transparent backdrop-blur-sm text-white fixed top-5 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-white">TradeMinutes</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-md text-white">
          <Link href="#" className="hover:text-gray-200">Home</Link>
          <Link href="#" className="hover:text-gray-200">Browse Jobs</Link>
          <Link href="#" className="hover:text-gray-200">Users</Link>
          <Link href="#" className="hover:text-gray-200">Pages</Link>
          <Link href="#" className="hover:text-gray-200">Contact</Link>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-white hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
          <Link href="#" className="hover:text-gray-200">Become a Seller</Link>
          <Link href="/login" className="hover:text-gray-200">Sign in</Link>
          <Link href="/register">
            <button className="bg-white text-black px-4 py-1.5 rounded hover:bg-gray-200">
              Join
            </button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-white">
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black/80 text-white px-4 py-2 space-y-2 shadow-md">
          <Link href="#">Home</Link>
          <Link href="#">Browse Jobs</Link>
          <Link href="#">Users</Link>
          <Link href="#">Pages</Link>
          <Link href="#">Contact</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Join</Link>
        </div>
      )}
    </header>
  );
}
