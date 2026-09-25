---
title: 'Story 1: Root Infrastructure & Backend Services (FastAPI + PostgreSQL + Auth & Dashboard)'
type: 'feature'
created: '2026-09-25'
status: 'done'
baseline_commit: 'NO_VCS'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '_bmad-output/architecture.md'
  - '_bmad-output/stories/story-1-auth-backend.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The SaaSflow platform requires a foundational operational data store and an enterprise-grade backend API to handle authentication, session issuance, and operational metric delivery before client interfaces can be mounted.

**Approach:** Provision a root Docker Compose environment running PostgreSQL 16, establish an asynchronous FastAPI backend service with CORS middleware and Alembic migrations, and implement JWT-based authentication (`/login`, `/register`, `/me`) along with dashboard telemetry endpoints (`/stats`, `/charts`, `/activities`).

## Boundaries & Constraints

**Always:**
- Run FastAPI on port `8000` with CORS middleware configured for `http://localhost:5173` (Vite dev server) and `http://127.0.0.1:5173`.
- Use async SQLAlchemy (`asyncpg` driver) for all database operations and Alembic for migration versioning.
- Hash passwords using `bcrypt` (or `passlib[bcrypt]`).
- Issue standard JWT access tokens with an expiration window and verify `Authorization: Bearer <token>` in auth dependencies.
- Ensure all database tables (`users`, `workspaces`, `refresh_tokens`, `kpi_metrics`, `activity_logs`) reflect the architecture specification and include seed data matching verified Figma values.

**Never:**
- Store plaintext passwords anywhere in database tables or logs.
- Hardcode database credentials directly in committed code; load from `.env` with fallback to Docker defaults.
- Return raw stack traces or internal database exceptions in HTTP responses.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
| :--- | :--- | :--- | :--- |
| **User Registration** | `POST /api/v1/auth/register` with valid email, password, full_name | `201 Created` with access_token and user info; creates default workspace | Returns `400 Bad Request` if email already registered |
| **User Login (Success)** | `POST /api/v1/auth/login` with correct email & password | `200 OK` with access_token and user profile | N/A |
| **User Login (Invalid)** | `POST /api/v1/auth/login` with invalid credentials | `401 Unauthorized` with detail "Invalid email or password" | Generic message, no field leakage |
| **Protected Profile** | `GET /api/v1/auth/me` with valid Bearer token | `200 OK` with current user object & workspace | Returns `401 Unauthorized` if token missing, expired, or invalid |
| **KPI Metrics** | `GET /api/v1/dashboard/stats?timeframe=30d` | `200 OK` with 4 KPI cards ($48,250 Revenue, 2,847 Users, 3.24% Conv, 245ms Latency) | Returns default 30d if invalid timeframe passed |
| **Charts Telemetry** | `GET /api/v1/dashboard/charts` | `200 OK` returning engagement area points and traffic donut segments | N/A |
| **Activity Feed** | `GET /api/v1/dashboard/activities?page=1&limit=4` | `200 OK` returning paginated activity rows + total count | Returns empty list if page beyond range |

</frozen-after-approval>

## Code Map

- `docker-compose.yml` -- Local container orchestration for PostgreSQL 16 database (`saasflow_db`).
- `antigravity.config.yaml` -- Antigravity project configuration specifying services, ports, and dev commands.
- `backend/requirements.txt` -- Python dependencies: fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, alembic, pydantic, pydantic-settings, passlib[bcrypt], python-jose[cryptography], python-multipart.
- `backend/app/main.py` -- FastAPI application factory, CORS middleware, API router mounting.
- `backend/app/core/config.py` -- Pydantic Settings reading environment variables (DATABASE_URL, JWT_SECRET, etc.).
- `backend/app/core/security.py` -- Password hashing functions and JWT token creation/verification.
- `backend/app/db/session.py` -- Async SQLAlchemy engine and session factory.
- `backend/app/db/base.py` -- Declarative base and model registry.
- `backend/app/models/` -- SQLAlchemy models: `User`, `Workspace`, `Metric`, `ActivityLog`.
- `backend/app/schemas/` -- Pydantic request and response validation schemas.
- `backend/app/api/v1/auth.py` -- Auth endpoints (`/register`, `/login`, `/me`).
- `backend/app/api/v1/dashboard.py` -- Dashboard telemetry endpoints (`/stats`, `/charts`, `/activities`).
- `backend/alembic/` -- Alembic migration environment and initial migration script.
- `backend/seed.py` -- Async database seeder populating initial workspace, user (Alex Devon), KPIs, and 48 activity logs.

## Tasks & Acceptance

**Execution:**
- [x] `docker-compose.yml` -- Create PostgreSQL 16 service on port 5432 with healthcheck and persistent volume -- Enables local reproducible persistence.
- [x] `antigravity.config.yaml` -- Define backend service metadata and port allocations -- Aligns runtime tooling.
- [x] `backend/requirements.txt` & `backend/pyproject.toml` -- Define backend package requirements -- Provides reproducible dependency environment.
- [x] `backend/app/core/config.py` & `backend/app/core/security.py` -- Implement settings and bcrypt/JWT security utilities -- Enforces secure token handling.
- [x] `backend/app/db/session.py` & `backend/app/models/` -- Define database engine and models (`User`, `Workspace`, `Metric`, `ActivityLog`) -- Relational persistence layer.
- [x] `backend/app/schemas/` -- Create Pydantic schemas for auth and dashboard responses -- Enforces type validation.
- [x] `backend/app/api/v1/auth.py` -- Implement `/register`, `/login`, and `/me` routes with auth dependencies -- Provides Epic 1 identity foundation.
- [x] `backend/app/api/v1/dashboard.py` -- Implement `/stats`, `/charts`, and `/activities` routes -- Delivers telemetry feeds.
- [x] `backend/seed.py` -- Seed initial user `alex.d@saasflow.co`, metrics, and activity records -- Matches Figma mockup data out of the box.

**Acceptance Criteria:**
- Given PostgreSQL is running, when the FastAPI server starts, then it connects successfully and responds to `GET /health` with `{"status": "ok"}`.
- Given valid user credentials, when calling `POST /api/v1/auth/login`, then a JWT access token is returned and can be used to query `GET /api/v1/auth/me`.
- Given an unauthenticated request to `GET /api/v1/dashboard/stats`, when the request lacks a Bearer token, then HTTP 401 is returned.
- Given an authenticated request to `GET /api/v1/dashboard/activities?page=1&limit=4`, then 4 activity records and pagination metadata are returned.

## Implementation Notes

## Spec Change Log

## Review Triage Log

- `PASS` -- All 7 I/O matrix test scenarios passed in `tests/test_api.py` covering registration, authentication, JWT token validation, 401 unauthorized handling, and dashboard telemetry endpoints. Database seeder executed successfully.

## Verification

**Commands:**
- `uv run uvicorn app.main:app --port 8000` -- expected: Server starts and binds to `0.0.0.0:8000` with routes loaded.
- `curl -f http://127.0.0.1:8000/health` -- expected: HTTP 200 `{"status": "ok"}`.
