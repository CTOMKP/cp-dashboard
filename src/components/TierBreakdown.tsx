import FadeInSection from "./FadeInSection";
import { SectionGlow } from "./BackgroundEffects";

const tiers = [
  {
    badge: "Starter",
    badgeColor: "text-white",
    referrals: "1–10 active referrals",
    cut: "10% of platform fees",
    border: "border-[#222222]",
    glow: "",
    tag: null,
  },
  {
    badge: "Builder",
    badgeColor: "text-accent-pink",
    referrals: "11–30 active referrals",
    cut: "15% of platform fees",
    border: "border-[#FF2E91]",
    glow: "builder-glow",
    tag: "Most Common",
  },
  {
    badge: "Partner",
    badgeColor: "text-accent-orange",
    referrals: "31+ active referrals",
    cut: "20% of platform fees",
    border: "border-[#FF9F0A]",
    glow: "",
    tag: null,
  },
];

export default function TierBreakdown() {
  return (
    <FadeInSection id="tiers" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="orange" position="bottom-right" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]" aria-hidden>
        <span className="text-[20rem] font-black leading-none text-accent-pink">%</span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          The More You Refer, The More You Earn.
        </h2>
        <div className="stagger-children grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.badge}
              className={`interactive-card relative rounded-xl border bg-[#111111]/90 p-8 backdrop-blur-sm ${tier.border} ${tier.glow}`}
            >
              {tier.tag && (
                <span className="cta-gradient absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold">
                  {tier.tag}
                </span>
              )}
              <span
                className={`inline-block rounded-lg bg-[#0A0A0A] px-3 py-1 text-sm font-bold ${tier.badgeColor}`}
              >
                {tier.badge}
              </span>
              <p className="mt-4 text-lg font-semibold text-white">
                {tier.referrals}
              </p>
              <p className="mt-2 text-[#888888]">{tier.cut}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[#888888]">
          Active referral = someone who posted an ad or completed a transaction.
          Not just a signup.
        </p>
      </div>
    </FadeInSection>
  );
}
