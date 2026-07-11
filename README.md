# CTOMarketplace — Creator Landing & Dashboard

This repo contains the **public marketing site**, **creator signup placeholder**, **login placeholder**, and the full **Creator Dashboard** UI for CTOMarketplace.

It is built as a **Next.js 15** app with mock API routes so the frontend can run end-to-end today. Backend developers should replace those mock routes with real services while keeping the same request/response contracts documented below.

---

## Quick start

```bash
npm install
npm run dev
```

- Marketing site: `http://localhost:3000`
- Creator dashboard: `http://localhost:3000/creator`
- Login placeholder: `http://localhost:3000/login`

If you see white screens or 500 errors after changes, clear the Next cache:

```bash
rm -rf .next && npm run dev
```

**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide icons, qrcode.react

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                    # Marketing landing page
│   ├── login/page.tsx              # Login placeholder
│   ├── creator-signup/page.tsx     # Signup placeholder
│   ├── creator/                    # Dashboard routes
│   │   ├── layout.tsx              # Shell: sidebar, top bar, providers
│   │   ├── page.tsx                # Overview
│   │   ├── referrals/page.tsx
│   │   ├── earnings/page.tsx
│   │   ├── payouts/page.tsx
│   │   ├── content/page.tsx
│   │   └── settings/page.tsx
│   └── api/creator/                # Mock API (replace with real backend)
├── components/
│   ├── Hero.tsx, FAQ.tsx, ...      # Marketing sections
│   └── creator/                    # Dashboard UI
├── contexts/                       # Theme, profile, notifications, sidebar
├── lib/
│   ├── api/creator.ts              # Frontend API client (single integration point)
│   ├── mock-*.ts                   # In-memory mock data stores
│   └── format.ts, wallet-change.ts, payout-chains.ts
└── types/creator.ts                # Shared TypeScript contracts
```

**Key rule for integration:** The dashboard UI only talks to the backend through `src/lib/api/creator.ts`. Backend work should either keep these Next.js API routes and wire them to a real service, or point `fetchApi` at an external API base URL.

---

# For frontend designers

This section describes what UI exists today, what is polished, and what still needs design assets or refinement.

## 1. Marketing landing page (`/`)

Fully built scroll landing page with dark theme and pink/orange gradient accents.

| Section | File | Status |
|---------|------|--------|
| Hero | `src/components/Hero.tsx` | Built |
| How it works | `src/components/HowItWorks.tsx` | Built |
| Earnings calculator | `src/components/EarningsCalculator.tsx` | Built (interactive slider) |
| Tier breakdown | `src/components/TierBreakdown.tsx` | Built |
| What is CTO | `src/components/WhatIsCTO.tsx` | Built |
| Content angles | `src/components/ContentAngles.tsx` | Built |
| Dashboard preview | `src/components/DashboardPreview.tsx` | Built (static mockup) |
| FAQ | `src/components/FAQ.tsx` | Built (accordion) |
| Final CTA | `src/components/FinalCTA.tsx` | Built |
| Footer | `src/components/Footer.tsx` | Built |
| Background effects | `src/components/BackgroundEffects.tsx` | Built |

**Designer notes:**
- Background is `#0A0A0A` with pink `#FF2E91` and orange `#FF9F0A` accents.
- Animations: gradient shifts, floating particles, aurora blobs, scroll fade-ins (`FadeInSection.tsx`).
- Creator signup CTA links to `/creator-signup` (placeholder page only).

## 2. Creator dashboard (`/creator/*`)

Full authenticated-style dashboard shell with 6 pages.

### Layout & navigation

| Piece | File | Behavior |
|-------|------|----------|
| Sidebar | `src/components/creator/layout/Sidebar.tsx` | Fixed left nav on desktop; slide-out drawer on mobile |
| Top bar | `src/components/creator/layout/TopBar.tsx` | Page title, hamburger (mobile), theme toggle, notifications, profile avatar |
| Mobile nav | `src/contexts/SidebarContext.tsx` | Hamburger opens drawer; closes on route change or backdrop tap |
| Theme | `src/contexts/ThemeContext.tsx` | Light/dark toggle (CSS variables in `globals.css`) |

### Dashboard pages

| Route | Page component | What's on screen |
|-------|----------------|------------------|
| `/creator` | `OverviewPage.tsx` | 4 stat cards, 30-day earnings bar chart, tier progress bar, “Request Payout” CTA |
| `/creator/referrals` | `ReferralsPage.tsx` | Referral link block (QR, share buttons), searchable referral list |
| `/creator/earnings` | `EarningsPage.tsx` | Total/month stats, searchable transaction history |
| `/creator/payouts` | `PayoutsPage.tsx` | Balance stats, chain selector, read-only wallet, request payout, payout history |
| `/creator/content` | `ContentPage.tsx` | Shareable links, content script library by niche, banner placeholders |
| `/creator/settings` | `SettingsPage.tsx` | Profile (username + avatar), password reset, wallet management |

### Notifications UI

| Piece | File | Behavior |
|-------|------|----------|
| Bell + dropdown | `NotificationPanel.tsx` | Bottom sheet on mobile, dropdown on desktop |
| Toast popups | `NotificationToasts.tsx` | Up to 3 toasts, auto-dismiss after 6s |
| Types | — | `new_referral`, `new_earning`, `payout_paid` |
| Earnings sound | `earnings-notification-sound.ts` | Plays `/sounds/earnings-notification.mp3` after user interaction (browser autoplay rules) |

### Reusable UI components

Located in `src/components/creator/ui/`:

- `StatCard`, `Badge`, `CopyButton`, `SearchInput`, `Pagination`
- `EmptyState`, `ErrorState`, `Skeleton` (+ `TableSkeleton`, `ChartSkeleton`, `StatCardSkeleton`)

Charts in `src/components/creator/charts/`:

- `EarningsChart.tsx` — Recharts bar chart
- `TierProgressBar.tsx` — tier progress visualization

### Design system (creator dashboard)

Tokens are defined in `src/app/globals.css` under the creator theme:

| Token | Usage |
|-------|-------|
| `--color-creator-bg` | Page background (`#0a0a0a` dark) |
| `--color-creator-card` | Card surfaces |
| `--color-creator-border` | Borders |
| `--color-creator-text-primary` / `-secondary` | Text hierarchy |
| `--color-creator-accent` | Orange accent (`#ff6b35`) |
| `--color-creator-success` | Green money/positive states |
| `.creator-btn-primary` | Pink→orange→yellow gradient button |
| `.creator-btn-outline` | Outlined secondary button |

Utility classes: `.bg-creator-card`, `.text-creator-accent`, `.border-creator-border`, etc.

### Mobile optimization (implemented)

- Hamburger + left drawer replaces cramped bottom tabs
- Tables become stacked cards on screens `< md` (Referrals, Earnings, Payouts)
- Input + copy button rows stack vertically on small screens
- Notification panel becomes a bottom sheet on mobile
- Toasts span full width on mobile
- Safe-area padding for notched phones
- Duplicate page `h2` titles hidden on mobile (title shown in TopBar)

### Referrals sharing UI

`ReferralLinkBlock.tsx` includes:

- Read-only referral link + copy
- Share on X, TikTok, Instagram (Instagram copies link then opens instagram.com)
- Referral code + copy
- QR code + download as PNG

### Content page assets

`ContentPage.tsx` uses **hardcoded** niche scripts and banner placeholders. Designers should provide:

- Final banner images (currently placeholder blocks)
- Google Drive / asset links for “More scripts” buttons
- Any updated copy per niche

### Placeholder / needs design or product input

| Item | Route / file | Notes |
|------|--------------|-------|
| Login | `/login` | Static “Continue to Dashboard” — no real auth UI |
| Creator signup | `/creator-signup` | Placeholder text only |
| Logo | `/public/ctom-marketplace-logo.png` | Referenced in sidebar/login — **add to `/public`** |
| Earnings sound | `/public/sounds/earnings-notification.mp3` | Referenced but **file must be added** |
| Base chain payouts | `BlockchainSelector.tsx` | Shown as “coming soon”, disabled |
| Auth screens | — | No forgot-password, email verification, OAuth, etc. |

---

# For backend developers

This section documents the API contract the frontend expects, business rules already encoded in the UI, and what to replace.

## Architecture today

```
Browser → src/lib/api/creator.ts → /api/creator/* (Next.js route handlers)
                                         ↓
                                   mock-*-store.ts (in-memory)
```

**There is no real authentication yet.** API routes do not check sessions or tokens. The frontend client redirects to `/login` on HTTP 401, but no route currently returns 401.

**Mock data** lives in:

| Store | File | Purpose |
|-------|------|---------|
| Settings | `mock-settings-store.ts` | Username, email, avatar, username lock |
| Payouts / wallet | `mock-payout-store.ts` | Balances, payout history, wallet change state |
| Referrals | `mock-referrals-store.ts` | Referral list + demo referral creation |
| Earnings | `mock-earnings-store.ts` | Transactions + demo earnings |
| Notifications | `mock-notifications-store.ts` | Notification feed + demo triggers |

Replace these stores with database/service calls. Keep response shapes identical to `src/types/creator.ts`.

## Shared types

All contracts: **`src/types/creator.ts`**

Important enums:

- `CreatorTier`: `STARTER` | `BUILDER` | `PARTNER`
- `ReferralStatus`: `active` | `inactive`
- `EarningType`: `ad_fee` | `escrow_deal`
- `EarningStatus`: `paid` | `pending`
- `PayoutStatus`: `pending` | `approved` | `paid` | `rejected`
- `PayoutChainId`: `solana` | `base` (only Solana enabled in UI)
- `CreatorNotificationType`: `new_referral` | `new_earning` | `payout_paid`

## API reference

All endpoints are under `/api/creator/`. The frontend sends `Content-Type: application/json` and `credentials: "include"`.

### `GET /api/creator/dashboard`

**Response:** `DashboardData`

```json
{
  "totalReferrals": 24,
  "newReferralsThisWeek": 6,
  "thisMonthEarnings": 142.5,
  "currentTier": "BUILDER",
  "tierCutPercent": 15,
  "referralsForNextTier": 6,
  "activeReferrals": 14,
  "pendingPayout": 38.0,
  "earningsLast30Days": [{ "date": "ISO-8601", "amount": 12.5 }]
}
```

### `GET /api/creator/referrals`

**Response:** `{ referrals: Referral[] }`

```json
{
  "referrals": [{
    "id": "string",
    "username": "optional-string",
    "wallet": "string",
    "dateJoined": "ISO-8601",
    "status": "active | inactive",
    "generated": 42.5
  }]
}
```

### `GET /api/creator/earnings`

**Response:** `EarningsData`

```json
{
  "totalEarned": 487.25,
  "thisMonth": 142.5,
  "transactions": [{
    "id": "string",
    "date": "ISO-8601",
    "type": "ad_fee | escrow_deal",
    "dealAmount": 50.0,
    "yourCut": 7.5,
    "status": "paid | pending"
  }]
}
```

### `GET /api/creator/payouts`

**Response:** `PayoutsData`

```json
{
  "availableBalance": 38.0,
  "totalPaidOut": 312.5,
  "savedWalletAddress": "string",
  "savedChain": "solana",
  "walletChange": {
    "activeWalletAddress": "string",
    "pendingWalletAddress": "optional",
    "walletLastChanged": "optional ISO-8601",
    "walletChangePendingUntil": "optional ISO-8601",
    "nextWalletChangeAllowed": "optional ISO-8601"
  },
  "payouts": [{
    "id": "string",
    "dateRequested": "ISO-8601",
    "amount": 125.0,
    "wallet": "string",
    "chain": "solana | base",
    "status": "pending | approved | paid | rejected",
    "notes": "optional string"
  }]
}
```

### `POST /api/creator/payouts/request`

**Body:**

```json
{ "walletAddress": "string", "amount": 38.0, "chain": "solana" }
```

**Success:** `{ "success": true }`

**Validation (must enforce):**
- `chain` must be `solana` (Base not supported yet)
- `amount` minimum **$10**
- Wallet must be creator's active payout wallet
- Payouts blocked while wallet change is pending (72h activation window)

### `POST /api/creator/payouts/wallet`

Used from **Settings** to submit a wallet change.

**Body:**

```json
{ "walletAddress": "string", "chain": "solana" }
```

**Success:** returns updated `PayoutsData`

**Validation (must enforce):**
- Valid Solana address format (`isValidSolanaAddress` in `payout-chains.ts`)
- Only one change per **30 days** (`WALLET_CHANGE_COOLDOWN_DAYS`)
- New address enters **72-hour pending** state (`WALLET_ACTIVATION_HOURS`)
- During pending: payouts still go to **old** active wallet
- After pending expires: new wallet becomes active

### `GET /api/creator/referral-code`

**Response:** `ReferralCodeData`

```json
{
  "referralCode": "CTOM-BUILDER42",
  "referralLink": "https://ctomarketplace.com/signup?ref=CTOM-BUILDER42",
  "landingPageUrl": "https://ctomarketplace.com/creator?ref=CTOM-BUILDER42"
}
```

### `GET /api/creator/settings`

**Response:** `CreatorSettingsData`

```json
{
  "username": "cryptobuilder",
  "email": "creator@example.com",
  "profileImageUrl": "optional url or data URL",
  "usernameLocked": true,
  "walletChange": { "...same as payouts..." },
  "wallets": [{
    "chain": "solana",
    "address": "string",
    "label": "Solana USDC"
  }]
}
```

Settings GET merges wallet address from payout state so Settings and Payouts stay in sync.

### `PUT /api/creator/settings`

**Body:**

```json
{ "username": "string", "profileImageUrl": "optional string (base64 data URL supported)" }
```

**Rules:**
- Username can only be changed **once**; after first save `usernameLocked: true`
- When locked, only `profileImageUrl` updates are accepted
- Returns updated `CreatorSettingsData`

### `POST /api/creator/settings/password`

**Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Validation:**
- All fields required
- New password min 8 characters
- `newPassword` must equal `confirmPassword`

**Success:** `{ "success": true }`

### Notifications — `GET|POST|PATCH|DELETE /api/creator/notifications`

#### `GET`

**Response:**

```json
{
  "notifications": [{
    "id": "string",
    "type": "new_referral | new_earning | payout_paid",
    "title": "string",
    "message": "string",
    "referralId": "optional",
    "earningId": "optional",
    "payoutId": "optional",
    "amount": "optional number",
    "wallet": "optional",
    "createdAt": "ISO-8601",
    "read": false
  }],
  "unreadCount": 2
}
```

Frontend polls this every **4 seconds** while the dashboard is open.

#### `PATCH` — mark read

```json
{ "id": "notification-id" }
```
or
```json
{ "all": true }
```

Returns updated `{ notifications, unreadCount }`.

#### `DELETE` — remove

```json
{ "id": "notification-id" }
```
or
```json
{ "all": true }
```

#### `POST` — demo/simulate (remove in production)

```json
{ "type": "referral" | "earning" | "payout" }
```

Used by demo timers in `CreatorNotificationContext.tsx`. In production, notifications should be created server-side when real events occur.

**Production triggers backend must implement:**

| Event | Type | When to create |
|-------|------|----------------|
| New referral signup | `new_referral` | User signs up with creator's ref code |
| Creator earns commission | `new_earning` | Ad fee or escrow deal credits creator |
| Payout sent on-chain | `payout_paid` | Payout status moves to `paid` |

## Business rules summary

| Feature | Rule |
|---------|------|
| Username | One-time change, then locked |
| Wallet change | 30-day cooldown, 72h activation delay, payouts paused to old wallet during pending |
| Payout request | Min $10, Solana USDC only, uses active wallet |
| Payouts page wallet field | Read-only — edits only in Settings |
| Referral list | Search by username or wallet |
| Earnings list | Search by transaction type label |
| Notifications | Unread badge, per-item dismiss, clear all, mark all read, toast on new items |
| Auth | **Not implemented** — must add session/JWT and return 401 when unauthenticated |

## Frontend API client

**`src/lib/api/creator.ts`** exports:

| Function | Method | Endpoint |
|----------|--------|----------|
| `getDashboard()` | GET | `/api/creator/dashboard` |
| `getReferrals()` | GET | `/api/creator/referrals` |
| `getEarnings()` | GET | `/api/creator/earnings` |
| `getPayouts()` | GET | `/api/creator/payouts` |
| `getReferralCode()` | GET | `/api/creator/referral-code` |
| `getNotifications()` | GET | `/api/creator/notifications` |
| `markNotificationRead(id)` | PATCH | `/api/creator/notifications` |
| `markAllNotificationsRead()` | PATCH | `/api/creator/notifications` |
| `removeNotification(id)` | DELETE | `/api/creator/notifications` |
| `clearAllNotifications()` | DELETE | `/api/creator/notifications` |
| `requestPayout(...)` | POST | `/api/creator/payouts/request` |
| `updateWalletAddress(...)` | POST | `/api/creator/payouts/wallet` |
| `getSettings()` | GET | `/api/creator/settings` |
| `updateSettings(...)` | PUT | `/api/creator/settings` |
| `resetPassword(...)` | POST | `/api/creator/settings/password` |

If the real API lives on another host, add `NEXT_PUBLIC_API_BASE_URL` and update `fetchApi` in this file.

---

# Integration checklist (frontend + backend)

Use this list to go from the current mock app to production.

## Backend

- [ ] Implement authentication (login, session cookie or JWT)
- [ ] Return **401** on all `/api/creator/*` routes when unauthenticated
- [ ] Replace `mock-settings-store.ts` with user profile service
- [ ] Replace `mock-payout-store.ts` with payout + wallet service (enforce 30d/72h rules)
- [ ] Replace `mock-referrals-store.ts` with referral tracking service
- [ ] Replace `mock-earnings-store.ts` with commission/ledger service
- [ ] Replace `mock-notifications-store.ts` with notification service + real-time or polling
- [ ] Wire `POST /payouts/request` to create real payout records
- [ ] Wire `POST /payouts/wallet` to wallet change workflow
- [ ] Generate real referral codes/links per creator in `GET /referral-code`
- [ ] Remove demo `POST /notifications` simulate endpoint and client demo timers
- [ ] Connect password reset to real auth provider
- [ ] Add Base chain support when product-ready (UI already has disabled state)

## Frontend / design

- [ ] Add `/public/ctom-marketplace-logo.png`
- [ ] Add `/public/sounds/earnings-notification.mp3`
- [ ] Design and implement real login/signup flows (replace placeholders)
- [ ] Provide final content banners for Content page
- [ ] Review mobile layouts on real devices
- [ ] Confirm tier names/colors match production business logic
- [ ] Update referral/signup URLs in `referral-code` route to production domains

## Joint verification

- [ ] Log in → land on `/creator` with real user data
- [ ] Overview stats match database totals
- [ ] Referral link/code/QR reflect logged-in creator
- [ ] New referral creates row in Referrals table + `new_referral` notification
- [ ] New earning creates transaction + `new_earning` notification + sound
- [ ] Wallet change in Settings shows pending state on Payouts page
- [ ] Payout request blocked during wallet pending and below $10
- [ ] Paid payout creates `payout_paid` notification
- [ ] Profile image persists across navigation (TopBar avatar)
- [ ] Username lock works after first change
- [ ] 401 redirects to `/login`

---

## Environment variables (suggested for production)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | External API origin (if not using Next.js routes) |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL for referral links |
| `DATABASE_URL` | Backend database |
| Auth secrets | Session/JWT provider credentials |

---

## Contact / handoff notes

- **Single source of truth for API shapes:** `src/types/creator.ts`
- **Single frontend integration file:** `src/lib/api/creator.ts`
- **Mock logic to study:** `src/lib/mock-*.ts` and `src/lib/wallet-change.ts`
- **Demo notifications:** fire automatically ~5s / ~12s / ~18s after opening dashboard (sessionStorage-gated); remove before production

When both teams follow this README, the existing UI should work against a real backend without component changes — only the API layer and assets need to be swapped in.
