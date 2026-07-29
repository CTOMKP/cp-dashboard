# Creator Dashboard — Backend Data Contract

This document describes what the **cp-dashboard UI expects**, which **existing backend endpoints** already satisfy, and what **still needs to be built or extended**.

Auth uses the same JWT as CTO Marketplace (`Authorization: Bearer <cto_auth_token>`).

---

## Endpoints already integrated

### `GET /api/v1/creator/me`

Used for: **Dashboard overview**, **referral code/link**, **payout balances**, **payout wallet address**.

| UI field | Backend source | Notes |
|----------|----------------|-------|
| `totalReferrals` | `stats.totalReferrals` | |
| `activeReferrals` | `stats.activeReferrals` | Tier progress bar |
| `thisMonthEarnings` | `stats.thisMonthEarnings` | |
| `currentTier` | `stats.tier` | `STARTER` \| `BUILDER` \| `PARTNER` |
| `tierCutPercent` | `stats.creatorCutPercent` | |
| `referralsForNextTier` | `stats.referralsNeededForNextTier` | |
| `pendingPayout` | `stats.pendingPayoutBalance` | Dashboard card |
| `earningsLast30Days[]` | `dailyEarnings[]` | Chart: `{ date, amount }` per day |
| `referralCode` | `account.referralCode` | From `/me` — no separate referral-code endpoint |
| `referralLink` | `account.referralLink` | |
| `availableBalance` (payouts) | `account.pendingBalance` | |
| `totalPaidOut` (payouts) | `account.paidBalance` | |
| `savedWalletAddress` (payouts) | `account.payoutWalletAddress` | `null` if unset |

**Also returned but not yet shown in UI** (available for future use):

- `account.reservedBalance`, `account.heldBalance`
- `account.fraudStatus`, `account.fraudReason`, `account.lastReviewedAt`
- `stats.reservedPayoutBalance`, `stats.allTimeTotalEarned`, `stats.nextTierTarget`
- `earningsBreakdown[]`

---

### `GET /api/v1/creator/earnings?limit=N`

Used for: **Earnings page transaction table**.

Expected list item shape (when populated):

```json
{
  "id": "string",
  "date": "2026-07-29T12:00:00.000Z",
  "type": "ad_fee | escrow_deal",
  "dealAmount": 100.0,
  "yourCut": 15.0,
  "status": "paid | pending"
}
```

**Summary stats** (`totalEarned`, `thisMonth`) currently come from `/me` → `stats.allTimeTotalEarned`, `stats.thisMonthEarnings` until the earnings list response includes totals.

---

### `GET /api/v1/creator/payouts?limit=N`

Used for: **Payouts page history table**.

Expected list item shape (when populated):

```json
{
  "id": "string",
  "dateRequested": "2026-07-29T12:00:00.000Z",
  "amount": 25.0,
  "wallet": "Solana wallet address",
  "chain": "solana | base",
  "status": "pending | approved | paid | rejected",
  "notes": "optional string"
}
```

Balances and wallet address come from `/me` (see above).

---

### `GET /api/v1/creator/referrals?limit=N`

Used for: **Referrals page table**.

Expected list item shape (when populated):

```json
{
  "id": "string",
  "username": "optional string",
  "wallet": "wallet address",
  "dateJoined": "2026-07-29T12:00:00.000Z",
  "status": "active | inactive",
  "generated": 42.5
}
```

---

### `POST /api/v1/creator/payouts/request`

Used for: **Request payout** button.

**Request body (current backend):**

```json
{
  "walletAddress": "0xabc123...",
  "amount": 25,
  "note": "First payout request"
}
```

UI sends `walletAddress`, `amount`, and optional `note`. It does **not** send `chain` today because the backend contract does not include it.

---

## CTO Marketplace endpoints used (not under `/creator`)

### `GET /api/v1/auth/profile` ← **used for read**

Used for: **Settings profile**, **TopBar avatar**, **email display**.

| UI field | Backend source |
|----------|----------------|
| `email` | `email` |
| `username` (display name) | `name` |
| `profileImageUrl` | `avatarUrl` |

Expected shape from **`GET /api/v1/auth/profile`** (confirmed):

```json
{
  "data": {
    "id": 3,
    "email": "user@example.com",
    "avatarUrl": "https://...",
    "name": "username",
    "bio": "Crypto enthusiast",
    "role": "USER",
    "xpBalance": 1528,
    "rankScore": 555,
    "rankTier": 3,
    "rankLevel": 3,
    "rankLabel": "Junior Sapling",
    "rankEmoji": "🌳",
    "nextRankTier": 4,
    "nextRankLevel": 4,
    "nextRankLabel": "Senior Sapling",
    "rankProgressPercent": 88.75,
    "currentStreakDays": 1,
    "createdAt": "2025-10-02T17:21:33.206Z",
    "accountAgeDays": 300,
    "accountAge": "10 months",
    "walletId": "...",
    "wallets": [{ "id": "...", "address": "...", "blockchain": "SOLANA", "isPrimary": false }]
  },
  "statusCode": 200,
  "timestamp": "..."
}
```

Creator dashboard maps only **`email`**, **`name`** → username, **`avatarUrl`** → profile image. Rank/XP/wallets are available but not shown on creator pages today.

### `PUT /api/v1/auth/users/me` ← **used for profile save only**

There is **no** `GET /api/v1/auth/users/me` on the backend (returns `Cannot GET /api/v1/auth/users/me`). Profile **read** must use `GET /api/v1/auth/profile` above.

```json
{
  "name": "CreatorUsername",
  "avatarUrl": "https://..."
}
```

Password changes are handled by **Privy** (email OTP login). No creator-dashboard password endpoint is required unless you add one separately.

---

## Sign out (logout)

CTO Marketplace does **not** call a backend sign-out API. Logout is client-side only:

1. `privyLogout()` — ends the Privy session
2. `authService.logout()` / `privyService.logout()` — clears `localStorage` (`cto_auth_token`, user snapshot)
3. `queryClient.clear()` — clears TanStack Query cache
4. Redirect to `/` (landing page)

There is no `POST /api/v1/auth/logout` in the current CTO backend integration. If the backend adds one later, it can be called in `usePrivyAuth.handleLogout` before clearing local storage.

---

## Wallet endpoints in CTO Marketplace (reference only)

**Creator payout wallet** is separate from Privy/trading wallets:

| Wallet type | Source | Used for |
|-------------|--------|----------|
| **Payout wallet** | `GET /creator/me` → `account.payoutWalletAddress` | Where USDC creator earnings are sent (Settings + Payouts pages) |
| **Privy embedded wallets** | `GET /api/v1/auth/privy/wallets` | CTO Marketplace trading/profile — **not** used for creator payouts today |

The dashboard reads your payout address from `/me` and shows it on the Payouts and Settings pages. It does **not** pull from Privy wallet list APIs unless you later decide to unify them (e.g. “use my connected Solana wallet as payout address”).

These exist for **embedded Privy/trading wallets**, not creator **payout** wallets:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/auth/privy/wallets` | List user's Privy-linked wallets |
| `POST /api/v1/auth/privy/sync` | Login sync (already used) |
| `GET /api/v1/wallet/solana/balance/:address` | Solana balance |
| `GET /api/v1/wallet/movement/balance/:walletId` | Movement balance |

---

## Missing data — backend work required

### 1. `newReferralsThisWeek` (Dashboard)

**UI location:** Dashboard stat card subtext — “↑ X new this week”

**Status:** Intentionally **blank** until backend provides it.

**Options for backend:**

- Add to `GET /creator/me` → `stats.newReferralsThisWeek: number`
- Or add `referralsThisWeek: number` and let frontend calculate from referral rows with `dateJoined` in the last 7 days

```json
{
  "stats": {
    "newReferralsThisWeek": 3
  }
}
```

---

### 2. `landingPageUrl` (Referrals + Content pages)

**UI location:** “Creator Landing Page” copy field on Content page

**Status:** Intentionally **blank** until backend provides it.

**Suggested addition** to `GET /creator/me` → `account`:

```json
{
  "account": {
    "referralCode": "cto-3-e6b8ab",
    "referralLink": "https://app.ctomarketplace.com/?ref=cto-3-e6b8ab",
    "landingPageUrl": "https://creators.ctomarketplace.com/?ref=cto-3-e6b8ab"
  }
}
```

---

### 3. Payout chain / blockchain (Payouts + Settings)

**UI location:** Solana vs Base selector, chain badge on payout history

**Status:** UI supports `solana` and `base`; backend does not return chain today.

**Suggested additions:**

- `account.payoutChain: "solana" | "base"` on `/me`
- `chain` on each payout record (see payouts list above)
- Optional: accept `chain` on `POST /creator/payouts/request`

---

### 4. Payout wallet update + cooldown (Settings + Payouts)

**UI location:** Settings → Payout Wallet; 72-hour pending change banner on Payouts

**Status:** Mock-only today. Needs real endpoints.

**Suggested endpoints:**

#### `PUT /api/v1/creator/payouts/wallet` (or similar)

```json
{
  "walletAddress": "Solana...",
  "chain": "solana"
}
```

**Response:**

```json
{
  "success": true,
  "walletChange": {
    "activeWalletAddress": "current...",
    "pendingWalletAddress": "new...",
    "walletLastChanged": "2026-07-29T12:00:00.000Z",
    "walletChangePendingUntil": "2026-08-01T12:00:00.000Z",
    "nextWalletChangeAllowed": "2026-08-28T12:00:00.000Z"
  }
}
```

---

### 5. Creator notifications (Layout bell icon)

**UI location:** Notification panel + toasts

**Status:** Mock-only (`/api/creator/notifications`).

**Suggested:** Reuse CTO Marketplace notifications or add creator-scoped events.

#### Option A — reuse `GET /api/v1/notifications`

Filter client-side for creator event types: `new_referral`, `new_earning`, `payout_paid`.

#### Option B — new endpoint `GET /api/v1/creator/notifications`

```json
{
  "notifications": [
    {
      "id": "string",
      "type": "new_referral | new_earning | payout_paid",
      "title": "string",
      "message": "string",
      "referralId": "optional",
      "earningId": "optional",
      "payoutId": "optional",
      "amount": 12.5,
      "wallet": "optional",
      "createdAt": "ISO8601",
      "read": false
    }
  ],
  "unreadCount": 2
}
```

Also needed: `PATCH` mark read, `DELETE` remove (or match existing `/api/v1/notifications` mutations).

---

### 6. Account deactivation (Settings)

**UI location:** Deactivate account modal

**Suggested:** `POST /api/v1/creator/account/deactivate` or extend auth profile

```json
{ "username": "confirm-username" }
```

---

## Frontend data-fetch architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| HTTP + Bearer token | `apiClient.ts` | All backend calls |
| Server state | **TanStack Query** | `/creator/me`, earnings, payouts, referrals, auth profile |
| Client session | **Zustand** (`sessionStore`) | Token, email, username, avatar for TopBar |
| Mappers | `lib/creatorMappers.ts` | Backend shapes → UI types in `types/creator.ts` |

**Cache efficiency:**

- `/creator/me` is fetched **once** and shared across Dashboard, Referral link blocks, and payout summary (same query key).
- List pages fetch `/creator/earnings`, `/creator/payouts`, `/creator/referrals` in parallel with `/me` when summary fields are needed.
- Auth profile uses a separate query key (`profileKeys.detail`) shared with Settings.

---

## Quick checklist for backend developer

- [ ] Confirm populated shapes for `earnings[]`, `payouts[]`, `referrals[]` list items match expected fields above
- [ ] Add `stats.newReferralsThisWeek` (or document how to derive it)
- [ ] Add `account.landingPageUrl`
- [ ] Add payout `chain` support (account + records + optional request body)
- [ ] Add payout wallet update endpoint + `walletChange` cooldown object
- [ ] Add notifications (or confirm `/api/v1/notifications` covers creator events)
- [ ] Add account deactivation endpoint (optional)
