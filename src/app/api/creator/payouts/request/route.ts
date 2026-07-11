import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { walletAddress, amount, chain } = body;

  if (!walletAddress || !amount || !chain) {
    return NextResponse.json(
      { error: "walletAddress, amount, and chain are required" },
      { status: 400 }
    );
  }

  if (chain !== "solana") {
    return NextResponse.json(
      { error: "Only Solana USDC payouts are supported right now" },
      { status: 400 }
    );
  }

  if (amount < 10) {
    return NextResponse.json(
      { error: "Minimum payout is $10" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
