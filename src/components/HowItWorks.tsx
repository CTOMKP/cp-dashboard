import FadeInSection from "./FadeInSection";
import { FlowLines, SectionGlow } from "./BackgroundEffects";

const steps = [
  {
    number: "01",
    title: "Get Your Link",
    body: "Sign up in 30 seconds and get your unique referral link and personal dashboard.",
  },
  {
    number: "02",
    title: "Share It",
    body: "Post it on TikTok, X, YouTube, Discord anywhere your audience hangs out. We give you ready-made content angles to use.",
  },
  {
    number: "03",
    title: "Earn Forever",
    body: "Every time someone you referred posts an ad or completes a deal through escrow, you earn a percentage. It stacks.",
  },
];

export default function HowItWorks() {
  return (
    <FadeInSection id="how-it-works" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="pink" position="top-left" />
      <FlowLines />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          How It Works
        </h2>
        <div className="relative">
          <div className="step-connector" aria-hidden />
          <div className="stagger-children grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="interactive-card rounded-xl border border-[#222222] bg-[#111111]/90 p-8 backdrop-blur-sm"
              >
                <span className="text-4xl font-bold text-accent-pink">
                  {step.number}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-[#888888]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}
