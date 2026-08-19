import { NextResponse } from 'next/server';
import { readCampaignsAsync, logMarketingScanAsync } from '@/lib/adminDb';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const campaigns = await readCampaignsAsync();
    const cleanSlug = slug.toLowerCase().trim();
    const campaign = campaigns.find(c => c.slug.toLowerCase() === cleanSlug || c.id.toLowerCase() === cleanSlug);

    let destination = '/';
    let campaignName = 'Saarthi Marketing Campaign';
    let campaignId = cleanSlug;

    if (campaign) {
      destination = campaign.destination;
      campaignName = campaign.name;
      campaignId = campaign.id;
    }

    // Extract client info
    let os = 'Mobile';
    let browser = 'Browser';
    let device = 'Mobile Device';
    let referer = 'QR Code';
    let language = 'en-US';

    try {
      const body = await req.json();
      if (body.os) os = body.os;
      if (body.browser) browser = body.browser;
      if (body.device) device = body.device;
      if (body.referer) referer = body.referer;
      if (body.language) language = body.language;
    } catch {
      // Ignored if empty body
    }

    // Log the scan event into Supabase DB synchronously
    await logMarketingScanAsync({
      campaignId: campaignId,
      campaignSlug: campaign?.slug || cleanSlug,
      device,
      browser,
      os,
      language,
      referer,
    });

    return NextResponse.json({
      success: true,
      destination,
      campaignName,
      campaignId,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      destination: '/',
      campaignName: 'Saarthi',
    });
  }
}
