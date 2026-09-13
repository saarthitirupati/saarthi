import { NextResponse } from 'next/server';
import { executeAutonomousCycle, evaluateAutonomousTrigger } from '@/services/notifications/autonomousEngine';

export const dynamic = 'force-dynamic';

function checkAuth(req: Request): boolean {
  if (!process.env.CRON_SECRET) return true; // Allow in local dev if no secret configured
  const authHeader = req.headers.get('authorization');
  const cronSecretHeader = req.headers.get('x-cron-secret');
  const url = new URL(req.url);
  const cronSecretQuery = url.searchParams.get('cron_secret');

  return (
    cronSecretHeader === process.env.CRON_SECRET ||
    cronSecretQuery === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPreview = url.searchParams.get('preview') === 'true';
  const dryRun = url.searchParams.get('dry_run') === 'true' || isPreview;

  // Allow preview without auth for transparency & debugging
  if (!isPreview && !checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isPreview) {
    const decision = await evaluateAutonomousTrigger();
    return NextResponse.json({
      status: 'preview_only',
      decision,
      explainability: decision.reason
    });
  }

  const result = await executeAutonomousCycle(dryRun);
  return NextResponse.json({
    success: true,
    dryRun,
    ...result
  });
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = Boolean(body?.dry_run);

  const result = await executeAutonomousCycle(dryRun);
  return NextResponse.json({
    success: true,
    dryRun,
    ...result
  });
}
