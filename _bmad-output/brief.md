# Product Brief: SaaSflow Full-Stack User Dashboard & Authentication System

## 1. Executive Summary & Context (The Pyramid Principle)

**Situation:** Modern B2B SaaS platforms require a unified operational command center where workspace administrators and product leaders can monitor revenue health, track user acquisition, inspect platform reliability, and manage account security in real time.

**Complication:** Teams often suffer from fragmented monitoring—revenue metrics live in Stripe, traffic analytics in Google Analytics, error tracking in Datadog, and audit logs in disparate server dumps. Furthermore, without a fortified authentication boundary and structured session control, multi-tenant workspace data is vulnerable to unauthorized access and privilege escalation.

**Solution:** **SaaSflow** provides an integrated, full-stack operational dashboard with enterprise-grade authentication. It bridges top-level business intelligence (MRR, conversion rates, traffic channels) with granular operational audits (API generation, payment status, IP tracking) under a hardened, protected session architecture.

---

## 2. Evidence-Based Foundation (Figma Design Grounding)

All requirements, UI layouts, and domain models are directly synthesized from the verified Figma design system (`User-DashBoard`, key `kQQp6IjO3JC4LjQ6OVIXq9`):

* **Design Palette & Accents:**
  * Primary Accent: `#4F46E5` (Indigo 600)
  * Backgrounds: Light Slate `#F8FAFC`, Pure White `#FFFFFF`, Dark Slate `#0F172A`, Surface Slate `#1E293B`
  * Borders & Hairlines: Slate `#E2E8F0` and `#334155`
  * Status Semantics: Emerald `#10B981` / `#D1FAE5` (Success), Rose `#EF4444` / `#FEE2E2` (Danger/Failure), Amber `#F59E0B` / `#FEF3C7` (Warning/Pending)
* **Typography:** `Inter` typeface across all view hierarchies (Bold 700 for KPI values `28px` and Form Headers `30px`; Semi-Bold 600 for card headers `16px` and actions `14px`).
* **Visual Components:** Dual-column split auth layout (`login-form-col` 576px / `login-visual-col` 864px), persistent 260px collapsible sidebar, breadcrumb navigation, global search bar (`⌘K`), quick-action date range filtering, responsive metric cards, dual data visualization graphs, and paginated event table.

---

## 3. Key User Personas & Stakeholder Voices

| Persona | Archetype & Role | Core Jobs-to-be-Done (JTBD) | Pain Points & Constraints |
| :--- | :--- | :--- | :--- |
| **Alex Devon** *(Primary End-User)* | **Workspace Owner / Founder**<br>Target: Executive Leadership | • Log in securely across devices.<br>• Gain an instant pulse on platform financial velocity (Revenue, MRR, Conversion).<br>• Switch between corporate workspaces (`Vortex Workspace`). | Information overload, slow-loading queries, ambiguous metrics without clear change deltas. |
| **Sarah Jenkins** *(Growth Persona)* | **VP of Product / Growth Lead**<br>Target: Product Management | • Monitor user engagement trajectories across 7d, 30d, and 90d intervals.<br>• Correlate marketing channel attributions (Direct vs. Organic vs. Social). | Needs visual clarity without digging into raw SQL; requires reliable attribution telemetry. |
| **Marcus Aurelius / Helena** *(Ops Persona)* | **SecOps / Platform Engineer**<br>Target: Operations & Security | • Track API key lifecycle events and workspace integrations.<br>• Monitor infrastructure response latency (target: <250ms).<br>• Investigate failed payment attempts and IP security events. | Blind spots in system audit logs, missing client IP metadata, slow anomaly detection. |
| **External Stakeholder / Auditor** | **Compliance & Security Auditor** | • Verify authentication boundaries, password hashing, and session expiration.<br>• Ensure zero leaked PII in audit feeds and verify role segregation. | Regulatory compliance (SOC2/GDPR), loose session invalidation, unauthorized route traversal. |

---

## 4. Functional Scope & Requirements

### 4.1 Authentication & Access Control (Public Zone)
1. **Credentials Authentication:**
   * Email Address and Password input with front-end validation and visibility toggle (`eye-off`).
   * "Remember me" persistent token option (secure cookie persistence).
   * Password reset workflow hook ("Forgot password?").
2. **Federated Identity (OAuth 2.0 / OIDC):**
   * One-click authentication buttons for **Google** and **GitHub**.
   * Automatic account linking or workspace onboarding for first-time social sign-ins.
3. **Session Management & Route Guards:**
   * JWT / HttpOnly secure cookie-based session persistence.
   * Client-side and server-side route middleware redirecting unauthenticated traffic to `/login`.
   * Explicit session termination via sidebar profile logout button.

### 4.2 Operational Dashboard (Protected Zone)
1. **Global Header & Workspace Context:**
   * Dynamic workspace selector (`Vortex Workspace`) supporting multi-tenancy context switching.
   * Active breadcrumb trail reflecting current navigational hierarchy (`Dashboard / Overview`).
   * Global command bar (`⌘K` shortcut trigger) for entity and log searching.
   * Notification bell with dynamic badge indicator for real-time alerts.
   * Timeframe filter selector (default: `Last 30 Days`).
2. **Core Operational Metrics (KPI Ribbon):**
   * **Total Revenue:** Formatted currency (`$48,250`) with percentage change delta (`+12.5%`).
   * **Active Users:** Aggregated count (`2,847`) with positive growth delta (`+8.3%`).
   * **Conversion Rate:** Percentage (`3.24%`) with negative indicator delta (`-1.2%`).
   * **Avg Response Time:** Millisecond latency telemetry (`245ms`) with delta change indicator (`+4.6%`).
3. **Data Visualizations:**
   * **User Engagement Trends:** Area/line chart illustrating daily active sessions, equipped with timeframe toggle buttons (`7d`, `30d`, `90d`).
   * **Traffic by Source:** Categorized donut visualization with absolute and percentage attribution:
     * Direct: 40% (`#4F46E5`)
     * Organic: 35% (`#10B981`)
     * Referral: 15% (`#F59E0B`)
     * Social: 10% (`#EF4444`)
     * Center aggregation label: Total Sessions (`2.8k`).
4. **Operational Activity Stream & Audit Log:**
   * Tabular log capturing critical platform events with columns:
     * `User`: Avatar thumbnail, Full Name, and verified Email address.
     * `Action`: Explicit event descriptor (e.g., *Upgraded subscription*, *API key generated*, *Failed payment attempt*, *Workspace integration requested*).
     * `IP Address`: Client IPv4/IPv6 address for security tracing.
     * `Status`: Semantic pill badge (*Success* in green, *Failed* in red, *Pending* in amber).
     * `Timestamp`: Relative human-readable timestamp (e.g., *2 mins ago*, *1 hour ago*).
   * Pagination controls: Footnote showing subset count (*Showing 1 to 4 of 48 entries*) with *Previous* and *Next* button states.

---

## 5. System Boundaries & Constraints

### 5.1 Security & Compliance Boundaries
* **Transport & Storage Encryption:** Strict HTTPS enforcement with TLS 1.3. Passwords hashed using Argon2id or bcrypt (cost factor >= 12).
* **Token Storage:** No raw authentication tokens in `localStorage` or `sessionStorage` (mitigating XSS). Auth tokens must be issued as `HttpOnly`, `SameSite=Lax/Strict`, `Secure` cookies.
* **Brute-Force & Abuse Mitigation:** Rate-limiting enforced on `/api/auth/login` (max 5 failed attempts per IP per 15 minutes before temporary lock).
* **Audit Boundary:** All security-sensitive actions (login, API token creation, payment failure, role escalation) must trigger immutable log entries storing timestamp, Actor ID, target Workspace ID, and client IP.

### 5.2 Performance & Reliability Constraints
* **Initial Page Load (LCP):** Dashboard LCP under **1.2 seconds** on broadband; first contentful paint (FCP) under **600ms**.
* **API Telemetry Latency:** KPI endpoint responses cached and resolved in **< 100ms** (p95).
* **Audit Table Pagination:** Hard ceiling of 10–25 records per API query slice to prevent server memory bloat; database indexed on `(workspace_id, created_at DESC)`.

### 5.3 UX & Accessibility Boundaries
* **Design System Fidelity:** 1:1 parity with the Figma component specification, utilizing exact colors (`#4F46E5` primary) and responsive flex/grid wrappers.
* **Accessibility (WCAG 2.1 AA):**
  * All form inputs must have associated accessible labels and focus rings.
  * Contrast ratio must exceed 4.5:1 for all regular text against `#FFFFFF` and `#0F172A`.
  * Keyboard navigation support: Full tabbing order on forms, tables, and modal triggers; `⌘K` / `Ctrl+K` shortcut listener for search.

---

## 6. Strategic Milestone Roadmap

1. **Milestone 1 — Authentication Spine & Session Shell:** Secure backend auth endpoints, JWT/session cookie handling, protected route guards, and split-screen Login UI.
2. **Milestone 2 — Dashboard Shell & Layout Scaffold:** Responsive layout with dark sidebar, top navigation bar, workspace switcher, and user profile card.
3. **Milestone 3 — Telemetry & KPI Engine:** Integration of real-time or aggregated metrics API for the 4 core KPI cards and timeframe filters.
4. **Milestone 4 — Visualizations & Audit Stream:** Implementation of the Engagement Area chart, Traffic Donut chart, and paginated Activity table with status badges.
5. **Milestone 5 — Hardening & Production Verification:** Rate limiting, security headers, WCAG compliance review, and automated end-to-end smoke tests.
