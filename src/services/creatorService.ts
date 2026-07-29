import { apiGet, apiPost } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/authSession";
import { unwrapApiJsonBody } from "@/lib/apiResponse";
import type {
  CreatorEarningsListResponse,
  CreatorMeResponse,
  CreatorPayoutsListResponse,
  CreatorReferralsListResponse,
} from "@/types/creatorBackend";

const CREATOR_BASE = "/api/v1/creator";

function limitQuery(limit?: number | string): string {
  if (limit == null || limit === "") return "";
  return `?limit=${encodeURIComponent(String(limit))}`;
}

async function fetchCreator<T>(
  path: string,
  options?: { limit?: number | string; signal?: AbortSignal },
): Promise<T> {
  if (!getAuthToken()) {
    throw new Error("No auth token available");
  }

  const raw = await apiGet<unknown>(
    `${CREATOR_BASE}${path}${limitQuery(options?.limit)}`,
    {
      signal: options?.signal,
      auth: true,
      clearSessionOn401: true,
    },
  );

  return unwrapApiJsonBody<T>(raw);
}

export const creatorService = {
  getMe(limit?: number | string, signal?: AbortSignal) {
    return fetchCreator<CreatorMeResponse>("/me", { limit, signal });
  },

  getEarnings(limit?: number | string, signal?: AbortSignal) {
    return fetchCreator<CreatorEarningsListResponse>("/earnings", {
      limit,
      signal,
    });
  },

  getPayouts(limit?: number | string, signal?: AbortSignal) {
    return fetchCreator<CreatorPayoutsListResponse>("/payouts", {
      limit,
      signal,
    });
  },

  getReferrals(limit?: number | string, signal?: AbortSignal) {
    return fetchCreator<CreatorReferralsListResponse>("/referrals", {
      limit,
      signal,
    });
  },

  requestPayout(
    body: {
      walletAddress: string;
      amount: number;
      note?: string;
    },
    signal?: AbortSignal,
  ) {
    if (!getAuthToken()) {
      throw new Error("No auth token available");
    }

    return apiPost<unknown>(`${CREATOR_BASE}/payouts/request`, body, {
      signal,
      auth: true,
      clearSessionOn401: true,
    });
  },
};
