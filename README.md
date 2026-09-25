# SaaSflow — Modern Analytics & Management Dashboard

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg?logo=vercel&logoColor=white)](https://vercel.com)

A high-performance, enterprise-grade SaaS analytics and management platform inspired by modern Figma designs with a sleek **Liquid Glass UI**, real-time metric polling, responsive command palette (`⌘K`), and robust decoupled architecture.

---

## ✨ Features

- **Liquid Glass Aesthetic & Responsive Shell:**
  - Modern translucent glassmorphism cards with smooth border glows (`backdrop-blur-md`, subtle gradients).
  - 260px desktop sidebar with active indicators and responsive mobile drawer navigation.
  - Global `⌘K` / `Ctrl+K` command palette for fast keyboard-driven navigation.
- **Enterprise Authentication & Session Security:**
  - JWT Access Tokens (15 min) + Refresh Tokens (7 days) with silent rotation (RTR) and revocation.
  - Automatic Axios request interceptor with concurrent refresh queueing.
  - Split-screen Figma login/signup UI with defensive error boundaries and session expiration redirects.
- **Real-Time KPI Engine:**
  - 4 Key Metric Cards (Revenue, Users, Conversion Rate, Churn).
  - Synchronized timeframe switching (24h, 7d, 30d, 90d) with live 30-second polling.
- **Interactive Visualizations:**
  - Engagement Area Chart with dynamic SVG linear gradients and formatted tooltips.
  - Traffic Sources Donut Chart with percentage distributions and customized legend.
- **Audit & Activity Management:**
  - Paginated system activity audit log with debounced search and status badges (Success, Warning, Failed).

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios, React Router v7 |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy (Async), Alembic, Pydantic v2, PyJWT, Passlib (Bcrypt) |
| **Database** | SQLite + `aiosqlite` (local development) / PostgreSQL + `asyncpg` (production) |
| **Deployment** | Vercel (Frontend), Docker / Render / Railway (Backend) |

---

## 📁 Repository Structure

```
bmad/
├── backend/                  # FastAPI asynchronous REST backend
│   ├── alembic/              # Database migration versions
│   ├── app/
│   │   ├── api/v1/           # Modular API endpoints (auth, dashboard)
│   │   ├── core/             # Configuration, JWT security, password hashing
│   │   ├── db/               # SQLAlchemy async session management
│   │   ├── models/           # Declarative ORM models (User, Metric, Activity, Workspace)
│   │   └── schemas/          # Pydantic validation schemas
│   ├── tests/                # Automated pytest suite (100% passing)
│   ├── requirements.txt      # Python dependencies
│   ├── seed.py               # Database seeder with sample metrics & activities
│   └── .env.example          # Backend configuration reference
├── frontend/                 # React 19 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── api/              # Axios client with automatic refresh queue
│   │   ├── components/       # Reusable UI components (Sidebar, Header, Cards, Charts, etc.)
│   │   ├── context/          # React AuthContext with persistent session
│   │   └── pages/            # Application views (Dashboard, Login)
│   ├── vercel.json           # Frontend Vercel SPA routing configuration
│   └── package.json          # Frontend scripts & dependencies
├── _bmad-output/             # BMAD Architecture, PRD, and UX specifications
├── vercel.json               # Monorepo root Vercel build configuration
└── docker-compose.yml        # Multi-container orchestration (PostgreSQL + FastAPI)
```

---

## 🚀 Quickstart (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Ashz05/saasflow-dashboard.git
cd saasflow-dashboard
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Seed initial admin user and sample metrics
python seed.py

# Launch FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Default credentials:
- **Email:** `admin@example.com`
- **Password:** `password`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment to Vercel

### Option 1: Vercel GitHub Integration (Recommended)
1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Project Settings**:
   - **Root Directory:** Select `frontend` (or leave root as `.` using the included root `vercel.json`).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://<your-deployed-backend-url>/api/v1`
5. Click **Deploy**.

### Option 2: Deploy using Vercel CLI
```bash
cd frontend
npx vercel
```

---

## 🧪 Testing

Run backend asynchronous unit and integration tests:
```bash
cd backend
pytest tests/ -v
```

---

## 📄 License
This project is licensed under the MIT License.
