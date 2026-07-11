import Link from "next/link";

export default function LandingAuthBar() {
  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-xl border border-[#222222] bg-[#111111]/95 text-sm font-semibold shadow-lg backdrop-blur-md">
      <Link
        href="/creator/login"
        className="flex items-center px-4 py-2.5 text-[#888888] transition-colors hover:text-white"
      >
        Log in
      </Link>
      <div className="w-px self-stretch bg-[#333333]" aria-hidden />
      <Link
        href="/creator/signup"
        className="cta-gradient flex items-center px-4 py-2.5 transition-opacity hover:opacity-90"
      >
        Sign up
      </Link>
    </div>
  );
}
