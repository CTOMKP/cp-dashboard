"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

type PrivyAuthCardProps = {
  mode: "login" | "signup";
};

export default function PrivyAuthCard({ mode }: PrivyAuthCardProps) {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, ready } = usePrivyAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && isAuthenticated && !isLoading) {
      router.replace("/creator");
    }
  }, [ready, isAuthenticated, isLoading, router]);

  async function handleAuth() {
    setSubmitting(true);
    setError("");
    try {
      await login();
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isLogin = mode === "login";
  const title = isLogin ? "Sign In" : "Create Account";
  const subtitle = isLogin
    ? "to your Creator Dashboard"
    : "Join the Creator Program";
  const buttonLabel = isLogin ? "Sign In with Privy" : "Sign Up with Privy";
  const alternateHref = isLogin ? "/creator/signup" : "/creator/login";
  const alternateText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const alternateLink = isLogin ? "Create one →" : "Sign in →";

  if (!ready || (isAuthenticated && isLoading)) {
    return (
      <div className="signup-card-glow flex w-full max-w-[560px] items-center justify-center rounded-xl border border-[#222222] bg-[#111111] p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
      </div>
    );
  }

  return (
    <div className="signup-card-glow w-full max-w-[560px] rounded-xl border border-[#222222] bg-[#111111] p-6 sm:p-8">
      <Image
        src="/ctom-marketplace-logo.png"
        alt="CTOMarketplace"
        width={220}
        height={40}
        className="mx-auto mb-8 h-9 w-auto"
        priority
      />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-1.5 text-sm leading-snug text-[#888888]">{subtitle}</p>
      </div>

      <p className="mb-6 text-center text-sm text-[#888888]">
        Use your email, Google account, or crypto wallet to{" "}
        {isLogin ? "sign in" : "create your account"}.
      </p>

      {error && (
        <p className="mb-4 text-center text-sm text-[#ef4444]">{error}</p>
      )}

      <button
        type="button"
        onClick={() => void handleAuth()}
        disabled={submitting}
        className="signup-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          `${buttonLabel} →`
        )}
      </button>

      <p className="mt-6 text-center text-sm text-[#888888]">
        {alternateText}{" "}
        <Link href={alternateHref} className="signup-link font-medium">
          {alternateLink}
        </Link>
      </p>
    </div>
  );
}
