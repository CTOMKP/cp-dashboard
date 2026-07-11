"use client";

import Badge from "@/components/creator/ui/Badge";
import type { PayoutChain, PayoutChainId } from "@/lib/payout-chains";
import { PAYOUT_CHAINS } from "@/lib/payout-chains";
import { Check, Lock } from "lucide-react";

interface BlockchainSelectorProps {
  selectedChainId: PayoutChainId;
  onSelect: (chainId: PayoutChainId) => void;
}

function ChainIcon({ chain }: { chain: PayoutChain }) {
  const initials = chain.name.slice(0, 1);

  if (chain.id === "solana") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#9945FF] via-[#14F195] to-[#00C2FF] text-sm font-bold text-white">
        SOL
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-creator-info)]/20 text-sm font-bold text-[var(--color-creator-info)]">
      {initials}
    </div>
  );
}

export default function BlockchainSelector({
  selectedChainId,
  onSelect,
}: BlockchainSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-creator-text-primary">
          Select Blockchain
        </label>
        <p className="mt-1 text-xs text-creator-text-secondary">
          Choose where you want to receive your Solana USDC payout. More
          networks will be added soon.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PAYOUT_CHAINS.map((chain) => {
          const isSelected = selectedChainId === chain.id;
          const isDisabled = !chain.enabled;

          return (
            <button
              key={chain.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(chain.id)}
              className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-creator-accent bg-creator-accent-muted shadow-[0_0_20px_rgba(255,107,53,0.12)]"
                  : isDisabled
                    ? "cursor-not-allowed border-creator-border bg-creator-bg/40 opacity-60"
                    : "border-creator-border bg-creator-bg hover:border-creator-accent/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ChainIcon chain={chain} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-creator-text-primary">
                        {chain.name}
                      </span>
                      <Badge variant="teal">{chain.token}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-creator-text-secondary">
                      {chain.description}
                    </p>
                  </div>
                </div>

                {isSelected && chain.enabled && (
                  <Check className="h-5 w-5 shrink-0 text-creator-accent" />
                )}
                {chain.comingSoon && (
                  <Badge variant="grey" className="shrink-0 gap-1">
                    <Lock className="h-3 w-3" />
                    Coming Soon
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
