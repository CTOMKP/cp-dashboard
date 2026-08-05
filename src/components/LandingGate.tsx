"use client";

import { Loader2 } from "lucide-react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function LandingGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, ready } = usePrivyAuth();

  if (!ready || isLoading || isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
          <p className="text-sm text-[#888888]">
            {isAuthenticated ? "Opening your Creator dashboard…" : "Loading Creator Program…"}
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
