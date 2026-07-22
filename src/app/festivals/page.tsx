'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, CalendarHeart, Info, Loader2, Users, MapPin, Shirt, Search, Sparkles, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

import { safeFetchJson } from '@/lib/safeFetch';
import { FESTIVALS_2026 } from '@/data/festivals';

const COLORS = ['#D97706', '#8B5CF6', '#059669', '#10B981', '#3B82F6', '#EF4444', '#EC4899'];
const BGS = ['#FEF3C7', '#EDE9FE', '#ECFDF5', '#E0F2FE', '#EFF6FF', '#FEF2F2', '#FCE7F3'];

const MONTH_FILTERS = [
  { label: 'All 2026 Festivals', value: 'all' },
  { label: 'Jan 2026', value: '2026-01' },
  { label: 'Feb 2026', value: '2026-02' },
  { label: 'Mar 2026', value: '2026-03' },
  { label: 'Apr 2026', value: '2026-04' },
  { label: 'May 2026', value: '2026-05' },
  { label: 'Jun 2026', value: '2026-06' },
  { label: 'Jul 2026', value: '2026-07' },
  { label: 'Aug 2026', value: '2026-08' },
  { label: 'Sep 2026', value: '2026-09' },
  { label: 'Oct 2026', value: '2026-10' },
  { label: 'Nov 2026', value: '2026-11' },
  { label: 'Dec 2026', value: '2026-12' },
];

export default function FestivalsPage() {
  const router = useRouter();
  const [rawFestivals, setRawFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMonth, setActiveMonth] = useState('all');

  useEffect(() => {
    setLoading(true);
    safeFetchJson<any>('/api/v1/festivals?all=1')
      .then(d => {
        if (d && Array.isArray(d.data) && d.data.length > 0) {
          setRawFestivals(d.data);
        } else {
          setRawFestivals(FESTIVALS_2026);
        }
      })
      .catch((err) => {
        console.error('Fetch error, fallback to local dataset:', err);
        setRawFestivals(FESTIVALS_2026);
      })
      .finally(() => setLoading(false));
  }, []);

  const festivals = useMemo(() => {
    const dataset = rawFestivals.length > 0 ? rawFestivals : FESTIVALS_2026;
    return dataset.map((f: any) => ({
      ...f,
      id: f.id || f.slug || f.name?.toLowerCase().replace(/\s+/g, '-'),
      name: f.name || f.title || 'Festival',
      date: (f.date || f.date_start || '').split('T')[0],
      location: f.location || f.place_name || 'Tirupati Temple',
      recommendedTime: f.recommendedTime || f.recommended_time || '5:30 PM - 9:00 PM',
      dressCode: f.dressCode || f.dress_code || 'Traditional',
      expectedCrowd: f.expectedCrowd || f.crowd_level || f.crowdPrediction || 'Moderate',
      placeId: f.placeId || f.place_id || 'kapila-theertham',
      specialTips: f.specialTips || f.special_tips || f.description || ''
    }));
  }, [rawFestivals]);

  const filteredFestivals = useMemo(() => {
    return festivals.filter(f => {
      const matchSearch = searchQuery.trim() === '' || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.specialTips && f.specialTips.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchMonth = activeMonth === 'all' || f.date.startsWith(activeMonth);

      return matchSearch && matchMonth;
    });
  }, [festivals, searchQuery, activeMonth]);

  const fmtDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {}
    return dateStr;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F5', paddingBottom: 60, fontFamily: 'var(--font-sans)' }}>
      {/* Top Header */}
      <div style={{
        padding: '16px 20px',
        background: '#FFFFFF',
        borderBottom: '1px solid #F1F5F9',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => router.back()} 
            style={{ 
              border: 'none', 
              background: '#F8FAFC', 
              borderRadius: '12px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={22} color="#0F172A" />
          </button>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A' }}>
              2026 Tirupati Festival Calendar
            </h1>
            <p style={{ fontSize: 12, margin: '2px 0 0', color: '#64748B', fontWeight: 500 }}>
              Live schedules & recommended temple visits
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginTop: 14, position: 'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search festival, temple, or ritual (e.g. Onam, ISKCON)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Month Filter Chips */}
        <div style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingTop: 12,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {MONTH_FILTERS.map(m => {
            const active = activeMonth === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setActiveMonth(m.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: active ? '1px solid #D97706' : '1px solid #E2E8F0',
                  background: active ? '#D97706' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  fontSize: '12px',
                  fontWeight: active ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body Container */}
      <div style={{ padding: '16px 20px' }}>
        {/* Info Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', 
          borderRadius: 16, 
          padding: '14px 16px', 
          display: 'flex', 
          gap: 12, 
          marginBottom: 20, 
          border: '1px solid #FDE68A',
          boxShadow: '0 2px 6px rgba(217, 119, 6, 0.05)'
        }}>
          <Sparkles size={22} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: 13, color: '#92400E', lineHeight: 1.5, fontWeight: 500 }}>
            Every festival is mapped to its primary recommended shrine in Tirupati with crowd advisories & recommended timings.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Loader2 size={32} color="#D97706" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748B', fontSize: 14, marginTop: 12, fontWeight: 500 }}>Loading 2026 festivals...</p>
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'white', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'inline-flex', padding: 16, backgroundColor: '#F8FAFC', borderRadius: '50%', marginBottom: 16 }}>
              <CalendarHeart size={32} color="#94A3B8" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#1E293B' }}>No Festivals Found</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>Try clearing your search query or selecting a different month filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
              {filteredFestivals.map((fest, index) => {
                const color = COLORS[index % COLORS.length];
                const bg = BGS[index % BGS.length];

                return (
                  <motion.div
                    key={fest.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    style={{
                      background: 'white', 
                      borderRadius: 20, 
                      padding: 18,
                      boxShadow: '0 3px 12px rgba(0,0,0,0.03)',
                      borderLeft: `6px solid ${color}`,
                      borderTop: '1px solid #F1F5F9',
                      borderRight: '1px solid #F1F5F9',
                      borderBottom: '1px solid #F1F5F9'
                    }}
                  >
                    {/* Header line: Festival name & date badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CalendarHeart size={18} color={color} />
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                              {fest.name}
                            </h3>
                            <span style={{ fontSize: 12, color: color, fontWeight: 700, marginTop: 2, display: 'block' }}>
                              {fmtDate(fest.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        color: '#92400E', 
                        background: '#FEF3C7',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        whiteSpace: 'nowrap'
                      }}>
                        {fest.expectedCrowd} Crowd
                      </span>
                    </div>

                    {/* Special tips / description */}
                    {fest.specialTips && (
                      <p style={{ margin: '10px 0', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                        {fest.specialTips}
                      </p>
                    )}

                    {/* Meta Info Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="#64748B" /> {fest.recommendedTime}
                      </span>

                      {fest.location && (
                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: '#EFF6FF', border: '1px solid #DBEAFE', color: '#1E40AF', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="#2563EB" /> {fest.location}
                        </span>
                      )}

                      {fest.dressCode && (
                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 10, background: '#F3F0FF', border: '1px solid #DDD6FE', color: '#6D28D9', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Shirt size={12} color="#7C3AED" /> {fest.dressCode}
                        </span>
                      )}
                    </div>

                    {/* Recommended Temple Action Row */}
                    {fest.placeId && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14, paddingTop: 10, borderTop: '1px dashed #F1F5F9' }}>
                        <Link 
                          href={`/place/${fest.placeId}`}
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#059669',
                            background: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            borderRadius: '10px',
                            padding: '6px 14px',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            boxShadow: '0 1px 2px rgba(5, 150, 105, 0.05)'
                          }}
                        >
                          Recommended Temple &rarr;
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
