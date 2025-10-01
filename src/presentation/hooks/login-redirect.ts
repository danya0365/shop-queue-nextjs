/**
 * Simple login redirect utilities
 */

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const REDIRECT_KEY = "login_redirect";
const DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const useLoginRedirect = () => {
  const router = useRouter();

  const saveAndRedirect = useCallback(
    (currentPath: string, loginPath: string = "/auth/login") => {
      saveRedirectPath(currentPath);
      router.push(loginPath);
    },
    [router]
  );

  const handleRedirect = useCallback((fallbackPath: string = "/") => {
    handleLoginRedirect(fallbackPath);
  }, []);

  const clearRedirect = useCallback(() => {
    clearRedirectPath();
  }, []);

  return {
    saveAndRedirect,
    handleRedirect,
    clearRedirect,
  };
};

interface RedirectData {
  path: string;
  timestamp: number;
  expiresAt: number;
}

function saveRedirectPath(path: string): void {
  if (typeof window === "undefined") return;

  // Basic validation
  if (!path || !path.startsWith("/") || path.includes("://")) {
    return;
  }

  const redirectData: RedirectData = {
    path,
    timestamp: Date.now(),
    expiresAt: Date.now() + DEFAULT_EXPIRY,
  };

  sessionStorage.setItem(REDIRECT_KEY, JSON.stringify(redirectData));
}

function getRedirectPath(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(REDIRECT_KEY);
    if (!stored) return null;

    const redirectData: RedirectData = JSON.parse(stored);

    // Check if expired
    if (Date.now() > redirectData.expiresAt) {
      sessionStorage.removeItem(REDIRECT_KEY);
      return null;
    }

    return redirectData.path;
  } catch {
    return null;
  }
}

function clearRedirectPath(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REDIRECT_KEY);
}

function handleLoginRedirect(fallbackPath: string = "/"): void {
  const redirectPath = getRedirectPath();
  clearRedirectPath();

  if (redirectPath && typeof window !== "undefined") {
    window.location.href = redirectPath;
  } else {
    window.location.href = fallbackPath;
  }
}
