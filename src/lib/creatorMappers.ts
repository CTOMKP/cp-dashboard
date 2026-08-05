import { toRecord } from "@/lib/apiResponse";
import {
  getAuthWalletAddressForChain,
  mapAuthWalletsToPayoutWallets,
} from "@/lib/authWallets";
import type {
  CreatorEarningsListResponse,
  CreatorMeResponse,
  CreatorPayoutsListResponse,
  CreatorReferralsListResponse,
  CreatorTierBackend,
} from "@/types/creatorBackend";
import type { User } from "@/types/auth.types";
import type {
  CreatorSettingsData,
  CreatorTier,
  DashboardData,
  EarningsData,
  EarningTransaction,
  PayoutChainId,
  PayoutRecord,
  PayoutsData,
  PayoutWallet,
  Referral,
  ReferralCodeData,
} from "@/types/creator";

function asTier(tier: CreatorTierBackend | string | undefined): CreatorTier {
  if (tier === "BUILDER" || tier === "PARTNER" || tier === "STARTER") {
    return tier;
  }
  return "STARTER";
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asChain(value: unknown): PayoutChainId {
  return value === "base" ? "base" : "solana";
}

export function mapMeToDashboard(me: CreatorMeResponse): DashboardData {
  return {
    totalReferrals: me.stats.totalReferrals,
    newReferralsThisWeek: me.stats.newReferralsThisWeek ?? null,
    thisMonthEarnings: me.stats.thisMonthEarnings,
    currentTier: asTier(me.stats.tier),
    tierCutPercent: me.stats.creatorCutPercent,
    referralsForNextTier: me.stats.referralsNeededForNextTier,
    activeReferrals: me.stats.activeReferrals,
    pendingPayout: me.stats.pendingPayoutBalance,
    earningsLast30Days: (me.dailyEarnings ?? []).map((point) => ({
      date: point.date,
      amount: asNumber(point.amount),
    })),
  };
}

export function mapMeToReferralCode(me: CreatorMeResponse): ReferralCodeData {
  return {
    referralCode: me.account.referralCode,
    referralLink: me.account.referralLink,
    landingPageUrl: me.account.landingPageUrl ?? null,
  };
}

function mapEarningItem(raw: unknown): EarningTransaction {
  const row = toRecord(raw);
  const typeRaw = String(row.type ?? "escrow_deal");
  return {
    id: String(row.id ?? row.earningId ?? ""),
    date: String(row.date ?? row.createdAt ?? ""),
    type: typeRaw === "ad_fee" ? "ad_fee" : "escrow_deal",
    dealAmount: asNumber(row.dealAmount ?? row.deal_amount ?? row.amount),
    yourCut: asNumber(row.yourCut ?? row.your_cut ?? row.creatorCut),
    status: row.status === "pending" ? "pending" : "paid",
  };
}

export function mapToEarningsData(
  me: CreatorMeResponse,
  list: CreatorEarningsListResponse,
): EarningsData {
  const items = (list.earnings ?? me.earnings ?? []).map(mapEarningItem);
  return {
    totalEarned: me.stats.allTimeTotalEarned,
    thisMonth: me.stats.thisMonthEarnings,
    transactions: items.filter((item) => item.id || item.date),
  };
}

function mapPayoutItem(raw: unknown): PayoutRecord {
  const row = toRecord(raw);
  return {
    id: String(row.id ?? row.payoutId ?? ""),
    dateRequested: String(row.dateRequested ?? row.createdAt ?? row.requestedAt ?? ""),
    amount: asNumber(row.amount),
    wallet: String(row.wallet ?? row.walletAddress ?? ""),
    chain: asChain(row.chain),
    status:
      row.status === "approved" ||
      row.status === "paid" ||
      row.status === "rejected"
        ? row.status
        : "pending",
    notes: typeof row.notes === "string" ? row.notes : typeof row.note === "string" ? row.note : undefined,
  };
}

export function mapToPayoutsData(
  me: CreatorMeResponse,
  list: CreatorPayoutsListResponse,
  profile?: User,
): PayoutsData {
  const authWallets = mapAuthWalletsToPayoutWallets(profile?.wallets);
  const fallbackWallet = me.account.payoutWalletAddress ?? undefined;
  const fallbackWallets: PayoutWallet[] = fallbackWallet
    ? [
        {
          chain: "solana",
          address: fallbackWallet,
          label: "Solana USDC",
        },
      ]
    : [];
  const wallets = authWallets.length > 0 ? authWallets : fallbackWallets;
  const savedChain = wallets[0]?.chain ?? "solana";

  return {
    availableBalance: me.account.pendingBalance,
    totalPaidOut: me.account.paidBalance,
    savedWalletAddress:
      getAuthWalletAddressForChain(profile?.wallets, savedChain) ??
      fallbackWallet,
    savedChain,
    wallets,
    payouts: (list.payouts ?? me.payouts ?? [])
      .map(mapPayoutItem)
      .filter((item) => item.id || item.dateRequested),
  };
}

function mapReferralItem(raw: unknown): Referral {
  const row = toRecord(raw);
  return {
    id: String(row.id ?? row.referralId ?? row.userId ?? ""),
    username: typeof row.username === "string" ? row.username : undefined,
    wallet: String(row.wallet ?? row.walletAddress ?? ""),
    dateJoined: String(row.dateJoined ?? row.createdAt ?? row.joinedAt ?? ""),
    status: row.status === "inactive" ? "inactive" : "active",
    generated: asNumber(row.generated ?? row.totalGenerated ?? row.earnings),
  };
}

export function mapToReferralsData(list: CreatorReferralsListResponse): {
  referrals: Referral[];
} {
  return {
    referrals: (list.referrals ?? [])
      .map(mapReferralItem)
      .filter((item) => item.id || item.wallet),
  };
}

export function mapProfileToSettings(
  profile: User,
  account?: CreatorMeResponse["account"],
): CreatorSettingsData {
  const authWallets = mapAuthWalletsToPayoutWallets(profile.wallets);
  const payoutWallet = account?.payoutWalletAddress ?? undefined;
  const fallbackWallets: PayoutWallet[] = payoutWallet
    ? [
        {
          chain: "solana",
          address: payoutWallet,
          label: "Solana USDC",
        },
      ]
    : [];

  return {
    username: profile.name?.trim() || profile.email.split("@")[0] || "Creator",
    email: profile.email,
    profileImageUrl: profile.avatarUrl ?? undefined,
    wallets: authWallets.length > 0 ? authWallets : fallbackWallets,
  };
}
