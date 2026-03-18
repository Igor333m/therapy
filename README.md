# Therapy Marketplace

Therapy Marketplace is a monorepo for an MVP that connects clients with therapists based on language, country, and service type. The web app provides the discovery experience, while the API handles authentication, booking workflows, therapist-related session flows, and integrations for recording and transcription.

The current implementation already includes role-aware authentication, booking request endpoints, shared domain constants for locales and services, and infrastructure wiring for PostgreSQL, Redis, Agora webhooks, and transcript processing.

## App Summary

This project is structured around a therapy marketplace use case:

- Clients can register, log in, verify email, and create booking requests.
- Therapists can access therapist-specific session queue endpoints.
- Moderators have protected moderation endpoints.
- The web frontend exposes the initial marketplace flow for selecting language and country, then browsing available therapy services.
- The backend is prepared for session recording and transcription workflows through Agora and transcription modules.

Shared package definitions keep user roles, supported locales, and core service slugs consistent across the API and web app.

## Tech Stack

### Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### Backend

- NestJS 11
- TypeScript
- TypeORM
- Passport JWT authentication
- class-validator / class-transformer

### Data and Infrastructure

- PostgreSQL 16
- Redis 7
- Docker Compose for local infrastructure
- Agora webhook integration
- AssemblyAI-ready transcription configuration

### Monorepo

- npm workspaces
- Shared internal package: `@therapy/shared`

## Repository Structure

```text
.
|- apps/
|  |- api/      # NestJS backend
|  \- web/      # Next.js frontend
|- packages/
|  \- shared/   # Shared roles, locales, service types, and common contracts
\- infrastructure/
	\- docker-compose.yml
```

## Key Capabilities Present

- JWT-based auth with register, login, refresh, and current-user endpoints
- Email verification flow
- Role-aware guards for client, therapist, and moderator access
- Booking request creation for therapy sessions
- Shared therapy service catalog and locale support (`en`, `sr`)
- PostgreSQL-backed domain model for users, therapist profiles, availability, bookings, content, recordings, transcripts, and contact inquiries
- Agora recording webhook entrypoint
- Transcription module wiring for post-session processing

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop or another Docker runtime

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` in the repository root and fill in any required secrets.

Important variables include:

- `PORT` for the API server
- `DATABASE_URL` for PostgreSQL
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- `REDIS_URL`
- Agora credentials
- S3 storage credentials for recordings
- `ASSEMBLYAI_API_KEY` for transcription

### Start Local Infrastructure

```bash
docker compose -f infrastructure/docker-compose.yml --env-file .env up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### Run the Applications

Frontend:

```bash
npm run dev:web
```

Backend:

```bash
npm run dev:api
```

Default local URLs:

- Web app: `http://localhost:3000`
- API: `http://localhost:3001/api`

## Workspace Scripts

From the repository root:

```bash
npm run dev:web
npm run dev:api
npm run build
npm run lint
npm run typecheck
```

## API Notes

The API applies a global `/api` prefix and request validation via NestJS `ValidationPipe`.

Current endpoint areas include:

- `/api/auth/*`
- `/api/sessions/*`
- `/api/webhooks/agora/recording`

An HTTP request collection is available in `apps/api/src/requestsAPI.http` for local API testing.

## Domain Notes

- Supported locales: English (`en`) and Serbian (`sr`)
- Core services: individual, couples, teen, coping-with-move
- User roles: client, therapist, moderator

## Current Status

This repository is positioned as an MVP foundation. The core scaffolding for marketplace discovery, auth, session booking flows, and integration points is in place, while production concerns such as full UI flows, external service credentials, and deployment hardening still depend on environment-specific setup.
