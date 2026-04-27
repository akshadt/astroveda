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
    <div className="flex min-h-screen bg-gray-50 w-full relative z-50">
      <AdminSidebar />
      <div className="flex-1 min-w-0 max-w-full">
        <main className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
