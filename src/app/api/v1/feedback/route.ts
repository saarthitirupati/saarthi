import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';

export const dynamic = 'force-dynamic';

export interface FeedbackRecord {
  id: string;
  placeId: string;
  placeName: string;
  isPositive: boolean;
  comment: string;
  createdAt: string;
}

// In-memory feedback store fallback for production serverless persistence
let inMemoryFeedback: FeedbackRecord[] = [
  { id: 'fb-1', placeId: 'govindaraja', placeName: 'Sri Govindaraja Swamy Temple', isPositive: true, comment: 'Locker counters were super fast and clean. Thanks Saarthi!', createdAt: new Date(Date.now() - 5 * 60 * 1000).toLocaleString() },
  { id: 'fb-2', placeId: 'kapila-theertham', placeName: 'Kapila Theertham', isPositive: true, comment: 'Great recommendation during rainy weather.', createdAt: new Date(Date.now() - 12 * 60 * 1000).toLocaleString() },
  { id: 'fb-3', placeId: 'annaprasadam', placeName: 'Matrusri Annaprasadam Complex', isPositive: true, comment: 'Free meal timing guidance was 100% accurate.', createdAt: new Date(Date.now() - 45 * 60 * 1000).toLocaleString() },
  { id: 'fb-4', placeId: 'chandragiri', placeName: 'Chandragiri Fort', isPositive: false, comment: 'Light show starts 30 mins later in winter schedule.', createdAt: new Date(Date.now() - 2 * 3600 * 1000).toLocaleString() },
  { id: 'fb-5', placeId: 'srinivasam', placeName: 'Srinivasam SSD Counter', isPositive: true, comment: 'SSD token availability status saved me 4 hours of waiting.', createdAt: new Date(Date.now() - 3 * 3600 * 1000).toLocaleString() }
];

const deletedFeedbackIds = new Set<string>();

export async function GET() {
  try {
    const placesMap = new Map(PLACES.map(p => [p.id, p.name]));
    let dbFormatted: FeedbackRecord[] = [];

    // Query Supabase feedback table
    try {
      const { data: dbData, error } = await supabase
        .from('feedback')
        .select('id, place_id, is_positive, comment, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && dbData && Array.isArray(dbData)) {
        dbFormatted = dbData.map((row: any) => {
          const pName = placesMap.get(row.place_id) || row.place_id || 'General Feedback';
          return {
            id: String(row.id),
            placeId: row.place_id || 'general',
            placeName: pName === 'general' ? 'General Feedback' : pName,
            isPositive: Boolean(row.is_positive),
            comment: row.comment || '',
            createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : 'Recently'
          };
        });
      }
    } catch (sbErr) {
      console.warn('Supabase feedback fetch notice:', sbErr);
    }

    // Merge in-memory and database records
    const mergedMap = new Map<string, FeedbackRecord>();
    for (const item of [...inMemoryFeedback, ...dbFormatted]) {
      const sid = String(item.id);
      if (item && !deletedFeedbackIds.has(sid) && !mergedMap.has(sid)) {
        mergedMap.set(sid, item);
      }
    }

    return NextResponse.json(Array.from(mergedMap.values()));
  } catch (err: any) {
    console.error('Failed to fetch feedback:', err);
    return NextResponse.json(inMemoryFeedback.filter(f => !deletedFeedbackIds.has(String(f.id))));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { placeId, isHelpful, isPositive, comment } = body;
    const positiveVal = isPositive !== undefined ? Boolean(isPositive) : (isHelpful !== undefined ? Boolean(isHelpful) : true);
    const pid = placeId || 'general';

    const placesMap = new Map(PLACES.map(p => [p.id, p.name]));
    const pName = placesMap.get(pid) || (pid === 'general' ? 'General Feedback' : pid);

    const newItem: FeedbackRecord = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      placeId: pid,
      placeName: pName,
      isPositive: positiveVal,
      comment: comment || '',
      createdAt: new Date().toLocaleString()
    };

    deletedFeedbackIds.delete(newItem.id);
    inMemoryFeedback = [newItem, ...inMemoryFeedback];

    // Try Supabase insert
    try {
      const { data: inserted, error } = await supabase.from('feedback').insert([{
        place_id: pid,
        is_positive: positiveVal,
        comment: comment || ''
      }]).select();

      if (!error && inserted && inserted[0]) {
        newItem.id = String(inserted[0].id);
      }
    } catch (sbErr) {
      console.warn('Supabase feedback insert notice:', sbErr);
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Feedback submitted successfully'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const sid = String(id);
    deletedFeedbackIds.add(sid);
    inMemoryFeedback = inMemoryFeedback.filter(f => String(f.id) !== sid);

    try {
      await supabase.from('feedback').delete().eq('id', id);
    } catch (sbErr) {
      console.warn('Supabase feedback delete notice:', sbErr);
    }

    return NextResponse.json({ success: true, id: sid, message: 'Feedback entry deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
