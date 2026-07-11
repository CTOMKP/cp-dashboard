import Badge from "../ui/Badge";
import { getNextTier, getTierProgress } from "@/lib/format";
import type { CreatorTier } from "@/types/creator";
import { Skeleton } from "../ui/Skeleton";

interface TierProgressBarProps {
  currentTier: CreatorTier;
  activeReferrals: number;
  referralsForNextTier: number;
  loading?: boolean;
}

export default function TierProgressBar({
  currentTier,
  activeReferrals,
  referralsForNextTier,
  loading,
}: TierProgressBarProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-creator-border bg-creator-card p-6">
        <Skeleton className="mb-4 h-5 w-44" />
        <Skeleton className="mb-3 h-3 w-full" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  const nextTier = getNextTier(currentTier);
  const progress = getTierProgress(
    currentTier,
    activeReferrals,
    referralsForNextTier
  );

  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-4 transition-colors duration-200 md:p-6">
      <h3 className="mb-4 text-sm font-medium text-creator-text-secondary">
        Progress to Next Tier
      </h3>

      {currentTier === "PARTNER" ? (
        <div className="flex items-center gap-3">
          <Badge variant="purple">You&apos;ve reached the highest tier</Badge>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-creator-text-primary">
              {currentTier}
            </span>
            <span className="font-medium text-creator-accent">{nextTier}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-creator-bg">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ff007a] via-[#ff6b35] to-[#ffc107] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-creator-text-secondary">
            {activeReferrals} active referrals · {referralsForNextTier} more
            needed for {nextTier}
          </p>
        </>
      )}
    </div>
  );
}
