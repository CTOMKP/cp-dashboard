"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  DollarSign,
  Trophy,
  Users,
} from "lucide-react";
import { getDashboard } from "@/lib/api/creator";
import { formatCurrency, getTierColor } from "@/lib/format";
import type { DashboardData } from "@/types/creator";
import StatCard from "@/components/creator/ui/StatCard";
import { StatCardSkeleton } from "@/components/creator/ui/Skeleton";
import ErrorState from "@/components/creator/ui/ErrorState";
import EarningsChart from "@/components/creator/charts/EarningsChart";
import TierProgressBar from "@/components/creator/charts/TierProgressBar";

export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboard();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
        Creator Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))
        ) : data ? (
          <>
            <StatCard
              title="Total Referrals"
              value={data.totalReferrals}
              subtext={
                <span className="text-[var(--color-creator-info)]">
                  ↑ {data.newReferralsThisWeek} new this week
                </span>
              }
              icon={Users}
            />
            <StatCard
              title="This Month's Earnings"
              value={
                <span className="text-creator-success">
                  {formatCurrency(data.thisMonthEarnings)}
                </span>
              }
              subtext={`${data.currentTier.charAt(0) + data.currentTier.slice(1).toLowerCase()} Tier · ${data.tierCutPercent}%`}
              icon={DollarSign}
            />
            <StatCard
              title="Current Tier"
              value={
                <span style={{ color: getTierColor(data.currentTier) }}>
                  {data.currentTier}
                </span>
              }
              subtext={`${data.referralsForNextTier} more referrals for next tier`}
              icon={Trophy}
            />
            <StatCard
              title="Pending Payout"
              value={formatCurrency(data.pendingPayout)}
              subtext="Minimum payout: $10"
              icon={ArrowUpRight}
              action={
                <Link
                  href="/creator/payouts"
                  className="creator-btn-primary inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm"
                >
                  Request Payout
                </Link>
              }
            />
          </>
        ) : null}
      </div>

      <EarningsChart
        data={data?.earningsLast30Days ?? []}
        loading={loading}
      />

      <TierProgressBar
        currentTier={data?.currentTier ?? "STARTER"}
        activeReferrals={data?.activeReferrals ?? 0}
        referralsForNextTier={data?.referralsForNextTier ?? 0}
        loading={loading}
      />
    </div>
  );
}
