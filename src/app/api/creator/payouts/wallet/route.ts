import { NextRequest, NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/payout-chains";
import { submitWalletChange } from "@/lib/mock-payout-store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { walletAddress, chain } = body;

  if (!walletAddress || !chain) {
    return NextResponse.json(
      { error: "walletAddress and chain are required" },
      { status: 400 }
    );
  }

  if (chain !== "solana") {
    return NextResponse.json(
      { error: "Only Solana USDC wallets are supported right now" },
      { status: 400 }
    );
  }

  if (!isValidSolanaAddress(walletAddress)) {
    return NextResponse.json(
      { error: "Enter a valid Solana USDC wallet address" },
      { status: 400 }
    );
  }

  const result = submitWalletChange(walletAddress, chain);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
