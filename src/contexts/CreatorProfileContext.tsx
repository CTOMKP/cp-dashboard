"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSettings } from "@/lib/api/creator";
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
  const [profile, setProfile] = useState<CreatorSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const result = await getSettings();
      setProfile((prev) => ({
        ...result,
        profileImageUrl: result.profileImageUrl ?? prev?.profileImageUrl,
      }));
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<CreatorSettingsData>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <CreatorProfileContext.Provider
      value={{ profile, loading, refreshProfile, updateProfile }}
    >
      {children}
    </CreatorProfileContext.Provider>
  );
}

export function useCreatorProfile() {
  return useContext(CreatorProfileContext);
}
