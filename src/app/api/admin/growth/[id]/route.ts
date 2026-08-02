import { NextResponse } from 'next/server';
import { readCampaigns, updateCampaign, readScans } from '@/lib/adminDb';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaigns = readCampaigns();
    const campaign = campaigns.find(c => c.id === id || c.slug === id);

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const allScans = readScans();
    const campaignScans = allScans.filter(s => s.campaignId === campaign.id || s.campaignSlug === campaign.slug);

    return NextResponse.json({
      success: true,
      campaign,
      scans: campaignScans,
      totalScans: campaignScans.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch campaign details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = updateCampaign(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update campaign' },
      { status: 400 }
    );
  }
}
