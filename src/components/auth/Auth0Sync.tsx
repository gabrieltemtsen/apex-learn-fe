"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { registerAccessTokenGetter } from "@/lib/auth0-token";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

/**
 * Bridges Auth0 SDK state into our local Zustand store (for legacy UI code)
 * and registers a token getter used by the axios interceptor.
 */
export default function Auth0Sync() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const setStoreLoading = useAuthStore((s) => s.setLoading);

  // Ensure we only register once
  const registeredRef = useRef(false);

  useLayoutEffect(() => {
    if (registeredRef.current) return;
    registeredRef.current = true;

    registerAccessTokenGetter(async () => {
      try {
        return await getAccessTokenSilently();
      } catch {
        return null;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStoreLoading(isLoading);
    setSession({ isAuthenticated });
  }, [isAuthenticated, isLoading, setSession, setStoreLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }

    // Fetch the real user profile from backend (role/tenant/etc)
    // Do it with an explicit token header to avoid timing/race issues.
    let cancelled = false;
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const { data: me } = await axios.get(`${baseUrl}/users/me/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setUser(me);
      } catch {
        // If profile fetch fails, keep Auth0 session but clear local user
        if (!cancelled) setUser(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setUser, getAccessTokenSilently]);

  return null;
}
