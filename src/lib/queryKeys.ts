export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export const creatorKeys = {
  all: ["creator"] as const,
  me: () => [...creatorKeys.all, "me"] as const,
  earnings: (limit?: number | string) =>
    [...creatorKeys.all, "earnings", limit ?? "default"] as const,
  payouts: (limit?: number | string) =>
    [...creatorKeys.all, "payouts", limit ?? "default"] as const,
  referrals: (limit?: number | string) =>
    [...creatorKeys.all, "referrals", limit ?? "default"] as const,
};
