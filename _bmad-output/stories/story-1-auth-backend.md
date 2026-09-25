 

# Story 1: Authentication & Identity Backend

**Story ID:** STORY-01
**Epic:** Epic 1 — Authentication & Identity Management
**Status:** Ready for Dev
**Lead:** Winston (`🏗️`)

---

## 1. Goal & Context

Implement the core authentication and identity management service in Node.js/TypeScript with PostgreSQL. This provides secure user registration, bcrypt password hashing, JWT Access Token generation, HttpOnly Refresh Token issuance with automatic rotation (RTR), and token revocation on logout.

---

## 2. Acceptance Criteria

- [ ] **AC 1.1 (Database Models):** PostgreSQL tables `workspaces`, `users`, and `refresh_tokens` are created using migration tooling with UUID keys, foreign key constraints, and timestamps.
- [ ] **AC 1.2 (Register Endpoint):** `POST /api/v1/auth/register` accepts `email`, `password`, `fullName`. Validates email format, checks for duplicates, hashes password using bcrypt (cost 12), seeds a default workspace (`Vortex Workspace`), and returns Access Token + sets HttpOnly `refreshToken` cookie.
- [ ] **AC 1.3 (Login Endpoint):** `POST /api/v1/auth/login` verifies credentials. On success, issues 15-min JWT access token and 7-day (or 24h) refresh token cookie. On failure, responds with `401 Unauthorized` with generic message.
- [ ] **AC 1.4 (Brute Force Protection):** Enforces rate limiting on `/api/v1/auth/login` (max 5 failed attempts per 15 minutes per IP returning `429 Too Many Requests`).
- [ ] **AC 1.5 (Silent Refresh & Rotation):** `POST /api/v1/auth/refresh` reads `refreshToken` cookie, checks database validity, issues a new Access Token, and replaces the old refresh token with a new rotated token.
- [ ] **AC 1.6 (Logout Endpoint):** `POST /api/v1/auth/logout` marks the refresh token revoked in the database and clears the cookie (`Max-Age=0`).
- [ ] **AC 1.7 (Auth Middleware):** Express middleware validates `Authorization: Bearer <token>` on protected routes and attaches `req.user` context.

---

## 3. Technical Notes & Implementation Guidance

* **Password Hashing:** `bcryptjs` or `@node-rs/bcrypt` with cost factor 12.
* **JWT Signing:** `jsonwebtoken` with 15m expiration, signed with `JWT_SECRET`. Payload contains `{ sub: user.id, workspaceId: user.workspace_id, role: user.role }`.
* **Cookie Flags:** `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/api/v1/auth'`.
* **Testing:** Unit tests verifying login success, login failure (401), token expiration handling, and refresh token rotation.
