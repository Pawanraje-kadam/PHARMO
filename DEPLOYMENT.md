# PHARMO Deployment Guide

## Architecture

| Service   | Host   | Directory          |
|-----------|--------|--------------------|
| Backend   | Render | `apps/backend`     |
| Frontend  | Vercel | `apps/frontend`    |
| Database  | Neon   | PostgreSQL         |

---

## 1. Neon (Database) Setup

1. Go to [neon.tech](https://neon.tech) and create a project.
2. Copy the connection string from the dashboard. It looks like:
   ```
   postgresql://user:password@ep-xxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Save this as `DATABASE_URL` — you will use it in the backend.

---

## 2. Environment Variables

### Backend (`apps/backend/.env`)

| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `DATABASE_URL`   | Yes      | Neon PostgreSQL connection string        |
| `JWT_SECRET`     | Yes      | Secret key for signing JWT tokens        |
| `GROQ_API_KEY`   | No       | API key for Groq AI features             |
| `FRONTEND_URL`   | Yes      | Comma-separated allowed CORS origins     |
| `NODE_ENV`       | Yes      | `production` or `development`            |
| `PORT`           | No       | Server port (default: 5000)              |

### Frontend (`apps/frontend/.env`)

| Variable       | Required | Description                            |
|----------------|----------|----------------------------------------|
| `VITE_API_URL` | Yes      | Backend API base URL (with `/api`)     |

Example frontend `.env`:
```
VITE_API_URL=https://pharmo-backend.onrender.com/api
```

---

## 3. Backend — Render Deployment

1. Push the repo to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) → New Web Service.
3. Connect your GitHub repo.
4. Use these settings:

   | Setting          | Value                                         |
   |------------------|-----------------------------------------------|
   | Name             | `pharmo-backend`                              |
   | Root Directory   | `apps/backend`                                |
   | Runtime          | Node                                          |
   | Build Command    | `npm install && npm run build`                |
   | Start Command    | `npm run start`                               |
   | Plan             | Free (or paid)                                |

5. Add the following Environment Variables:

   | Key              | Value                          |
   |------------------|--------------------------------|
   | `NODE_ENV`       | `production`                   |
   | `PORT`           | `5000`                         |
   | `DATABASE_URL`   | *(Neon connection string)*     |
   | `JWT_SECRET`     | *(strong random secret)*       |
   | `FRONTEND_URL`   | `https://pharmo.vercel.app`    |
   | `GROQ_API_KEY`   | *(optional, from Groq console)*|

6. Click **Deploy**.

> **Important**: If you have a Prisma migration to apply, run this in Render's shell after first deploy:
> ```
> npm run prisma:deploy
> ```

---

## 4. Frontend — Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → Add New Project.
2. Import your GitHub repo.
3. Configure:

   | Setting           | Value                |
   |-------------------|----------------------|
   | Root Directory    | `apps/frontend`      |
   | Framework Preset  | Vite                 |
   | Build Command     | `npm run build`      |
   | Output Directory  | `dist`               |

4. Add Environment Variable:

   | Key              | Value                                         |
   |------------------|-----------------------------------------------|
   | `VITE_API_URL`   | `https://pharmo-backend.onrender.com/api`      |

5. Click **Deploy**.

---

## 5. Prisma Migrations

### First-time migration (local)
```bash
# From the project root:
npm run prisma:migrate -- --name init
# Or from apps/backend:
cd apps/backend
npx prisma migrate dev --name init
```

### Apply migrations in production
```bash
# After deployment, run in Render shell:
npm run prisma:deploy
```

### Seed the database (local)
```bash
npm run db:seed
```

> **Important**: `prisma db push` is for development only. In production, always use `prisma migrate deploy`.

---

## 6. Deployment Commands (Quick Reference)

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run prisma:generate

# 3. Run database migrations
npm run prisma:deploy

# 4. Build backend
npm run build --workspace=apps/backend

# 5. Build frontend
npm run build --workspace=apps/frontend

# 6. Start backend
npm run start --workspace=apps/backend
```

---

## 7. Troubleshooting

### 7.1 Backend crashes on startup
- **Check `DATABASE_URL`**: Ensure the Neon connection string is correct and includes `?sslmode=require`.
- **Check `JWT_SECRET`**: Ensure it is set in production.
- **Check ports**: Render assigns `PORT` automatically — do not hardcode it.

### 7.2 Frontend shows blank page or API errors
- **Check `VITE_API_URL`**: Verify it points to the correct Render backend URL and includes `/api`.
- **Check CORS**: Ensure `FRONTEND_URL` in the backend env matches the Vercel domain exactly.
- Redeploy after env var changes.

### 7.3 CORS errors in browser
- The backend's `FRONTEND_URL` env var can be a comma-separated list for multiple origins:
  ```
  FRONTEND_URL=https://pharmo.vercel.app,http://localhost:5173
  ```

### 7.4 Prisma migration fails
- Ensure `DATABASE_URL` is correct and the database is accessible.
- Check that no manual schema changes conflict with migrations.
- Run `prisma migrate diff` to debug.

### 7.5 TypeScript build errors
- Ensure all unused imports and variables are removed (strict mode is enabled).
- Run `npm run build` locally first to catch issues.

---

## 8. Local Development

```bash
# Install
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to local DB
npm run db:push

# Seed data
npm run db:seed

# Start backend (http://localhost:5000)
npm run dev --workspace=apps/backend

# Start frontend (http://localhost:5173)
npm run dev --workspace=apps/frontend
```
