import type {
  CreatorSettingsData,
  DashboardData,
  EarningsData,
  NotificationsData,
  PayoutsData,
  ReferralCodeData,
  ReferralsData,
} from "@/types/creator";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    const body = await res.text().catch(() => "");
    if (body) {
      try {
        const json = JSON.parse(body) as { error?: string };
        message = json.error || body;
      } catch {
        message = body;
      }
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export function getDashboard(): Promise<DashboardData> {
  return fetchApi<DashboardData>("/api/creator/dashboard");
}

export function getReferrals(): Promise<ReferralsData> {
  return fetchApi<ReferralsData>("/api/creator/referrals");
}

export function getEarnings(): Promise<EarningsData> {
  return fetchApi<EarningsData>("/api/creator/earnings");
}

export function getPayouts(): Promise<PayoutsData> {
  return fetchApi<PayoutsData>("/api/creator/payouts");
}

export function getReferralCode(): Promise<ReferralCodeData> {
  return fetchApi<ReferralCodeData>("/api/creator/referral-code");
}

export function getNotifications(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications");
}

export function markNotificationRead(id: string): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "PATCH",
    body: JSON.stringify({ id }),
  });
}

export function markAllNotificationsRead(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "PATCH",
    body: JSON.stringify({ all: true }),
  });
}

export function removeNotification(id: string): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export function clearAllNotifications(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "DELETE",
    body: JSON.stringify({ all: true }),
  });
}

export function simulateReferralNotification(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "POST",
    body: JSON.stringify({ type: "referral" }),
  });
}

export function simulateEarningNotification(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "POST",
    body: JSON.stringify({ type: "earning" }),
  });
}

export function simulatePayoutPaidNotification(): Promise<NotificationsData> {
  return fetchApi<NotificationsData>("/api/creator/notifications", {
    method: "POST",
    body: JSON.stringify({ type: "payout" }),
  });
}

export function requestPayout(
  walletAddress: string,
  amount: number,
  chain: string
): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>("/api/creator/payouts/request", {
    method: "POST",
    body: JSON.stringify({ walletAddress, amount, chain }),
  });
}

export function updateWalletAddress(
  walletAddress: string,
  chain: string
): Promise<PayoutsData> {
  return fetchApi<PayoutsData>("/api/creator/payouts/wallet", {
    method: "POST",
    body: JSON.stringify({ walletAddress, chain }),
  });
}

export function getSettings(): Promise<CreatorSettingsData> {
  return fetchApi<CreatorSettingsData>("/api/creator/settings");
}

export function updateSettings(data: {
  username: string;
  profileImageUrl?: string;
}): Promise<CreatorSettingsData> {
  return fetchApi<CreatorSettingsData>("/api/creator/settings", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function resetPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>("/api/creator/settings/password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deactivateAccount(
  username: string
): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>("/api/creator/settings/deactivate", {
    method: "POST",
    body: JSON.stringify({ username }),
  });
}

export { ApiError };
