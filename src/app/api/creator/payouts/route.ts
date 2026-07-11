import { NextResponse } from "next/server";
import { getPayoutWalletState } from "@/lib/mock-payout-store";

export async function GET() {
  return NextResponse.json(getPayoutWalletState());
}
