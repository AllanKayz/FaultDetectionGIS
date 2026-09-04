# FaultGIS AI — Modernized Grid Intelligence, GIS Simulation & Dispatch Platform

A modernized, high-performance web platform for electrical power grid fault detection, spatial telemetry, crew dispatch, and outage analytics. Unified from legacy PHP scripts into a modern **Node.js/Express** backend and an **Angular v19/v22** single-page application built with a premium **Glassmorphism** visual language.

---

## 🌟 Key Features & Modernization Architecture

### 1. Unified Node.js / Express Backend (`/server`)
- **Type-Safe Architecture:** Built with TypeScript and Zod schema request validation.
- **PostGIS & Dual Database Support:** Connects directly to PostgreSQL + PostGIS (`faultdetectiongis.sql`) for spatial queries (`ST_AsGeoJSON`, `ST_GeomFromText`), with automatic in-memory mock database fallback when PostgreSQL is offline.
- **JWT & Role-Based Authorization:** Secure authentication middleware enforcing role-based permissions (`Foreman`, `Artisan`, `Artisan Assistant`, `Admin`).
- **RESTful Endpoints:**
  - `POST /api/auth/login` & `POST /api/auth/register` — JWT auth & employee onboarding.
  - `GET /api/faults/geojson` — GeoJSON feature collection for Leaflet map layers.
  - `GET /api/faults` & `POST /api/faults` — Fault reporting & telemetric simulation.
  - `PATCH /api/faults/:fid/status` — Status updates & artisan dispatch.
  - `GET /api/stats/summary` — Active outage analytics and sector customer impacts.
  - `GET /api/gis/crew` & `GET /api/gis/equipment` — Roster & equipment tracking.

### 2. Angular v19/v22 Modern Frontend (`/frontend`)
- **Standalone Component Architecture:** Lightweight, modular Angular structure.
- **Reactivity & Signals:** Utilizing Angular Signals (`signal`, `computed`, `resource`) for state management and async data fetching.
- **Leaflet GIS Integration:** Dynamic spatial map rendering with custom circular severity markers, interactive tooltips, and floating Glassmorphism control overlays.
- **Glassmorphism UI/UX Design System:**
  - Hardware-accelerated frosted glass panels (`backdrop-filter: blur(16px)`).
  - Translucent fills (`rgba(18, 24, 38, 0.75)` and `rgba(255, 255, 255, 0.08)`).
  - Subtle translucent borders and ambient glowing box-shadows.
  - WCAG AAA compliant high-contrast typography.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v22.x or higher
- **npm:** 10.x or higher
- *(Optional)* **PostgreSQL + PostGIS:** PostgreSQL 10+ with PostGIS extension for local spatial DB setup.

---

### Database Setup (Optional)

To initialize the PostgreSQL spatial database:
```bash
psql -U postgres -f faultdetectiongis.sql
```
*Note: If PostgreSQL is not running, the Express backend automatically starts in Mock Database Fallback Mode so all API endpoints work seamlessly.*

---

### Running the Backend

```bash
cd server
npm install
npm run build
npm start
```
The server will start on `http://localhost:3000`.

---

### Running the Frontend

```bash
cd frontend
npm install
npx ng serve --host 0.0.0.0 --port 4200
```
Open `http://localhost:4200` in your web browser.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Foreman** | `kmukondiwa@powerutility.com` | `12345` |
| **Artisan** | `fzimuto@powerutility.com` | `12345` |
| **Artisan Assistant** | `vmanganda@powerutility.com` | `12345` |
| **Admin** | `admin@powerutility.com` | `12345` |

---

## 🧪 Running Unit & Integration Tests

### Backend Tests (Vitest + Supertest)
```bash
cd server
npm test
```

### Frontend Tests (Vitest)
```bash
cd frontend
npx vitest run
```
