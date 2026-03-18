"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, BookOpen, CheckCircle } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwStrength = form.password.length >= 12 ? "strong" : form.password.length >= 8 ? "medium" : form.password.length > 0 ? "weak" : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    try {
      const data = await authApi.register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      login(data.user, data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><BookOpen className="w-5 h-5 text-white"/></div>
          <span className="text-white font-extrabold text-lg">Apex<span className="text-indigo-400">Learn</span>™</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Join 10,000+ learners on ApexLearn</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-5">
            {error && <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">First Name</label>
                  <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="John"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"/>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-1.5 block">Last Name</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"/>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">Email address</label>
                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"/>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">Password</label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"/>
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
                {pwStrength && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {["weak","medium","strong"].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full ${
                          pwStrength === "strong" ? "bg-emerald-500" :
                          pwStrength === "medium" && s !== "strong" ? "bg-yellow-500" :
                          pwStrength === "weak" && s === "weak" ? "bg-red-500" :
                          "bg-slate-700"
                        }`}/>
                      ))}
                    </div>
                    <span className={`text-xs capitalize ${pwStrength === "strong" ? "text-emerald-400" : pwStrength === "medium" ? "text-yellow-400" : "text-red-400"}`}>{pwStrength}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <input type="password" required value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} placeholder="Repeat password"
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"/>
                  {form.confirmPassword && form.password === form.confirmPassword && <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500"/>}
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-95">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin"/>Creating account...</> : "Create Account"}
              </button>
            </form>
            <p className="text-center text-slate-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign in</Link>
            </p>
            <p className="text-center text-slate-500 text-xs">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
