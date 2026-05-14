# Atithi App BD - Implementation Plan

## 🛑 Socratic Gate (Phase 0)
Before proceeding with implementation, please confirm or clarify the following:
1. **Third-party Providers:** For the OAuth ready requirement, which providers (Google, Apple, Facebook) should be prioritized?
2. **Insforge Environment:** Do you already have an Insforge project created with the connection details ready, or should we initialize local Insforge first?
3. **Deployment Target:** Will this be deployed on Vercel, or another hosting provider?

## Overview
Build a production-grade marketplace web application called Atithi App BD, an Airbnb clone for Homes, Experiences, and Services in Bangladesh. Features role-based access (Customer vs Host) with Insforge authentication, database, and storage.

## Project Type
**WEB** (Next.js 14 App Router, TypeScript, Tailwind CSS, ShadCN UI, Insforge).

## Success Criteria
- [ ] Users can sign up, log in, and switch roles via an onboarding flow.
- [ ] Insforge RLS policies correctly enforce role permissions (Customers can't create listings, etc).
- [ ] UI exactly mirrors the modern, pixel-perfect, horizontal-scrolling, card-based Airbnb design.
- [ ] Three functional verticals: Homes & Hotels, Experiences, and Services.
- [ ] Bookings and Wishlist systems function correctly.
- [ ] App fully supports 2 language versions: English and Bengali.

## Tech Stack
- **Framework:** Next.js 14 (App Router) - For Server Components & Actions.
- **Language:** TypeScript - For strict type safety.
- **Styling:** Tailwind CSS + ShadCN UI - For rapid, consistent UI components.
- **Backend & Auth:** Insforge - For Auth, Postgres DB, Storage, and RLS.
- **Validation:** Zod - For strict schema validations on mutations.
- **Internationalization (i18n):** `next-intl` or `i18next` - For English and Bengali support.

## File Structure (Core Modules)
```
/
├── app/
│   ├── (auth)/        # login, signup, onboarding
│   ├── (customer)/    # homes, experiences, services, bookings
│   ├── (host)/        # dashboard, my-listings, bookings management
│   └── layout.tsx     # global layout with role-based header
├── modules/
│   └── user/          # core user module
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── queries/
│       └── actions/
├── components/
│   ├── ui/            # shadcn components
│   └── shared/        # generic cards, horizontal scrolls, headers
├── lib/
│   ├── insforge/      # insforge client & auth helpers
│   ├── utils/         # helpers
└── types/             # global types
```

## Frontend Design System

### Typography
- **Primary Font:** `Plus Jakarta Sans`, sans-serif.
- **Headings:**
  - `display-lg`: 48px/56px, font-weight 800, tracking -0.02em
  - `display-md`: 36px/44px, font-weight 800, tracking -0.02em
  - `headline-lg`: 32px/40px, font-weight 700
  - `headline-md`: 26px/32px, font-weight 700
  - `headline-sm`: 22px/28px, font-weight 700
- **Body & Labels:**
  - `title-lg`, `title-md`: 18px & 16px, font-weight 600
  - `body-lg`, `body-md`: 16px & 14px, font-weight 400
  - `label-lg`, `label-md`, `label-sm`: 14px, 12px, 10px, font-weight 600-800

### Color Palette
- **Brand Primary:** `#FF385C` (Airbnb Pink/Red) - Hover state: `#E31C5F`.
- **Surface & Backgrounds:**
  - `surface` / `background`: `#f9f9f9`
  - `surface-container-lowest`: `#ffffff` (White for cards/headers)
- **Text (On-Surface):**
  - Primary text (`on-surface`): `#1a1c1c`
  - Secondary/Variant text (`on-surface-variant`): `#5c3f41` or Zinc-500.

### Spacing & Grid
- **Container Max Width:** `1280px`
- **Section Gap:** `48px`
- **Grid:** Margin `24px`, Gutter `20px`.
- **Breakpoints:**
  - Mobile: Single column, bottom tab navigation / sticky search pill.
  - Tablet (`md`): 2-3 column grids.
  - Desktop (`lg`): 4 column grids for listings.

### Component Specs
1. **Search Bar (Hero Pill):**
   - Shape: Fully rounded (`rounded-full`).
   - Shadow: `shadow-[0_3px_12px_rgba(0,0,0,0.08)]`.
   - Border: 1px solid `zinc-200`.
   - Layout: Divided sections (`Where`, `When`, `Who`) separated by `divide-x`.
   - Action Button: `#FF385C` circle with white search icon.
2. **Listing Cards:**
   - Image wrapper: `aspect-[4/3]`, `rounded-xl`, `overflow-hidden`.
   - Image effect: `group-hover:scale-105 transition-transform duration-500`.
   - Badges: `Guest favourite` (white/90 backdrop-blur, top-left), `Wishlist heart` (top-right, hover scale).
   - Layout: Flex column with tight gap (`gap-0.5`). 1-line truncation (`line-clamp-1`) for text elements.
3. **Navigation & Chips:**
   - Active state: Black text with black bottom border (`border-b-2 border-zinc-950`).
   - Inactive state: `zinc-500` text with hover effect.
   - Badges: `NEW` tag positioned absolute (`-top-3 -right-6`), dark blue bg (`#3b4c6b`), white text, 9px.
4. **Icons:**
   - Provider: `Material Symbols Outlined` (filled for active states).

### NID Verification Screen Elements
- **Theme:** Red/Pink tinted backgrounds for cards.
- **Upload Dropzones:** 
  - Front & Back upload areas inside dashed border containers (`rounded-3xl`).
  - Action icon: Red camera icon with a plus inside a soft red circle.
- **Primary Action:** Large, full-width red button with verified badge icon.

## Task Breakdown

### Phase 1: Project & Database Foundation (P0)
- **Task 1.1:** Setup Next.js 14 project with Tailwind and ShadCN UI.
  - **Agent:** `frontend-specialist` (Skill: `app-builder`)
  - **Dependencies:** None
  - **INPUT→OUTPUT→VERIFY:** Input: Next.js init → Output: Project skeleton → Verify: `npm run dev` starts successfully.
- **Task 1.2:** Configure Internationalization (i18n).
  - **Agent:** `frontend-specialist` (Skill: `i18n-localization`)
  - **Dependencies:** 1.1
  - **INPUT→OUTPUT→VERIFY:** Input: English and Bengali setup specs → Output: `next-intl` configuration and locale directories → Verify: Routing works with language prefix or cookies.
- **Task 1.3:** Implement Insforge Schema & RLS.
  - **Agent:** `database-architect` (Skill: `database-design`)
  - **Dependencies:** 1.1
  - **INPUT→OUTPUT→VERIFY:** Input: Schema from PRD → Output: `schema.sql` and migrations → Verify: Migrations apply cleanly to Insforge.
  
### Phase 2: Core User & Auth Module (P1)
- **Task 2.1:** Build Insforge Auth integration & Server Actions.
  - **Agent:** `backend-specialist` (Skill: `api-patterns`)
  - **Dependencies:** 1.3
  - **INPUT→OUTPUT→VERIFY:** Input: Auth flow specs → Output: `lib/insforge/` clients and auth actions → Verify: Server-side auth methods return session data.
- **Task 2.2:** Build User Module (Queries & Mutations).
  - **Agent:** `backend-specialist`
  - **Dependencies:** 2.1
  - **INPUT→OUTPUT→VERIFY:** Input: Data layer spec → Output: `getCurrentUserProfile()`, `updateProfile()`, `activateHost()`, `updateNIDStatus()` → Verify: User role state is fetched and typed correctly.
- **Task 2.3:** Implement Onboarding & Role Switch Flow UI.
  - **Agent:** `frontend-specialist` (Skill: `frontend-design`)
  - **Dependencies:** 2.2
  - **INPUT→OUTPUT→VERIFY:** Input: Onboarding spec → Output: Multi-step forms for customer/host intent → Verify: Forms successfully write to `profiles` and `host_profiles`.
- **Task 2.4:** Implement NID (National ID) Verification Upload Flow.
  - **Agent:** `frontend-specialist` + `backend-specialist`
  - **Dependencies:** 2.3
  - **INPUT→OUTPUT→VERIFY:** Input: NID upload UI spec (Front & Back image uploads) → Output: NID upload UI & Insforge Storage integration → Verify: Users are blocked from booking or listing creation until NID verification is complete.

### Phase 3: Global Layout & Core Navigation (P2)
- **Task 3.1:** Implement Role-Aware Header & Smart Search Bar.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 2.3
  - **INPUT→OUTPUT→VERIFY:** Input: UI spec → Output: Sticky header with context-aware search fields → Verify: Navigation correctly shifts tabs based on path/role.
- **Task 3.2:** Build Shared UI Components.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 1.1
  - **INPUT→OUTPUT→VERIFY:** Input: Card system specs → Output: Reusable Card, Horizontal Scroll, Rating components → Verify: Components match Airbnb aesthetic (rounded, soft shadows).

### Phase 4: Verticals Implementation (P2)
- **Task 4.1:** Build Homes & Hotels Vertical.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 3.2
  - **INPUT→OUTPUT→VERIFY:** Input: Home UI spec → Output: Homes discovery page, filters, listings → Verify: Horizontal scrolls work and snap perfectly.
- **Task 4.2:** Build Experiences Vertical.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 3.2
  - **INPUT→OUTPUT→VERIFY:** Input: Experiences UI spec → Output: Categories chip scroll, Experience cards → Verify: Proper layout and routing to detail pages.
- **Task 4.3:** Build Services Vertical.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 3.2
  - **INPUT→OUTPUT→VERIFY:** Input: Services UI spec → Output: Category grid, service listings rows → Verify: Images load, responsive behavior holds.

### Phase 5: Booking Engine & Property Details (P0)
- **Task 5.1:** Build Property Detail Page (Airbnb style).
  - **Agent:** `frontend-specialist`
  - **Features:** Image gallery, dynamic description, sticky reservation sidebar.
  - **INPUT→OUTPUT→VERIFY:** Detail page with sticky bar → Verify: Scroll behavior and responsive layout.
- **Task 5.2:** Implement Live Availability Calendar.
  - **Agent:** `frontend-specialist` + `backend-specialist`
  - **Features:** Date selection, pricing logic (base + fees), availability checks via Insforge.
- **Task 5.3:** Modular OTP Authentication.
  - **Agent:** `backend-specialist`
  - **Features:** Phone-based login pattern (swappable for SMS gateway).

### Phase 6: Transactional Engine & SSLCommerz (P0)
- **Task 6.1:** Payment Gateway Integration (SSLCommerz).
  - **Agent:** `backend-specialist`
  - **Features:** Hosted checkout redirect, BDT price calculation, payment modal.
- **Task 6.2:** Webhooks & IPN (Instant Payment Notification).
  - **Agent:** `backend-specialist`
  - **Features:** Secure callback route to confirm booking status in Insforge.
- **Task 6.3:** Host & Guest Dashboards.
  - **Agent:** `frontend-specialist`
  - **Features:** "My Trips" for guests, "Manage Listings & Earnings" for hosts.
- **Task 5.2:** Implement Host Dashboard.
  - **Agent:** `frontend-specialist`
  - **Dependencies:** 2.3, 5.1
  - **INPUT→OUTPUT→VERIFY:** Input: Host spec → Output: Host-only layout, listing management UI → Verify: RLS blocks customers from accessing dashboard.

## Phase X: Verification
- [ ] Purple/Violet hex ban confirmed.
- [ ] No generic layouts, Airbnb aesthetic confirmed.
- [ ] Security Scan passed (`security_scan.py`).
- [ ] UX Audit passed (`ux_audit.py`).
- [ ] Lighthouse metrics > 90 for Performance & SEO.
- [ ] Build completes without errors (`npm run build`).

## ✅ PHASE X COMPLETE
- Lint: [ ]
- Security: [ ]
- Build: [ ]
- Date: TBD
