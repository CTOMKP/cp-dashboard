"use client";

import { useState } from "react";
import FadeInSection from "./FadeInSection";
import { FloatingSymbols, SectionGlow } from "./BackgroundEffects";

const angles = [
  {
    tag: "Passive Income",
    tagColor: "bg-[#FF2E91]/10 text-accent-pink",
    text: "This platform pays me every time someone I referred posts a job or completes a deal. I literally earn while I sleep.",
  },
  {
    tag: "Fiverr Comparison",
    tagColor: "bg-[#FF9F0A]/10 text-accent-orange",
    text: "Fiverr takes 25% from freelancers. This Web3 platform takes 6% and shares the revenue with creators who bring people in.",
  },
  {
    tag: "Web3 Jobs",
    tagColor: "bg-[#FF2E91]/10 text-accent-pink",
    text: "Looking for Web3 work or need someone to build your crypto project? This marketplace connects CTO communities with real builders.",
  },
  {
    tag: "Early Mover",
    tagColor: "bg-[#FF9F0A]/10 text-accent-orange",
    text: "This platform is still early. The creators getting in now are going to earn the most as it grows. Here's how it works.",
  },
  {
    tag: "The Math",
    tagColor: "bg-[#FF2E91]/10 text-accent-pink",
    text: "50 people use my link this month. They post ads and complete deals. I earn passively every month. Here's the platform.",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-4 rounded-xl border border-[#222222] px-4 py-2 text-sm font-medium text-[#888888] transition-colors hover:border-[#FF2E91] hover:text-accent-pink"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ContentAngles() {
  return (
    <FadeInSection id="content-angles" className="relative overflow-hidden px-6 py-20">
      <SectionGlow color="both" position="bottom-left" />
      <FloatingSymbols />
      <div className="pointer-events-none absolute left-8 top-1/4 text-[8rem] font-black leading-none text-[#FF2E91] opacity-[0.03]" aria-hidden>
        &ldquo;
      </div>
      <div className="pointer-events-none absolute bottom-1/4 right-8 text-[8rem] font-black leading-none text-[#FF9F0A] opacity-[0.03]" aria-hidden>
        &rdquo;
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
          Not Sure What To Post? We&apos;ve Got You.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[#888888]">
          Here are proven angles you can use right now. Copy them, adapt them,
          make them yours.
        </p>
        <div className="stagger-children mt-12 grid gap-6 sm:grid-cols-2">
          {angles.map((angle) => (
            <div
              key={angle.tag}
              className="interactive-card flex flex-col rounded-xl border border-[#222222] bg-[#111111]/90 p-6 backdrop-blur-sm"
            >
              <span
                className={`inline-block w-fit rounded-lg px-3 py-1 text-xs font-bold ${angle.tagColor}`}
              >
                {angle.tag}
              </span>
              <p className="mt-4 flex-1 text-[#CCCCCC] leading-relaxed">
                {angle.text}
              </p>
              <CopyButton text={angle.text} />
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
