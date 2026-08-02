# Saarthi Architecture

Saarthi leverages a decoupled "Two Brains" approach: Next.js handles the user interface and server-side rendering, while FastAPI manages business logic, data validation, and heavy database operations.

## High-Level Flow
```text
Browser
  ↓
Next.js (Frontend / App Router)
  ↓
Next.js API Routes (Proxy)
  ↓
FastAPI (Backend Business Logic)
  ↓
Supabase (PostgreSQL + Realtime)
```

## Why this Architecture?
1. **Centralized Logic**: Business rules (e.g. creating a place, validating alerts) live entirely in FastAPI.
2. **Decoupled Frontend**: If we migrate away from Supabase in the future, the frontend components (which only talk to Next.js API or FastAPI directly) won't need to change.
3. **Security**: Sensitive operations are processed on the backend where API keys and secrets are securely managed.
4. **Performance**: FastAPI provides high concurrency via ASGI, while Next.js handles layout caching and asset optimization.

## Data Flow Layering
To maintain maintainability, we strictly separate concerns into the following layers:

1. **Components (`src/components/`)**: Pure UI. They receive props and render React elements.
2. **Hooks (`src/hooks/`)**: Business logic and state management. They call services.
3. **Services (`src/services/`)**: API communication layer (Axios/fetch wrappers).
4. **Next.js API / Proxy**: Routes requests to FastAPI.
5. **FastAPI (`backend/app/routers/`)**: Backend endpoints.
