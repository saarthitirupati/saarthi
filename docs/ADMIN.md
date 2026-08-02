# Admin Panel

The Admin Panel (`/admin`) is the control center for Saarthi.

## Architecture
The Admin panel uses **FastAPI** as its primary backend, completely decoupling it from direct Supabase JS interactions. This ensures that any business logic, API key protection, or validation happens server-side on the Python backend.

## Structure
- `/admin`: Dashboard showing high-level stats and quick links.
- `/admin/places`: Manage physical locations.
- `/admin/places/[id]`: Edit a specific place.
- `/admin/live-alerts`: Push realtime notifications.
- `/admin/status`: Update Darshan queue times.

## Fetching Strategy
The admin pages use `fetch` requests pointing to `/api/admin/*`, which are proxied by Next.js directly to the FastAPI server.
