# Story 4: Operational KPI Metrics Ribbon & Background Polling

**Story ID:** STORY-04  
**Epic:** Epic 2 — Real-time Metric Analytics & Visualization  
**Status:** Ready for Dev  
**Lead:** Winston (`🏗️`)  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` Frame `kpi-row`  

---

## 1. Goal & Context
Implement the 4 operational KPI ribbon cards (Total Revenue, Active Users, Conversion Rate, Avg Response Time) backed by an auto-polling service and robust loading/error/stale UI states.

---

## 2. Acceptance Criteria

- [ ] **AC 4.1 (Backend Telemetry Endpoint):** `GET /api/v1/dashboard/metrics?timeframe=30d` queries PostgreSQL `kpi_metrics` table or aggregates and returns the 4 metric definitions with values and deltas in < 120ms.
- [ ] **AC 4.2 (Card Grid & Visual Fidelity):** 4 responsive cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`, `gap-4`). Styled with `#FFFFFF` background, border `#E2E8F0`, rounded corners (`12px`), shadow card, and `24px` padding.
- [ ] **AC 4.3 (Exact Data Representation):**
  1. **Total Revenue:** `$48,250` with `+12.5%` emerald badge and `dollar-sign` icon inside `#EEF2FF` box.
  2. **Active Users:** `2,847` with `+8.3%` emerald badge and `users` icon.
  3. **Conversion Rate:** `3.24%` with `-1.2%` rose badge (`#EF4444` on `#FEE2E2`) and `target` icon.
  4. **Avg Response Time:** `245ms` with `+4.6%` emerald badge and `clock` icon.
- [ ] **AC 4.4 (Lifecycle States):**
  - **Cold Load:** Shimmer pulse skeleton bars matching exact card typography dimensions.
  - **Error State:** Warning notification inside card with a clickable *"Retry"* action.
  - **Polling / Stale Update:** Background sync executes without causing screen flicker or layout shift (CLS < 0.05).
- [ ] **AC 4.5 (Polling Engine):** Client polls `/api/v1/dashboard/metrics` every 30 seconds. Pauses polling when `document.visibilityState === 'hidden'`.

---

## 3. Technical Notes & Implementation Guidance
* **Data Fetching:** Use TanStack Query (`@tanstack/react-query`) or SWR with `refetchInterval: 30000`, `refetchIntervalInBackground: false`.
* **Database Seeding:** Include initial SQL seed script populating `kpi_metrics` for `7d`, `30d`, and `90d`.
