import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAuthorizedAdmin } from '@/lib/authGuard';

const DEFAULT_FESTIVALS = [
  {
    id: 'fest-1',
    name: 'Srivari Salakatla Brahmotsavam',
    slug: 'srivari-brahmotsavam',
    festival_type: 'Major Temple Event',
    date: '2026-09-18',
    crowd_level: 'Extreme',
    status: 'Upcoming',
    description: 'The grandest 9-day annual festival at Tirumala with majestic Vahana Sevas (Garuda Seva, Rathotsavam).',
    dress_code: 'Strict Traditional Indian Attire',
    parking_status: 'Full at Tirumala (Use Alipiri Parking)',
    visitor_notes: 'Book SSD tokens or travel via footpath early. Heavy rush expected during Garuda Seva.'
  },
  {
    id: 'fest-2',
    name: 'Vaikunta Ekadasi & Dwadasi',
    slug: 'vaikunta-ekadasi',
    festival_type: 'Spiritual Peak',
    date: '2026-12-20',
    crowd_level: 'Extreme',
    status: 'Upcoming',
    description: 'Opening of the sacred Vaikunta Dwaram for 10 days. Millions of devotees queue for holy darshan.',
    dress_code: 'Traditional',
    parking_status: 'Strict Diversion at Alipiri',
    visitor_notes: 'Vaikunta Dwaram remains open for 10 consecutive days.'
  },
  {
    id: 'fest-3',
    name: 'Rathasapthami (Surya Jayanthi)',
    slug: 'rathasapthami',
    festival_type: 'One-Day Brahmotsavam',
    date: '2027-02-13',
    crowd_level: 'High',
    status: 'Upcoming',
    description: 'Lord Malayappa Swamy blesses devotees on 7 different Vahanams from sunrise to night.',
    dress_code: 'Traditional',
    parking_status: 'Moderate',
    visitor_notes: 'Starts with Suryaprabha Vahanam at 5:30 AM.'
  },
  {
    id: 'fest-4',
    name: 'Ugadi (Telugu New Year Asthanam)',
    slug: 'ugadi-asthanam',
    festival_type: 'Cultural & Religious',
    date: '2027-03-30',
    crowd_level: 'High',
    status: 'Upcoming',
    description: 'Special Panchanga Sravanam and Ugadi Asthanam conducted at Bangaru Vakili inside Srivari Temple.',
    dress_code: 'Traditional',
    parking_status: 'Available',
    visitor_notes: 'Ugadi Prasadam distribution at Annaprasadam Complex.'
  }
];

export async function GET() {
  try {
    const { data, error } = await supabase.from('festivals').select('*').order('date', { ascending: true });
    if (!error && data && data.length > 0) {
      return NextResponse.json({ festivals: data });
    }
  } catch (e: any) {
    console.error('Error fetching festivals:', e);
  }

  // Fallback to rich TTD festivals data
  return NextResponse.json({ festivals: DEFAULT_FESTIVALS });
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.slug) body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    const doc = {
      slug: body.slug,
      name: body.name,
      description: body.description || '',
      festival_type: body.festival_type || body.category || 'Spiritual',
      date: body.date || new Date().toISOString().split('T')[0],
      gravity_score: Number(body.gravity_score) || 5,
      crowd_level: body.crowd_level || body.expectedCrowd || 'Moderate',
      recommended_time: body.recommended_time || body.recommendedTime || '',
      dress_code: body.dress_code || body.dressCode || '',
      parking_status: body.parking_status || body.parking || 'Available',
      visitor_notes: body.visitor_notes || body.specialTips || '',
      is_major: body.is_major !== undefined ? !!body.is_major : true,
      image_url: body.image_url || body.coverImage || '',
      status: body.status || 'Upcoming'
    };

    const { data, error } = await supabase.from('festivals').insert([doc]).select();
    if (error) throw error;

    return NextResponse.json({ festival: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
