# Story 2: Split-Screen Authentication Frontend & Route Guards

**Story ID:** STORY-02  
**Epic:** Epic 1 — Authentication & Identity Management  
**Status:** Ready for Dev  
**Lead:** Winston (`🏗️`)  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` Frame `login-page`  

---

## 1. Goal & Context
Construct the responsive, high-fidelity Login and Registration interface in React + Tailwind CSS, matching the 576px/864px split-screen Figma layout. Integrate the client-side Auth Context, silent refresh interceptor, and protected route guards.

---

## 2. Acceptance Criteria

- [ ] **AC 2.1 (Split Layout):** Desktop renders fixed `576px` left form column and `864px` right showcase column (`rgba(15, 23, 42, 0.8)` background with preview mockup and glassmorphism testimonial card). On mobile (< 1024px), right column collapses cleanly.
- [ ] **AC 2.2 (Form Inputs & States):** Email and Password fields feature:
  - Idle `#E2E8F0` border.
  - Focus `#4F46E5` border with `0 0 0 3px rgba(79, 70, 229, 0.15)` ring.
  - Password visibility toggle icon (`eye-off` / `eye`).
  - Error state with `#EF4444` border and inline feedback text.
- [ ] **AC 2.3 (Remember Me & OAuth Row):** Checkbox with `#4F46E5` fill and checkmark icon. "Forgot password?" link. Secondary OAuth buttons for Google and GitHub.
- [ ] **AC 2.4 (Submit & Loading State):** Primary "Sign In" button (`#4F46E5`, height `44px`) displays an accessible SVG spinner during API call and disables inputs.
- [ ] **AC 2.5 (Auth Context & Interceptor):**
  - Keeps Access Token in React state/memory.
  - Axios or Fetch interceptor detects `401 Unauthorized` and invokes `/api/v1/auth/refresh` silently.
  - App bootstrap calls `/api/v1/auth/refresh` on page reload to rehydrate session.
- [ ] **AC 2.6 (Protected Route Guards):** Unauthenticated visits to `/dashboard/*` redirect to `/login?next={path}`. Authenticated visits to `/login` redirect to `/dashboard`.

---

## 3. Technical Notes & Implementation Guidance
* **State Management:** React Context (`AuthContext`) exposing `user`, `login(credentials)`, `logout()`, `isAuthenticated`, `isLoading`.
* **Animations:** Tailwind CSS transitions for input focus and button hover; optional 300ms error shake animation on failed submission.
