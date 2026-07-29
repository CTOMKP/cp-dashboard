export type CreatorTierBackend = "STARTER" | "BUILDER" | "PARTNER";

export type CreatorAccountBackend = {
  id: string;
  userId: number;
  referralCode: string;
  referralLink: string;
  tier: CreatorTierBackend;
  activeReferralsCount: number;
  totalReferralsCount: number;
  totalEarned: number;
  pendingBalance: number;
  reservedBalance: number;
  paidBalance: number;
  heldBalance: number;
  payoutWalletAddress: string | null;
  fraudStatus?: string;
  fraudReason?: string | null;
  lastReviewedAt?: string | null;
  /** Backend TBD — UI shows blank until provided */
  landingPageUrl?: string | null;
};

export type CreatorStatsBackend = {
  totalReferrals: number;
  activeReferrals: number;
  tier: CreatorTierBackend;
  referralsNeededForNextTier: number;
  thisMonthEarnings: number;
  pendingPayoutBalance: number;
  reservedPayoutBalance: number;
  allTimeTotalEarned: number;
  creatorCutPercent: number;
  nextTierTarget: number;
  /** Backend TBD — UI shows blank until provided */
  newReferralsThisWeek?: number | null;
};

export type CreatorDailyEarningBackend = {
  date: string;
  amount: number;
};

export type CreatorMeResponse = {
  success: boolean;
  account: CreatorAccountBackend;
  stats: CreatorStatsBackend;
  earningsBreakdown?: unknown[];
  dailyEarnings?: CreatorDailyEarningBackend[];
  referrals?: unknown[];
  earnings?: unknown[];
  payouts?: unknown[];
};

export type CreatorEarningsListResponse = {
  success: boolean;
  earnings: unknown[];
};

export type CreatorPayoutsListResponse = {
  success: boolean;
  payouts: unknown[];
};

export type CreatorReferralsListResponse = {
  success: boolean;
  referrals: unknown[];
};
