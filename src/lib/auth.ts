"use client";

import { privyService } from "@/services/privyService";
import { useSessionStore } from "@/lib/sessionStore";

/**
 * Clears local session storage. Prefer `usePrivyAuth().logout()` when Privy
 * context is available — it also clears the Privy session.
 */
export async function signOut(): Promise<void> {
  privyService.logout();
  useSessionStore.getState().clear();

  if (typeof window !== "undefined") {
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith("ctom-")) {
        sessionStorage.removeItem(key);
      }
    }

    window.location.href = "/";
  }
}
