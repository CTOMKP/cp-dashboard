"use client";

import { useRouter } from "next/navigation";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function CTAButton({
  className = "",
  children = "Get My Referral Link →",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const { login, isAuthenticated, ready, isLoading } = usePrivyAuth();
  const authResolved = ready && !isLoading;

  if (authResolved && isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => router.push("/creator")}
        className={`cta-glow cta-gradient inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={!authResolved}
      onClick={() => void login()}
      className={`cta-glow cta-gradient inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
