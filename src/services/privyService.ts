import { ApiError } from "@/lib/apiError";
import { apiPost, getBackendBaseUrl } from "@/lib/apiClient";
import { toRecord, unwrapApiData } from "@/lib/apiResponse";
import {
  clearSessionStorage,
  PROFILE_AVATAR_URL_KEY,
  setAuthToken,
  USER_AVATAR_URL_KEY,
  USER_EMAIL_KEY,
  USER_ID_KEY,
  WALLET_ADDRESS_KEY,
} from "@/lib/authSession";
import type { BackendWallet } from "@/types/privy";
import { saveWalletsToStorage } from "@/utils/localStorage";

const getSyncUrl = () => `${getBackendBaseUrl()}/api/v1/auth/privy/sync`;

type SyncResponseData = {
  success?: boolean;
  token?: string;
  user?: {
    id?: number | string;
    email?: string;
    walletAddress?: string;
    walletsCount?: number;
    avatarUrl?: string;
  };
  wallets?: BackendWallet[];
  id?: number | string;
  userId?: number | string;
};

class PrivyService {
  private isSyncSuccessPayload(
    payload: SyncResponseData,
  ): payload is SyncResponseData & {
    token: string;
    user: NonNullable<SyncResponseData["user"]> & {
      id: number | string;
      email: string;
    };
  } {
    return Boolean(
      (payload?.success === true || (payload?.user && payload?.token)) &&
        typeof payload?.token === "string" &&
        payload?.user &&
        (typeof payload.user.id === "number" ||
          typeof payload.user.id === "string") &&
        typeof payload.user.email === "string",
    );
  }

  async syncUser(
    privyToken: string,
    getAccessToken?: () => Promise<string | null>,
  ): Promise<{
    success: boolean;
    token: string;
    user: {
      id: number;
      email: string;
      walletAddress?: string;
      walletsCount: number;
    };
    wallets: BackendWallet[];
  }> {
    const freshToken =
      (getAccessToken ? await getAccessToken() : null) ?? privyToken;

    if (!freshToken) {
      throw new Error("No fresh token available");
    }

    let response: unknown;
    try {
      response = await apiPost<unknown>(
        getSyncUrl(),
        { privyToken: freshToken },
        { auth: false },
      );
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const body = error.body as
          | { message?: string; error?: string }
          | undefined;
        const backendMessage = body?.message || body?.error || error.message;
        throw new Error(
          `Failed to sync user: ${backendMessage} (Status: ${error.status || "N/A"})`,
        );
      }
      throw error;
    }

    const rawResponse = toRecord(unwrapApiData(response));
    const responseData: SyncResponseData = rawResponse as SyncResponseData;

    if (this.isSyncSuccessPayload(responseData)) {
      setAuthToken(responseData.token);
      localStorage.setItem(USER_EMAIL_KEY, responseData.user.email);
      localStorage.setItem(USER_ID_KEY, responseData.user.id.toString());

      if (responseData.user.walletAddress) {
        localStorage.setItem(
          WALLET_ADDRESS_KEY,
          responseData.user.walletAddress,
        );
      }

      if (responseData.user.avatarUrl) {
        localStorage.setItem(USER_AVATAR_URL_KEY, responseData.user.avatarUrl);
        localStorage.setItem(
          PROFILE_AVATAR_URL_KEY,
          responseData.user.avatarUrl,
        );
      }

      if (responseData.wallets && responseData.wallets.length > 0) {
        const userId = responseData.user?.id;
        if (userId) {
          saveWalletsToStorage(responseData.wallets, userId.toString());
        }
      }

      return responseData as {
        success: boolean;
        token: string;
        user: {
          id: number;
          email: string;
          walletAddress?: string;
          walletsCount: number;
        };
        wallets: BackendWallet[];
      };
    }

    const possibleUserId =
      responseData?.user?.id ||
      responseData?.id ||
      responseData?.userId ||
      (responseData?.user &&
        typeof responseData.user === "object" &&
        responseData.user.id);

    if (possibleUserId && responseData?.token) {
      setAuthToken(responseData.token);
      localStorage.setItem(USER_ID_KEY, possibleUserId.toString());
      if (responseData.user?.email) {
        localStorage.setItem(USER_EMAIL_KEY, responseData.user.email);
      }
      return responseData as {
        success: boolean;
        token: string;
        user: {
          id: number;
          email: string;
          walletAddress?: string;
          walletsCount: number;
        };
        wallets: BackendWallet[];
      };
    }

    throw new Error(
      `Failed to sync user: Invalid response structure. Keys: ${Object.keys(responseData || {}).join(", ")}`,
    );
  }

  logout() {
    clearSessionStorage();
  }
}

export const privyService = new PrivyService();
