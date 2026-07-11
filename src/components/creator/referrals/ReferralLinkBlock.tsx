"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { getReferralCode } from "@/lib/api/creator";
import type { ReferralCodeData } from "@/types/creator";
import CopyButton from "@/components/creator/ui/CopyButton";
import { Skeleton } from "@/components/creator/ui/Skeleton";
import ErrorState from "@/components/creator/ui/ErrorState";

function ShareOnX({ link }: { link: string }) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join CTOMarketplace and start earning! ${link}`)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-creator-border px-4 py-2 text-sm font-medium text-creator-text-primary transition-colors hover:border-creator-accent hover:text-creator-accent"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Share on X
    </a>
  );
}

function ShareOnTikTok({ link }: { link: string }) {
  const url = `https://www.tiktok.com/upload?text=${encodeURIComponent(link)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-creator-border px-4 py-2 text-sm font-medium text-creator-text-primary transition-colors hover:border-creator-accent hover:text-creator-accent"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.5a8.28 8.28 0 0 0 4.83 1.54V6.5a4.85 4.85 0 0 1-1.05-.19z" />
      </svg>
      Share on TikTok
    </a>
  );
}

function ShareOnInstagram({ link }: { link: string }) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard may be unavailable; still open Instagram.
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-xl border border-creator-border px-4 py-2 text-sm font-medium text-creator-text-primary transition-colors hover:border-creator-accent hover:text-creator-accent"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.28 6.068 2.266 6.477 2.266 12c0 5.523.014 5.932.072 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.058-1.28.072-1.689.072-7.212 0-5.523-.014-5.932-.072-7.212-.058-1.278-.33-2.451-1.297-3.418C19.398.402 18.225.13 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
      Share on Instagram
    </button>
  );
}

export default function ReferralLinkBlock() {
  const [data, setData] = useState<ReferralCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getReferralCode();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load referral code");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const downloadQR = useCallback(() => {
    if (!data) return;
    const svg = document.getElementById("referral-qr");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 240;
      canvas.height = 240;
      ctx?.drawImage(img, 0, 0, 240, 240);
      const a = document.createElement("a");
      a.download = "ctom-referral-qr.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }, [data]);

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-creator-border bg-creator-card p-6">
        <Skeleton className="mb-4 h-5 w-36" />
        <Skeleton className="mb-6 h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-xl border border-creator-border bg-creator-card p-4 transition-colors duration-200 md:p-6">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-creator-text-secondary">
            Your Referral Link
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={data.referralLink}
              className="min-w-0 flex-1 rounded-lg border border-creator-border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary"
            />
            <CopyButton text={data.referralLink} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <ShareOnX link={data.referralLink} />
          <ShareOnTikTok link={data.referralLink} />
          <ShareOnInstagram link={data.referralLink} />
          <CopyButton text={data.referralLink} label="Copy Link" className="" />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <label className="mb-2 block text-sm text-creator-text-secondary">
              Your Code
            </label>
            <div className="flex items-center gap-2">
              <span className="rounded-xl border border-creator-accent/30 bg-creator-accent-muted px-4 py-2 font-mono text-sm font-bold text-creator-accent">
                {data.referralCode}
              </span>
              <CopyButton text={data.referralCode} />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="rounded-xl bg-[#0a0a0a] p-3">
              <QRCodeSVG
                id="referral-qr"
                value={data.referralLink}
                size={120}
                bgColor="#0a0a0a"
                fgColor="#ffffff"
                level="M"
              />
            </div>
            <button
              type="button"
              onClick={downloadQR}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-creator-text-secondary transition-colors hover:text-creator-accent"
            >
              <Download className="h-3.5 w-3.5" />
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
