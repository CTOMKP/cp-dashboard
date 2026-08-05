"use client";

import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function LandingAuthBar() {
  const { isAuthenticated, ready, isLoading } = usePrivyAuth();
  const authResolved = ready && !isLoading;

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-xl border border-[#222222] bg-[#111111]/95 text-sm font-semibold shadow-lg backdrop-blur-md">
      {!ready ? (
        <span className="inline-flex h-[42px] items-center justify-center px-4 text-[#888888]">
          Loading…
        </span>
      ) : !authResolved ? (
        <span className="inline-flex h-[42px] items-center justify-center px-4 text-[#888888]">
          Signing in…
        </span>
      ) : isAuthenticated ? (
        <Link
          href="/creator"
          className="cta-gradient flex items-center px-4 py-2.5 transition-opacity hover:opacity-90"
        >
          Dashboard →
        </Link>
      ) : (
        <div className="px-1 py-1">
          <LoginButton />
        </div>
      )}
    </div>
  );
}
