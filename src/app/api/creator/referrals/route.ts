import { NextResponse } from "next/server";
import { getReferralsState } from "@/lib/mock-referrals-store";

export async function GET() {
  return NextResponse.json({ referrals: getReferralsState() });
}
