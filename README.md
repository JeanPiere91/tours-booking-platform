# Tours Booking Platform

Full-stack web application for browsing (and eventually booking) guided tours.
Built as part of the SIT753 7.3HD DevOps assessment.

## Sprint 1 — Public Tours Catalog (closed)

- Browse the full catalogue of tours
- Filter tours by category
- View detailed information for a selected tour (gallery, itinerary, includes, sticky booking sidebar UI)
- Containerised with Docker / docker-compose

Out of scope for Sprint 1 (still to come): booking flow, payments, authentication, admin dashboard, Resend email, Jenkins pipeline.

## Tech Stack

- **Frontend:** React 18 + Vite, served by nginx in production
- **Backend:** Node.js 20 + Express
- **Data:** Mock JSON (will migrate to a database in a later sprint)
- **Containerization:** Docker / docker-compose
- **CI/CD (planned):** Jenkins

## Project Structure

```
tours-booking-platform/
├── backend/            Express API (Dockerfile + src)
├── frontend/           React + Vite SPA (Dockerfile + nginx.conf + src)
├── docs/               Mockups and user stories
├── docker-compose.yml  Orchestrates frontend + backend
└── .dockerignore
```

## Ports

| Service  | Container | Host  | URL                              |
|----------|-----------|-------|----------------------------------|
| Frontend | 80        | 5173  | http://localhost:5173            |
| Backend  | 5000      | 5000  | http://localhost:5000            |
| Health   | 5000      | 5000  | http://localhost:5000/health     |

## Running with Docker (recommended)

Prerequisites: Docker Desktop (or Docker Engine + Compose v2).

```bash
# Build images and start both services
docker compose up --build

# Detached mode
docker compose up --build -d

# Tail logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

Then open http://localhost:5173. The SPA calls the API through nginx, which proxies `/api/*` and `/health` to `backend:5000` over the internal `tours-net` Docker network — no CORS configuration required in the browser.

The compose file declares healthchecks on both services and uses `depends_on: condition: service_healthy`, so the frontend will only start once the backend health endpoint returns 200.

### Useful one-off commands

```bash
# Hit the API directly (host-side)
curl http://localhost:5000/health
curl http://localhost:5000/api/tours
curl http://localhost:5000/api/tours/machu-picchu-full-day

# Rebuild a single service after editing its code
docker compose build backend
docker compose up -d backend
```

## Running without Docker (dev mode)

```bash
# Backend (terminal 1)
cd backend
npm install
npm run dev          # http://localhost:5000

# Frontend (terminal 2)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Vite proxies `/api/*` and `/health` to `http://localhost:5000` during `npm run dev` — see [frontend/vite.config.js](frontend/vite.config.js). To proxy somewhere else, set `VITE_API_PROXY_TARGET` (see [frontend/.env.example](frontend/.env.example)).

## API Endpoints (Sprint 1)

| Method | Path                  | Description                                     |
|--------|-----------------------|-------------------------------------------------|
| GET    | `/health`             | Service health check                            |
| GET    | `/api/tours`          | List tours (filter with `?category=Adventure`)  |
| GET    | `/api/tours/:slug`    | Get a single tour by slug                       |
