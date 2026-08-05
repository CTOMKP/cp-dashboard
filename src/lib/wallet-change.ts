import type { PayoutChainId, PayoutsData } from "@/types/creator";

export const WALLET_CHANGE_COOLDOWN_DAYS = 30;
export const WALLET_ACTIVATION_HOURS = 72;

export function isWalletChangePending(pendingUntil?: string): boolean {
  if (!pendingUntil) return false;
  return new Date(pendingUntil).getTime() > Date.now();
}

export function canChangeWallet(nextAllowed?: string): boolean {
  if (!nextAllowed) return true;
  return new Date(nextAllowed).getTime() <= Date.now();
}

export function getActivePayoutWallet(
  data: PayoutsData,
  chain: PayoutChainId = "solana",
): string {
  if (
    data.walletChange?.pendingWalletAddress &&
    isWalletChangePending(data.walletChange.walletChangePendingUntil)
  ) {
    return data.walletChange.activeWalletAddress;
  }

  const chainWallet = data.wallets.find((wallet) => wallet.chain === chain)?.address;
  return (
    chainWallet ??
    data.savedWalletAddress ??
    data.walletChange?.activeWalletAddress ??
    ""
  );
}

export function getTimeRemaining(targetIso: string) {
  const totalMs = Math.max(0, new Date(targetIso).getTime() - Date.now());
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, totalMs };
}

export function formatCountdown(targetIso: string): string {
  const { hours, minutes, seconds, totalMs } = getTimeRemaining(targetIso);
  if (totalMs <= 0) return "0h 0m 0s";
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function chainDisplayName(chain: PayoutChainId): string {
  return chain === "solana" ? "Solana USDC" : "Ethereum USDC";
}
