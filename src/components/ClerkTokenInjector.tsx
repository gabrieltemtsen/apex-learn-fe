"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setClerkTokenProvider } from "@/lib/api";

export default function ClerkTokenInjector() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenProvider(() => getToken());
  }, [getToken]);

  return null;
}
