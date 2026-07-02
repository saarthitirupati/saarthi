'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DarshanTimingsCard() {
  const [status, setStatus] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/admin/status')
        .then(res => res.json())
        .then(data => {
          setStatus(data);
          setLastUpdated('Just now');
        })
        .catch(err => console.error(err));
    };

    fetchStatus();
    
    const timer = setInterval(() => {
      setLastUpdated(prev => {
        if (prev === 'Just now') return '1 min ago';
        const match = prev.match(/(\d+)/);
        if (match) {
          const mins = parseInt(match[1], 10);
          return `${mins + 1} mins ago`;
        }
        return prev;
      });
    }, 60000);

    import('@/lib/supabase').then(({ supabase }) => {
      const channelName = `public:tirumala_status_${Math.random().toString(36).substring(7)}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'tirumala_status', filter: 'id=eq.1' },
          () => {
            fetchStatus();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
        clearInterval(timer);
      };
    });
  }, []);

  if (!status) return (
    <div className="bg-white rounded-3xl shadow-sm p-6 space-y-4 animate-pulse border border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-16 bg-gray-100 rounded-2xl"></div>
      <div className="space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-50 rounded-2xl border border-gray-100"></div>)}
      </div>
    </div>
  );

  const parseWaitHours = (timeStr: string) => {
    if (!timeStr) return 99;
    const match = timeStr.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
    return 99;
  };

  const getStatusStyle = (hours: number, isAvailability: boolean = false) => {
    if (isAvailability) return { color: 'text-emerald-600', dot: 'bg-emerald-500' };
    if (hours <= 2) return { color: 'text-emerald-600', dot: 'bg-emerald-500' };
    if (hours <= 5) return { color: 'text-amber-500', dot: 'bg-amber-400' };
    if (hours <= 10) return { color: 'text-orange-500', dot: 'bg-orange-400' };
    return { color: 'text-rose-600', dot: 'bg-rose-500' };
  };

  const darshans = status?.darshans || [];

  return (
    <div className="flex flex-col gap-4">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>🛕</span> Darshan Timings
          </h2>
          <p className="text-gray-500 text-[13px] font-medium mt-1">
            Today&apos;s estimated waiting times
          </p>
        </div>
        <Link href="/live" className="text-indigo-600 text-[13px] font-bold tracking-tight hover:text-indigo-700 transition-colors">
          View All &rarr;
        </Link>
      </div>

      {status.notice && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-2xl text-sm font-semibold flex gap-2">
          <span>🔔</span> {status.notice}
        </div>
      )}

      {/* CARDS LIST */}
      <div className="space-y-4 relative">
        {darshans.map((d: any, idx: number) => {
          let emoji = '💰';
          if (d.name.includes('300') || d.name.toLowerCase().includes('special')) emoji = '🎫';
          else if (d.name.toLowerCase().includes('footpath') || d.name.toLowerCase().includes('divya')) emoji = '🥾';
          else if (d.name.toLowerCase().includes('vip') || d.name.toLowerCase().includes('srivani')) emoji = '✨';

          const hours = parseWaitHours(d.waitTime);
          const isAvailability = d.name.toLowerCase().includes('slot') || d.name.toLowerCase().includes('token');
          const style = getStatusStyle(hours, isAvailability);

          const mapNameToId = (name: string): string => {
            const lower = name.toLowerCase();
            if (lower.includes('sarva')) return 'sarva-darshan';
            if (lower.includes('300') || lower.includes('special')) return 'special-entry';
            if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
            if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
            return 'sarva-darshan';
          };
          const darshanId = mapNameToId(d.name);

          return (
            <Link key={idx} href={`/darshan/${darshanId}`} className="block">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-4 rounded-[20px] border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer"
              >
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl drop-shadow-sm group-hover:scale-110 transition-transform">{emoji}</span>
                    <h3 className="font-extrabold text-gray-900 text-[15px] leading-tight tracking-tight">{d.name.split(' (')[0]}</h3>
                  </div>
                  <p className="text-gray-500 text-xs font-semibold tracking-wide ml-[32px]">
                    {d.name.includes('(') ? d.name.substring(d.name.indexOf('(') + 1, d.name.indexOf(')')) : d.peakHours || 'Estimated Wait'}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${style.dot} shadow-sm`} />
                    <span className={`text-xl font-black tracking-tight ${style.color}`}>{d.waitTime}</span>
                  </div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{isAvailability ? 'Booking Status' : 'Estimated Wait'}</p>
                </div>
              </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">
        Updated {lastUpdated}
      </div>

    </div>
  );
}
