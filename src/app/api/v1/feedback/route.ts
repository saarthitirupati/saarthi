import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

export interface FeedbackRecord {
  id: string;
  placeId: string;
  placeName: string;
  isPositive: boolean;
  comment: string;
  createdAt: string;
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLocalFeedback(): FeedbackRecord[] {
  ensureDir();
  if (!fs.existsSync(FEEDBACK_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf-8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocalFeedback(feedback: FeedbackRecord[]): void {
  try {
    ensureDir();
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
  } catch {}
}

const deletedFeedbackIds = new Set<string>();

export async function GET() {
  try {
    const placesMap = new Map(PLACES.map(p => [p.id, p.name]));
    let dbFormatted: FeedbackRecord[] = [];

    // 1. Query Supabase feedback table
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

    // 2. Read local file storage
    const localRecords = readLocalFeedback();

    // 3. Merge records
    const mergedMap = new Map<string, FeedbackRecord>();
    for (const item of [...dbFormatted, ...localRecords]) {
      const sid = String(item.id);
      if (item && !deletedFeedbackIds.has(sid) && !mergedMap.has(sid)) {
        mergedMap.set(sid, item);
      }
    }

    const result = Array.from(mergedMap.values());
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      }
    });
  } catch (err: any) {
    console.error('Failed to fetch feedback:', err);
    return NextResponse.json(readLocalFeedback().filter(f => !deletedFeedbackIds.has(String(f.id))), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      }
    });
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

    // Save to local file storage
    const local = readLocalFeedback();
    local.unshift(newItem);
    writeLocalFeedback(local);

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

    // Remove from local file storage
    const local = readLocalFeedback().filter(f => String(f.id) !== sid);
    writeLocalFeedback(local);

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
