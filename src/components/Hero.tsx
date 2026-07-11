import CTAButton from "./CTAButton";
import FadeInSection from "./FadeInSection";
import {
  AuroraOrbs,
  CryptoNetwork,
  FloatingSymbols,
  MarqueeTicker,
  ParticleField,
  PerspectiveGrid,
  ScanLine,
} from "./BackgroundEffects";

export default function Hero() {
  return (
    <FadeInSection
      id="hero"
      immediate
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20"
    >
      <div className="hero-gradient absolute inset-0" />
      <AuroraOrbs intensity="hero" />
      <PerspectiveGrid />
      <CryptoNetwork />
      <ParticleField count={50} />
      <FloatingSymbols />
      <div className="dot-pattern absolute inset-0 opacity-40" />
      <ScanLine />
      <div className="noise-overlay absolute inset-0" />
      <div className="hero-vignette absolute inset-0" />
      <MarqueeTicker />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#222222] bg-[#111111]/80 px-4 py-2 text-xs font-semibold tracking-wider text-[#888888] backdrop-blur-sm">
          <span className="live-dot" />
          CREATOR PROGRAM · CRYPTO AFFILIATE
        </div>
        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Get Paid Every Time Someone You Referred Makes a{" "}
          <span className="gradient-text">Deal.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#888888] sm:text-xl">
          Join the CTOMarketplace Creator Program. Share your link. Earn a
          percentage of every transaction your referrals generate forever.
        </p>
        <div className="mt-10">
          <CTAButton />
        </div>
        <p className="mt-4 text-sm text-[#888888]">
          Free to join. No approval needed. Start earning today.
        </p>
      </div>
    </FadeInSection>
  );
}
