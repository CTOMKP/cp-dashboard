import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    referralCode: "CTOM-BUILDER42",
    referralLink: "https://ctomarketplace.com/signup?ref=CTOM-BUILDER42",
    landingPageUrl: "https://ctomarketplace.com/creator?ref=CTOM-BUILDER42",
  });
}
