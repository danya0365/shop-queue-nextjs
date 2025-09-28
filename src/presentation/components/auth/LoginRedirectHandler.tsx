/**
 * Component to handle redirect after login success
 */

"use client";

import { useEffect } from "react";
import { useLoginRedirect } from "../../hooks/login-redirect";
import { useAuthStore } from "../../stores/auth-store";
import { useProfileStore } from "../../stores/profile-store";

interface LoginRedirectHandlerProps {
  fallbackPath?: string;
}

export function LoginRedirectHandler({
  fallbackPath = "/",
}: LoginRedirectHandlerProps) {
  const { handleRedirect } = useLoginRedirect();
  const { fetchProfiles, fetchActiveProfile, activeProfile } =
    useProfileStore();
  const { authAccount } = useAuthStore();
  const loadProfiles = async (userId: string) => {
    await Promise.all([fetchProfiles(userId), fetchActiveProfile(userId)]);
  };

  const filterFallbackPath = (path: string) => {
    if (path === "/") {
      return "/dashboard";
    }
    if (path === "/account") {
      return "/dashboard";
    }
    if (path === "/auth/login") {
      return "/dashboard";
    }
    if (path === "/auth/register") {
      return "/dashboard";
    }
    if (path === "/auth/verify") {
      return "/dashboard";
    }
    return path;
  };

  // Load profiles on component mount
  useEffect(() => {
    if (authAccount) {
      loadProfiles(authAccount.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAccount?.id]);

  useEffect(() => {
    if (!authAccount || !activeProfile) {
      return;
    }
    const filteredPath = filterFallbackPath(fallbackPath);

    console.log("Filtered path:", filteredPath);
    // Small delay to ensure auth state is updated
    const timer = setTimeout(() => {
      handleRedirect(filteredPath);
    }, 100);

    return () => clearTimeout(timer);
  }, [fallbackPath, authAccount, activeProfile, handleRedirect]);

  return null;
}
