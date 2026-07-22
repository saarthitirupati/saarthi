import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';

// In-memory feedback store fallback
let inMemoryFeedback: any[] = [
  { id: 'fb-1', placeId: 'govindaraja', placeName: 'Sri Govindaraja Swamy Temple', isPositive: true, comment: 'Locker counters were super fast and clean. Thanks Saarthi!', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { id: 'fb-2', placeId: 'kapila-theertham', placeName: 'Kapila Theertham', isPositive: true, comment: 'Great recommendation during rainy weather.', createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString() },
  { id: 'fb-3', placeId: 'annaprasadam', placeName: 'Matrusri Annaprasadam Complex', isPositive: true, comment: 'Free meal timing guidance was 100% accurate.', createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'fb-4', placeId: 'chandragiri', placeName: 'Chandragiri Fort', isPositive: false, comment: 'Light show starts 30 mins later in winter schedule.', createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { id: 'fb-5', placeId: 'srinivasam', placeName: 'Srinivasam SSD Counter', isPositive: true, comment: 'SSD token availability status saved me 4 hours of waiting.', createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString() }
];

export async function GET() {
  try {
    const placesMap = new Map(PLACES.map(p => [p.id, p.name]));
    
    // Flat query to avoid foreign key join failures
    const { data: dbData, error } = await supabase
      .from('feedback')
      .select('id, place_id, is_positive, comment, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && dbData && dbData.length > 0) {
      const formatted = dbData.map((row: any) => {
        const pName = placesMap.get(row.place_id) || row.place_id || 'General Feedback';
        return {
          id: String(row.id),
          placeId: row.place_id,
          placeName: pName === 'general' ? 'General Feedback' : pName,
          isPositive: !!row.is_positive,
          comment: row.comment || '',
          createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : 'Recently'
        };
      });

      // Merge with in-memory feedback (newest first)
      const mergedMap = new Map();
      [...formatted, ...inMemoryFeedback].forEach(item => {
        if (!mergedMap.has(item.id)) mergedMap.set(item.id, item);
      });

      return NextResponse.json(Array.from(mergedMap.values()));
    }
  } catch (err) {
    console.error('Failed to fetch feedback from Supabase:', err);
  }

  return NextResponse.json(inMemoryFeedback);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { placeId, isHelpful, isPositive, comment } = body;
    const positiveVal = isPositive !== undefined ? isPositive : (isHelpful !== undefined ? isHelpful : true);
    const pid = placeId || 'general';

    const placesMap = new Map(PLACES.map(p => [p.id, p.name]));
    const pName = placesMap.get(pid) || pid || 'General Feedback';

    const newItem = {
      id: `fb-${Date.now()}`,
      placeId: pid,
      placeName: pName === 'general' ? 'General Feedback' : pName,
      isPositive: positiveVal,
      comment: comment || '',
      createdAt: new Date().toLocaleString()
    };

    // Store in memory
    inMemoryFeedback = [newItem, ...inMemoryFeedback];

    // Try Supabase insert
    try {
      await supabase.from('feedback').insert([{
        place_id: pid,
        is_positive: positiveVal,
        comment: comment || ''
      }]);
    } catch {}

    return NextResponse.json({
      success: true,
      data: newItem,
      message: 'Feedback submitted successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    inMemoryFeedback = inMemoryFeedback.filter(f => f.id !== id);

    try {
      await supabase.from('feedback').delete().eq('id', id);
    } catch {}

    return NextResponse.json({ success: true, message: 'Feedback entry deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
