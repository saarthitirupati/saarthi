'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Bus, CarFront,  Users, ThermometerSun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveDashboard() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/live-status')
        .then(res => res.json())
        .then(data => setStatus(data))
        .catch(err => console.error(err));
    };

    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 10000); // 10 seconds polling

    return () => clearInterval(interval);
  }, []);

  if (!status) return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-sm p-8 text-center animate-pulse border border-white/50">
      <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-6"></div>
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-5 space-y-5">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <MapPin className="w-5 h-5 text-teal-600" fill="currentColor" fillOpacity={0.2} />
          {status.location}
        </h2>
        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          LIVE
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Crowd */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-100/50 shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest opacity-80">Crowd</span>
            <Users className="w-4 h-4 text-emerald-600 opacity-60" />
          </div>
          <div>
            <div className={`text-2xl font-black tracking-tight ${status.crowd.status === 'Extreme' || status.crowd.status === 'High' ? 'text-red-600' : 'text-emerald-900'}`}>
              {status.crowd.status}
            </div>
            <span className="text-xs text-emerald-700 font-medium">Wait: {status.crowd.waitMinutes}m</span>
          </div>
        </motion.div>

        {/* Weather */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-sky-50 to-sky-100/50 p-4 rounded-2xl border border-sky-100/50 shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-sky-800 font-bold uppercase tracking-widest opacity-80">Weather</span>
            <ThermometerSun className="w-4 h-4 text-sky-600 opacity-60" />
          </div>
          <div>
            <div className="text-3xl font-black text-sky-900 tracking-tighter">
              {status.weather.temperatureCelsius}°
            </div>
            <span className="text-xs text-sky-700 font-medium">{status.weather.condition}</span>
          </div>
        </motion.div>

        {/* Transit */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-100/50 shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-amber-800 font-bold uppercase tracking-widest opacity-80">Next Bus</span>
            <Bus className="w-4 h-4 text-amber-600 opacity-60" />
          </div>
          <div>
            <div className="text-3xl font-black text-amber-900 tracking-tighter">
              {status.transit.nextRtcBusMinutes} <span className="text-base font-bold text-amber-700/60 tracking-normal">m</span>
            </div>
            <span className="text-xs text-amber-700 font-medium">To Tirumala</span>
          </div>
        </motion.div>

        {/* Parking */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-2xl border border-indigo-100/50 shadow-sm flex flex-col justify-between h-28"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-widest opacity-80">Parking</span>
            <CarFront className="w-4 h-4 text-indigo-600 opacity-60" />
          </div>
          <div>
            <div className="text-xl font-black text-indigo-900 tracking-tight leading-tight">
              {status.parking.status}
            </div>
            <span className="text-xs text-indigo-700 font-medium mt-1 block truncate w-full">{status.parking.location}</span>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
