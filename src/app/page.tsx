import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import EarningsCalculator from "@/components/EarningsCalculator";
import TierBreakdown from "@/components/TierBreakdown";
import WhatIsCTO from "@/components/WhatIsCTO";
import ContentAngles from "@/components/ContentAngles";
import DashboardPreview from "@/components/DashboardPreview";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0A0A0A]">
      {/* Persistent ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,46,145,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_100%,rgba(255,159,10,0.04),transparent)]" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      <div className="relative z-10">
        <Hero />
        <HowItWorks />
        <EarningsCalculator />
        <TierBreakdown />
        <WhatIsCTO />
        <ContentAngles />
        <DashboardPreview />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
