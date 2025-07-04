"use client";

import { useEffect, useState, ReactNode, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../common/Sidebar";
import { NotificationBell } from "../common/Sidebar";
import { useSession } from "next-auth/react";

interface LayoutProps {
  children: ReactNode;
  headerName?: string;
}

export default function ProtectedLayout({ children, headerName }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDarkMode(saved === "dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } min-h-screen flex`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6">
        <TopBar />
        {children}
      </main>
    </div>
  );
}

// TopBar component for search and profile dropdown
function TopBar() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userImage: string | undefined = typeof session?.user?.image === 'string' ? session.user.image : undefined;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="flex items-center mb-6 gap-8 w-full">
      {/* Search input (left-aligned) */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base text-gray-700"
        />
      </div>
      {/* Right controls: Notification, profile */}
      <div className="flex items-center gap-4 ml-auto">
        <NotificationBell />
        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200 shadow-sm hover:bg-emerald-50 transition-colors"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {userImage && userImage !== "" ? (
              <img src={userImage} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                {userName.charAt(0)}
              </span>
            )}
            <span className="font-medium text-gray-700">{userName}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Profile</a>
              <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Settings</a>
              <button type="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
