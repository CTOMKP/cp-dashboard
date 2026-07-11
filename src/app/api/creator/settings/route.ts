import { NextRequest, NextResponse } from "next/server";
import {
  getSettingsState,
  updateSettingsState,
} from "@/lib/mock-settings-store";
import { getPayoutWalletState } from "@/lib/mock-payout-store";
import { getActivePayoutWallet } from "@/lib/wallet-change";

export async function GET() {
  const settings = getSettingsState();
  const payouts = getPayoutWalletState();
  const activeWallet = getActivePayoutWallet(payouts);

  if (settings.wallets[0] && activeWallet) {
    settings.wallets[0].address = activeWallet;
  }

  settings.walletChange = payouts.walletChange;

  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { username, profileImageUrl } = body;
  const current = getSettingsState();

  if (!current.usernameLocked && !username?.trim()) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  const updated = updateSettingsState({
    username: username?.trim(),
    profileImageUrl,
  });

  if (!updated.success) {
    return NextResponse.json({ error: updated.error }, { status: 400 });
  }

  return NextResponse.json(updated.data);
}
