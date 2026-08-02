import { NextResponse } from 'next/server';
import { readCampaigns, addCampaign, getGrowthHubMetrics, readScans } from '@/lib/adminDb';

export async function GET() {
  try {
    const campaigns = readCampaigns();
    const metrics = getGrowthHubMetrics();
    const scans = readScans().slice(0, 50); // recent 50 scans

    return NextResponse.json({
      success: true,
      campaigns,
      metrics,
      recentScans: scans,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Growth Hub data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, category, location, destination } = body;

    if (!name || !slug || !destination) {
      return NextResponse.json(
        { success: false, error: 'Name, slug, and destination are required' },
        { status: 400 }
      );
    }

    const campaign = addCampaign({
      name,
      slug,
      category: category || 'other',
      location: location || 'Tirupati',
      destination,
      status: 'active',
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create campaign' },
      { status: 400 }
    );
  }
}
