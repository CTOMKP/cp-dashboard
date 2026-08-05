"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { privyService } from "@/services/privyService";
import { authService } from "@/services/authService";
import {
  bootstrapAuthSession,
  fetchProfileWithRetry,
} from "@/services/authBootstrap";
import { getAuthToken } from "@/lib/authSession";
import { profileKeys } from "@/lib/queryKeys";
import { bindSessionStoreListeners, useSessionStore } from "@/lib/sessionStore";
import type { User } from "@/types/auth.types";
import { captureReferralCodeFromLocation } from "@/lib/referralAttribution";

const DEFAULT_LOGIN_REDIRECT = "/creator";
const processingUserIds = new Set<string>();

/** Set when user initiates login; cleared after redirect or failure. */
let pendingLoginRedirect: string | null = null;
let activeSessionSync: Promise<void> | null = null;
let activeHandoffExchange: Promise<User> | null = null;
let manualLoginInProgress = false;

type LoginOptions = {
  redirectTo?: string;
};

type PrivyAuthContextValue = {
  user: ReturnType<typeof usePrivy>["user"];
  userData: {
    id?: string;
    email?: string;
    name?: string | null;
    walletId?: string | null;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  ready: boolean;
  login: (options?: LoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: ReturnType<typeof usePrivy>["getAccessToken"];
};

const PrivyAuthContext = createContext<PrivyAuthContextValue | null>(null);

export function PrivyAuthProvider({ children }: { children: ReactNode }) {
  const {
    authenticated,
    ready,
    user,
    login: privyLogin,
    logout: privyLogout,
    getAccessToken,
  } = usePrivy();

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [handoffPending, setHandoffPending] = useState(true);
  const [userData, setUserData] = useState<PrivyAuthContextValue["userData"]>(
    null,
  );

  useEffect(() => {
    bindSessionStoreListeners();
    captureReferralCodeFromLocation();
  }, []);

  const applyProfile = useCallback((profile: User) => {
    setUserData({
      id: String(profile.id),
      email: profile.email,
      name: profile.name,
      walletId: profile.walletId,
    });
    useSessionStore.getState().setUserId(String(profile.id));
    useSessionStore.getState().setEmail(profile.email ?? null);
    useSessionStore.getState().setUsername(profile.name ?? null);
    useSessionStore.getState().hydrateFromStorage();
    queryClient.setQueryData(profileKeys.detail(), profile);
  }, [queryClient]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("handoff");
    if (!code) {
      setHandoffPending(false);
      return;
    }

    if (!activeHandoffExchange) {
      activeHandoffExchange = authService.exchangeHandoff(code);
    }
    void activeHandoffExchange
      .then((profile) => {
        applyProfile(profile);
        useSessionStore.getState().setToken(getAuthToken());
        setIsAuthenticated(true);
        window.dispatchEvent(new Event("cto-authenticated"));
        router.replace(DEFAULT_LOGIN_REDIRECT);
      })
      .catch((error) => {
        console.error("Session handoff failed:", error);
      })
      .finally(() => {
        activeHandoffExchange = null;
        setHandoffPending(false);
        setIsLoading(false);
      });
  }, [applyProfile, router]);

  const resolveProfile = useCallback(
    async (profilePromise: Promise<User | null>) => {
      const profile = await profilePromise;
      if (profile) applyProfile(profile);
      return profile;
    },
    [applyProfile],
  );

  const hydrateProfile = useCallback(() => {
    void resolveProfile(fetchProfileWithRetry());
  }, [resolveProfile]);

  const establishSession = useCallback(async (): Promise<{
    profilePromise: Promise<User | null> | null;
  } | null> => {
    if (getAuthToken()) {
      setIsAuthenticated(true);
      return { profilePromise: fetchProfileWithRetry() };
    }

    if (activeSessionSync) {
      await activeSessionSync;
      return { profilePromise: fetchProfileWithRetry() };
    }

    let profilePromise: Promise<User | null> = Promise.resolve(null);

    activeSessionSync = (async () => {
      const result = await bootstrapAuthSession(getAccessToken);
      profilePromise = result.profilePromise;
      useSessionStore.getState().setToken(getAuthToken());
      setIsAuthenticated(true);
    })();

    try {
      await activeSessionSync;
    } finally {
      activeSessionSync = null;
    }

    return { profilePromise };
  }, [getAccessToken]);

  const finishPendingRedirect = useCallback(() => {
    if (!getAuthToken()) return;
    window.dispatchEvent(new Event("cto-authenticated"));
    const publicAuthPaths = new Set([
      "/",
      "/login",
      "/creator/login",
      "/creator/signup",
      "/creator-signup",
    ]);
    const path = pendingLoginRedirect ??
      (publicAuthPaths.has(pathname) ? DEFAULT_LOGIN_REDIRECT : null);
    pendingLoginRedirect = null;
    if (path) router.replace(path);
  }, [pathname, router]);

  useEffect(() => {
    if (!isAuthenticated || !getAuthToken()) return;
    finishPendingRedirect();
  }, [isAuthenticated, finishPendingRedirect]);

  useEffect(() => {
    if (!ready || handoffPending) return;

    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      setIsLoading(false);
      useSessionStore.getState().hydrateFromStorage();
      hydrateProfile();
      finishPendingRedirect();
      return;
    }

    if (!authenticated) {
      setIsAuthenticated(false);
      setIsLoading(false);
      if (!pendingLoginRedirect) {
        useSessionStore.getState().clear();
      }
    }
  }, [ready, authenticated, handoffPending, finishPendingRedirect, hydrateProfile]);

  useEffect(() => {
    if (!ready || !authenticated || !user || manualLoginInProgress) return;

    const userId = user.id;
    if (processingUserIds.has(userId)) return;

    const existingToken = getAuthToken();
    if (existingToken) {
      void (async () => {
        setIsLoading(true);
        setIsAuthenticated(true);
        await resolveProfile(fetchProfileWithRetry());
        finishPendingRedirect();
        setIsLoading(false);
      })();
      return;
    }

    processingUserIds.add(userId);

    void (async () => {
      try {
        setIsLoading(true);
        const session = await establishSession();
        if (session?.profilePromise) await resolveProfile(session.profilePromise);
        finishPendingRedirect();
      } catch (error) {
        console.error("Authentication flow failed:", error);
        setIsAuthenticated(!!getAuthToken());
        if (!getAuthToken()) {
          pendingLoginRedirect = null;
        }
      } finally {
        setIsLoading(false);
        processingUserIds.delete(userId);
      }
    })();
  }, [
    authenticated,
    user?.id,
    ready,
    establishSession,
    user,
    finishPendingRedirect,
    hydrateProfile,
    resolveProfile,
  ]);

  const login = useCallback(
    async (options?: LoginOptions) => {
      const redirectTo = options?.redirectTo ?? DEFAULT_LOGIN_REDIRECT;
      pendingLoginRedirect = redirectTo;
      manualLoginInProgress = true;

      try {
        if (!authenticated) {
          await privyLogin({ loginMethods: ["email", "wallet", "google"] });
        }
        const session = await establishSession();
        if (session?.profilePromise) await resolveProfile(session.profilePromise);
        setIsAuthenticated(true);
        pendingLoginRedirect = null;
        window.dispatchEvent(new Event("cto-authenticated"));
        router.replace(redirectTo);
      } finally {
        manualLoginInProgress = false;
      }
    },
    [authenticated, privyLogin, establishSession, resolveProfile, router],
  );

  const logout = useCallback(async () => {
    pendingLoginRedirect = null;

    try {
      await privyLogout();
      queryClient.clear();
      await authService.logout();
      privyService.logout();

      if (user?.id) {
        processingUserIds.delete(user.id);
      }

      setIsAuthenticated(false);
      useSessionStore.getState().clear();
      window.dispatchEvent(new Event("cto-logged-out"));

      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      queryClient.clear();
      await authService.logout();
      privyService.logout();
      if (user?.id) {
        processingUserIds.delete(user.id);
      }
      setIsAuthenticated(false);
      useSessionStore.getState().clear();
      window.dispatchEvent(new Event("cto-logged-out"));
      router.replace("/");
      throw error;
    }
  }, [privyLogout, queryClient, router, user?.id]);

  const value = useMemo<PrivyAuthContextValue>(
    () => ({
      user,
      userData,
      isAuthenticated,
      isLoading: isLoading || !ready || handoffPending,
      ready,
      login,
      logout,
      getAccessToken,
    }),
    [
      user,
      userData,
      isAuthenticated,
      isLoading,
      handoffPending,
      ready,
      login,
      logout,
      getAccessToken,
    ],
  );

  return (
    <PrivyAuthContext.Provider value={value}>{children}</PrivyAuthContext.Provider>
  );
}

export function usePrivyAuth() {
  const context = useContext(PrivyAuthContext);
  if (!context) {
    throw new Error("usePrivyAuth must be used within PrivyAuthProvider");
  }
  return context;
}
