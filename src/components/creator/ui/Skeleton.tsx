interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-creator-border/60 ${className}`}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-5">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-6">
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
