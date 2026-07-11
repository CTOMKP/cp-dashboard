import type { PayoutChainId, PayoutsData, WalletChangeState } from "@/types/creator";
import {
  WALLET_ACTIVATION_HOURS,
  WALLET_CHANGE_COOLDOWN_DAYS,
} from "@/lib/wallet-change";

const defaultWalletState: PayoutsData & { walletChange: WalletChangeState } = {
  availableBalance: 38.0,
  totalPaidOut: 312.5,
  savedWalletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  savedChain: "solana",
  walletChange: {
    activeWalletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    walletLastChanged: "2025-04-21T10:00:00Z",
    nextWalletChangeAllowed: "2025-05-21T10:00:00Z",
  },
  payouts: [
    {
      id: "1",
      dateRequested: "2025-06-01T10:00:00Z",
      amount: 125.0,
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      status: "paid",
      notes: "Paid on Solana",
    },
    {
      id: "2",
      dateRequested: "2025-05-01T10:00:00Z",
      amount: 87.5,
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      status: "paid",
    },
    {
      id: "3",
      dateRequested: "2025-06-28T15:30:00Z",
      amount: 38.0,
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      status: "pending",
    },
  ],
};

let payoutWalletState = structuredClone(defaultWalletState);

function commitPayoutWalletState(next: typeof payoutWalletState) {
  payoutWalletState = next;
}

export function getPayoutWalletState(): PayoutsData {
  const now = Date.now();
  const pendingUntil = payoutWalletState.walletChange.walletChangePendingUntil;

  if (pendingUntil && new Date(pendingUntil).getTime() <= now) {
    const pendingWallet = payoutWalletState.walletChange.pendingWalletAddress;
    if (pendingWallet) {
      payoutWalletState.savedWalletAddress = pendingWallet;
      payoutWalletState.walletChange.activeWalletAddress = pendingWallet;
      payoutWalletState.walletChange.pendingWalletAddress = undefined;
      payoutWalletState.walletChange.walletChangePendingUntil = undefined;
    }
  }

  return structuredClone(payoutWalletState);
}

export function submitWalletChange(
  newWalletAddress: string,
  chain: PayoutChainId
): { success: boolean; error?: string; data?: PayoutsData } {
  const state = getPayoutWalletState();
  const walletChange = state.walletChange;

  if (!walletChange) {
    return { success: false, error: "Wallet configuration not found." };
  }

  if (walletChange.walletChangePendingUntil) {
    const pendingMs = new Date(walletChange.walletChangePendingUntil).getTime();
    if (pendingMs > Date.now()) {
      return {
        success: false,
        error: "A wallet change is already pending.",
      };
    }
  }

  if (walletChange.nextWalletChangeAllowed) {
    const allowedMs = new Date(walletChange.nextWalletChangeAllowed).getTime();
    if (allowedMs > Date.now()) {
      return {
        success: false,
        error: `You can only change your wallet once every ${WALLET_CHANGE_COOLDOWN_DAYS} days.`,
      };
    }
  }

  const activeWallet =
    walletChange.activeWalletAddress ?? state.savedWalletAddress ?? "";

  if (newWalletAddress.trim() === activeWallet) {
    return { success: false, error: "This is already your active wallet address." };
  }

  const now = new Date();
  const pendingUntil = new Date(
    now.getTime() + WALLET_ACTIVATION_HOURS * 60 * 60 * 1000
  );
  const nextAllowed = new Date(
    now.getTime() + WALLET_CHANGE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000
  );

  payoutWalletState.walletChange = {
    activeWalletAddress: activeWallet,
    pendingWalletAddress: newWalletAddress.trim(),
    walletLastChanged: now.toISOString(),
    walletChangePendingUntil: pendingUntil.toISOString(),
    nextWalletChangeAllowed: nextAllowed.toISOString(),
  };
  payoutWalletState.savedChain = chain;

  return { success: true, data: getPayoutWalletState() };
}

export function resetPayoutWalletState() {
  payoutWalletState = structuredClone(defaultWalletState);
}

export function completePayoutPayment(payoutId?: string) {
  const pendingPayout = payoutId
    ? payoutWalletState.payouts.find((payout) => payout.id === payoutId)
    : payoutWalletState.payouts.find((payout) => payout.status === "pending");

  if (pendingPayout && pendingPayout.status !== "paid") {
    const updatedPayouts = payoutWalletState.payouts.map((payout) =>
      payout.id === pendingPayout.id
        ? {
            ...payout,
            status: "paid" as const,
            notes: "Paid on Solana",
          }
        : payout
    );

    commitPayoutWalletState({
      ...payoutWalletState,
      availableBalance: Math.max(
        0,
        payoutWalletState.availableBalance - pendingPayout.amount
      ),
      totalPaidOut: payoutWalletState.totalPaidOut + pendingPayout.amount,
      payouts: updatedPayouts,
    });

    return updatedPayouts.find((payout) => payout.id === pendingPayout.id)!;
  }

  const wallet =
    payoutWalletState.walletChange.activeWalletAddress ??
    payoutWalletState.savedWalletAddress ??
    "";
  const latestPaid = payoutWalletState.payouts.find(
    (payout) => payout.status === "paid"
  );
  if (latestPaid) {
    return latestPaid;
  }

  const amount = payoutWalletState.availableBalance || 38;
  const demoPayout = {
    id: `payout-demo-${Date.now()}`,
    dateRequested: new Date().toISOString(),
    amount,
    wallet,
    chain: "solana" as const,
    status: "paid" as const,
    notes: "Paid on Solana",
  };

  commitPayoutWalletState({
    ...payoutWalletState,
    availableBalance: Math.max(0, payoutWalletState.availableBalance - amount),
    totalPaidOut: payoutWalletState.totalPaidOut + amount,
    payouts: [demoPayout, ...payoutWalletState.payouts],
  });

  return demoPayout;
}
