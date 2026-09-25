# AGENTS.md — Repository Guidance for AI Agents

## Project Documentation & Planning Location

> [!IMPORTANT]
> **All project documentation, specifications, and planning artifacts are strictly located inside `_bmad-output/`.**
> The root `docs/` directory has been removed and migrated to `_bmad-output/`.

### Directory Layout & Artifact Inventory

All markdown specification files are organized within `_bmad-output/`:

* **Product Brief:** `_bmad-output/brief.md` — Strategic intent, user personas, operational metrics, and boundaries.
* **Product Requirements Document (PRD):** `_bmad-output/prd.md` — Detailed user stories, acceptance criteria, OKRs, and epic definitions.
* **Technical Architecture:** `_bmad-output/architecture.md` — Decoupled system architecture, PostgreSQL schemas, REST API contract, and ADRs.
* **UI/UX Specifications:**
  * `_bmad-output/ux/design.md` — Design tokens (Tailwind CSS hex codes, typography scale, spacing).
  * `_bmad-output/ux/experience.md` — State machines, screen transitions, skeletons, and error interactions.
* **Implementation Stories (Sharded PRD):**
  * `_bmad-output/stories/story-1-auth-backend.md` — Story 1: Auth backend API & PostgreSQL models.
  * `_bmad-output/stories/story-2-auth-frontend.md` — Story 2: Split-screen Figma Login UI & Auth context.
  * `_bmad-output/stories/story-3-dashboard-shell.md` — Story 3: 260px Sidebar, Header, and `⌘K` command palette.
  * `_bmad-output/stories/story-4-kpi-metrics.md` — Story 4: 4 KPI cards & 30s background polling engine.
  * `_bmad-output/stories/story-5-visualizations.md` — Story 5: Engagement area chart & Traffic donut chart.
  * `_bmad-output/stories/story-6-activity-audit.md` — Story 6: Paginated audit log table & debounced search.

### Guidelines for Agents

1. **Path Resolution:** When reading or referencing any project specification, always use `_bmad-output/<filename>` (e.g., `_bmad-output/prd.md`).
2. **Writing Artifacts:** Any new planning or documentation markdown files must be written inside `_bmad-output/` or its subdirectories.
3. **BMad Configuration:** `modules.bmm.project_knowledge` and `modules.bmm.planning_artifacts` resolve to `{project-root}/_bmad-output`.
