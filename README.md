# Aperçu

![Aperçu Banner](apercuweb.jpg)

**Aperçu** is a full-stack event management platform. It lets organizers create events, manage speakers, and publish blog posts — all subject to admin approval — while the public can browse events, speaker profiles, and the blog without logging in.

## Features

### Public
- Browse and search upcoming events
- View event details and linked speakers
- Read published blog posts with author profiles
- Speaker public profiles with their events and blog posts
- Contact form

### Users (registered)
- Register and log in
- Register / cancel registration for events
- View personal registration history

### Organizers
- Create and manage events (draft → pending → published)
- Submit speakers for admin approval
- Link approved speakers to their events
- Write blog posts (draft → pending → published)
- Link speakers as authors on blog posts

### Admins
- Approve or reject events, speakers, and blog posts
- Full CRUD on all content
- Manage users and roles
- View contact form submissions

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Python FastAPI |
| Database | MySQL |
| Auth | JWT (HS256) via `access-token` header |
| Containerization | Docker / Docker Compose |
| CI/CD | GitHub Actions → Docker Hub (Trivy-scanned, multi-arch) |
| Deployment | k3s (Kubernetes) via Kustomize + ArgoCD Image Updater |
| Secrets | Doppler (`secrets.doppler.com` operator) |
| Ingress | Traefik, public via Cloudflare |
| Tracing | OpenTelemetry (OTLP), enabled when `TAILSCALE_IP_TSPI` is set |

In production, this app connects to a shared MySQL instance — see [`shared-mysql`](https://github.com/JeanMichelBB/shared-mysql). It doesn't run its own database in k3s.

## Project Structure

```
apercu/
├── first-look/          # React + Vite frontend
│   └── src/
│       ├── pages/       # Route-level components (Admin, Organizer, public)
│       ├── components/  # Reusable UI (Header, Footer, LazyImage, …)
│       ├── services/    # api.js — all Axios calls
│       └── locales/     # i18n translations (en / fr)
├── fastapi-backend/     # FastAPI backend
│   ├── main.py          # App entry, middleware, DB init + auto-migration
│   ├── database/        # SQLAlchemy engine + models
│   ├── routers/         # auth, events, speakers, posts, users, contacts
│   ├── schemas.py       # Pydantic request/response models
│   ├── seed.py          # Sample data seeded on first run
│   ├── tracing.py       # OpenTelemetry setup (no-op without TAILSCALE_IP_TSPI)
│   └── dev.sh           # Local MySQL bootstrap (macOS/Homebrew)
├── k3s/                 # Kubernetes manifests (Kustomize)
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml       # Traefik, public via Cloudflare
│   ├── networkpolicy.yaml # Pod-to-pod segmentation
│   ├── doppler-secret.yaml
│   ├── image-updater.yaml # ArgoCD Image Updater
│   └── kustomization.yaml
├── docker-compose.yml
└── .github/workflows/deploy.yml
```

## Environment Variables

Create a `.env` file at the project root:

```env
# Database
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=apercu
MYSQL_USER=apercu_user
MYSQL_PASSWORD=your_password

# Backend
SQLALCHEMY_DATABASE_URL=mysql+pymysql://apercu_user:your_password@mysql:3306/apercu
DB_HOST=mysql
DB_NAME=apercu
DB_USER=apercu_user
DB_PASSWORD=your_password
DB_ROOT_PASSWORD=your_root_password

# Auth
SECRET_KEY=your_jwt_secret

# Admin seed account
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Email (SMTP via Gmail)
FROM_EMAIL=your@gmail.com
FROM_PASSWORD=your_app_password
```

Create `first-look/.env` for the frontend build:

```env
VITE_APP_API_URL=http://localhost:8001
```

## Running with Docker Compose

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8001 |
| Swagger docs | http://localhost:8001/docs |

## Running Locally for Development

**Backend:**
```bash
cd fastapi-backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd first-look
npm install
npm run dev
```

## Database Migrations

No migration tool required. On every startup the backend:

1. Creates the database and user if they don't exist
2. Creates any missing tables (`CREATE TABLE IF NOT EXISTS`)
3. Adds any missing columns to existing tables automatically
4. Seeds sample data on first run

## CI/CD

Pushing to `main` (touching `first-look/` or `fastapi-backend/`) triggers GitHub Actions (`.github/workflows/deploy.yml`):

1. Build a scan-only image
2. Trivy scan — fails the build on unfixed CRITICAL vulnerabilities
3. Build and push multi-arch (`linux/amd64`, `linux/arm64`) images to Docker Hub, tagged `latest` and by commit SHA:
   - `jeanmichelbb/ap-fe`
   - `jeanmichelbb/ap-be`

Deployment to k3s is GitOps-style: ArgoCD Image Updater (`k3s/image-updater.yaml`) watches those tags and bumps `k3s/kustomization.yaml` automatically.

## Content Status Workflows

```
Events:   draft → pending → published
Speakers: pending → approved
Posts:    draft → pending → published
```

Organizers submit content for review. Admins approve or reject. Only published/approved content is visible to the public.

## API Auth

All endpoints require an `access-token` header with a valid JWT except:

- `GET /events`, `/events/:id`, `/events/:id/speakers`
- `GET /speakers`, `/speakers/:id`, `/speakers/:id/events`, `/speakers/:id/posts`
- `GET /posts`, `/posts/:id`, `/posts/:id/speakers`
- `POST /login`, `/auth/register`, `/auth/user-login`, `/auth/forgot-password`, etc.
