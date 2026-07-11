import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-creator-border bg-creator-card/50 px-6 py-16 text-center">
      <Inbox className="mb-3 h-8 w-8 text-creator-text-secondary" />
      <p className="max-w-sm text-sm text-creator-text-secondary">{message}</p>
    </div>
  );
}
