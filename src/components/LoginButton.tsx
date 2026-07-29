"use client";

import { useState } from "react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function LoginButton() {
  const { login } = usePrivyAuth();
  const [submitting, setSubmitting] = useState(false);

  return (
    <button
      type="button"
      disabled={submitting}
      onClick={() => {
        setSubmitting(true);
        void login().catch((error) => {
          console.error("Login failed:", error);
          setSubmitting(false);
        });
      }}
      className="cta-gradient inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? "Signing in..." : "Login"}
    </button>
  );
}
