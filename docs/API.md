# API Reference

## Overview
Saarthi uses a unified API layer. The Next.js frontend proxies specific admin routes to FastAPI to ensure business rules remain centralized. 

## Base URLs
- **Frontend API (Next.js)**: `/api/*`
- **Backend API (FastAPI)**: `/api/v1/*` (typically running on `http://127.0.0.1:8000`)

## Routing Strategy
The `next.config.ts` handles API rewriting:
```javascript
// next.config.ts
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: 'http://127.0.0.1:8000/api/v1/admin/:path*',
      },
    ];
  },
}
```
This means when the React frontend calls `fetch('/api/admin/places')`, it seamlessly hits FastAPI at `http://127.0.0.1:8000/api/v1/admin/places`.
