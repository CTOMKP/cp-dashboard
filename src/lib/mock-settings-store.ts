import type { CreatorSettingsData } from "@/types/creator";

const defaultSettingsState: CreatorSettingsData = {
  username: "cryptobuilder",
  email: "creator@example.com",
  profileImageUrl: undefined,
  usernameLocked: true,
  wallets: [
    {
      chain: "solana",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      label: "Solana USDC",
    },
  ],
};

type SettingsGlobal = typeof globalThis & {
  __creatorSettingsState?: CreatorSettingsData;
};

const settingsGlobal = globalThis as SettingsGlobal;

if (!settingsGlobal.__creatorSettingsState) {
  settingsGlobal.__creatorSettingsState = structuredClone(defaultSettingsState);
}

let settingsState = settingsGlobal.__creatorSettingsState;

function commitSettingsState(next: CreatorSettingsData) {
  settingsState = next;
  settingsGlobal.__creatorSettingsState = next;
}

export function getSettingsState(): CreatorSettingsData {
  return structuredClone(settingsState);
}

export function updateSettingsState(updates: {
  username?: string;
  profileImageUrl?: string;
}): { success: boolean; data?: CreatorSettingsData; error?: string } {
  if (settingsState.usernameLocked) {
    commitSettingsState({
      ...settingsState,
      profileImageUrl:
        updates.profileImageUrl !== undefined
          ? updates.profileImageUrl
          : settingsState.profileImageUrl,
    });
    return { success: true, data: getSettingsState() };
  }

  if (!updates.username?.trim()) {
    return { success: false, error: "Username is required." };
  }

  commitSettingsState({
    ...settingsState,
    username: updates.username.trim(),
    profileImageUrl:
      updates.profileImageUrl !== undefined
        ? updates.profileImageUrl
        : settingsState.profileImageUrl,
    usernameLocked: true,
  });

  return { success: true, data: getSettingsState() };
}

export function syncSettingsWallet(address: string) {
  if (settingsState.wallets[0]) {
    commitSettingsState({
      ...settingsState,
      wallets: settingsState.wallets.map((wallet, index) =>
        index === 0 ? { ...wallet, address } : wallet
      ),
    });
  }
}
