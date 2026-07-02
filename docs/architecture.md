# Architecture

Saarthi is designed as a Next.js 16 application using the App Router.

## Principles

1.  **Server Components First:** Default to React Server Components (RSC) to reduce client bundle size. Use Client Components (`"use client"`) only when interactivity (hooks, state, event listeners) is required.
2.  **API Routes:** Backend endpoints are located in `src/app/api/` and utilize Next.js Route Handlers.
3.  **Data Fetching:** Prefer fetching data directly in Server Components where possible, falling back to client-side fetching with SWR/React Query or standard fetch only when necessary.
