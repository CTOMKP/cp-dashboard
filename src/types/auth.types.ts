/** Wallet row on GET /api/v1/auth/profile */
export interface AuthUserWallet {
  id: string;
  circleWalletId: string | null;
  privyWalletId: string | null;
  address: string;
  blockchain: string;
  type: string;
  walletClient: string;
  description: string | null;
  isPrimary: boolean;
  encryptedPrivateKey: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

/** Unwrapped `data` from GET /api/v1/auth/profile */
export interface AuthUserProfile {
  id: number;
  email: string;
  avatarUrl: string | null;
  name: string | null;
  bio: string | null;
  role: string;
  xpBalance?: number;
  rankScore?: number;
  rankTier?: number;
  rankLevel?: number;
  rankLabel?: string;
  rankEmoji?: string;
  nextRankTier?: number | null;
  nextRankLevel?: number | null;
  nextRankLabel?: string | null;
  rankProgressPercent?: number;
  currentStreakDays?: number;
  createdAt: string;
  accountAgeDays?: number;
  accountAge?: string;
  walletId?: string | null;
  wallets?: AuthUserWallet[];
  updatedAt?: string;
}

/** Normalized profile used across the app (id as string). */
export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role?: string;
  walletId?: string | null;
  wallets?: AuthUserWallet[];
  createdAt: string;
  updatedAt?: string;
}

export function normalizeAuthProfile(profile: AuthUserProfile): User {
  return {
    id: String(profile.id),
    email: profile.email,
    name: profile.name,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    role: profile.role,
    walletId: profile.walletId ?? undefined,
    wallets: profile.wallets,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt ?? profile.createdAt,
  };
}
