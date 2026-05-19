# Tours Booking Platform

Full-stack web application for browsing and (eventually) booking guided tours.
Built as part of the SIT753 7.3HD DevOps assessment.

## Sprint 1 — Public Tours Catalog

- Browse the full catalog of tours
- Filter tours by category
- View detailed information for a selected tour

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Data:** Mock JSON (will migrate to a database in a later sprint)
- **Containerization:** Docker / docker-compose
- **CI/CD (planned):** Jenkins

## Project Structure

```
tours-booking-platform/
├── backend/          Express API server
├── frontend/         React + Vite SPA
└── docker-compose.yml
```

## Running Locally

### Without Docker

```bash
# Backend
cd backend
npm install
npm run dev          # http://localhost:4000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### With Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:4000
- Health:   http://localhost:4000/health

## API Endpoints (Sprint 1)

| Method | Path                  | Description                |
|--------|-----------------------|----------------------------|
| GET    | `/health`             | Service health check       |
| GET    | `/api/tours`          | List tours (filter by `?category=`) |
| GET    | `/api/tours/:slug`    | Get a single tour by slug  |

## Out of Scope (later sprints)

- Booking flow & payments
- Authentication
- Admin dashboard
- Email integration
- Jenkins pipeline
