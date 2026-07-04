# Saarthi Project

Spiritual travel guide and itinerary planner app for Tirupati and nearby regions.

## Build and Dev Commands
- **Dev server:** `npm run dev`
- **Build production bundle:** `npm run build`
- **TypeScript compile check:** `npx tsc --noEmit`
- **Lint check:** `npx eslint .`
- **Lint admin pages:** `npx eslint src/app/admin`
- **Trigger DB sync:** `curl -X POST http://localhost:3000/api/admin/sync`

## Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/app/admin/` - Admin CMS directories (places, stories, quizzes, festivals, live-status, fuel, traffic, telemetry)
- `src/app/api/admin/` - Admin-specific API endpoints with Supabase connectors
- `src/components/` - Shared UI components (TripContext, LiveStatus, etc.)
- `src/data/` - Static location records and guide fallbacks (`places.ts`)
- `src/lib/` - Client/server helpers (recommendation engine, Supabase hooks)
- `src/utils/` - Shared utility functions (location calculations, speech synthesis)
- `public/` - Static assets and mock images

## Core Technical Rules
1. **Dynamic User Distance:** Always calculate distance from user coordinates using the Haversine formula (`calculateDistance` from `@/utils/location`). Never hardcode or default to static values when GPS coordinates are available.
2. **Realtime Merge Pattern:** When loading places data from Supabase, always merge the realtime updates on top of static fallback data to preserve rich metadata (`whyVisit`, `shortIntro`, `history`) that is absent from database columns.
3. **No Hydration Mismatches:** Avoid calling dynamic client-only APIs (like `new Date().getDay()`) directly in JSX during SSR. Move them to `useEffect` hooks and handle on-mount.
4. **Onboarding Context:** Greet the user dynamically by checking `localStorage('saarthi_user_name')`. If missing, display the welcome overlay.
5. **Ponytail Dev Ethos:** Write the minimum code that works. Boring over clever. Prioritize reuse over new abstractions. Shortest working diff wins.
6. **Admin Place Promotion:** All static core places are editable. Editing a core place and saving updates automatically promotes it to a dynamic place by setting `_dynamic: true` and inserting it into Supabase.
7. **Sync-Safe Pruning:** When pruning stale data during sync, protect user-created dynamic database records. Dynamic places are filtered via `_dynamic` flags, dynamic stories via ID prefix validation (only prune IDs starting with `'story-'`), and dynamic festivals via ID format validation (only prune non-UUID IDs).
8. **Schema-Safe Database Updates:** When performing inserts or updates in admin endpoints, dynamically fetch one row from the target table to extract valid schema column names. Clean the payload by removing any keys that are not valid columns in Supabase to prevent column mismatch database errors.
