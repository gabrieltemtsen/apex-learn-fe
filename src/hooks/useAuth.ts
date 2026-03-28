"use client";

import { useRouter } from "next/navigation";
import { useAuth as useClerkAuth, useUser, useClerk } from "@clerk/nextjs";

export function useAuth() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useClerkAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const requireAuth = () => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  };

  const requireRole = (roles: string[]) => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return false;
    }

    const role = user?.publicMetadata?.role as string | undefined;
    if (!role || !roles.includes(role)) {
      router.push("/dashboard");
      return false;
    }

    return true;
  };

  const logoutApp = async () => {
    await signOut();
    router.push("/");
  };

  return {
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          role: (user.publicMetadata?.role as string) ?? "learner",
        }
      : null,
    requireAuth,
    requireRole,
    logout: logoutApp,
    getToken,
  };
}
