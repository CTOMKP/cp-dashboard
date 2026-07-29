"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  Clock,
  Loader2,
  Lock,
  Save,
  User,
  UserX,
  Wallet,
} from "lucide-react";
import { authService } from "@/services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/lib/queryKeys";
import { useCreatorProfile } from "@/contexts/CreatorProfileContext";
import { maskEmail, truncateWallet, formatDate } from "@/lib/format";
import {
  getDefaultPayoutChain,
  isValidSolanaAddress,
} from "@/lib/payout-chains";
import {
  canChangeWallet,
  formatCountdown,
  isWalletChangePending,
} from "@/lib/wallet-change";
import type { CreatorSettingsData } from "@/types/creator";
import ErrorState from "@/components/creator/ui/ErrorState";
import Badge from "@/components/creator/ui/Badge";
import { Skeleton } from "@/components/creator/ui/Skeleton";
import DeactivateAccountModal from "@/components/creator/settings/DeactivateAccountModal";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { profile, updateProfile, refreshProfile, loading: profileLoading } =
    useCreatorProfile();
  const [data, setData] = useState<CreatorSettingsData | null>(null);
  const [username, setUsername] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateUsername, setDeactivateUsername] = useState("");
  const [deactivatingAccount, setDeactivatingAccount] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const walletChange = data?.walletChange;
  const isPending = isWalletChangePending(
    walletChange?.walletChangePendingUntil
  );
  const changeAllowed = canChangeWallet(walletChange?.nextWalletChangeAllowed);
  const activeWallet = data?.wallets[0]?.address ?? "";
  const activeChain = useMemo(() => getDefaultPayoutChain(), []);

  const fetchData = useCallback(async () => {
    setError(null);
    await refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (profile?.profileImageUrl) {
      setProfilePreview((current) => current ?? profile.profileImageUrl);
    }
  }, [profile?.profileImageUrl]);

  useEffect(() => {
    if (profileLoading) {
      setLoading(true);
      return;
    }

    if (!profile) {
      setLoading(false);
      return;
    }

    setError(null);
    setData(profile);
    setUsername(profile.username);
    setProfilePreview(profile.profileImageUrl);
    setWalletAddress(profile.wallets[0]?.address ?? "");
    setLoading(false);
  }, [profile, profileLoading]);

  useEffect(() => {
    if (!isPending || !walletChange?.walletChangePendingUntil) {
      setCountdown("");
      return;
    }

    const update = () => {
      setCountdown(formatCountdown(walletChange.walletChangePendingUntil!));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isPending, walletChange?.walletChangePendingUntil]);

  useEffect(() => {
    if (
      isPending &&
      walletChange?.walletChangePendingUntil &&
      countdown === "0h 0m 0s"
    ) {
      fetchData();
    }
  }, [countdown, isPending, walletChange?.walletChangePendingUntil, fetchData]);

  const walletInputDisabled = isPending || !changeAllowed;

  const handleWalletChange = (value: string) => {
    if (walletInputDisabled) return;
    setWalletAddress(value);
    setWalletError(null);
  };

  const handleSaveWallet = async () => {
    if (!walletAddress.trim()) {
      setWalletError("Please enter your Solana USDC wallet address.");
      return;
    }
    if (!isValidSolanaAddress(walletAddress)) {
      setWalletError("Enter a valid Solana wallet address.");
      return;
    }
    if (!changeAllowed) {
      setWalletError(
        `You can only change your wallet once every 30 days.${
          walletChange?.nextWalletChangeAllowed
            ? ` Next change available ${formatDate(walletChange.nextWalletChangeAllowed)}.`
            : ""
        }`
      );
      return;
    }
    if (walletAddress.trim() === activeWallet) {
      setWalletError("This is already your active payout wallet.");
      return;
    }

    setSavingWallet(true);
    setWalletError(null);
    try {
      throw new Error("Wallet updates are not available yet.");
    } catch (err) {
      setWalletError(
        err instanceof Error ? err.message : "Failed to update wallet"
      );
    } finally {
      setSavingWallet(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!data?.usernameLocked && !username.trim()) {
      setProfileError("Username is required.");
      return;
    }
    setSavingProfile(true);
    setProfileError(null);
    try {
      const updated = await authService.updateUser({
        name: data?.usernameLocked ? data.username : username.trim(),
        avatarUrl:
          profilePreview && !profilePreview.startsWith("data:")
            ? profilePreview
            : undefined,
      });
      const nextSettings: CreatorSettingsData = {
        ...(data ?? {
          username: updated.name ?? username.trim(),
          email: updated.email,
          wallets: [],
        }),
        username: updated.name ?? username.trim(),
        email: updated.email,
        profileImageUrl: updated.avatarUrl ?? profilePreview,
      };
      setData(nextSettings);
      setUsername(nextSettings.username);
      setProfilePreview(nextSettings.profileImageUrl);
      updateProfile(nextSettings);
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      await refreshProfile();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to save profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetPassword = async () => {
    setSavingPassword(true);
    setPasswordError(null);
    try {
      throw new Error(
        "Password reset is managed through your email login provider.",
      );
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to reset password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const openDeactivateModal = () => {
    setDeactivateUsername("");
    setDeactivateError(null);
    setDeactivateModalOpen(true);
  };

  const closeDeactivateModal = () => {
    if (deactivatingAccount) return;
    setDeactivateModalOpen(false);
    setDeactivateUsername("");
    setDeactivateError(null);
  };

  const handleDeactivateAccount = async () => {
    if (!data?.username) return;

    if (deactivateUsername.trim() !== data.username) {
      setDeactivateError("Username does not match your account.");
      return;
    }

    setDeactivatingAccount(true);
    setDeactivateError(null);

    try {
      throw new Error("Account deactivation is not available yet.");
    } catch (err) {
      setDeactivateError(
        err instanceof Error ? err.message : "Failed to deactivate account"
      );
    } finally {
      setDeactivatingAccount(false);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="hidden text-2xl font-bold text-creator-text-primary md:block">
        Settings
      </h2>

      <section className="rounded-xl border border-creator-border bg-creator-card p-4 md:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-creator-text-primary">
          <User className="h-5 w-5" />
          Profile
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Update your public username and profile picture.
        </p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-creator-border bg-gradient-to-br from-[#ff007a] via-[#ff8c00] to-[#ffc107]">
              {(profilePreview ?? profile?.profileImageUrl) ? (
                <img
                  src={profilePreview ?? profile?.profileImageUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                  {username.charAt(0).toUpperCase() || "C"}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full border border-creator-border bg-creator-card p-2 text-creator-text-primary transition-colors hover:border-creator-accent"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm text-creator-text-secondary">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              disabled={data?.usernameLocked}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none ${
                data?.usernameLocked
                  ? "cursor-not-allowed border-creator-border/40 bg-creator-bg/70 text-creator-text-secondary"
                  : "border-creator-border bg-creator-bg text-creator-text-primary focus:border-creator-accent"
              }`}
            />
            {data?.usernameLocked && (
              <p className="mt-2 text-xs text-creator-text-secondary">
                Username can only be changed once and is now locked.
              </p>
            )}
          </div>
        </div>

        {profileError && (
          <p className="mt-4 text-sm text-[var(--color-creator-danger)]">
            {profileError}
          </p>
        )}

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="creator-btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
        >
          {savingProfile ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : profileSaved ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {profileSaved ? "Saved!" : "Save Profile"}
        </button>
      </section>

      <section className="rounded-xl border border-creator-border bg-creator-card p-4 md:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-creator-text-primary">
          <Lock className="h-5 w-5" />
          Reset Password
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Choose a strong password with at least 8 characters.
        </p>

        {data?.email && (
          <div className="mt-6 rounded-xl border border-creator-border bg-creator-bg p-4">
            <label className="mb-2 block text-xs text-creator-text-secondary">
              Account Email
            </label>
            <p className="text-sm font-medium text-creator-text-primary">
              {maskEmail(data.email)}
            </p>
            <p className="mt-1 text-xs text-creator-text-secondary">
              This is the email address connected to your account.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-creator-text-secondary">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-creator-border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary focus:border-creator-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-creator-text-secondary">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-creator-border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary focus:border-creator-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-creator-text-secondary">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-creator-border bg-creator-bg px-4 py-2.5 text-sm text-creator-text-primary focus:border-creator-accent focus:outline-none"
            />
          </div>
        </div>

        {passwordError && (
          <p className="mt-4 text-sm text-[var(--color-creator-danger)]">
            {passwordError}
          </p>
        )}

        <button
          type="button"
          onClick={handleResetPassword}
          disabled={savingPassword}
          className="creator-btn-outline mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium"
        >
          {savingPassword ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : passwordSaved ? (
            <Check className="h-4 w-4 text-creator-success" />
          ) : null}
          {passwordSaved ? "Password Updated!" : "Reset Password"}
        </button>
      </section>

      <section className="rounded-xl border border-creator-border bg-creator-card p-4 md:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-creator-text-primary">
          <Wallet className="h-5 w-5" />
          Connected Wallets
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Manage your payout wallet here. Changes can only be made once every 30
          days and take 72 hours to activate.
        </p>

        <div className="mt-6 space-y-3">
          {data?.wallets.map((wallet) => (
            <div
              key={wallet.chain}
              className="rounded-xl border border-creator-border bg-creator-bg p-4"
            >
              <Badge variant="teal">{wallet.label}</Badge>

              {isPending && (
                <div className="mt-4 rounded-xl border border-[var(--color-creator-warning)]/30 bg-[var(--color-creator-warning)]/10 p-4">
                  <p className="text-sm font-medium text-creator-text-primary">
                    Wallet change pending. Your new address will activate in 72
                    hours.
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-creator-text-secondary">
                    <Clock className="h-3.5 w-3.5" />
                    Activates in:{" "}
                    <span className="font-mono text-creator-accent">
                      {countdown}
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-creator-text-secondary">
                    Payouts during this period still go to your current wallet:{" "}
                    <span className="font-mono text-creator-text-primary">
                      {truncateWallet(activeWallet)}
                    </span>
                  </p>
                </div>
              )}

              <label className="mb-2 mt-4 block text-sm text-creator-text-secondary">
                {activeChain.walletLabel}
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => handleWalletChange(e.target.value)}
                placeholder={activeChain.walletPlaceholder}
                disabled={walletInputDisabled}
                className={`w-full rounded-xl border bg-creator-bg px-4 py-2.5 font-mono text-sm focus:outline-none disabled:cursor-not-allowed ${
                  walletInputDisabled
                    ? "border-creator-border/40 bg-creator-bg/70 text-creator-text-secondary"
                    : "border-creator-border text-creator-text-primary focus:border-creator-accent"
                }`}
              />

              {walletChange?.walletLastChanged && (
                <p className="mt-2 text-xs text-creator-text-secondary">
                  Last updated: {formatDate(walletChange.walletLastChanged)}
                </p>
              )}

              {walletError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--color-creator-danger)]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {walletError}
                </p>
              )}

              {!isPending &&
                changeAllowed &&
                walletAddress.trim() !== activeWallet && (
                  <button
                    type="button"
                    onClick={handleSaveWallet}
                    disabled={savingWallet}
                    className="creator-btn-outline mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    {savingWallet && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Save Wallet
                  </button>
                )}

              {!changeAllowed &&
                !isPending &&
                walletChange?.nextWalletChangeAllowed && (
                  <p className="mt-2 text-xs text-creator-text-secondary">
                    Next wallet change available:{" "}
                    {formatDate(walletChange.nextWalletChangeAllowed)}
                  </p>
                )}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-creator-danger)]/25 bg-creator-card p-4 md:p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-creator-text-primary">
          <UserX className="h-5 w-5 text-[var(--color-creator-danger)]" />
          Deactivate Account
        </h3>
        <p className="mt-1 text-sm text-creator-text-secondary">
          Permanently deactivate your creator account. You will lose access to
          your dashboard, referral earnings, and payout wallet.
        </p>

        <button
          type="button"
          onClick={openDeactivateModal}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--color-creator-danger)]/40 bg-[var(--color-creator-danger)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-creator-danger)] transition-opacity hover:opacity-90"
        >
          Deactivate Account
        </button>
      </section>

      <DeactivateAccountModal
        open={deactivateModalOpen}
        username={data?.username ?? ""}
        confirmUsername={deactivateUsername}
        loading={deactivatingAccount}
        error={deactivateError}
        onConfirmUsernameChange={setDeactivateUsername}
        onClose={closeDeactivateModal}
        onConfirm={handleDeactivateAccount}
      />
    </div>
  );
}
