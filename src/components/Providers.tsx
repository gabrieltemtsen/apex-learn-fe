"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/contexts/toast";
import { Auth0Provider } from "@auth0/auth0-react";
import Auth0Sync from "@/components/auth/Auth0Sync";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
      })
  );

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;

  if (!domain || !clientId) {
    // Fail loudly in dev; in prod this makes misconfig obvious.
    console.error("Missing Auth0 env vars: NEXT_PUBLIC_AUTH0_DOMAIN / NEXT_PUBLIC_AUTH0_CLIENT_ID");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        domain={domain || ""}
        clientId={clientId || ""}
        authorizationParams={{
          redirect_uri:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
          audience,
        }}
        cacheLocation="localstorage"
        useRefreshTokens
      >
        <Auth0Sync />
        <ToastProvider>{children}</ToastProvider>
      </Auth0Provider>
    </QueryClientProvider>
  );
}
