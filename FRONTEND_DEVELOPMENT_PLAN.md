# Frontend Development Plan for Atithi App BD

**Project**: Airbnb‑style web application for Bangladesh (Atithi App BD)  
**Goal**: Identify missing frontend pages, prioritize implementation, and provide a detailed roadmap to deliver a complete, production‑ready UI.

---  

## 1. Executive Summary
- The current codebase contains many incomplete or missing pages (`app/[locale]/dashboard/*`, `app/[locale]/login`, `app/[locale]/signup`, `app/[locale]/verify-nid`, `app/[locale]/payment`, etc.).  
- Critical user flows (authentication, OTP verification, host/guest dashboards, listing search, calendar & booking, payment processing, profile management) are either absent or broken.  
- This plan outlines:
  1. **Missing page inventory**  
  2. **Prioritized roadmap** (high → low)  
  3. **Feature‑by‑feature implementation steps**  
  4. **Key UI components & reusable patterns**  
  5. **Integration points with existing backend APIs**  
  6. **Testing & quality gates**  

---  

## 2. Current State Overview
| Area | Status | Notes |
|------|--------|-------|
| **Routing** | Partial – many `/[locale]/` routes exist but are not fully wired | `next.config.ts` shows i18n localization (bn, en). |
| **Authentication** | `login`, `signup`, `otp.ts`, `user.ts` files modified but UI missing | Auth flows not rendered. |
| **Host/Guest Dashboards** | Folders created under `app/[locale]/dashboard/host/` & `.../guest/` but no pages/components yet | Need full dashboards. |
| **Listings** | `listings.ts` action exists, `ListingCard.tsx` component partially implemented | Search & listing grid incomplete. |
| **Booking Calendar** | `booking.ts` action present, no UI calendar component | Needs integration with calendar lib. |
| **Payments** | `payment.ts` action & related utilities exist | Checkout flow missing. |
| **Verification** | `NIDUpload.tsx` component created but not used | Identity verification flow incomplete. |
| **UI Components** | Many components (Footer, Header, Card, Map) are in flux | Need consistent design system. |
| **Localization** | `messages/*.json` for bn & en present | Right‑to‑left layout considerations pending. |

---  

## 3. Missing Pages Inventory

| Page | Required For | Current Status |
|------|--------------|----------------|
|| **OTP Verification** | Verify phone/email after signup | `otp.ts` action exists, UI missing |
| **Verify NID** | Host identity verification | `NIDUpload.tsx` exists, UI missing |
| **Dashboard – Host** | Host management (listings, bookings, earnings) | Folder `dashboard/host/` empty |
| **Dashboard – Guest** | Guest view of bookings, preferences | Folder `dashboard/guest/` empty |
| **Listings Overview** | Browse all listings, filter/sort | `listings.ts` exists, UI missing |
| **Listing Detail** | View listing, photos, amenities, availability | Not implemented |
| **Search & Map** | Search results with map overlay | `Search/` folder empty |
| **Booking Calendar** | Select dates, view pricing, confirm booking | `booking.ts` exists, UI missing |
| **Payment / Checkout** | Pay via integrated gateway | `payment.ts` exists, UI missing |
| **Profile / Settings** | Edit personal info, addresses, payment methods | Not present |
| **Help / FAQ** | User support | `help/` folder exists, UI missing |
| **Terms & Privacy** | Legal pages | `terms/`, `privacy/` folders exist, UI missing |
| **Verification Success / Failure** | Feedback after NID upload | Missing |
| **Error / 404 Page** | Graceful handling of unknown routes | Missing |

---  

## 4. Prioritized Roadmap (High → Low)

| Priority | Phase | Core Deliverables |
|----------|-------|-------------------|
| **P1** | **Authentication** | Login, Signup, OTP verification, Profile intro screen |
| **P2** | **Host Onboarding** | NID upload, verification status, Host Dashboard (listings, calendar, earnings) |
| **P3** | **Guest Experience** | Guest Dashboard, Listing browsing, Search & Map, Listing detail |
| **P4** | **Booking Flow** | Calendar UI, pricing breakdown, Booking confirmation, Email/SMS notifications |
| **P5** | **Payments** | Checkout page, payment gateway integration, receipt page |
| **P6** | **Legal & Support** | Terms, Privacy, Help Center, About Us |
| **P7** | **Polish & Localization** | RTL support, Theme switching, Accessibility audit, Internationalization refinements |
| **P8** | **Monitoring & CI** | End‑to‑end tests, performance monitoring, error reporting |

---  

## 5. Detailed Implementation Plan  

### 5.1 Authentication (P1)
| Task | Description | Files / Folders | Owner |
|------|-------------|-----------------|-------|
| Create **Login** page (`app/[locale]/login/page.tsx`) | Form with email/password, link to OTP | `login/` folder, `auth.ts` actions | FE Team |
| Create **Signup** page (`app/[locale]/signup/page.tsx`) | Multi‑step form (name, email, password) | `signup/` folder | FE Team |
| Implement **OTP** UI (`app/[locale]/otp/page.tsx`) | Input for 6‑digit code, auto‑submit on timeout | `otp.ts` action | FE Team |
| Wire auth navigation (link between pages) | Use Next.js Link component | Shared `components/Navigation.tsx` | FE Team |
| Add **Auth Guard** component | Redirect unauthenticated users | `middleware.ts` or custom hook | FE Team |

### 5.2 Host Onboarding (P2)
| Task | Description | Files / Folders | Owner |
|------|-------------|-----------------|-------|
| Build **NID Upload** UI (`app/[locale]/verify-nid/page.tsx`) | Drag‑and‑drop, preview, submit to `NIDUpload.tsx` | `verify-nid/` folder | FE Team |
| Create **Host Dashboard** (`app/[locale]/dashboard/host/`) | Sub‑pages: Overview, Listings, Calendar, Earnings | `dashboard/host/` | FE Team

**Host Dashboard – Detailed Tasks**

| Sub‑page | Path | Description | Owner |
|----------|------|-------------|-------|
| Overview | `app/[locale]/dashboard/host/overview/page.tsx` | Summary cards for earnings, upcoming bookings, quick actions | FE Team |
| Listings | `app/[locale]/dashboard/host/listings/page.tsx` | List host's properties, edit/delete, add new listing button | FE Team |
| Calendar | `app/[locale]/dashboard/host/calendar/page.tsx` | Calendar view of bookings, availability toggles, integrate `HostCalendar` component | FE Team |
| Earnings | `app/[locale]/dashboard/host/earnings/page.tsx` | Revenue breakdown, payouts history, export CSV | FE Team |
| Settings | `app/[locale]/dashboard/host/settings/page.tsx` | Profile, payment method, verification status | FE Team |

**Key Components**
- `components/HostDashboardLayout.tsx` – shared layout with navigation tabs
- `components/HostListingCard.tsx` – card view for each property
- `components/HostCalendar.tsx` – calendar UI for booking management
- `components/EarningsChart.tsx` – visual revenue charts
 |
| Implement **Listing Management** (Add/Edit/Delete) | Forms bound to `listings.ts` actions | `components/ListingForm.tsx` | FE Team |
| Build **Calendar View** for hosts | Integrate `react-calendar` or similar | `components/HostCalendar.tsx` | FE Team |
| Display **Booking Requests** | Accept/reject flow, notification system | `components/BookingRequestCard.tsx` | FE Team |

### 5.3 Guest Experience (P3)
| Task | Description | Files / Folders | Owner |
|------|-------------|-----------------|-------|
| **Search** page (`app/[locale]/search/page.tsx`) | Filter by location, dates, price; integrate with `search` action | `search/` folder | FE Team |

**Search – Detailed Tasks**

| Sub‑page | Path | Description | Owner |
|----------|------|-------------|-------|
| Main Search | `app/[locale]/search/page.tsx` | Search bar, filters, results list, integrates with `search` API | FE Team |
| Filters Sidebar | `components/SearchFiltersSidebar.tsx` | UI for location, dates, price range, amenities filters | FE Team |
| Results List | `components/SearchResultsList.tsx` | Infinite scroll list of `ListingCard` components | FE Team |
| Map Overlay | `components/SearchMapOverlay.tsx` | Shows result pins on a map, syncs with list selection | FE Team |

| **Listing Detail** page (`app/[locale]/listings/[id]/page.tsx`) | Photo gallery, amenities, host rating, availability calendar | `listings/[id]/` | FE Team |

**Listing Detail – Detailed Tasks**

| Sub‑page | Path | Description | Owner |
|----------|------|-------------|-------|
| Overview | `app/[locale]/listings/[id]/page.tsx` | Main listing view with photo carousel, title, price, description | FE Team |
| Amenities | `components/ListingAmenities.tsx` | List of amenities with icons, reusable component | FE Team |
| Photo Gallery | `components/ListingPhotoGallery.tsx` | Swipeable gallery, zoom, lazy‑load images | FE Team |
| Host Info | `components/ListingHostInfo.tsx` | Host name, avatar, verification badge | FE Team |
| Booking Calendar | `components/ListingBookingCalendar.tsx` | Inline mini‑calendar showing availability, integrates with booking flow | FE Team |

| **Map Component** (`components/ui/MapComponent.tsx`) | Embed Leaflet/Google Maps, show listing locations | `MapComponent.tsx` | FE Team |

**Map Component – Detailed Tasks**

| Sub‑component | Path | Description | Owner |
|----------------|------|-------------|-------|
| Base Map | `components/ui/MapComponent.tsx` | Wrapper around Leaflet/Google Maps, initializes map with default center/zoom | FE Team |
| Marker Layer | `components/ui/MapMarkerLayer.tsx` | Renders markers for listings, supports clustering | FE Team |
| Popup Component | `components/ui/MapPopup.tsx` | Shows listing preview when marker clicked, links to detail page | FE Team |
| Search Integration | `components/ui/MapSearchIntegration.tsx` | Syncs map viewport with search filter results | FE Team |

| **Booking Flow** – Calendar UI (`app/[locale]/booking/page.tsx`) | Date picker, price calculation, proceed to payment | `booking.ts` action | FE Team |
| **Guest Dashboard** (`app/[locale]/dashboard/guest/`) | My bookings, upcoming stays, preferences | `dashboard/guest/` | FE Team

**Guest Dashboard – Detailed Tasks**

| Sub‑page | Path | Description | Owner |
|----------|------|-------------|-------|
| Overview | `app/[locale]/dashboard/guest/overview/page.tsx` | Summary of upcoming stays, recent activity, quick links | FE Team |
| Bookings | `app/[locale]/dashboard/guest/bookings/page.tsx` | List of all bookings, status, view details, cancel option | FE Team |
| Preferences | `app/[locale]/dashboard/guest/preferences/page.tsx` | Manage travel preferences, saved filters, notifications | FE Team |
| Settings | `app/[locale]/dashboard/guest/settings/page.tsx` | Profile info, payment methods, account security | FE Team |

**Key Components**
- `components/GuestDashboardLayout.tsx` – shared layout with tab navigation
- `components/GuestBookingCard.tsx` – card view for each booking
- `components/PreferencesForm.tsx` – form for user preferences
- `components/SettingsForm.tsx` – user account settings UI |

### 5.4 Payments (P5)
| Task | Description | Files / Folders | Owner |
|------|-------------|-----------------|-------|
| **Checkout** page (`app/[locale]/checkout/page.tsx`) | Stripe/Payola integration, order summary | `payment.ts` action | FE Team |
| **Receipt** page (`app/[locale]/receipt/page.tsx`) | Confirmation, PDF download option | `receipt.tsx` | FE Team |
| **Payment Success / Failure** UI | Show status, retry option | Shared `components/StatusMessage.tsx` | FE Team |
| **Webhook Integration** | Listen to payment webhook, update booking status | API route `webhook.ts` | FE Team |

### 5.5 Legal & Support (P6)
| Task | Description | Files / Folders | Owner |
|------|-------------|-----------------|-------|
| **Terms** & **Privacy** pages (`app/[locale]/terms/page.tsx`, `privacy/page.tsx`) | Static content, SEO‑friendly | `terms/`, `privacy/` | FE Team |
| **Help Center** (`help/page.tsx`) | Searchable FAQs, contact form | `help/` | FE Team |
| **About Us** (`about/page.tsx`) | Brand story, partner info | `about/` (create if needed) | FE Team |

### 5.6 Polish & Localization (P7)
| Task | Description | Files / Fistors | Owner |
|------|-------------|----------------|-------|
| Implement **RTL** support for Bengali (`dir="rtl"` on root) | CSS adjustments, layout mirroring | `globals.css`, `layout.tsx` | FE Team |
| Add **Theme Switcher** (Light/Dark) | Persist preference in `localStorage` | `components/ThemeToggle.tsx` | FE Team |
| Conduct **Accessibility Audit** (WCAG 2.1) | Keyboard navigation, ARIA labels | Lint rules, axe-core integration | FE Team |
| Internationalize **Date & Currency** formats | Use `next-intl` or `react-intl` | `i18n.ts` | FE Team |

### 5.7 Monitoring & CI (P8)
| Task | Description | Files / Fistors | Owner |
|------|-------------|----------------|-------|
| Add **End‑to‑End Tests** with Cypress for critical flows (login → OTP → dashboard) | `cypress/integration/auth.spec.ts` | Cypress config | FE Team |
| Integrate **Sentry** for error tracking | Capture frontend exceptions | `sentry.client.ts` | FE Team |
| Set up **CI lint‑fix** pipeline | Fail on lint errors, auto‑format on PR | GitHub Actions config | DevOps |
| Configure **Performance Budgets** | Alert on bundle size regression | `next.config.js` | DevOps |

---  

## 6. Reusable UI Components (Identified)

| Component | Purpose | Status |
|-----------|---------|--------|
| `components/ui/ListingCard.tsx` | Mini‑preview of a listing in search results | Partially implemented – needs final styling |
| `components/ui/ScrollSection.tsx` | Section with infinite scroll (used in dashboards) | Modified – needs polishing |
| `components/ui/PriceDisplay.tsx` | Format price with currency symbol | Modified – needs locale support |
| `components/ui/MapComponent.tsx` | Leaflet wrapper for location maps | Empty – create new |
| `components/shared/Modal.tsx` | Generic dialog primitive | Exists – use for NID upload, OTP modal |
| `components/ThemeToggle.tsx` | Light/Dark mode switch | To be added |
| `components/StatusMessage.tsx` | Success/error toast/banner | Exists – use consistently |

---  

## 7. Integration Points with Backend

| Backend Feature | Frontend Integration Needed |
|-----------------|------------------------------|
| `auth.ts` (login, signup, OTP) | Call via `/api/auth/*` endpoints; handle token storage |
| `listings.ts` (fetch/list/create) | Pagination, filtering, optimistic UI updates |
| `booking.ts` (create/confirm) | Mutate booking status, optimistic UI |
| `payment.ts` (initiate payment) | Pass amount & token to payment gateway |
| `user.ts` (profile) | Update profile fields, avatar upload |
| `otp.ts` (verify OTP) | Client‑side verification, retry logic |
| Webhook (`webhook.ts`) | Receive payment status, update booking state |

---  

## 8. Testing Strategy

1. **Unit Tests** – React components with Jest + React Testing Library.  
2. **Integration Tests** – Mock API routes, test form flows (login, OTP, booking).  
3. **End‑to‑End** – Cypress scenarios covering full user journeys (signup → OTP → host onboarding → listing creation).  
4. **Visual Regression** – Use Storybook + Chromatic for UI component snapshots.  
5. **Accessibility** – Run axe-core on each page; fix violations before merge.  

---  

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| **Page Coverage** | 100% of listed pages implemented & live |
| **User Flow Completion** | ≥ 95% of core flows (auth → dashboard → booking → payment) complete without errors |
| **Performance** | Initial page load < 2 s on 3G (Lighthouse) |
| **Accessibility** | WCAG AA compliance for all public pages |
| **Error Rate** | < 1% of frontend HTTP requests result in uncaught errors (monitored via Sentry) |
| **Testing** | 80%+ code coverage for new components; all Cypress scenarios pass on CI |

---  

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **API Breaking Changes** (backend endpoints) | High – could stall frontend work | Pin API version in `package.json`; add integration tests against staging; coordinate with backend team for backward‑compatible shim. |
| **Design System Drift** | Medium – inconsistent UI | Adopt a shared `design-token` file; run periodic component linting. |
| **Localized Layout Complexity** (RTL) | Medium – CSS bugs | Use CSS logical properties; test both LTR & RTL in CI. |
| **Third‑party Payment Gateway Limits** | Low – possible payment failures | Implement fallback “Cash on Arrival” UI; feature flag. |
| **Time Constraints on OTP/Verification** | Medium | Prioritize OTP UI early; use mock service for early dev. |

---  

## 11. Next Steps (Immediate Action Items)

1. **Create the `FRONTEND_DEVELOPMENT_PLAN.md` file** (this document).  
2. **Sprint 1** – Implement Authentication pages (Login, Signup, OTP).  
3. **Sprint 2** – Build Host Onboarding (NID upload, Host Dashboard skeleton).  
4. **Sprint 3** – Develop Guest Experience core (Search, Listing Detail, Calendar).  
5. **Sprint 4** – Integrate Booking & Payment flows.  
6. **Sprint 5** – Polish UI, add Legal pages, perform accessibility audit.  
7. **Sprint 6** – Add tests, CI/CD pipelines, monitoring.  

---  

### Appendix A – File Conventions

```
/app/[locale]/<feature>/page.tsx          // main route for the feature
/app/[locale]/<feature>/components/        // reusable components specific to feature
/components/ui/                            // shared UI components (buttons, cards, modals)
/components/shared/                         // generic utilities (ThemeToggle, StatusMessage)
/layout.tsx                                 // root layout (includes < AuthProvider >, i18nProvider)
/middleware.ts                              // auth guard, locale redirect logic
```

---  

*Prepared by the Frontend Architecture Team – 2026‑05‑10*  
