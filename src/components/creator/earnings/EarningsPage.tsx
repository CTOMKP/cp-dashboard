"use client";

import { useMemo, useState, useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { EarningTransaction } from "@/types/creator";
import StatCard from "@/components/creator/ui/StatCard";
import { StatCardSkeleton } from "@/components/creator/ui/Skeleton";
import Badge from "@/components/creator/ui/Badge";
import SearchInput from "@/components/creator/ui/SearchInput";
import Pagination from "@/components/creator/ui/Pagination";
import EmptyState from "@/components/creator/ui/EmptyState";
import ErrorState from "@/components/creator/ui/ErrorState";
import { DollarSign } from "lucide-react";
import { useCreatorEarningsQuery } from "@/hooks/useCreatorQueries";

const PAGE_SIZE = 10;

function typeLabel(type: string) {
  return type === "ad_fee" ? "Ad Fee" : "Escrow Deal";
}

function typeVariant(type: string): "teal" | "purple" {
  return type === "ad_fee" ? "teal" : "purple";
}

export default function EarningsPage() {
  const { data, isLoading, error, refetch } = useCreatorEarningsQuery();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const transactions = data?.transactions ?? [];
  const totalEarned = data?.totalEarned ?? 0;
  const thisMonth = data?.thisMonth ?? 0;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((t) =>
      typeLabel(t.type).toLowerCase().includes(q),
    );
  }, [transactions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (error) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Failed to load earnings"}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
        Earnings History
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
              title="Total Earned"
              value={formatCurrency(totalEarned)}
              subtext="All time"
              icon={DollarSign}
            />
            <StatCard
              title="This Month"
              value={formatCurrency(thisMonth)}
              subtext="Current billing period"
              icon={DollarSign}
            />
          </>
        )}
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-creator-border bg-creator-card p-4">
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-creator-border/60" />
            ))}
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState message="No earnings yet. Your earnings will appear here once your referrals start transacting." />
      ) : (
        <div className="rounded-xl border border-creator-border bg-creator-card transition-colors duration-200">
          <div className="border-b border-creator-border p-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search transactions..."
            />
          </div>
          <div className="divide-y divide-creator-border md:hidden">
            {paginated.map((tx: EarningTransaction) => (
              <div key={tx.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-creator-text-secondary">
                      {formatDateTime(tx.date)}
                    </p>
                    <p className="mt-1 font-medium text-creator-success">
                      {formatCurrency(tx.yourCut)}
                    </p>
                  </div>
                  <Badge variant={typeVariant(tx.type)}>
                    {typeLabel(tx.type)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-creator-text-secondary">
                  <span>Deal {formatCurrency(tx.dealAmount)}</span>
                  <Badge variant={tx.status === "paid" ? "green" : "yellow"}>
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-creator-border text-xs text-creator-text-secondary">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Deal Amount</th>
                  <th className="px-4 py-3 font-medium">Your Cut</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((tx: EarningTransaction, i: number) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-creator-border last:border-0 ${
                      i % 2 === 0 ? "bg-creator-bg/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-creator-text-secondary">
                      {formatDateTime(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={typeVariant(tx.type)}>
                        {typeLabel(tx.type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-creator-text-primary">
                      {formatCurrency(tx.dealAmount)}
                    </td>
                    <td className="px-4 py-3 font-medium text-creator-success">
                      {formatCurrency(tx.yourCut)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={tx.status === "paid" ? "green" : "yellow"}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
