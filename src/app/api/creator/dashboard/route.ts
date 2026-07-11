import { NextResponse } from "next/server";

function generateEarningsLast30Days() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString(),
      amount: Math.round((Math.random() * 12 + 1) * 100) / 100,
    });
  }
  return data;
}

export async function GET() {
  return NextResponse.json({
    totalReferrals: 24,
    newReferralsThisWeek: 6,
    thisMonthEarnings: 142.5,
    currentTier: "BUILDER",
    tierCutPercent: 15,
    referralsForNextTier: 6,
    activeReferrals: 14,
    pendingPayout: 38.0,
    earningsLast30Days: generateEarningsLast30Days(),
  });
}
