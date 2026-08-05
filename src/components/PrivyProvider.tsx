"use client";

import React, { useMemo } from "react";
import { PrivyProvider as PrivyProviderBase } from "@privy-io/react-auth";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { getDefaultSolanaRpcUrl } from "@/lib/solanaRpc";

interface PrivyProviderProps {
  children: React.ReactNode;
}

export default function PrivyProvider({ children }: PrivyProviderProps) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  const solanaRpcs = useMemo(() => {
    const http = getDefaultSolanaRpcUrl();
    const ws = /^https:/i.test(http)
      ? http.replace(/^https:/i, "wss:")
      : /^http:/i.test(http)
        ? http.replace(/^http:/i, "ws:")
        : http;
    const bundle = {
      rpc: createSolanaRpc(http),
      rpcSubscriptions: createSolanaRpcSubscriptions(ws),
    };
    return {
      "solana:mainnet": bundle,
      "solana:devnet": bundle,
    };
  }, []);

  React.useEffect(() => {
    const handlePrivyError = (event: ErrorEvent) => {
      if (event.error?.message?.includes("walletProxy")) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", handlePrivyError);
    return () => window.removeEventListener("error", handlePrivyError);
  }, []);

  if (!privyAppId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4">
        <div className="w-full max-w-md rounded-xl border border-[#222222] bg-[#111111] p-8">
          <h1 className="mb-4 text-2xl font-bold text-[#ef4444]">
            Configuration Error
          </h1>
          <p className="text-[#888888]">
            Privy App ID is not configured. Set{" "}
            <code className="text-white">NEXT_PUBLIC_PRIVY_APP_ID</code> in your
            environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PrivyProviderBase
      appId={privyAppId}
      config={{
        solana: { rpcs: solanaRpcs },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
          solana: { createOnLogin: "users-without-wallets" },
        },
        loginMethods: ["email", "wallet", "google"],
        appearance: {
          theme: "#010101",
          accentColor: "#8B5CF6",
          logo: "/ctom-marketplace-logo.png",
          showWalletLoginFirst: true,
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  );
}
