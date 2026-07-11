import type { CreatorNotification, EarningTransaction, PayoutRecord, Referral } from "@/types/creator";
import { formatCurrency, truncateWallet } from "@/lib/format";
import { createDemoReferral } from "@/lib/mock-referrals-store";
import { createDemoEarning } from "@/lib/mock-earnings-store";
import { completePayoutPayment } from "@/lib/mock-payout-store";

type NotificationsGlobal = typeof globalThis & {
  __creatorNotificationsState?: CreatorNotification[];
  __creatorDemoReferralDueAt?: number;
  __creatorDemoReferralCreated?: boolean;
};

const notificationsGlobal = globalThis as NotificationsGlobal;
const DEMO_REFERRAL_DELAY_MS = 5000;

if (!notificationsGlobal.__creatorNotificationsState) {
  notificationsGlobal.__creatorNotificationsState = [];
}

let notificationsState = notificationsGlobal.__creatorNotificationsState;

function commitNotificationsState(next: CreatorNotification[]) {
  notificationsState = next;
  notificationsGlobal.__creatorNotificationsState = next;
}

function referralMessage(referral: Referral): string {
  if (referral.username) {
    return `@${referral.username} joined via your referral link`;
  }
  return `${truncateWallet(referral.wallet)} joined via your referral link`;
}

function earningLabel(type: EarningTransaction["type"]): string {
  return type === "escrow_deal" ? "escrow deal" : "ad fee";
}

function earningMessage(transaction: EarningTransaction): string {
  const source = earningLabel(transaction.type);
  const status =
    transaction.status === "pending" ? " (pending)" : "";
  return `You earned ${formatCurrency(transaction.yourCut)} from an ${source}${status}`;
}

function addNotification(notification: CreatorNotification): CreatorNotification {
  const exists = notificationsState.some((n) => n.id === notification.id);
  if (!exists) {
    commitNotificationsState([notification, ...notificationsState]);
  }
  return notification;
}

export function getNotificationsState(): CreatorNotification[] {
  return structuredClone(
    [...notificationsState].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
}

export function getUnreadCount(): number {
  return notificationsState.filter((n) => !n.read).length;
}

export function notifyNewReferral(referral: Referral): CreatorNotification {
  return addNotification({
    id: `notif-${referral.id}`,
    type: "new_referral",
    title: "New referral",
    message: referralMessage(referral),
    referralId: referral.id,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export function notifyNewEarning(
  transaction: EarningTransaction
): CreatorNotification {
  return addNotification({
    id: `notif-${transaction.id}`,
    type: "new_earning",
    title: "New earnings",
    message: earningMessage(transaction),
    earningId: transaction.id,
    amount: transaction.yourCut,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

function payoutMessage(payout: PayoutRecord): string {
  return `${formatCurrency(payout.amount)} USDC was sent to ${truncateWallet(payout.wallet)}`;
}

export function notifyPayoutPaid(payout: PayoutRecord): CreatorNotification {
  const existing = notificationsState.find(
    (notification) =>
      notification.type === "payout_paid" &&
      notification.payoutId === payout.id
  );
  if (existing) return existing;

  return addNotification({
    id: `notif-${payout.id}`,
    type: "payout_paid",
    title: "Payout received",
    message: payoutMessage(payout),
    payoutId: payout.id,
    amount: payout.amount,
    wallet: payout.wallet,
    createdAt: new Date().toISOString(),
    read: false,
  });
}

export function markNotificationRead(
  id: string
): CreatorNotification | undefined {
  let updated: CreatorNotification | undefined;
  commitNotificationsState(
    notificationsState.map((notification) => {
      if (notification.id !== id) return notification;
      updated = { ...notification, read: true };
      return updated;
    })
  );
  return updated;
}

export function markAllNotificationsRead(): void {
  commitNotificationsState(
    notificationsState.map((notification) => ({
      ...notification,
      read: true,
    }))
  );
}

export function removeNotification(id: string): boolean {
  const next = notificationsState.filter((notification) => notification.id !== id);
  if (next.length === notificationsState.length) return false;
  commitNotificationsState(next);
  return true;
}

export function clearAllNotifications(): void {
  commitNotificationsState([]);
}

export function maybeCreateDemoReferralNotification(): void {
  if (
    notificationsGlobal.__creatorDemoReferralCreated ||
    notificationsState.some((n) => n.referralId?.startsWith("demo-"))
  ) {
    notificationsGlobal.__creatorDemoReferralCreated = true;
    return;
  }

  const now = Date.now();

  if (!notificationsGlobal.__creatorDemoReferralDueAt) {
    notificationsGlobal.__creatorDemoReferralDueAt =
      now + DEMO_REFERRAL_DELAY_MS;
    return;
  }

  if (now < notificationsGlobal.__creatorDemoReferralDueAt) {
    return;
  }

  notificationsGlobal.__creatorDemoReferralCreated = true;
  const referral = createDemoReferral();
  notifyNewReferral(referral);
}

export function simulateReferralNotification(): CreatorNotification {
  const referral = createDemoReferral();
  return notifyNewReferral(referral);
}

export function simulateEarningNotification(): CreatorNotification {
  const transaction = createDemoEarning();
  return notifyNewEarning(transaction);
}

export function simulatePayoutPaidNotification(): CreatorNotification {
  const payout = completePayoutPayment();
  const existing = notificationsState.find(
    (notification) => notification.id === `notif-${payout.id}`
  );
  if (existing) return existing;
  return notifyPayoutPaid(payout);
}
