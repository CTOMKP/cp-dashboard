import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  action,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-5 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <p className="text-sm text-creator-text-secondary">{title}</p>
        <div className="rounded-lg bg-creator-bg p-2">
          <Icon className="h-4 w-4 text-creator-text-secondary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-creator-text-primary">
        {value}
      </p>
      {subtext && (
        <div className="mt-1 text-xs text-creator-text-secondary">{subtext}</div>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
