'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, CalendarHeart, Info, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const COLORS = ['#EC4899', '#8B5CF6', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
const BGS = ['#FCE7F3', '#EDE9FE', '#FEF3C7', '#ECFDF5', '#EFF6FF', '#FEF2F2'];

export default function FestivalsPage() {
  const router = useRouter();
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/festivals')
      .then(r => r.json())
      .then(d => {
        console.log('Festivals fetched:', d);
        setFestivals(d.festivals || []);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d: string) => {
    try { return new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Loader2 size={28} color="#FF9933" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#999', fontSize: 14, marginTop: 12 }}>Loading festivals...</p>
          </div>
        ) : festivals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'white', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'inline-flex', padding: 16, backgroundColor: '#F3F4F6', borderRadius: '50%', marginBottom: 16 }}>
              <CalendarHeart size={32} color="#9CA3AF" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#374151' }}>No Upcoming Festivals</h3>
            <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>There are no temple events scheduled for the coming weeks. Check back later!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {festivals.map((fest, index) => {
              const color = COLORS[index % COLORS.length];
              const bg = BGS[index % BGS.length];
              const dateStr = fest.date
                ? `${fmt(fest.date)}${fest.dateEnd ? ` — ${fmt(fest.dateEnd)}` : ''}`
                : fest.dateStart
                  ? `${fmt(fest.dateStart)}${fest.dateEnd ? ` — ${fmt(fest.dateEnd)}` : ''}`
                  : '';

              const rawCrowd = String(fest.crowdPrediction || fest.crowd_level || fest.expectedCrowd || '');
              const crowdLevel = rawCrowd ? rawCrowd.charAt(0).toUpperCase() + rawCrowd.slice(1).toLowerCase() : '';

              return (
                <Link href={`/festivals/${fest.slug || fest.id}`} key={fest.id} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    style={{
                      background: 'white', borderRadius: 20, padding: 20,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                      borderLeft: `6px solid ${color}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarHeart size={20} color={color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1F2937' }}>{fest.name || fest.title}</h3>
                        {dateStr && <span style={{ fontSize: 14, color, fontWeight: 600 }}>{dateStr}</span>}
                      </div>
                    </div>
                    {fest.description && (
                      <p style={{ margin: '0 0 10px', fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>{fest.description}</p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {crowdLevel && (
                        <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 12, background: '#FEF3C7', color: '#92400E', fontWeight: 600 }}>
                          👥 {crowdLevel}
                        </span>
                      )}
                      {fest.location && (
                        <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 12, background: '#EFF6FF', color: '#1E40AF', fontWeight: 600 }}>
                          📍 {fest.location}
                        </span>
                      )}
                      {(fest.dressCode || fest.dress_code) && (
                        <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 12, background: '#F3F0FF', color: '#6C63FF', fontWeight: 600 }}>
                          👕 {fest.dressCode || fest.dress_code}
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
