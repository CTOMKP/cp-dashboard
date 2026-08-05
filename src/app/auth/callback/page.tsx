"use client";

import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
        <p className="text-sm text-[#888888]">Opening your Creator dashboard…</p>
      </div>
    </main>
  );
}
