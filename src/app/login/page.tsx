"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

function LoginInner() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg">
            Apex<span className="text-indigo-400">Learn</span>™
          </span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to continue your learning journey</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5">
            <button
              disabled={isLoading}
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: redirect },
                  authorizationParams: { prompt: "login" },
                })
              }
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting…
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-center text-slate-400 text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={() =>
                  loginWithRedirect({
                    appState: { returnTo: redirect },
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
