"use client";

import { useEffect, useRef, useState } from "react";
import FadeInSection from "./FadeInSection";
import { OrbitRing, ParticleField, ScanLine, SectionGlow } from "./BackgroundEffects";

const chartData = [
  2.1, 3.4, 1.8, 4.2, 5.1, 3.9, 6.2, 4.8, 7.1, 5.5, 8.3, 6.7, 4.2, 9.1, 7.8,
  5.3, 6.9, 8.4, 10.2, 7.5, 9.8, 11.3, 8.6, 12.1, 9.4, 10.7, 13.2, 11.8, 14.5,
  12.3,
];

const maxValue = Math.max(...chartData);

export default function DashboardPreview() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBarsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <FadeInSection id="dashboard" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="pink" position="center" />
      <OrbitRing className="left-[-100px] top-1/3 opacity-20" />
      <ParticleField count={20} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Watch Your Earnings Grow In Real Time.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#888888]">
          Your personal dashboard tracks every referral, every transaction, and
          every dollar earned. No guessing. No waiting for a report. Just live
          numbers.
        </p>

        <div className="relative mt-12 overflow-hidden rounded-xl border border-[#222222] bg-[#111111]/95 p-6 backdrop-blur-sm sm:p-8">
          <ScanLine />
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold text-white">
              CTOMarketplace
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[#FF2E91]/10 px-2 py-1 text-xs font-medium text-accent-pink">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              Creator Dashboard
            </span>
          </div>

          <div className="stagger-children mt-6 grid grid-cols-2 gap-4">
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-4">
              <p className="text-xs text-[#888888]">Total Referrals</p>
              <p className="live-stat mt-1 text-2xl font-bold text-white">24</p>
              <p className="mt-1 text-xs text-accent-pink">↑ 6 this week</p>
            </div>
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-4">
              <p className="text-xs text-[#888888]">This Month&apos;s Earnings</p>
              <p className="live-stat mt-1 text-2xl font-bold text-accent-pink">$142.50</p>
              <p className="mt-1 text-xs text-[#888888]">Builder Tier · 15%</p>
            </div>
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-4">
              <p className="text-xs text-[#888888]">Current Tier</p>
              <p className="mt-1 text-2xl font-bold text-white">Builder</p>
              <p className="mt-1 text-xs text-accent-orange">6 more for Partner</p>
            </div>
            <div className="interactive-card rounded-xl border border-[#222222] bg-[#0A0A0A] p-4">
              <p className="text-xs text-[#888888]">Pending Payout</p>
              <p className="mt-1 text-2xl font-bold text-white">$38.00</p>
              <p className="mt-1 text-xs text-[#888888]">Paid in USDC</p>
            </div>
          </div>

          <div className="mt-8" ref={chartRef}>
            <p className="mb-4 text-sm font-medium text-[#888888]">
              Earnings Last 30 Days
            </p>
            <div className="flex h-32 items-end gap-[3px] rounded-xl bg-[#0A0A0A] p-4">
              {chartData.map((value, i) => (
                <div
                  key={i}
                  className={`bar-gradient flex-1 rounded-t-sm ${barsVisible ? "bar-animate" : ""}`}
                  style={{
                    height: barsVisible ? `${(value / maxValue) * 100}%` : "0%",
                    opacity: 0.4 + (value / maxValue) * 0.6,
                    animationDelay: barsVisible ? `${i * 30}ms` : undefined,
                  }}
                  title={`Day ${i + 1}: $${value.toFixed(2)}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
