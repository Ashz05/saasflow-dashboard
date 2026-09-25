# Story 6: User Activity Audit Log Table with Pagination & Filtering

**Story ID:** STORY-06  
**Epic:** Epic 3 — User Activity Auditing & Event Streams  
**Status:** Ready for Dev  
**Lead:** Winston (`🏗️`)  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` Frame `table-card`  

---

## 1. Goal & Context
Implement the enterprise security audit table: displaying recent platform actions, client IP tracking, semantic status pills (`SUCCESS`, `FAILED`, `PENDING`), debounced keyword search, status filtering, and server-side pagination controls.

---

## 2. Acceptance Criteria

- [ ] **AC 6.1 (Backend Paginated Endpoint):**
  - `GET /api/v1/dashboard/activity?page=1&limit=4&status=all&search=`
  - Queries `activity_logs` in PostgreSQL indexed by `created_at DESC`.
  - Supports filtering by status (`SUCCESS`, `FAILED`, `PENDING`) and text search across user name, email, and action.
  - Returns `data` slice and `pagination` metadata (currentPage, totalPages, totalRecords, hasNextPage, hasPrevPage).
- [ ] **AC 6.2 (Table UI Structure):** Card container with `#FFFFFF` background, border `#E2E8F0`, rounded corners (`12px`), and `24px` padding.
- [ ] **AC 6.3 (Table Columns & Row Details):**
  1. **User:** User avatar (`32x32px` rounded), full name (`14px` bold `#0F172A`), and email (`12px` muted `#475569`).
  2. **Action:** Human-readable activity text (e.g., *Upgraded subscription*, *API key generated*, *Failed payment attempt*, *Workspace integration requested*).
  3. **IP Address:** Monospace format client IP (e.g., `192.168.1.45`).
  4. **Status:** Full pill badges (`padding: 4px 10px`, `rounded-full`):
     - `Success`: Emerald `#10B981` on `#D1FAE5`.
     - `Failed`: Rose `#EF4444` on `#FEE2E2`.
     - `Pending`: Amber `#F59E0B` on `#FEF3C7`.
  5. **Timestamp:** Relative human-readable format (e.g., *2 mins ago*, *1 hour ago*).
- [ ] **AC 6.4 (Search & Status Filter):**
  - Debounced (300ms) search input filters activity stream without page reload.
  - Table header filter icon opens dropdown to isolate status types.
- [ ] **AC 6.5 (Pagination Controls):**
  - Footer counter reads *"Showing X to Y of Z entries"*.
  - *"Previous"* button is disabled on page 1; *"Next"* button is disabled on the last page.
  - Navigating pages smoothly fetches and updates row data.

---

## 3. Technical Notes & Implementation Guidance
* **Seeding:** Seed `activity_logs` with at least 48 records (matching the Figma pagination text *"Showing 1 to 4 of 48 entries"*).
* **Relative Times:** Use `date-fns` (`formatDistanceToNowStrict`) or `dayjs` for humanized timestamps.
