# Story 3: Dashboard Layout Shell, Navigation & Command Palette

**Story ID:** STORY-03  
**Epic:** Epic 1 & Epic 2 — Dashboard Foundations  
**Status:** Ready for Dev  
**Lead:** Winston (`🏗️`)  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` Frame `user-dashboard`  

---

## 1. Goal & Context
Build the primary application layout container: the fixed 260px dark navigation sidebar (`#0F172A`), top header bar with breadcrumbs and search, workspace switcher dropdown, and global `⌘K` command palette modal.

---

## 2. Acceptance Criteria

- [ ] **AC 3.1 (260px Dark Sidebar):** Fixed `260px` width on desktop (`#0F172A`). Responsive slide-over drawer on mobile/tablet (< 1024px) triggered by hamburger button.
- [ ] **AC 3.2 (Brand & Nav Items):**
  - Brand header with SaaSflow logo badge (`#4F46E5`) and typography (`18px` white bold).
  - Navigation links: `Dashboard` (active, `#4F46E5` fill), `Analytics`, `Users`, `Integrations`, `Settings`.
  - Inactive links highlight to `#1E293B` on hover.
- [ ] **AC 3.3 (Workspace Switcher):** Interactive pill (`#1E293B`, border `#334155`) showing "Vortex Workspace" and chevron icon. Dropdown menu toggles on click and dismisses on outside click.
- [ ] **AC 3.4 (User Profile Card & Logout):** Bottom sidebar card with avatar (`36x36px`), user full name ("Alex Devon"), email, and logout button invoking `POST /api/v1/auth/logout`.
- [ ] **AC 3.5 (Header Bar & Breadcrumbs):** Breadcrumb path `Dashboard / Overview`. Notification bell with `#EF4444` unread badge dot. Date range filter selector (`Last 30 Days`).
- [ ] **AC 3.6 (Global Search Command Palette `⌘K`):** Global listener for `⌘K` (Mac) and `Ctrl+K` (Windows). Opens centered modal with backdrop blur, search input, and quick action filters.

---

## 3. Technical Notes & Implementation Guidance
* **Icons:** Use `lucide-react` for standard SVG icons (`LayoutDashboard`, `LineChart`, `Users`, `Network`, `Settings`, `LogOut`, `Search`, `Bell`, `Calendar`).
* **Layout Structure:** Flex layout: fixed sidebar + flex-1 scrollable main content with `padding: 32px` on `#F8FAFC`.
