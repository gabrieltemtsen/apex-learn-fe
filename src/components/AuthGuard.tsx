"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { BookOpen, Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Use Zustand v5's official persist API to track hydration.
  // Start as false (SSR safe) — useEffect will flip it once on the client.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Already hydrated (common case: navigating within the same SPA session)
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    // Not yet hydrated: subscribe to the finish event
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // Double-check in case it hydrated between the check above and the subscribe
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [hydrated, isAuthenticated, router]);

  // Show spinner while waiting for hydration, or while about to redirect
  if (!hydrated || (hydrated && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center animate-pulse">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
      </div>
    );
  }

  return <>{children}</>;
}
