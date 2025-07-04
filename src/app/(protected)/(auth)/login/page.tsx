"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const errorText = contentType.includes("application/json")
          ? (await res.json()).message || "Login failed"
          : await res.text();
        throw new Error(errorText);
      }
      if (!contentType.includes("application/json")) {
        await res.text();
        throw new Error("Unexpected response format from server");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-zinc-100 to-zinc-200 text-gray-900 font-[var(--font-geist-sans)] flex flex-col relative overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-32">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full">
          {/* Left: Image */}
          <div className="hidden md:block">
            <img
              src="/login1.png"
              alt="Login visual"
              className="h-[500px] object-contain"
            />
          </div>
          {/* Right: Login Form */}
          <section className="rounded-xl p-8 w-full max-w-sm bg-white/30 backdrop-blur border border-white/40 shadow-lg text-black">
            <h2 className="text-4xl font-bold text-center mb-6 font-mono">Login</h2>
            <form onSubmit={handleLogin}>
              {success && (
                <p className="text-green-500 text-sm mb-2 text-center flex items-center justify-center gap-2">
                  <img src="/favicon.ico" alt="Loading" className="w-5 h-5 animate-spin" />
                  {success}
                </p>
              )}
              {error && (
                <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
              )}
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 rounded border bg-white border-gray-300 text-black"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-4 rounded border bg-white border-gray-300 text-black"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded font-bold text-white"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-zinc-300" />
              <span className="px-2 text-zinc-400 text-sm">OR</span>
              <div className="flex-grow h-px bg-zinc-300" />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => signIn("github", { callbackUrl: "/github-auth" })}
                className="w-10 h-10 bg-white border rounded-full flex items-center justify-center shadow hover:shadow-md"
                title="Log in with GitHub"
              >
                <img src="/github.png" alt="GitHub" className="w-5 h-5" />
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/google-auth" })}
                className="w-10 h-10 bg-white border rounded-full flex items-center justify-center shadow hover:shadow-md"
                title="Log in with Google"
              >
                <img src="/google.png" alt="Google" className="w-5 h-5" />
              </button>
            </div>
            <p
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-blue-400 text-center mt-3 hover:underline cursor-pointer"
            >
              Forgot password?
            </p>
            <p className="text-sm text-center mt-4 text-black">
              Don't have an account?{' '}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
