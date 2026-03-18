"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { BookOpen, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Only redirect AFTER the store has rehydrated from localStorage.
    // Without this check, isAuthenticated is always false on first render
    // even for logged-in users, causing an infinite redirect loop.
    if (_hasHydrated && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // Show spinner while hydrating OR if about to redirect
  if (!_hasHydrated || (!isAuthenticated && _hasHydrated)) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  return <>{children}</>;
}
