import { NextResponse } from 'next/server';

// Temporary in-memory mock store
let mockDecisionCards = [
  { id: '1', title: 'I only have 2 hours', icon: 'Clock', query_params: { duration: '<120' }, priority: 10, enabled: true },
  { id: '2', title: "I'm with family", icon: 'Users', query_params: { tags: ['Family'] }, priority: 20, enabled: true },
  { id: '3', title: "It's raining", icon: 'CloudRain', query_params: { indoor: true }, priority: 30, enabled: true },
];

let mockExperiences = [
  { id: '1', title: 'Spiritual', icon: 'Heart', priority: 10, enabled: true },
  { id: '2', title: 'Nature', icon: 'TreePine', priority: 20, enabled: true },
  { id: '3', title: 'History', icon: 'Landmark', priority: 30, enabled: true },
];

export async function GET() {
  return NextResponse.json({
    decisionCards: mockDecisionCards,
    experiences: mockExperiences,
  });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const type = data.type; // 'decision_card' or 'experience'
    const payload = data.payload;
    payload.id = Date.now().toString();

    if (type === 'decision_card') {
      mockDecisionCards.push(payload);
    } else if (type === 'experience') {
      mockExperiences.push(payload);
    }

    return NextResponse.json({ success: true, item: payload });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const type = data.type;
    const payload = data.payload;

    if (type === 'decision_card') {
      mockDecisionCards = mockDecisionCards.map(c => c.id === payload.id ? { ...c, ...payload } : c);
    } else if (type === 'experience') {
      mockExperiences = mockExperiences.map(e => e.id === payload.id ? { ...e, ...payload } : e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (type === 'decision_card') {
      mockDecisionCards = mockDecisionCards.filter(c => c.id !== id);
    } else if (type === 'experience') {
      mockExperiences = mockExperiences.filter(e => e.id !== id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
