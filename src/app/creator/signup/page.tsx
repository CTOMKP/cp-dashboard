import SignupForm from "@/components/creator/signup/SignupForm";

export default function CreatorSignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255, 159, 10, 0.08), transparent 70%)",
        }}
      />
      <div className="relative z-10 w-full max-w-[560px]">
        <SignupForm />
      </div>
    </main>
  );
}
