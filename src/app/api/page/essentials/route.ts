import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sections = [];

    // 1. Notice Section
    sections.push({
      id: 'today_notice',
      type: 'notice',
      priority: 1,
      items: [
        { id: 'n1', text: 'Locker closes at 8 PM', type: 'warning' },
        { id: 'n2', text: 'Heavy rain near Kapila', type: 'alert' },
        { id: 'n3', text: 'SSD closed today', type: 'error' }
      ]
    });

    // 2. Search Section
    sections.push({
      id: 'essentials_search',
      type: 'search_bar',
      priority: 2,
      placeholder: 'Need something? Phone, Dress, Locker...',
    });

    // 3. Common Mistakes
    sections.push({
      id: 'common_mistakes',
      type: 'common_mistakes',
      title: 'Common Mistakes',
      priority: 3,
      items: [
        { id: 'm1', text: "Don't carry phones.", icon: 'smartphone_off' },
        { id: 'm2', text: 'Wear traditional dress.', icon: 'shirt' },
        { id: 'm3', text: 'Avoid afternoon queue.', icon: 'clock' },
        { id: 'm4', text: 'Carry water.', icon: 'droplet' }
      ]
    });

    // 4. Journey Section (Before You Leave & During Journey combined or split)
    sections.push({
      id: 'before_you_leave',
      type: 'journey',
      title: 'Before You Leave',
      priority: 4,
      items: [
        { id: 'j1', name: 'Dress Code', icon: 'shirt' },
        { id: 'j2', name: 'Documents', icon: 'file_text' },
        { id: 'j3', name: 'Tickets', icon: 'ticket' },
        { id: 'j4', name: 'Darshan', icon: 'eye' }
      ]
    });

    sections.push({
      id: 'during_journey',
      type: 'journey',
      title: 'During Your Journey',
      priority: 5,
      items: [
        { id: 'j5', name: 'Parking', icon: 'parking' },
        { id: 'j6', name: 'RTC Buses', icon: 'bus' },
        { id: 'j7', name: 'Railway', icon: 'train' },
        { id: 'j8', name: 'Locker', icon: 'lock' },
        { id: 'j9', name: 'Restroom', icon: 'bath' },
        { id: 'j10', name: 'Drinking Water', icon: 'droplet' }
      ]
    });

    // 6. If Something Goes Wrong
    sections.push({
      id: 'emergency',
      type: 'emergency',
      title: 'If Something Goes Wrong',
      priority: 6,
      items: [
        { id: 'e1', name: 'Medical', icon: 'cross' },
        { id: 'e2', name: 'Lost & Found', icon: 'search' },
        { id: 'e3', name: 'Police', icon: 'shield' },
        { id: 'e4', name: 'Women Safety', icon: 'users' },
        { id: 'e5', name: 'Fire', icon: 'flame' },
        { id: 'e6', name: 'Emergency', icon: 'alert_triangle' }
      ]
    });

    // 7. Quick Guides
    sections.push({
      id: 'quick_guides',
      type: 'quick_guides',
      title: 'Quick Guides',
      priority: 7,
      items: [
        { id: 'q1', title: 'First Visit', type: 'guide' },
        { id: 'q2', title: 'Family', type: 'guide' },
        { id: 'q3', title: 'Senior Citizens', type: 'guide' },
        { id: 'q4', title: 'One Day', type: 'guide' },
        { id: 'q5', title: 'RTC', type: 'guide' },
        { id: 'q6', title: 'Walking Route', type: 'guide' }
      ]
    });

    // 8. Contacts
    sections.push({
      id: 'contacts',
      type: 'contacts',
      title: 'Important Contacts',
      priority: 8,
      items: [
        { id: 'c1', name: 'TTD Call Center', number: '1800 425 4141' },
        { id: 'c2', name: 'Police Helpline', number: '100' }
      ]
    });

    return NextResponse.json({
      version: "1.0",
      generatedAt: new Date().toISOString(),
      sections
    });
  } catch (error) {
    console.error("Error generating essentials page:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
