"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

type LoginValues = {
  identifier: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!values.identifier.trim()) {
    errors.identifier = "Email or username is required";
  }
  if (!values.password) {
    errors.password = "Password is required";
  }
  return errors;
}

function isLoginComplete(values: LoginValues): boolean {
  return values.identifier.trim() !== "" && values.password.length > 0;
}

export default function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const canSubmit = useMemo(() => isLoginComplete(values), [values]);

  function inputClass(field: keyof LoginValues) {
    return `w-full rounded-xl border bg-[#0A0A0A] px-4 py-2.5 text-sm text-white focus:outline-none ${
      errors[field]
        ? "border-[#ef4444] focus:border-[#ef4444]"
        : "border-[#222222] focus:border-[#00FF94]"
    }`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError("");

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/creator/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: values.identifier.trim(),
          password: values.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Invalid email/username or password.");
        return;
      }

      router.push("/creator");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-card-glow w-full max-w-[560px] rounded-xl border border-[#222222] bg-[#111111] p-6 sm:p-8">
      <Image
        src="/cto-marketplace-logo.png"
        alt="CTOMarketplace"
        width={220}
        height={40}
        className="mx-auto mb-8 h-9 w-auto"
        priority
      />

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Sign In</h1>
        <p className="mt-1.5 text-sm leading-snug text-[#888888]">
          to your Creator Dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="mb-2 block text-sm text-[#888888]"
          >
            Email or Username<span className="text-[#ef4444]"> *</span>
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            value={values.identifier}
            onChange={(e) => {
              setValues((prev) => ({ ...prev, identifier: e.target.value }));
              if (submitted) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.identifier;
                  return next;
                });
              }
            }}
            className={inputClass("identifier")}
            placeholder="you@example.com or username"
          />
          <FieldError message={errors.identifier} />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-[#888888]"
          >
            Password<span className="text-[#ef4444]"> *</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, password: e.target.value }));
                if (submitted) {
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.password;
                    return next;
                  });
                }
              }}
              className={`${inputClass("password")} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] transition-colors hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>

        {submitError && (
          <p className="text-center text-sm text-[#ef4444]">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="signup-btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In →"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#888888]">
        Don&apos;t have an account?{" "}
        <Link href="/creator/signup" className="signup-link font-medium">
          Create one →
        </Link>
      </p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[#ef4444]">{message}</p>;
}
