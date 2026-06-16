# Fullstack Dockerized Hackathon — Project Scaffold

This repository contains a fullstack scaffold (Angular frontend + Node/Express backend) optimized for Docker Compose and deployment to a Linux VPS. See the generated documentation for detailed architecture and conventions.

- **Project guide**: [CLAUDE.md](CLAUDE.md)
- **Frontend architecture**: [docs/front.md](docs/front.md)
- **Backend architecture**: [docs/api.md](docs/api.md)

## Quickstart (local)

1. Copy `.env.example` to `.env` and fill values for `DATABASE_URL`, `JWT_SECRET`, etc.

2. Start services with Docker Compose:

```bash
docker-compose up --build
```

3. Backend API: http://localhost:3000/api/
4. Frontend: http://localhost (served by Nginx container)

## Development (non-Docker)

Backend

```bash
cd backend
npm install
# run in dev mode (nodemon/ts-node) if configured
npm run dev
```

Frontend

```bash
cd frontend
npm install
ng serve
```

## CI/CD

Workflows are expected under `.github/workflows/`:

- `test.yml` for PRs and push checks (install, lint, build)
- `deploy.yml` for building images, pushing to registry, SSH to VPS and running `docker-compose` on the server

Configure the following GitHub repository secrets for deploys:

```
VPS_HOST
VPS_USER
VPS_SSH_KEY
DOCKER_USERNAME (optional)
DOCKER_PASSWORD (optional)
```

## Next steps I can do for you

- Scaffold `docker-compose.yml`, `backend` and `frontend` starter files
- Generate `prisma/schema.prisma` and a `Todos` feature
- Create GitHub Actions workflows (`test.yml`, `deploy.yml`)

Tell me which next step you'd like me to implement.
