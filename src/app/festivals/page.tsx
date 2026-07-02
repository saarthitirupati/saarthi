'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, CalendarHeart, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const FESTIVALS = [
  {
    id: 1,
    title: 'Srivari Salakatla Brahmotsavams',
    date: 'Sep 26 - Oct 4, 2026',
    desc: 'The most important annual festival at Tirumala. The deity is processed in different vahanas (vehicles) each day, drawing millions of pilgrims.',
    color: '#EC4899',
    bg: '#FCE7F3'
  },
  {
    id: 2,
    title: 'Vaikunta Ekadasi',
    date: 'Dec 19, 2026',
    desc: 'The Vaikunta Dwaram is opened on this day. It is believed that passing through the Dwaram brings salvation.',
    color: '#8B5CF6',
    bg: '#EDE9FE'
  },
  {
    id: 3,
    title: 'Rathasapthami',
    date: 'Feb 12, 2027',
    desc: 'Also known as Surya Jayanthi, the Lord is taken on seven different vahanas around the temple streets in a single day.',
    color: '#F59E0B',
    bg: '#FEF3C7'
  }
];

export default function FestivalsPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F5', paddingBottom: 40, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <ChevronLeft size={28} color="#1F2937" />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1F2937' }}>Temple Festivals</h1>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 16, display: 'flex', gap: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <Info size={24} color="#3B82F6" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
            Tirumala celebrates over 433 festivals in a year (Nitya Kalyanam, Pachatoranam). Here are the major upcoming events.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FESTIVALS.map((fest, index) => (
            <motion.div 
              key={fest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ background: 'white', borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', borderLeft: `6px solid ${fest.color}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: fest.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarHeart size={20} color={fest.color} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1F2937' }}>{fest.title}</h3>
                  <span style={{ fontSize: 14, color: fest.color, fontWeight: 600 }}>{fest.date}</span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>{fest.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
