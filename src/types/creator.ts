export type CreatorTier = "STARTER" | "BUILDER" | "PARTNER";

export type ReferralStatus = "active" | "inactive";

export type EarningType = "ad_fee" | "escrow_deal";

export type EarningStatus = "paid" | "pending";

export type PayoutStatus = "pending" | "approved" | "paid" | "rejected";

export type PayoutChainId = "solana" | "base";

export interface EarningsDataPoint {
  date: string;
  amount: number;
}

export interface DashboardData {
  totalReferrals: number;
  newReferralsThisWeek: number | null;
  thisMonthEarnings: number;
  currentTier: CreatorTier;
  tierCutPercent: number;
  referralsForNextTier: number;
  activeReferrals: number;
  pendingPayout: number;
  earningsLast30Days: EarningsDataPoint[];
}

export interface Referral {
  id: string;
  username?: string;
  wallet: string;
  dateJoined: string;
  status: ReferralStatus;
  generated: number;
}

export interface ReferralsData {
  referrals: Referral[];
}

export type CreatorNotificationType =
  | "new_referral"
  | "new_earning"
  | "payout_paid"
  | "welcome";

export interface CreatorNotification {
  id: string;
  type: CreatorNotificationType;
  title: string;
  message: string;
  referralId?: string;
  earningId?: string;
  payoutId?: string;
  amount?: number;
  wallet?: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationsData {
  notifications: CreatorNotification[];
  unreadCount: number;
}

export interface EarningTransaction {
  id: string;
  date: string;
  type: EarningType;
  dealAmount: number;
  yourCut: number;
  status: EarningStatus;
}

export interface EarningsData {
  totalEarned: number;
  thisMonth: number;
  transactions: EarningTransaction[];
}

export interface PayoutRecord {
  id: string;
  dateRequested: string;
  amount: number;
  wallet: string;
  chain: PayoutChainId;
  status: PayoutStatus;
  notes?: string;
}

export interface WalletChangeState {
  activeWalletAddress: string;
  pendingWalletAddress?: string;
  walletLastChanged?: string;
  walletChangePendingUntil?: string;
  nextWalletChangeAllowed?: string;
}

export interface PayoutWallet {
  chain: PayoutChainId;
  address: string;
  label: string;
}

export interface PayoutsData {
  availableBalance: number;
  totalPaidOut: number;
  savedWalletAddress?: string;
  savedChain?: PayoutChainId;
  walletChange?: WalletChangeState;
  wallets: PayoutWallet[];
  payouts: PayoutRecord[];
}

export interface CreatorSettingsData {
  username: string;
  email: string;
  profileImageUrl?: string;
  usernameLocked?: boolean;
  accountDeactivated?: boolean;
  deactivatedAt?: string;
  walletChange?: WalletChangeState;
  wallets: {
    chain: string;
    address: string;
    label: string;
  }[];
}

export interface ReferralCodeData {
  referralCode: string;
  referralLink: string;
  landingPageUrl: string | null;
}
