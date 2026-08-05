import { chainDisplayName } from "@/lib/wallet-change";
import type { AuthUserWallet } from "@/types/auth.types";
import type { PayoutChainId, PayoutWallet } from "@/types/creator";

export function blockchainToPayoutChain(
  blockchain: string,
): PayoutChainId | null {
  const normalized = blockchain.toLowerCase();
  if (normalized.includes("solana")) return "solana";
  if (normalized.includes("base")) return "base";
  return null;
}

export function mapAuthWalletsToPayoutWallets(
  wallets?: AuthUserWallet[],
): PayoutWallet[] {
  if (!wallets?.length) return [];

  const seen = new Set<PayoutChainId>();
  const mapped: PayoutWallet[] = [];

  for (const wallet of wallets) {
    const chain = blockchainToPayoutChain(wallet.blockchain);
    if (!chain || !wallet.address.trim() || seen.has(chain)) continue;
    seen.add(chain);
    mapped.push({
      chain,
      address: wallet.address,
      label: chainDisplayName(chain),
    });
  }

  return mapped;
}

export function getAuthWalletAddressForChain(
  wallets: AuthUserWallet[] | undefined,
  chain: PayoutChainId,
): string | undefined {
  if (!wallets?.length) return undefined;

  const chainWallets = wallets.filter(
    (wallet) => blockchainToPayoutChain(wallet.blockchain) === chain,
  );
  if (!chainWallets.length) return undefined;

  const primary = chainWallets.find((wallet) => wallet.isPrimary);
  return (primary ?? chainWallets[0]).address;
}
