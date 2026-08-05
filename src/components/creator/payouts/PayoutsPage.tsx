"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Clock,
  DollarSign,
  Loader2,
  Wallet,
} from "lucide-react";
import { formatCurrency, formatDate, truncateWallet } from "@/lib/format";
import { getDefaultPayoutChain, getPayoutChain } from "@/lib/payout-chains";
import {
  formatCountdown,
  getActivePayoutWallet,
  isWalletChangePending,
} from "@/lib/wallet-change";
import type { PayoutChainId, PayoutRecord } from "@/types/creator";
import BlockchainSelector from "@/components/creator/payouts/BlockchainSelector";
import StatCard from "@/components/creator/ui/StatCard";
import { StatCardSkeleton } from "@/components/creator/ui/Skeleton";
import Badge from "@/components/creator/ui/Badge";
import EmptyState from "@/components/creator/ui/EmptyState";
import ErrorState from "@/components/creator/ui/ErrorState";
import { useCreatorPayoutsQuery } from "@/hooks/useCreatorQueries";
import { useRequestPayoutMutation } from "@/hooks/mutations/useRequestPayoutMutation";
import { isApiError } from "@/lib/apiError";

const MIN_PAYOUT = 10;

function statusVariant(
  status: string,
): "yellow" | "blue" | "green" | "red" | "grey" {
  switch (status) {
    case "pending":
      return "yellow";
    case "approved":
      return "blue";
    case "paid":
      return "green";
    case "rejected":
      return "red";
    default:
      return "grey";
  }
}

export default function PayoutsPage() {
  const { data, isLoading, error, refetch } = useCreatorPayoutsQuery();
  const requestPayoutMutation = useRequestPayoutMutation();
  const [selectedChain, setSelectedChain] = useState<PayoutChainId>("solana");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (data?.savedChain) {
      setSelectedChain(data.savedChain);
    }
  }, [data?.savedChain]);

  const activeChain = useMemo(
    () => getPayoutChain(selectedChain) ?? getDefaultPayoutChain(),
    [selectedChain],
  );

  const walletChange = data?.walletChange;
  const isPending = isWalletChangePending(
    walletChange?.walletChangePendingUntil,
  );
  const selectedWallet = data?.wallets.find(
    (wallet) => wallet.chain === selectedChain,
  );
  const activePayoutWallet =
    selectedWallet?.address ||
    (data && selectedChain === "solana"
      ? getActivePayoutWallet(data, "solana")
      : "");

  useEffect(() => {
    if (!isPending || !walletChange?.walletChangePendingUntil) {
      setCountdown("");
      return;
    }

    const update = () => {
      setCountdown(formatCountdown(walletChange.walletChangePendingUntil!));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isPending, walletChange?.walletChangePendingUntil]);

  useEffect(() => {
    if (
      isPending &&
      walletChange?.walletChangePendingUntil &&
      countdown === "0h 0m 0s"
    ) {
      void refetch();
    }
  }, [countdown, isPending, walletChange?.walletChangePendingUntil, refetch]);

  const canRequest =
    (data?.availableBalance ?? 0) >= MIN_PAYOUT &&
    activePayoutWallet.length > 0 &&
    activeChain.enabled &&
    !isPending;

  const handleChainSelect = (chainId: PayoutChainId) => {
    setSelectedChain(chainId);
    setSubmitError(null);
  };

  const handleRequest = async () => {
    if (!data || !canRequest) return;

    setSubmitError(null);
    try {
      await requestPayoutMutation.mutateAsync({
        walletAddress: activePayoutWallet,
        amount: data.availableBalance,
        chain: selectedChain,
      });
    } catch (err) {
      setSubmitError(
        isApiError(err)
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to request payout",
      );
    }
  };

  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load payouts"}
        onRetry={() => void refetch()}
      />
    );
  }

  const submitting = requestPayoutMutation.isPending;

  return (
    <div className="space-y-6">
      <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
        Payouts
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Available Balance"
              value={
                <span className="text-creator-success">
                  {formatCurrency(data?.availableBalance ?? 0)}
                </span>
              }
              subtext="Minimum payout: $10 Solana USDC"
              icon={Wallet}
            />
            <StatCard
              title="Total Paid Out"
              value={formatCurrency(data?.totalPaidOut ?? 0)}
              subtext="All time"
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <div className="space-y-6 rounded-xl border border-creator-border bg-creator-card p-4 transition-colors duration-200 md:p-6">
        <BlockchainSelector
          selectedChainId={selectedChain}
          onSelect={handleChainSelect}
        />

        {activeChain.enabled && (
          <div className="border-t border-creator-border pt-6">
            <label className="mb-2 block text-sm font-medium text-creator-text-primary">
              {activeChain.walletLabel}
            </label>
            <p className="mb-3 text-xs text-creator-text-secondary">
              This wallet comes from your connected account wallets. Update it
              in Settings if you need to make a change.
            </p>

            {isPending && (
              <div className="mb-4 rounded-xl border border-[var(--color-creator-warning)]/30 bg-[var(--color-creator-warning)]/10 p-4">
                <p className="text-sm font-medium text-creator-text-primary">
                  Wallet change pending. Your new address will activate in 72
                  hours.
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-creator-text-secondary">
                  <Clock className="h-3.5 w-3.5" />
                  Activates in:{" "}
                  <span className="font-mono text-creator-accent">
                    {countdown}
                  </span>
                </p>
                <p className="mt-2 text-xs text-creator-text-secondary">
                  Payouts during this period still go to your current wallet:{" "}
                  <span className="font-mono text-creator-text-primary">
                    {truncateWallet(activePayoutWallet)}
                  </span>
                </p>
              </div>
            )}

            <input
              type="text"
              value={activePayoutWallet}
              readOnly
              disabled
              placeholder={activeChain.walletPlaceholder}
              className="w-full cursor-not-allowed rounded-xl border border-creator-border/40 bg-creator-bg/70 px-4 py-2.5 font-mono text-sm text-creator-text-secondary focus:outline-none"
            />
          </div>
        )}

        {activeChain.enabled && (
          <>
            <div className="group relative border-t border-creator-border pt-6">
              <button
                type="button"
                onClick={() => void handleRequest()}
                disabled={!canRequest || submitting}
                className="creator-btn-primary w-full rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Request Payout on ${activeChain.name}`
                )}
              </button>
              {!canRequest && (data?.availableBalance ?? 0) < MIN_PAYOUT && (
                <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg border border-creator-border bg-creator-card px-3 py-1.5 text-xs text-creator-text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                  Minimum payout is $10
                </div>
              )}
              {isPending && (
                <div className="pointer-events-none absolute -top-12 left-1/2 w-64 -translate-x-1/2 rounded-lg border border-creator-border bg-creator-card px-3 py-2 text-center text-xs text-creator-text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                  Payouts are paused while your wallet address change is being
                  processed
                </div>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-[var(--color-creator-danger)]">
                {submitError}
              </p>
            )}

            <p className="text-xs text-creator-text-secondary">
              Payouts are processed manually and sent in USDC on the selected network.
              Processing time: 1–3 business days.
            </p>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-creator-border bg-creator-card p-4">
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-creator-border/60" />
            ))}
          </div>
        </div>
      ) : !data?.payouts.length ? (
        <EmptyState message="No payout requests yet." />
      ) : (
        <div className="rounded-xl border border-creator-border bg-creator-card transition-colors duration-200">
          <div className="divide-y divide-creator-border md:hidden">
            {data.payouts.map((payout: PayoutRecord) => (
              <div key={payout.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-creator-text-primary">
                      {formatCurrency(payout.amount)}
                    </p>
                    <p className="mt-1 text-xs text-creator-text-secondary">
                      {formatDate(payout.dateRequested)}
                    </p>
                  </div>
                  <Badge variant={statusVariant(payout.status)}>
                    {payout.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-creator-text-secondary">
                  <Badge variant="teal">
                    {payout.chain === "solana" ? "Solana USDC" : "Ethereum USDC"}
                  </Badge>
                  <span className="font-mono">
                    {truncateWallet(payout.wallet)}
                  </span>
                </div>
                {payout.notes && (
                  <p className="text-xs text-creator-text-secondary">
                    {payout.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-creator-border text-xs text-creator-text-secondary">
                  <th className="px-4 py-3 font-medium">Date Requested</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Chain</th>
                  <th className="px-4 py-3 font-medium">Wallet</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.payouts.map((payout: PayoutRecord, i: number) => (
                  <tr
                    key={payout.id}
                    className={`border-b border-creator-border last:border-0 ${
                      i % 2 === 0 ? "bg-creator-bg/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-creator-text-secondary">
                      {formatDate(payout.dateRequested)}
                    </td>
                    <td className="px-4 py-3 font-medium text-creator-text-primary">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="teal">
                        {payout.chain === "solana" ? "Solana USDC" : "Ethereum USDC"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-creator-text-secondary">
                      {truncateWallet(payout.wallet)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(payout.status)}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-creator-text-secondary">
                      {payout.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
