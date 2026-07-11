import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-creator-border bg-creator-card px-6 py-12 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-[var(--color-creator-danger)]" />
      <p className="text-sm text-creator-text-secondary">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="creator-btn-outline mt-4 rounded-lg px-4 py-2 text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
