"use client";

import { useMemo, useState } from "react";
import FadeInSection from "./FadeInSection";
import { HexPattern, OrbitRing, SectionGlow } from "./BackgroundEffects";

function getTier(referrals: number) {
  if (referrals <= 10) {
    return { name: "Starter", cut: 0.1, label: "Starter Tier · 10% cut applied" };
  }
  if (referrals <= 30) {
    return { name: "Builder", cut: 0.15, label: "Builder Tier · 15% cut applied" };
  }
  return { name: "Partner", cut: 0.2, label: "Partner Tier · 20% cut applied" };
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  note,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
  note?: string;
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm text-[#888888]">{label}</label>
        <span className="text-sm font-bold text-accent-pink">
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      {note && <p className="mt-2 text-xs text-[#888888]">{note}</p>}
    </div>
  );
}

export default function EarningsCalculator() {
  const [adValue, setAdValue] = useState(25);
  const [escrowDeal, setEscrowDeal] = useState(500);
  const [referrals, setReferrals] = useState(50);

  const tier = useMemo(() => getTier(referrals), [referrals]);

  const adEarnings = referrals * adValue * tier.cut;
  const escrowEarnings = referrals * escrowDeal * 0.06 * tier.cut;
  const total = adEarnings + escrowEarnings;

  return (
    <FadeInSection id="calculator" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="both" position="center" />
      <HexPattern opacity={0.035} />
      <OrbitRing className="right-[-80px] top-1/2 opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Here&apos;s Exactly What You Earn.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#888888]">
          Adjust the sliders to match your audience size and the deals you
          expect to drive.
        </p>

        <div className="calculator-glow relative mt-12 rounded-xl border border-[#222222] bg-[#111111]/95 p-6 backdrop-blur-sm sm:p-10">
          <SliderControl
            label="Average listing fee per referral"
            value={adValue}
            min={5}
            max={50}
            onChange={setAdValue}
            formatValue={(v) => `$${v}`}
          />
          <SliderControl
            label="Average escrow deal per referral"
            value={escrowDeal}
            min={50}
            max={10000}
            step={50}
            onChange={setEscrowDeal}
            formatValue={(v) => `$${v.toLocaleString()}`}
            note="Revenue share and token deals in crypto regularly reach $5K–$10K"
          />
          <SliderControl
            label="Number of active referrals"
            value={referrals}
            min={1}
            max={200}
            onChange={setReferrals}
            formatValue={(v) => v.toString()}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-6">
              <p className="text-sm text-[#888888]">From listing fees</p>
              <p className="live-stat mt-2 text-2xl font-bold text-accent-pink">
                {formatCurrency(adEarnings)} / month
              </p>
              <p className="mt-2 text-xs text-[#888888]">
                Based on referrals posting one ad per month
              </p>
            </div>
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-6">
              <p className="text-sm text-[#888888]">From escrow deals</p>
              <p className="live-stat mt-2 text-2xl font-bold text-accent-pink">
                {formatCurrency(escrowEarnings)} / month
              </p>
              <p className="mt-2 text-xs text-[#888888]">
                Based on one completed deal per referral per month
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-white">
              Estimated monthly earnings:{" "}
              <span className="gradient-text text-3xl font-bold sm:text-4xl">
                {formatCurrency(total)}
              </span>
            </p>
            <p className="mt-3 text-sm text-accent-pink">{tier.label}</p>
          </div>

          <div className="mt-8 space-y-2 text-center text-xs text-[#888888]">
            <p>
              Estimates only. Earnings depend on how active your referrals are
              on the platform.
            </p>
            <p>
              Active referral = someone who posted an ad or completed a
              transaction. Not just a signup.
            </p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
