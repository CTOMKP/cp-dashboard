import type { Referral } from "@/types/creator";

const defaultReferrals: Referral[] = [
  {
    id: "1",
    username: "bagzilla",
    wallet: "0x7a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    dateJoined: "2025-04-21T10:30:00Z",
    status: "active",
    generated: 42.5,
  },
  {
    id: "2",
    wallet: "0x1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c",
    dateJoined: "2025-05-03T14:15:00Z",
    status: "active",
    generated: 28.75,
  },
  {
    id: "3",
    username: "cryptobuilder",
    wallet: "0x9f8e7d6c5b4a392817161514131211100908070605",
    dateJoined: "2025-05-18T09:00:00Z",
    status: "inactive",
    generated: 5.2,
  },
  {
    id: "4",
    wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
    dateJoined: "2025-06-01T16:45:00Z",
    status: "active",
    generated: 67.3,
  },
  {
    id: "5",
    username: "web3dev",
    wallet: "0x567890abcdef1234567890abcdef1234567890ab",
    dateJoined: "2025-06-12T11:20:00Z",
    status: "active",
    generated: 19.8,
  },
];

const demoReferralPool = [
  { username: "moonhodler", wallet: "0x8a1f2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c" },
  { username: "solanaqueen", wallet: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d" },
  { wallet: "0xf3e4d5c6b7a80918273645fedcba0987654321ab" },
  { username: "ctomaxi", wallet: "0x1a2b3c4d5e6f708192837465fedcba0987654321" },
];

type ReferralsGlobal = typeof globalThis & {
  __creatorReferralsState?: Referral[];
  __creatorDemoReferralIndex?: number;
};

const referralsGlobal = globalThis as ReferralsGlobal;

if (!referralsGlobal.__creatorReferralsState) {
  referralsGlobal.__creatorReferralsState = structuredClone(defaultReferrals);
}

let referralsState = referralsGlobal.__creatorReferralsState;

function commitReferralsState(next: Referral[]) {
  referralsState = next;
  referralsGlobal.__creatorReferralsState = next;
}

export function getReferralsState(): Referral[] {
  return structuredClone(referralsState);
}

export function addReferral(referral: Referral): Referral {
  commitReferralsState([referral, ...referralsState]);
  return referral;
}

export function createDemoReferral(): Referral {
  const index = referralsGlobal.__creatorDemoReferralIndex ?? 0;
  const template = demoReferralPool[index % demoReferralPool.length];
  referralsGlobal.__creatorDemoReferralIndex = index + 1;

  const referral: Referral = {
    id: `demo-${Date.now()}`,
    username: template.username,
    wallet: template.wallet,
    dateJoined: new Date().toISOString(),
    status: "active",
    generated: 0,
  };

  return addReferral(referral);
}
