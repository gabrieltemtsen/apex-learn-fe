"use client";

import { useRouter } from "next/navigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  };

  const requireRole = (roles: string[]) => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return false;
    }
    if (!store.user || !roles.includes(store.user.role)) {
      router.push("/dashboard");
      return false;
    }
    return true;
  };

  const logoutApp = async () => {
    store.logoutLocal();
    await logout({ logoutParams: { returnTo: window.location.origin } });
    router.push("/");
  };

  return {
    ...store,
    isAuthenticated,
    isLoading,
    requireAuth,
    requireRole,
    loginWithRedirect,
    logout: logoutApp,
  };
}
