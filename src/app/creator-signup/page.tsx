import Link from "next/link";

export default function CreatorSignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-white">Creator Signup</h1>
        <p className="mt-4 text-[#888888]">
          Signup flow coming soon. This is a placeholder route for the referral
          link CTA.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-accent-pink transition-colors hover:underline"
        >
          ← Back to landing page
        </Link>
      </div>
    </main>
  );
}
