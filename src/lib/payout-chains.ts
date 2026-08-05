export type PayoutChainId = "solana" | "ethereum";

export interface PayoutChain {
  id: PayoutChainId;
  name: string;
  token: string;
  description: string;
  walletLabel: string;
  walletPlaceholder: string;
  walletHint: string;
  enabled: boolean;
  comingSoon?: boolean;
}

export const PAYOUT_CHAINS: PayoutChain[] = [
  {
    id: "solana",
    name: "Solana",
    token: "Solana USDC",
    description: "Receive payouts as USDC on Solana",
    walletLabel: "Solana USDC Wallet Address",
    walletPlaceholder: "e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    walletHint:
      "Enter a valid Solana wallet address that can receive USDC. This is required before you can request a payout.",
    enabled: true,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    token: "Ethereum USDC",
    description: "Receive payouts as USDC on Ethereum",
    walletLabel: "Ethereum USDC Wallet Address",
    walletPlaceholder: "e.g. 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    walletHint: "Uses the Ethereum wallet connected to your CTO account.",
    enabled: true,
  },
];

export function getPayoutChain(id: PayoutChainId): PayoutChain | undefined {
  return PAYOUT_CHAINS.find((chain) => chain.id === id);
}

export function getDefaultPayoutChain(): PayoutChain {
  return PAYOUT_CHAINS.find((chain) => chain.enabled) ?? PAYOUT_CHAINS[0];
}

export function isValidSolanaAddress(address: string): boolean {
  const trimmed = address.trim();
  if (trimmed.length < 32 || trimmed.length > 44) return false;
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed);
}
