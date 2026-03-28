import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl font-extrabold text-white">Reset password</h1>
        <p className="text-slate-400 text-sm">
          Password resets are handled by Clerk. Please use the “Forgot password?” flow on the sign-in screen.
        </p>
        <Link
          href="/sign-in"
          className="block w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
        >
          Go to Sign In
        </Link>
      </div>
    </div>
  );
}
