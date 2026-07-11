"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getReferrals } from "@/lib/api/creator";
import { formatCurrency, formatDate, truncateWallet } from "@/lib/format";
import type { Referral } from "@/types/creator";
import ReferralLinkBlock from "@/components/creator/referrals/ReferralLinkBlock";
import Badge from "@/components/creator/ui/Badge";
import SearchInput from "@/components/creator/ui/SearchInput";
import Pagination from "@/components/creator/ui/Pagination";
import EmptyState from "@/components/creator/ui/EmptyState";
import ErrorState from "@/components/creator/ui/ErrorState";
import { TableSkeleton } from "@/components/creator/ui/Skeleton";

const PAGE_SIZE = 10;

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReferrals();
      setReferrals(result.referrals);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return referrals.filter(
      (r) =>
        r.username?.toLowerCase().includes(q) ||
        r.wallet.toLowerCase().includes(q)
    );
  }, [referrals, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6">
      <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
        My Referrals
      </h2>

      <ReferralLinkBlock />

      {error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : loading ? (
        <TableSkeleton rows={5} />
      ) : referrals.length === 0 ? (
        <EmptyState message="No referrals yet. Share your link to get started." />
      ) : (
        <div className="rounded-xl border border-creator-border bg-creator-card transition-colors duration-200">
          <div className="border-b border-creator-border p-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search referrals..."
            />
          </div>
          <div className="divide-y divide-creator-border md:hidden">
            {paginated.map((referral) => (
              <div key={referral.id} className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-medium text-creator-text-primary">
                    {referral.username ? (
                      <span className="text-creator-link">
                        @{referral.username}
                      </span>
                    ) : (
                      <span className="font-mono text-xs">
                        {truncateWallet(referral.wallet)}
                      </span>
                    )}
                  </p>
                  <Badge
                    variant={referral.status === "active" ? "green" : "grey"}
                  >
                    {referral.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-creator-text-secondary">
                  <span>Joined {formatDate(referral.dateJoined)}</span>
                  <span className="font-medium text-creator-success">
                    {formatCurrency(referral.generated)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-creator-border text-xs text-creator-text-secondary">
                  <th className="px-4 py-3 font-medium">Username / Wallet</th>
                  <th className="px-4 py-3 font-medium">Date Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Generated</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((referral, i) => (
                  <tr
                    key={referral.id}
                    className={`border-b border-creator-border last:border-0 ${
                      i % 2 === 0 ? "bg-creator-bg/30" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-creator-text-primary">
                      {referral.username ? (
                        <span className="text-creator-link">@{referral.username}</span>
                      ) : (
                        <span className="font-mono text-xs">
                          {truncateWallet(referral.wallet)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-creator-text-secondary">
                      {formatDate(referral.dateJoined)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={referral.status === "active" ? "green" : "grey"}
                      >
                        {referral.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-creator-success">
                      {formatCurrency(referral.generated)}
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
