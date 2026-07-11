import Link from "next/link";

export default function CTAButton({
  className = "",
  children = "Get My Referral Link →",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href="/creator/signup"
      className={`cta-glow cta-gradient inline-flex items-center justify-center rounded-xl px-8 py-4 text-base font-bold ${className}`}
    >
      {children}
    </Link>
  );
}
