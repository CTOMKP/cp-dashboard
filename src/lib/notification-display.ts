import type { CreatorNotification, CreatorNotificationType } from "@/types/creator";

export function getNotificationHref(type: CreatorNotificationType): string {
  switch (type) {
    case "new_referral":
      return "/creator/referrals";
    case "new_earning":
      return "/creator/earnings";
    case "payout_paid":
      return "/creator/payouts";
    default:
      return "/creator";
  }
}

export function getNotificationActionLabel(
  type: CreatorNotificationType
): string {
  switch (type) {
    case "new_referral":
      return "View referrals →";
    case "new_earning":
      return "View earnings →";
    case "payout_paid":
      return "View payouts →";
    default:
      return "View dashboard →";
  }
}

export function getNotificationIconClass(type: CreatorNotificationType): string {
  switch (type) {
    case "new_earning":
      return "bg-[rgba(34,197,94,0.12)] text-creator-success";
    case "payout_paid":
      return "bg-[rgba(59,130,246,0.12)] text-[var(--color-creator-info,#3b82f6)]";
    default:
      return "bg-creator-accent-muted text-creator-accent";
  }
}
