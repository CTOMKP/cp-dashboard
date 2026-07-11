import FadeInSection from "./FadeInSection";
import { CryptoNetwork, HexPattern, SectionGlow } from "./BackgroundEffects";

export default function WhatIsCTO() {
  return (
    <FadeInSection id="about" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="pink" position="top-right" />
      <HexPattern opacity={0.05} />
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
        <CryptoNetwork />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          What Are You Actually Promoting?
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-[#CCCCCC] leading-relaxed">
          CTOMarketplace is the first talent marketplace built specifically for
          the memecoin ecosystem. CTO projects communities that revive
          abandoned crypto tokens come here to hire developers, designers,
          marketers, and community managers. Think Fiverr for Web3, but with 6%
          fees instead of 25%. It&apos;s early, it&apos;s growing, and the people
          building an audience around it now will earn the most.
        </p>
        <div className="stagger-children mt-12 grid gap-8 sm:grid-cols-2">
          <div className="interactive-card rounded-xl border border-[#222222] bg-[#111111]/90 p-8 backdrop-blur-sm">
            <p className="text-4xl font-bold text-accent-pink">6%</p>
            <p className="mt-2 text-[#888888]">
              Platform fee vs Fiverr&apos;s 25%
            </p>
          </div>
          <div className="interactive-card rounded-xl border border-[#222222] bg-[#111111]/90 p-8 backdrop-blur-sm">
            <p className="text-4xl font-bold text-accent-orange">2,400+</p>
            <p className="mt-2 text-[#888888]">
              Builders and investors already on platform
            </p>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
