"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePrivyAuth } from "@/hooks/usePrivyAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, ready } = usePrivyAuth();

  useEffect(() => {
    if (ready && !isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [ready, isLoading, isAuthenticated, router]);

  if (!ready || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
