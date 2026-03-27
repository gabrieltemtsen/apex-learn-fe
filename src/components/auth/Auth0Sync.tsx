"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { registerAccessTokenGetter } from "@/lib/auth0-token";
import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

type UserInfo = {
  email?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
};

/**
 * Bridges Auth0 SDK state into our local Zustand store (for legacy UI code)
 * and registers a token getter used by the axios interceptor.
 */
export default function Auth0Sync() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
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
        return await getAccessTokenSilently({
          authorizationParams: audience ? { audience } : undefined,
        });
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
        const token = await getAccessTokenSilently({
          authorizationParams: audience ? { audience } : undefined,
        });
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const headers = { Authorization: `Bearer ${token}` };

        const { data: me } = await axios.get(`${baseUrl}/users/me/profile`, { headers });

        // If DB user has placeholder/missing names, sync from Auth0 /userinfo.
        const needsName = !me?.firstName || me.firstName === 'NRSA' || !me?.lastName || me.lastName === 'User';
        if (needsName) {
          try {
            const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
            if (domain) {
              const { data: userinfo } = await axios.get<UserInfo>(
                `https://${domain}/userinfo`,
                { headers },
              );

              const full = (userinfo.name || '').trim().split(/\s+/);
              const firstName = (userinfo.given_name || full[0] || me.firstName || '').trim();
              const lastName = (userinfo.family_name || full.slice(1).join(' ') || me.lastName || '').trim();

              if (firstName || lastName) {
                const { data: updated } = await axios.patch(
                  `${baseUrl}/users/me/profile`,
                  { firstName, lastName },
                  { headers }
                );
                if (!cancelled) setUser(updated);
                return;
              }
            }
          } catch {
            // ignore userinfo sync failures
          }
        }

        if (!cancelled) setUser(me);
      } catch {
        // If profile fetch fails, keep Auth0 session but clear local user
        if (!cancelled) setUser(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setUser, getAccessTokenSilently, audience]);

  return null;
}
