"use client";

import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";

export default function ForgotPasswordPage() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-4">
        <h1 className="text-2xl font-extrabold text-white">Reset your password</h1>
        <p className="text-slate-400 text-sm">
          Password resets are handled by Auth0. Click below and use the “Forgot password?” link on the Auth0 login screen.
        </p>
        <button
          onClick={() => loginWithRedirect({ authorizationParams: { prompt: "login" } })}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
        >
          Go to Auth0 Login
        </button>
        <Link href="/" className="block text-center text-indigo-400 hover:text-indigo-300 text-sm">
          Back home
        </Link>
      </div>
    </div>
  );
}
