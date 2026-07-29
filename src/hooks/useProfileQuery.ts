"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/authSession";
import { profileKeys } from "@/lib/queryKeys";
import { authService } from "@/services/authService";

type UseProfileQueryOptions = {
  enabled?: boolean;
};

export function useProfileQuery(options: UseProfileQueryOptions = {}) {
  const { enabled: enabledOption } = options;
  const enabled =
    enabledOption !== undefined
      ? enabledOption
      : typeof window !== "undefined" && !!getAuthToken();

  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: ({ signal }) => authService.fetchProfile(signal),
    enabled,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
