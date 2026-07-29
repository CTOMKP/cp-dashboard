export function getDefaultSolanaRpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim() ||
    "https://api.mainnet-beta.solana.com"
  );
}
