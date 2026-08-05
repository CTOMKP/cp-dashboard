"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Loader2,
  Lock,
  Save,
  User,
  UserX,
  Wallet,
} from "lucide-react";
import { authService } from "@/services/authService";
import { pfpService } from "@/services/pfpService";
import { useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/lib/queryKeys";
import { useCreatorProfile } from "@/contexts/CreatorProfileContext";
import { maskEmail } from "@/lib/format";
import {
  PROFILE_AVATAR_META_KEY,
  PROFILE_AVATAR_URL_KEY,
  USER_AVATAR_URL_KEY,
} from "@/lib/authSession";
import { useSessionStore } from "@/lib/sessionStore";
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
  const sessionUserId = useSessionStore((state) => state.userId);
  const sessionEmail = useSessionStore((state) => state.email);
  const setAvatarUrl = useSessionStore((state) => state.setAvatarUrl);
  const [data, setData] = useState<CreatorSettingsData | null>(null);
  const [username, setUsername] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | undefined>();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
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
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivateUsername, setDeactivateUsername] = useState("");
  const [deactivatingAccount, setDeactivatingAccount] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setLoading(false);
  }, [profile, profileLoading]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userId = sessionUserId || sessionEmail || data?.email || "";
    if (!userId) {
      setAvatarError("Please log in to update your profile picture.");
      e.target.value = "";
      return;
    }

    setAvatarError(null);
    setAvatarUploading(true);

    try {
      const { viewUrl, key } = await pfpService.uploadProfileImage(file, userId);
      const updated = await authService.updateUser({ avatarUrl: viewUrl });

      localStorage.setItem(USER_AVATAR_URL_KEY, viewUrl);
      localStorage.setItem(PROFILE_AVATAR_URL_KEY, viewUrl);
      if (key) {
        localStorage.setItem(PROFILE_AVATAR_META_KEY, JSON.stringify({ key }));
      }

      const nextImageUrl = updated.avatarUrl ?? viewUrl;
      setAvatarUrl(nextImageUrl);
      setProfilePreview(nextImageUrl);
      setData((current) =>
        current ? { ...current, profileImageUrl: nextImageUrl } : current,
      );
      updateProfile({ profileImageUrl: nextImageUrl });
      window.dispatchEvent(new Event("avatarUpdated"));
      await queryClient.invalidateQueries({ queryKey: profileKeys.all });
      await refreshProfile();
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Failed to upload profile picture",
      );
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
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
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-creator-border bg-gradient-to-br from-[#ff007a] via-[#ff8c00] to-[#ffc107]">
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
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute bottom-0 right-0 rounded-full border border-creator-border bg-creator-card p-2 text-creator-text-primary transition-colors hover:border-creator-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleImageChange(e)}
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

        {avatarError && (
          <p className="mt-4 text-sm text-[var(--color-creator-danger)]">
            {avatarError}
          </p>
        )}

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
          Wallets connected to your CTO account. Your Solana wallet is used for
          USDC creator payouts.
        </p>

        <div className="mt-6 space-y-3">
          {data?.wallets.map((wallet) => (
            <div
              key={wallet.chain}
              className="rounded-xl border border-creator-border bg-creator-bg p-4"
            >
              <Badge variant="teal">{wallet.label}</Badge>

              <label className="mb-2 mt-4 block text-sm text-creator-text-secondary">
                {wallet.label} Address
              </label>
              <input
                type="text"
                value={wallet.address}
                readOnly
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-creator-border/40 bg-creator-bg/70 px-4 py-2.5 font-mono text-sm text-creator-text-secondary focus:outline-none"
              />
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
