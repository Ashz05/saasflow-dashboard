---
title: 'Story 2-6: Frontend React App, Split Login UI, and Dashboard Telemetry'
type: 'feature'
created: '2026-09-25'
status: 'done'
baseline_commit: 'NO_VCS'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '_bmad-output/architecture.md'
  - '_bmad-output/ux/design.md'
  - '_bmad-output/ux/experience.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Users require a high-fidelity, responsive client interface with enterprise authentication, split-screen login, real-time KPI ribbon monitoring, chart visualizations, and an audit log table that matches verified Figma designs.

**Approach:** Build a React + Vite TypeScript single-page application styled with Tailwind CSS tokens. Implement Auth Context with Axios Bearer interceptor, Protected Route guards, split-screen Login page, 260px Sidebar navigation, 4 KPI cards with 30s background polling, Recharts Area & Donut charts, and a paginated activity audit table.

## Boundaries & Constraints

**Always:**
- Use Tailwind CSS tokens matching `#4F46E5` primary accent, `#0F172A` dark sidebar, and Inter typography scale.
- Enforce Protected Route guards redirecting unauthenticated users to `/login`.
- Support global keyboard shortcut `⌘K` / `Ctrl+K` for the Command Palette modal.
- Provide shimmer skeleton loaders during data fetching and auto-poll metrics every 30s.

**Never:**
- Allow plaintext token leakage in untrusted storage without route guards.
- Permit layout shifts (CLS > 0.05) during background metric polling.

</frozen-after-approval>

## Code Map

- `frontend/src/api/client.ts` -- Axios client with request & 401 response interceptors.
- `frontend/src/context/AuthContext.tsx` -- React Auth Context managing token persistence, login, register, and logout.
- `frontend/src/components/ProtectedRoute.tsx` -- Route guard redirecting unauthenticated users.
- `frontend/src/pages/Login.tsx` -- Split-screen 576px/864px login page with password toggle, remember me, and live preview mockup.
- `frontend/src/components/Sidebar.tsx` -- 260px dark navigation sidebar with workspace switcher and profile card.
- `frontend/src/components/Header.tsx` -- Header with breadcrumb, `⌘K` search trigger, notification bell, and timeframe filter.
- `frontend/src/components/KpiCards.tsx` -- 4 KPI cards ($48,250 Revenue, 2,847 Users, 3.24% Conv, 245ms Latency) with 30s polling.
- `frontend/src/components/ChartsRow.tsx` -- Recharts Area chart (7d/30d/90d tabs) and Traffic Donut chart (Direct, Organic, Referral, Social).
- `frontend/src/components/ActivityTable.tsx` -- Paginated audit log table with search, status filtering, and relative timestamps.
- `frontend/src/components/CommandPalette.tsx` -- Global `⌘K` command palette modal dialog.
- `frontend/src/pages/Dashboard.tsx` -- Master dashboard assembly layout.

## Tasks & Acceptance

**Execution:**
- [x] `frontend/tailwind.config.js` -- Configure design tokens, colors, and shadows.
- [x] `frontend/src/api/client.ts` & `AuthContext.tsx` -- Auth state management and interceptor setup.
- [x] `frontend/src/pages/Login.tsx` -- Implement split-screen login view.
- [x] `frontend/src/components/Sidebar.tsx` & `Header.tsx` -- Layout navigation shell.
- [x] `frontend/src/components/KpiCards.tsx` -- 4 KPI cards with skeleton states and 30s polling.
- [x] `frontend/src/components/ChartsRow.tsx` -- Recharts area and donut visualizations.
- [x] `frontend/src/components/ActivityTable.tsx` -- Paginated audit table.
- [x] `frontend/src/components/CommandPalette.tsx` -- `⌘K` shortcut command modal.

## Review Triage Log

- `PASS` -- Vite production build passed cleanly (`npm run build`) with zero TypeScript errors. Backend endpoints verified and responding live.
