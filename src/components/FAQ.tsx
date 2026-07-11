"use client";

import { useState } from "react";
import FadeInSection from "./FadeInSection";
import { HexPattern, SectionGlow } from "./BackgroundEffects";

const faqs = [
  {
    q: "Is it really free to join?",
    a: "Yes. No approval, no fee, no catch. Sign up and get your link in 30 seconds.",
  },
  {
    q: "How do I get paid?",
    a: "Payouts are in USDC directly to your wallet. Minimum payout threshold is $10.",
  },
  {
    q: "What counts as an active referral?",
    a: "Someone who signed up through your link AND posted an ad or completed a transaction on the platform. Not just a signup.",
  },
  {
    q: "How long do I earn from a referral?",
    a: "Forever. Once someone signs up through your link they are attributed to you permanently.",
  },
  {
    q: "Do I need a crypto audience?",
    a: "No. Finance, hustle, passive income, and freelancing audiences all convert well for this offer.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <FadeInSection id="faq" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="orange" position="top-left" />
      <HexPattern opacity={0.025} />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">
          Common Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="interactive-card overflow-hidden rounded-xl border border-[#222222] bg-[#111111]/90 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 font-semibold text-white">{faq.q}</span>
                  <span
                    className={`shrink-0 text-accent-pink transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`accordion-content ${isOpen ? "open" : ""}`}
                >
                  <div className="accordion-inner">
                    <p className="px-6 pb-5 text-[#888888]">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeInSection>
  );
}
