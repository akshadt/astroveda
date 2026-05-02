"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Spinner from "@/components/ui/Spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoginPage) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!res.ok) {
          let message = `Request failed: ${res.status}`;
          try {
            const body = await res.json();
            message = body.error || message;
          } catch {
            // Ignore JSON parsing error and use fallback message.
          }
          throw new Error(message);
        }
      } catch (err: unknown) {
        console.error("Admin auth check failed:", err);
        router.replace("/admin/login");
        return;
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#1E1B4B] w-full flex-1">{children}</div>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <Spinner className="w-10 h-10 text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 w-full max-w-[100vw] overflow-x-hidden relative z-50">
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] h-14 bg-[#0F172A] flex items-center gap-2 px-3 border-b border-[#1e293b]">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg text-white hover:bg-white/10 -ml-1"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-playfair font-bold text-white text-sm truncate">Admin</span>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-[55] bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
      )}

      <div
        className={`fixed z-[56] top-0 left-0 h-full w-[min(18rem,100vw)] transition-transform duration-200 ease-out md:static md:z-auto md:w-64 md:flex-shrink-0 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 min-w-0 max-w-full flex flex-col pt-14 md:pt-0">
        <main className="flex-1 p-4 sm:px-6 lg:px-8 md:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
