# Story 5: Interactive Visualizations (Engagement Area & Traffic Donut)

**Story ID:** STORY-05  
**Epic:** Epic 2 — Real-time Metric Analytics & Visualization  
**Status:** Ready for Dev  
**Lead:** Winston (`🏗️`)  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` Frame `charts-row`  

---

## 1. Goal & Context
Implement the dual data visualization cards in the dashboard row: the User Engagement Trends area chart (with timeframe filter tabs) and the Traffic by Source donut chart with center totals and legend.

---

## 2. Acceptance Criteria

- [ ] **AC 5.1 (Backend Chart Endpoints):**
  - `GET /api/v1/dashboard/charts/engagement?timeframe=30d` returns session series array.
  - `GET /api/v1/dashboard/charts/traffic` returns 4 channel slices (Direct 40%, Organic 35%, Referral 15%, Social 10%) with total sessions `2.8k`.
- [ ] **AC 5.2 (Charts Row Layout):** Row container height `380px`, gap `24px`. Engagement chart is flex-1; Traffic donut card is fixed `420px` width.
- [ ] **AC 5.3 (User Engagement Area Chart):**
  - Interactive timeframe switcher tabs (`7d`, `30d` default, `90d`). Switching tabs triggers smooth data refetch and animation.
  - Smooth area gradient fill in `#4F46E5` transitioning down to transparent.
  - Custom hover tooltip displaying date and session counts on dark slate `#0F172A`.
- [ ] **AC 5.4 (Traffic by Source Donut Chart):**
  - Donut ring with 4 colored segments: Direct (`#4F46E5`), Organic (`#10B981`), Referral (`#F59E0B`), Social (`#EF4444`).
  - Center label displaying *"2.8k Total"*.
  - Right-aligned legend listing channel name, percentage, and color indicator dot.
  - Hovering a slice elevates its segment and highlights the respective legend row.

---

## 3. Technical Notes & Implementation Guidance
* **Charting Library:** Recharts, Chart.js, or lightweight SVG paths. Recharts (`ResponsiveContainer`, `AreaChart`, `PieChart`) is recommended for developer productivity and React harmony.
* **Loading Skeletons:** Both cards must render pulse skeleton placeholders before chart data loads.
