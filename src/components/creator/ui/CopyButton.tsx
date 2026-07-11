"use client";

import { useCallback, useState } from "react";
import { Check, Copy, Loader2 } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = useCallback(async () => {
    setLoading(true);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setLoading(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={loading}
      className={`creator-btn-outline inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : copied ? (
        <>
          <Check className="h-4 w-4 text-creator-success" />
          <span className="text-creator-success">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
