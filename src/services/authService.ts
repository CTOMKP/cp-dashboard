import { apiGet, apiPost, apiPut } from "@/lib/apiClient";
import { toRecord, unwrapApiData } from "@/lib/apiResponse";
import {
  clearSessionStorage,
  getAuthToken,
  PROFILE_AVATAR_URL_KEY,
  setAuthToken,
  USER_AVATAR_URL_KEY,
  USER_CREATED_KEY,
  USER_EMAIL_KEY,
  USER_ID_KEY,
  USER_NAME_KEY,
  WALLET_ID_KEY,
  clearAuthToken,
} from "@/lib/authSession";
import type { AuthUserProfile, User } from "@/types/auth.types";
import { normalizeAuthProfile } from "@/types/auth.types";

class AuthService {
  private parseUpdatedUserFromResponse(body: unknown): User | null {
    const normalized = toRecord(unwrapApiData(body));
    if (normalized.user && typeof normalized.user === "object") {
      return normalizeAuthProfile(normalized.user as AuthUserProfile);
    }
    if (typeof normalized.email === "string") {
      return normalizeAuthProfile(normalized as unknown as AuthUserProfile);
    }
    return null;
  }

  private applyUserProfileToStorage(profileData: User): void {
    if (profileData.id) {
      localStorage.setItem(USER_ID_KEY, String(profileData.id));
    }
    localStorage.setItem(USER_EMAIL_KEY, profileData.email);
    if (profileData.name) {
      localStorage.setItem(USER_NAME_KEY, profileData.name);
    } else if (Object.prototype.hasOwnProperty.call(profileData, "name")) {
      localStorage.removeItem(USER_NAME_KEY);
    }
    if (profileData.createdAt) {
      localStorage.setItem(USER_CREATED_KEY, profileData.createdAt);
    }
    if (profileData.walletId) {
      localStorage.setItem(WALLET_ID_KEY, profileData.walletId);
    }
    if (profileData.avatarUrl) {
      localStorage.setItem(USER_AVATAR_URL_KEY, profileData.avatarUrl);
      localStorage.setItem(PROFILE_AVATAR_URL_KEY, profileData.avatarUrl);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("avatarUpdated"));
      }
    }
  }

  async fetchProfile(
    signal?: AbortSignal,
    options?: { clearSessionOn401?: boolean },
  ): Promise<User> {
    const body = await apiGet<unknown>("/api/v1/auth/profile", {
      signal,
      clearSessionOn401: options?.clearSessionOn401 ?? true,
    });
    const profile = normalizeAuthProfile(unwrapApiData<AuthUserProfile>(body));
    if (!profile?.email) {
      throw new Error("Profile response is missing user email.");
    }

    this.applyUserProfileToStorage(profile);
    return profile;
  }

  async exchangeHandoff(code: string): Promise<User> {
    const body = await apiPost<unknown>(
      "/api/v1/auth/handoff/exchange",
      { code, target: "creator" },
      { auth: false, clearSessionOn401: false },
    );
    const session = toRecord(unwrapApiData(body));
    const token = session.access_token;
    if (typeof token !== "string" || !token) {
      throw new Error("Session handoff response is missing an access token.");
    }
    setAuthToken(token);
    return this.fetchProfile(undefined, { clearSessionOn401: false });
  }

  async updateUser(
    updates: Partial<Pick<User, "name" | "avatarUrl">>,
    signal?: AbortSignal,
  ): Promise<User> {
    const raw = await apiPut<unknown>("/api/v1/auth/users/me", updates, {
      signal,
      clearSessionOn401: true,
    });
    const updatedUser = this.parseUpdatedUserFromResponse(raw);
    if (!updatedUser) {
      throw new Error("Invalid update profile response.");
    }

    this.applyUserProfileToStorage(updatedUser);
    return updatedUser;
  }

  async logout(): Promise<void> {
    clearSessionStorage();
  }

  isAuthenticated(): boolean {
    return !!getAuthToken();
  }

  removeToken(): void {
    clearAuthToken();
  }
}

export const authService = new AuthService();
