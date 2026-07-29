"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/lib/authSession";
import { creatorKeys } from "@/lib/queryKeys";
import {
  mapMeToDashboard,
  mapMeToReferralCode,
  mapToEarningsData,
  mapToPayoutsData,
  mapToReferralsData,
} from "@/lib/creatorMappers";
import { creatorService } from "@/services/creatorService";
import type { CreatorMeResponse } from "@/types/creatorBackend";

function isQueryEnabled(enabled?: boolean) {
  return enabled ?? (typeof window !== "undefined" && !!getAuthToken());
}

export function useCreatorMeQuery<T = CreatorMeResponse>(
  select?: (data: CreatorMeResponse) => T,
  enabled?: boolean,
) {
  return useQuery({
    queryKey: creatorKeys.me(),
    queryFn: ({ signal }) => creatorService.getMe(undefined, signal),
    enabled: isQueryEnabled(enabled),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    select,
  });
}

export function useCreatorDashboardQuery(enabled?: boolean) {
  return useCreatorMeQuery(mapMeToDashboard, enabled);
}

export function useCreatorReferralCodeQuery(enabled?: boolean) {
  return useCreatorMeQuery(mapMeToReferralCode, enabled);
}

export function useCreatorEarningsQuery(limit?: number | string, enabled?: boolean) {
  return useQuery({
    queryKey: creatorKeys.earnings(limit),
    queryFn: async ({ signal }) => {
      const [me, earnings] = await Promise.all([
        creatorService.getMe(undefined, signal),
        creatorService.getEarnings(limit, signal),
      ]);
      return mapToEarningsData(me, earnings);
    },
    enabled: isQueryEnabled(enabled),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useCreatorPayoutsQuery(limit?: number | string, enabled?: boolean) {
  return useQuery({
    queryKey: creatorKeys.payouts(limit),
    queryFn: async ({ signal }) => {
      const [me, payouts] = await Promise.all([
        creatorService.getMe(undefined, signal),
        creatorService.getPayouts(limit, signal),
      ]);
      return mapToPayoutsData(me, payouts);
    },
    enabled: isQueryEnabled(enabled),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

export function useCreatorReferralsQuery(limit?: number | string, enabled?: boolean) {
  return useQuery({
    queryKey: creatorKeys.referrals(limit),
    queryFn: async ({ signal }) => {
      const list = await creatorService.getReferrals(limit, signal);
      return mapToReferralsData(list);
    },
    enabled: isQueryEnabled(enabled),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}
