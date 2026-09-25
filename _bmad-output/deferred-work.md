# Deferred Work Items

## Deferred from: Code Review (2026-09-25)

- **PostgreSQL Native Types & Production Migrations**: Models currently use `String(36)` instead of native PostgreSQL `UUID`, generic `JSON` instead of `JSONB`, and omit partial composite indexes (`idx_kpi_workspace_timeframe`). Deferred to database optimization / Alembic migration story.
- **Frontend Test Suite Scaffolding**: `frontend/src` currently has zero unit or integration tests (no Vitest / React Testing Library / Playwright setup). Deferred to QA test automation story.
