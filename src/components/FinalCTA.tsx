import CTAButton from "./CTAButton";
import FadeInSection from "./FadeInSection";
import {
  AuroraOrbs,
  ParticleField,
  ScanLine,
} from "./BackgroundEffects";

export default function FinalCTA() {
  return (
    <FadeInSection id="signup" className="relative overflow-hidden px-6 py-24">
      <div className="final-cta-gradient absolute inset-0" />
      <AuroraOrbs intensity="subtle" />
      <ParticleField count={25} />
      <ScanLine />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          The Earlier You Start, The{" "}
          <span className="gradient-text">More You Earn.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[#888888]">
          The platform is growing. Your referral base compounds over time.
          There&apos;s no reason to wait.
        </p>
        <div className="mt-10">
          <CTAButton />
        </div>
        <p className="mt-4 text-sm text-[#888888]">
          Free. Instant. No approval needed.
        </p>
      </div>
    </FadeInSection>
  );
}
