"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { mapProfileToSettings } from "@/lib/creatorMappers";
import { useSessionStore } from "@/lib/sessionStore";
import { useCreatorMeQuery } from "@/hooks/useCreatorQueries";
import { useProfileQuery } from "@/hooks/useProfileQuery";
import type { CreatorSettingsData } from "@/types/creator";

interface CreatorProfileContextValue {
  profile: CreatorSettingsData | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<CreatorSettingsData>) => void;
}

const CreatorProfileContext = createContext<CreatorProfileContextValue>({
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  updateProfile: () => {},
});

export function CreatorProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileQuery = useProfileQuery();
  const meQuery = useCreatorMeQuery();

  const profile = useMemo(() => {
    if (!profileQuery.data) return null;
    return mapProfileToSettings(profileQuery.data, meQuery.data?.account);
  }, [profileQuery.data, meQuery.data?.account]);

  useEffect(() => {
    if (!profileQuery.isSuccess || !profileQuery.data) return;

    useSessionStore.getState().hydrateFromStorage();
    if (profileQuery.data.name) {
      useSessionStore.getState().setUsername(profileQuery.data.name);
    }
    if (profileQuery.data.avatarUrl) {
      useSessionStore.getState().setAvatarUrl(profileQuery.data.avatarUrl);
    }
  }, [profileQuery.isSuccess, profileQuery.data]);

  const refreshProfile = useCallback(async () => {
    await Promise.all([profileQuery.refetch(), meQuery.refetch()]);
  }, [profileQuery, meQuery]);

  const updateProfile = useCallback((updates: Partial<CreatorSettingsData>) => {
    if (updates.username) {
      useSessionStore.getState().setUsername(updates.username);
    }
    if (updates.profileImageUrl) {
      useSessionStore.getState().setAvatarUrl(updates.profileImageUrl);
    }
  }, []);

  return (
    <CreatorProfileContext.Provider
      value={{
        profile,
        loading: profileQuery.isLoading || meQuery.isLoading,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </CreatorProfileContext.Provider>
  );
}

export function useCreatorProfile() {
  return useContext(CreatorProfileContext);
}
