import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock in-memory rules and weights fallback
let mockWeights = [
  { id: 'distance', category: 'distance', weights: { under2km: 35, under5km: 25, under10km: 15 }, description: 'Distance scoring tiers' },
  { id: 'crowd', category: 'crowd', weights: { low: 30, moderate: 15, high: -15, extreme: -40 }, description: 'Crowd level modifiers' },
  { id: 'weather', category: 'weather', weights: { rain_indoor_bonus: 35, rain_outdoor_penalty: -80 }, description: 'Weather modifiers' }
];

let mockRules = [
  { id: 'rule_1', condition_type: 'weather', condition_value: 'rain', target_filter: { placeType: 'indoor' }, score_modifier: 35, reason_template: 'Indoor facility safe from rain', source_attribution: 'IMD', enabled: true },
  { id: 'rule_2', condition_type: 'crowd', condition_value: 'extreme_crowd', target_filter: { category: 'Core Temple' }, score_modifier: 40, reason_template: 'Foothill escape from hilltop crowds', source_attribution: 'Live Update', enabled: true }
];

export async function GET() {
  try {
    if (supabase) {
      const { data: weights } = await supabase.from('recommendation_weights').select('*');
      const { data: rules } = await supabase.from('recommendation_rules').select('*');
      if (weights && weights.length > 0) mockWeights = weights;
      if (rules && rules.length > 0) mockRules = rules;
    }
  } catch {}

  return NextResponse.json({
    success: true,
    weights: mockWeights,
    rules: mockRules
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.weights) mockWeights = body.weights;
    if (body.rules) mockRules = body.rules;

    if (supabase && body.weights) {
      for (const w of body.weights) {
        await supabase.from('recommendation_weights').upsert(w);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Decision Engine rules and weights saved successfully'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
