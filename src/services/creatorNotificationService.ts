import { apiGet, apiPost, apiRequest } from "@/lib/apiClient";
import { getAuthToken } from "@/lib/authSession";
import { toRecord, unwrapApiJsonBody } from "@/lib/apiResponse";
import type { CreatorNotification, CreatorNotificationType } from "@/types/creator";

const BASE = "/api/v1/creator/notifications";

function mapNotification(raw: unknown): CreatorNotification {
  const row = toRecord(raw);
  const data = toRecord(row.data);
  const creatorType = String(data.creatorType ?? "welcome");
  const allowedTypes: CreatorNotificationType[] = [
    "welcome",
    "new_referral",
    "new_earning",
    "payout_paid",
  ];
  const type = allowedTypes.includes(creatorType as CreatorNotificationType)
    ? (creatorType as CreatorNotificationType)
    : "welcome";

  return {
    id: String(row.id ?? ""),
    type,
    title: String(row.title ?? "Creator Program"),
    message: String(row.body ?? row.message ?? ""),
    referralId: data.referralId ? String(data.referralId) : undefined,
    earningId: data.earningId ? String(data.earningId) : undefined,
    payoutId: data.payoutId ? String(data.payoutId) : undefined,
    amount: Number.isFinite(Number(data.amount)) ? Number(data.amount) : undefined,
    wallet: typeof data.wallet === "string" ? data.wallet : undefined,
    createdAt: String(row.createdAt ?? new Date().toISOString()),
    read: Boolean(row.readAt),
  };
}

export const creatorNotificationService = {
  async list(): Promise<CreatorNotification[]> {
    if (!getAuthToken()) return [];
    const raw = await apiGet<unknown>(BASE);
    const body = toRecord(unwrapApiJsonBody(raw));
    const notifications = Array.isArray(body.notifications) ? body.notifications : [];
    return notifications.map(mapNotification).filter((item) => item.id);
  },

  markRead(id: string) {
    return apiPost(`${BASE}/${encodeURIComponent(id)}/read`);
  },

  markAllRead() {
    return apiPost(`${BASE}/read-all`);
  },

  remove(id: string) {
    return apiRequest({ path: `${BASE}/${encodeURIComponent(id)}`, method: "DELETE" });
  },

  clearAll() {
    return apiRequest({ path: BASE, method: "DELETE" });
  },
};
