"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

function CallbackInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const accessToken = sp.get("accessToken");
      const refreshToken = sp.get("refreshToken");

      if (!accessToken || !refreshToken) {
        setError("Missing login tokens. Please try again.");
        return;
      }

      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const { data: user } = await axios.get(`${baseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        login(user, accessToken, refreshToken);
        router.replace("/dashboard");
      } catch (e: unknown) {
        const err = e as { response?: { data?: { message?: string } } };
        setError(err?.response?.data?.message || "Login failed. Please try again.");
      }
    })();
  }, [sp, login, router]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-2xl p-6 text-center">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="text-slate-200">Completing sign-in…</div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
