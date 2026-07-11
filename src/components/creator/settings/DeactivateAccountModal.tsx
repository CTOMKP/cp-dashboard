"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeactivateAccountModalProps {
  open: boolean;
  username: string;
  confirmUsername: string;
  loading: boolean;
  error: string | null;
  onConfirmUsernameChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeactivateAccountModal({
  open,
  username,
  confirmUsername,
  loading,
  error,
  onConfirmUsernameChange,
  onClose,
  onConfirm,
}: DeactivateAccountModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const usernameMatches = confirmUsername.trim() === username;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close deactivation dialog"
        onClick={onClose}
        disabled={loading}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-account-title"
        className="relative w-full max-w-md rounded-2xl border border-[var(--color-creator-danger)]/30 bg-creator-card p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-creator-text-secondary transition-colors hover:text-creator-text-primary disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[var(--color-creator-danger)]/15 p-2">
            <AlertTriangle className="h-5 w-5 text-[var(--color-creator-danger)]" />
          </div>
          <div>
            <h3
              id="deactivate-account-title"
              className="text-lg font-semibold text-creator-text-primary"
            >
              Deactivate your account?
            </h3>
            <p className="mt-2 text-sm text-creator-text-secondary">
              This will permanently deactivate your creator account. You will
              lose access to your dashboard, referral link, and pending payouts.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--color-creator-danger)]/20 bg-[var(--color-creator-danger)]/5 p-4">
          <p className="text-sm text-creator-text-primary">
            To confirm, type your username{" "}
            <span className="font-mono font-semibold text-creator-accent">
              {username}
            </span>{" "}
            below.
          </p>
          <label className="mt-4 mb-2 block text-sm text-creator-text-secondary">
            Username
          </label>
          <input
            ref={inputRef}
            type="text"
            value={confirmUsername}
            onChange={(e) => onConfirmUsernameChange(e.target.value)}
            placeholder="Enter your username"
            disabled={loading}
            autoComplete="off"
            className="w-full rounded-xl border border-creator-border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary focus:border-[var(--color-creator-danger)] focus:outline-none disabled:opacity-50"
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-[var(--color-creator-danger)]">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="creator-btn-outline rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !usernameMatches}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-creator-danger)]/40 bg-[var(--color-creator-danger)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-creator-danger)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              "Deactivate my account"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
