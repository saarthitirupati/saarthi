/**
 * Dynamic API Base URL resolver for Saarthi Frontend.
 * Priority:
 * 1. process.env.NEXT_PUBLIC_API_URL (e.g. "https://app.saarthiguide.in")
 * 2. process.env.BACKEND_URL (server-side environment override)
 * 3. Default fallback: "http://127.0.0.1:8000"
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim() !== '') {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (process.env.BACKEND_URL && process.env.BACKEND_URL.trim() !== '') {
    return process.env.BACKEND_URL.replace(/\/+$/, '');
  }
  return 'http://127.0.0.1:8000';
}
