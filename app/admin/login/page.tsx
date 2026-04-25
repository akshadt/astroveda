"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        try {
          const body = await res.json();
          setError(body.error || "Invalid credentials");
        } catch {
          setError("Invalid credentials");
        }
      }
    } catch (error: unknown) {
      console.error("Admin login failed:", error);
      setError("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Banner */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FDE68A] via-[#D97706] to-[#F59E0B]"></div>
        
        <div className="text-center mb-8">
          <svg className="w-12 h-12 text-[#7C3AED] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.1 3c-4.9 0-8.9 4-8.9 8.9s4 8.9 8.9 8.9c3.9 0 7.2-2.5 8.4-6-1.5 1-3.2 1.6-5 1.6-4.9 0-8.9-4-8.9-8.9 0-1.8.6-3.5 1.6-5-.3-.1-.7-.1-1.1-.1v.6z"/>
          </svg>
          <h1 className="font-playfair text-2xl font-bold text-gray-900">AstroVeda Admin</h1>
          <p className="text-gray-500 mt-2 text-sm">Please log in to streamline the cosmos.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-gray-50"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none bg-gray-50"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-lg border border-red-100 flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-[#1E1B4B] hover:bg-[#4C1D95] font-medium transition-colors shadow-md disabled:opacity-70"
          >
            {isLoading ? <Spinner /> : "Sign In"}
          </button>
        </form>
      </div>

      <Link 
        href="/" 
        className="mt-8 text-purple-200/70 hover:text-white transition-colors duration-200 flex items-center text-sm font-medium"
      >
        &larr; Back to Website
      </Link>
    </div>
  );
}
