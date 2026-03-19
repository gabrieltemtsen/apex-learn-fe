"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring service here (e.g., Sentry)
    console.error("[ApexLearn Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 text-sm">
            An unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-slate-600 text-xs mt-2 font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold transition-all"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
