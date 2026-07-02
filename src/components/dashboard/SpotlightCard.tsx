'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, MapPin, CloudSun, Calendar, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import { motion } from 'framer-motion';

export default function SpotlightCard() {
  const [spotlight, setSpotlight] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userLocation } = useTrip();
  const router = useRouter();

  useEffect(() => {
    const url = '/api/spotlight';
    const fetchSpotlight = async () => {
      let url = '/api/spotlight';
      if (userLocation) {
        url += `?lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }
      
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.spotlight) {
          setSpotlight(data.spotlight);
        }
      } catch (err) {
        console.error('Failed to fetch Spotlight:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlight();
    const interval = setInterval(fetchSpotlight, 10000);

    return () => clearInterval(interval);
  }, [userLocation]);

  if (loading || !spotlight) {
    return (
      <div className="bg-gray-100 rounded-2xl h-40 animate-pulse flex items-center justify-center border border-gray-200">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      </div>
    );
  }

  // Theme configuration based on color returned by API
  const themes: Record<string, any> = {
    red: {
      bg: 'bg-red-500',
      gradient: 'from-red-600 to-red-500',
      text: 'text-white',
      subText: 'text-red-100',
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      btn: 'bg-white text-red-600 hover:bg-red-50'
    },
    orange: {
      bg: 'bg-orange-500',
      gradient: 'from-orange-500 to-amber-500',
      text: 'text-white',
      subText: 'text-orange-50',
      icon: <Calendar className="w-6 h-6 text-white" />,
      btn: 'bg-white text-orange-600 hover:bg-orange-50'
    },
    sky: {
      bg: 'bg-sky-500',
      gradient: 'from-sky-500 to-blue-500',
      text: 'text-white',
      subText: 'text-sky-100',
      icon: <CloudSun className="w-6 h-6 text-white" />,
      btn: 'bg-white text-sky-600 hover:bg-sky-50'
    },
    emerald: {
      bg: 'bg-emerald-500',
      gradient: 'from-emerald-600 to-emerald-500',
      text: 'text-white',
      subText: 'text-emerald-100',
      icon: <MapPin className="w-6 h-6 text-white" />,
      btn: 'bg-white text-emerald-600 hover:bg-emerald-50'
    },
    indigo: {
      bg: 'bg-indigo-600',
      gradient: 'from-indigo-600 to-violet-600',
      text: 'text-white',
      subText: 'text-indigo-100',
      icon: <BookOpen className="w-6 h-6 text-white" />,
      btn: 'bg-white text-indigo-600 hover:bg-indigo-50'
    },
    purple: {
      bg: 'bg-purple-600',
      gradient: 'from-purple-600 to-fuchsia-600',
      text: 'text-white',
      subText: 'text-purple-100',
      icon: <Sparkles className="w-6 h-6 text-white" />,
      btn: 'bg-white text-purple-600 hover:bg-purple-50'
    }
  };

  const theme = themes[spotlight.color] || themes.indigo;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br ${theme.gradient} text-white p-6 cursor-pointer transform transition-transform hover:scale-[1.01]`}
      onClick={() => router.push(spotlight.actionLink)}
    >
      <div className="absolute top-0 right-0 p-4 opacity-20">
        {theme.icon}
      </div>

      <div className="relative z-10">
        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm border border-white/10">
          {spotlight.type.replace('_', ' ')}
        </div>
        
        <h3 className="text-2xl font-black tracking-tight leading-tight mb-1">
          {spotlight.title}
        </h3>
        
        <p className={`text-lg font-semibold ${theme.subText} mb-2`}>
          {spotlight.subtitle}
        </p>
        
        <p className={`text-sm ${theme.subText} opacity-90 mb-5 max-w-[85%]`}>
          {spotlight.description}
        </p>

        <button className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors ${theme.btn}`}>
          {spotlight.actionText} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
