"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  ACCOUNT_TYPES,
  COUNTRIES,
  LANGUAGES,
  MAIN_AUDIENCES,
} from "@/lib/creator-signup/constants";
import {
  isSignupFormComplete,
  validateSignupForm,
  type SignupFieldErrors,
  type SignupFormValues,
} from "@/lib/creator-signup/validation";

const initialValues: SignupFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  accountType: "",
  mainAudience: "",
  country: "",
  language: "English",
  telegramUsername: "",
  referralCode: "",
  agreeToTerms: false,
};

function RequiredMark() {
  return <span className="text-[#ef4444]"> *</span>;
}

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm text-creator-text-secondary"
    >
      {children}
      {required && <RequiredMark />}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[#ef4444]">{message}</p>;
}

function FieldNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-xs text-creator-text-secondary">{children}</p>
  );
}

export default function SignupForm() {
  const [values, setValues] = useState<SignupFormValues>(initialValues);
  const [errors, setErrors] = useState<SignupFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const canSubmit = useMemo(() => isSignupFormComplete(values), [values]);

  function updateField<K extends keyof SignupFormValues>(
    key: K,
    value: SignupFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function inputClass(field: keyof SignupFormValues) {
    return `w-full rounded-xl border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary focus:outline-none ${
      errors[field]
        ? "border-[#ef4444] focus:border-[#ef4444]"
        : "border-creator-border focus:border-[#00FF94]"
    }`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError("");

    const nextErrors = validateSignupForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/creator/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          username: values.username.trim(),
          password: values.password,
          accountType: values.accountType,
          mainAudience: values.mainAudience,
          country: values.country,
          language: values.language,
          telegramUsername: values.telegramUsername.trim() || undefined,
          referralCode: values.referralCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="signup-card-glow w-full max-w-[560px] rounded-xl border border-[#222222] bg-[#111111] p-8 text-center sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#00FF94]/15">
          <Check className="h-8 w-8 text-[#00FF94]" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-creator-text-primary">
          You&apos;re in.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-creator-text-secondary">
          Your creator account has been created. Check your email to verify your
          address and then log in to access your dashboard.
        </p>
        <Link
          href="/creator"
          className="signup-btn-primary mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm"
        >
          Go to Dashboard →
        </Link>
      </div>
    );
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
        <h1 className="text-2xl font-bold tracking-tight text-creator-text-primary">
          Sign Up
        </h1>
        <p className="mt-1.5 text-sm leading-snug text-creator-text-secondary">
          to CTOMarketplace Creator Program
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="firstName" required>
              First Name
            </FieldLabel>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={inputClass("firstName")}
            />
            <FieldError message={errors.firstName} />
          </div>
          <div>
            <FieldLabel htmlFor="lastName" required>
              Last Name
            </FieldLabel>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={inputClass("lastName")}
            />
            <FieldError message={errors.lastName} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="email" required>
            Email Address
          </FieldLabel>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass("email")}
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <FieldLabel htmlFor="username" required>
            Username
          </FieldLabel>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={(e) => updateField("username", e.target.value)}
            className={inputClass("username")}
          />
          <FieldNote>Only letters, numbers, and underscores</FieldNote>
          <FieldError message={errors.username} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="password" required>
              Password
            </FieldLabel>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`${inputClass("password")} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-creator-text-secondary transition-colors hover:text-creator-text-primary"
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
          <div>
            <FieldLabel htmlFor="confirmPassword" required>
              Confirm Password
            </FieldLabel>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(e) =>
                  updateField("confirmPassword", e.target.value)
                }
                className={`${inputClass("confirmPassword")} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-creator-text-secondary transition-colors hover:text-creator-text-primary"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError message={errors.confirmPassword} />
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm text-creator-text-secondary">
            How will you promote?<RequiredMark />
          </legend>
          <div className="space-y-2">
            {ACCOUNT_TYPES.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  values.accountType === option.value
                    ? "border-[#00FF94]/50 bg-[#00FF94]/5 text-creator-text-primary"
                    : "border-creator-border text-creator-text-secondary hover:border-creator-border/80"
                }`}
              >
                <input
                  type="radio"
                  name="accountType"
                  value={option.value}
                  checked={values.accountType === option.value}
                  onChange={(e) => updateField("accountType", e.target.value)}
                  className="mt-0.5 accent-[#00FF94]"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <FieldError message={errors.accountType} />
        </fieldset>

        <div>
          <FieldLabel htmlFor="mainAudience" required>
            Where is your main audience?
          </FieldLabel>
          <select
            id="mainAudience"
            value={values.mainAudience}
            onChange={(e) => updateField("mainAudience", e.target.value)}
            className={`${inputClass("mainAudience")} ${
              !values.mainAudience ? "text-creator-text-secondary" : ""
            }`}
          >
            <option value="">Where is your main audience?</option>
            {MAIN_AUDIENCES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError message={errors.mainAudience} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="country" required>
              Country
            </FieldLabel>
            <select
              id="country"
              value={values.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={`${inputClass("country")} ${
                !values.country ? "text-creator-text-secondary" : ""
              }`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <FieldError message={errors.country} />
          </div>
          <div>
            <FieldLabel htmlFor="language" required>
              Language
            </FieldLabel>
            <select
              id="language"
              value={values.language}
              onChange={(e) => updateField("language", e.target.value)}
              className={inputClass("language")}
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
            <FieldError message={errors.language} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="telegramUsername">Telegram Username</FieldLabel>
          <input
            id="telegramUsername"
            type="text"
            placeholder="@yourusername"
            value={values.telegramUsername}
            onChange={(e) => updateField("telegramUsername", e.target.value)}
            className={inputClass("telegramUsername")}
          />
          <FieldNote>Optional — used for creator support</FieldNote>
        </div>

        <div>
          <FieldLabel htmlFor="referralCode">Referral Code</FieldLabel>
          <input
            id="referralCode"
            type="text"
            placeholder="Enter referral code if you have one"
            value={values.referralCode}
            onChange={(e) => updateField("referralCode", e.target.value)}
            className={inputClass("referralCode")}
          />
          <FieldNote>If someone referred you to the creator program</FieldNote>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-creator-border px-4 py-3">
          <input
            type="checkbox"
            checked={values.agreeToTerms}
            onChange={(e) => updateField("agreeToTerms", e.target.checked)}
            className="mt-0.5 accent-[#00FF94]"
          />
          <span className="text-sm text-creator-text-secondary">
            I agree to the CTOMarketplace Creator Program{" "}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="signup-link underline"
            >
              Terms &amp; Conditions
            </a>
          </span>
        </label>
        <FieldError message={errors.agreeToTerms} />

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
              Creating account...
            </>
          ) : (
            "Create Creator Account →"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-creator-text-secondary">
        Already have an account?{" "}
        <Link href="/creator/login" className="signup-link font-medium">
          Sign in →
        </Link>
      </p>
    </div>
  );
}
