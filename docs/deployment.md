# Deployment Guide

Saarthi is optimized for deployment on lightweight cloud infrastructure, specifically Oracle Cloud Free Tier.

## Deployment Architecture

```text
Oracle VM (Ubuntu/Linux)
  ↓
Nginx (Reverse Proxy & SSL Termination)
  ├── 3000 (Next.js Production Build)
  └── 8000 (FastAPI Uvicorn Workers)
```

## Steps for Deployment

1. **Build the Frontend**:
   ```bash
   npm run build
   npm run start # Typically managed via PM2
   ```

2. **Run the Backend**:
   Run FastAPI using Gunicorn with Uvicorn workers for production stability:
   ```bash
   gunicorn -k uvicorn.workers.UvicornWorker app.main:app -b 127.0.0.1:8000
   ```

3. **Nginx Configuration**:
   Configure Nginx to route `/api/v1/*` to `localhost:8000` and all other traffic to `localhost:3000`.

4. **Static Assets**:
   Ensure images are fetched from remote URLs (like Unsplash) rather than stored locally to preserve VM storage limits.
