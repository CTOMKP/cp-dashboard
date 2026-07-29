import { getAuthToken } from "@/lib/authSession";
import {
  retryAsync,
  waitForPrivyAccessToken,
} from "@/lib/retryAsync";
import { authService } from "@/services/authService";
import { privyService } from "@/services/privyService";
import type { User } from "@/types/auth.types";

const AUTH_RETRY = { maxAttempts: 3, delayMs: 400, backoff: true } as const;

export type AuthBootstrapResult = {
  profilePromise: Promise<User | null>;
};

/**
 * Syncs Privy with the backend, then fetches profile in parallel with retries.
 * Profile only starts after the JWT exists so it cannot wipe the session on 401.
 */
export async function bootstrapAuthSession(
  getAccessToken: () => Promise<string | null>,
): Promise<AuthBootstrapResult> {
  const privyToken = await waitForPrivyAccessToken(getAccessToken);

  await retryAsync(
    () => privyService.syncUser(privyToken, getAccessToken),
    AUTH_RETRY,
  );

  if (!getAuthToken()) {
    throw new Error("Backend auth token missing after sync");
  }

  const profilePromise = retryAsync(
    () => authService.fetchProfile(undefined, { clearSessionOn401: false }),
    AUTH_RETRY,
  ).catch((error) => {
    console.error("Profile fetch failed after retries:", error);
    return null;
  });

  return { profilePromise };
}

export async function fetchProfileWithRetry(): Promise<User | null> {
  try {
    return await retryAsync(() => authService.fetchProfile(), AUTH_RETRY);
  } catch (error) {
    console.error("Profile fetch failed after retries:", error);
    return null;
  }
}
