const CREATOR_REFERRAL_KEY = "cto_creator_referral_code";
const REFERRAL_CODE_PATTERN = /^[a-z0-9][a-z0-9-]{2,63}$/i;

export function captureReferralCodeFromLocation(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const candidate = (params.get("ref") || params.get("referral") || "")
    .trim()
    .toLowerCase();

  if (!REFERRAL_CODE_PATTERN.test(candidate)) return null;
  window.localStorage.setItem(CREATOR_REFERRAL_KEY, candidate);
  return candidate;
}

export function getPendingReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CREATOR_REFERRAL_KEY)?.trim();
  return value && REFERRAL_CODE_PATTERN.test(value) ? value : null;
}

export function clearPendingReferralCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CREATOR_REFERRAL_KEY);
}
