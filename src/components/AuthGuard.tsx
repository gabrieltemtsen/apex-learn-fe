"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isLoading && !isAuthenticated)) {
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
