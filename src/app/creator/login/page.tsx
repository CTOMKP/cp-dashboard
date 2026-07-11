import Image from "next/image";
import Link from "next/link";

export default function CreatorLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-creator-border bg-creator-card p-8 text-center">
        <Image
          src="/cto-marketplace-logo.png"
          alt="CTO Marketplace"
          width={200}
          height={40}
          className="mx-auto mb-6 h-10 w-auto"
        />
        <h1 className="text-xl font-bold text-creator-text-primary">Sign In</h1>
        <p className="mt-2 text-sm text-creator-text-secondary">
          Log in to access your Creator Dashboard.
        </p>
        <Link
          href="/creator"
          className="creator-btn-primary mt-6 inline-block w-full rounded-xl px-4 py-3 text-sm"
        >
          Continue to Dashboard
        </Link>
        <p className="mt-6 text-sm text-creator-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/creator/signup" className="signup-link font-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
