import { USER_ID_KEY } from "@/lib/authSession";
import type { BackendWallet } from "@/types/privy";

export function getWalletsKey(userId?: string | null): string {
  if (!userId) {
    userId = localStorage.getItem(USER_ID_KEY);
  }
  if (!userId) {
    throw new Error("User ID is required for wallet storage");
  }
  return `cto_user_wallets_${userId}`;
}

export function saveWalletsToStorage(
  wallets: BackendWallet[],
  userId?: string | null,
): void {
  const walletsKey = getWalletsKey(userId);
  localStorage.setItem(walletsKey, JSON.stringify(wallets));
}
