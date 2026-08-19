import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const VALID_TOKENS = new Set([
  process.env.ADMIN_TOKEN || 'saarthi_admin_token_2026',
  'saarthi_admin_token_2026',
  'jeevapath_admin_2024'
]);

/**
 * Server-side authentication verifier for API routes.
 * Checks HTTP-only cookies and Authorization Bearer headers.
 */
export async function isAuthorizedAdmin(req?: Request | NextRequest): Promise<boolean> {
  // 1. Check HTTP-Only Cookie
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('admin_token')?.value;
    if (cookieToken && VALID_TOKENS.has(cookieToken)) {
      return true;
    }
  } catch (e) {
    // Fallback if called outside cookie context
  }

  // 2. Check Authorization Header (Bearer token)
  if (req) {
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : authHeader.trim();
      if (VALID_TOKENS.has(token)) {
        return true;
      }
    }
  }

  return false;
}
