"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2, BookOpen } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isLoading, error, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-white" />
      </div>
      <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
      <div className="text-slate-300 text-sm">
        {error ? `Login failed: ${error.message}` : "Finishing sign-in…"}
      </div>
    </div>
  );
}
