"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, Copy, Download, Loader2 } from "lucide-react";
import { getReferralCode } from "@/lib/api/creator";
import type { ReferralCodeData } from "@/types/creator";
import CopyButton from "@/components/creator/ui/CopyButton";
import Badge from "@/components/creator/ui/Badge";
import { Skeleton } from "@/components/creator/ui/Skeleton";
import ErrorState from "@/components/creator/ui/ErrorState";

type NicheTagVariant = "green" | "purple" | "blue" | "orange";

interface NicheScript {
  text: string;
}

interface ContentNiche {
  id: string;
  emoji: string;
  title: string;
  tag: string;
  tagVariant: NicheTagVariant;
  scripts: NicheScript[];
  driveLinkLabel: string;
}

const contentNiches: ContentNiche[] = [
  {
    id: "make-money",
    emoji: "💰",
    title: "Make Money Online",
    tag: "Make Money Online",
    tagVariant: "green",
    scripts: [
      {
        text: "I found a platform that pays you every time someone you referred makes a deal. No cap. No expiration. This is the passive income play nobody is talking about.",
      },
      {
        text: "Most people chase trading profits. I built a referral stream on a Web3 marketplace instead. Here's how it works and why it keeps paying me every month.",
      },
      {
        text: "If you're looking for passive income that isn't just another course or drop shipping thing — this Web3 marketplace pays creators a cut of every deal their referrals make. Forever.",
      },
    ],
    driveLinkLabel: "More make money scripts →",
  },
  {
    id: "fiverr",
    emoji: "⚔️",
    title: "Fiverr / Freelance Comparison",
    tag: "Fiverr vs Web3",
    tagVariant: "purple",
    scripts: [
      {
        text: "Fiverr takes 25% from every freelancer. This crypto marketplace takes 6%. If you do any kind of freelance work in Web3 — you need to know this exists.",
      },
      {
        text: "I switched from Fiverr to a Web3 marketplace for crypto jobs. Lower fees. Crypto payments. And I earn a referral cut when I bring people in.",
      },
      {
        text: "Web3 freelancers are still using Fiverr and paying 25% in fees. There's a marketplace built specifically for crypto work charging a fraction of that. Here's the link.",
      },
    ],
    driveLinkLabel: "More Fiverr comparison scripts →",
  },
  {
    id: "web3-jobs",
    emoji: "🛠️",
    title: "Web3 / Crypto Jobs",
    tag: "Web3 Jobs",
    tagVariant: "blue",
    scripts: [
      {
        text: "If you're a developer, designer, or marketer in Web3 — there's a marketplace specifically for crypto projects looking to hire. Not Fiverr. Not Upwork. Built for this space.",
      },
      {
        text: "CTO projects — communities reviving abandoned crypto tokens — are always looking for devs, designers, and marketers. This is where they post their jobs.",
      },
      {
        text: "You can get hired in Web3 without going through Fiverr. This marketplace is built specifically for crypto work with lower fees and crypto payments.",
      },
    ],
    driveLinkLabel: "More Web3 jobs scripts →",
  },
  {
    id: "early-mover",
    emoji: "🚀",
    title: "Early Mover / FOMO",
    tag: "Early Mover",
    tagVariant: "orange",
    scripts: [
      {
        text: "This platform is still early. The creators getting referral links now are going to earn the most as it grows. This is one of those get in early moments.",
      },
      {
        text: "I got access to a Web3 marketplace before it blew up. The referral program pays me every month and it compounds the more people I bring in.",
      },
      {
        text: "Platforms like this don't stay small forever. The people building a referral base now will be earning passively by the time everyone else finds out about it.",
      },
    ],
    driveLinkLabel: "More early mover scripts →",
  },
  {
    id: "the-math",
    emoji: "🧮",
    title: "The Math / Numbers",
    tag: "The Math",
    tagVariant: "green",
    scripts: [
      {
        text: "50 people use my referral link. They post jobs and close deals on a Web3 marketplace. I earn a % of every transaction. Every month. Here's the platform.",
      },
      {
        text: "The platform takes 6% on escrow deals. I get 15% of that as a referral. On a $2,000 deal that's $18 in my pocket from one transaction. Multiply that by 50 referrals and it adds up fast.",
      },
      {
        text: "Web3 deals can hit $5K to $10K. The platform takes 6%. I earn 15% of that cut from every deal my referrals make. One big deal = real money. Here's my link.",
      },
    ],
    driveLinkLabel: "More math angle scripts →",
  },
];

const banners = [
  { size: "1080×1080", aspect: "aspect-square" },
  { size: "1920×1080", aspect: "aspect-video" },
  { size: "1080×1920", aspect: "aspect-[9/16]" },
  { size: "1080×1080", aspect: "aspect-square" },
];

function SmallCopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    setLoading(true);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={loading}
      className="creator-btn-outline inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : copied ? (
        <>
          <Check className="h-3 w-3 text-creator-success" />
          <span className="text-creator-success">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

function NicheCard({ niche }: { niche: ContentNiche }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-5 transition-colors duration-200">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-xl" aria-hidden>
            {niche.emoji}
          </span>
          <span className="font-bold text-creator-text-primary">
            {niche.title}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={niche.tagVariant}>{niche.tag}</Badge>
          <ChevronDown
            className={`h-4 w-4 text-creator-text-secondary transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {expanded && (
        <>
          <div className="my-4 border-t border-creator-border" />

          <div className="space-y-0">
            {niche.scripts.map((script, index) => (
              <div
                key={index}
                className={`p-3 ${
                  index < niche.scripts.length - 1
                    ? "border-b border-creator-border"
                    : ""
                }`}
              >
                <p className="text-sm leading-relaxed text-creator-text-secondary">
                  {script.text}
                </p>
                <div className="mt-2">
                  <SmallCopyButton text={script.text} />
                </div>
              </div>
            ))}
          </div>

          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs text-creator-success transition-opacity hover:opacity-80"
          >
            {niche.driveLinkLabel}
          </a>
        </>
      )}
    </div>
  );
}

function BannerPlaceholder({
  size,
  aspect,
}: {
  size: string;
  aspect: string;
}) {
  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-4 transition-colors duration-200">
      <div
        className={`${aspect} flex items-center justify-center rounded-xl border border-creator-border bg-gradient-to-br from-creator-bg via-creator-card to-creator-accent-muted`}
      >
        <div className="text-center">
          <Image
            src="/ctom-marketplace-logo.png"
            alt="CTO Marketplace"
            width={140}
            height={28}
            className="mx-auto h-7 w-auto"
          />
          <p className="mt-2 text-xs text-creator-accent">Creator Program</p>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-creator-text-secondary">
        {size}
      </p>
      <button
        type="button"
        className="creator-btn-outline mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium"
      >
        <Download className="h-3.5 w-3.5" />
        Download
      </button>
    </div>
  );
}

export default function ContentPage() {
  const [linkData, setLinkData] = useState<ReferralCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReferralCode();
      setLinkData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
          Content & Promotion
        </h2>
        <p className="mt-2 text-sm text-creator-text-secondary">
          Use these ready-made scripts and assets to promote CTOMarketplace and
          grow your referral earnings.
        </p>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-creator-text-primary">
          Your Shareable Links
        </h3>
        {error ? (
          <div className="mt-4">
            <ErrorState message={error} onRetry={fetchData} />
          </div>
        ) : loading ? (
          <div className="mt-4 space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : linkData ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-creator-text-secondary">
                Referral Link
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={linkData.referralLink}
                  className="min-w-0 flex-1 rounded-lg border border-creator-border bg-creator-card px-4 py-2.5 text-sm text-creator-text-primary"
                />
                <CopyButton text={linkData.referralLink} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-creator-text-secondary">
                Creator Landing Page
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={linkData.landingPageUrl}
                  className="min-w-0 flex-1 rounded-lg border border-creator-border bg-creator-card px-4 py-2.5 text-sm text-creator-text-primary"
                />
                <CopyButton text={linkData.landingPageUrl} />
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section>
        <h3 className="text-lg font-semibold text-creator-text-primary">
          Content Library
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Pick your niche. Copy a script. Get your link in front of the right
          audience.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {contentNiches.map((niche) => (
            <NicheCard key={niche.id} niche={niche} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-creator-text-primary">
          Promotional Banners
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Download and use these in your content.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {banners.map((banner, i) => (
            <BannerPlaceholder key={i} {...banner} />
          ))}
        </div>
      </section>
    </div>
  );
}
