"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
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
            <h1 className="text-3xl font-extrabold text-white mb-2">Forgot password?</h1>
            <p className="text-slate-400">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <CheckCircle className="w-12 h-12 text-indigo-400" />
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">Check your inbox</p>
                  <p className="text-slate-400 text-sm mt-1">
                    We&apos;ve sent a reset link to{" "}
                    <span className="text-indigo-400 font-medium">{email}</span>
                  </p>
                </div>
                <Link
                  href="/login"
                  className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold"
                >
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-sm mb-1.5 block">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                <p className="text-center text-slate-400 text-sm">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
