export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local}@${domain}`;
  if (local.length <= 4) {
    return `${local.slice(0, 1)}..${local.slice(-1)}@${domain}`;
  }
  return `${local.slice(0, 3)}..${local.slice(-1)}@${domain}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} · ${timePart}`;
}

export function truncateWallet(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getNextTier(
  current: "STARTER" | "BUILDER" | "PARTNER"
): "BUILDER" | "PARTNER" | null {
  if (current === "STARTER") return "BUILDER";
  if (current === "BUILDER") return "PARTNER";
  return null;
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case "STARTER":
      return "var(--color-creator-info)";
    case "BUILDER":
      return "var(--color-creator-accent)";
    case "PARTNER":
      return "var(--color-creator-purple)";
    default:
      return "var(--color-creator-text-primary)";
  }
}

export function getTierProgress(
  tier: "STARTER" | "BUILDER" | "PARTNER",
  activeReferrals: number,
  referralsForNextTier: number
): number {
  if (tier === "PARTNER") return 100;
  const thresholds: Record<string, number> = {
    STARTER: 5,
    BUILDER: 20,
  };
  const currentThreshold = thresholds[tier] ?? 0;
  const nextThreshold = currentThreshold + referralsForNextTier;
  const progress =
    ((activeReferrals - currentThreshold) /
      (nextThreshold - currentThreshold)) *
    100;
  return Math.min(100, Math.max(0, progress));
}
