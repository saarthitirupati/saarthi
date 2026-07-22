import React from 'react';
import { Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveCardSection({ section }: { section: any }) {
  if (!section.items || section.items.length === 0) return null;

  const item = section.items[0]; // Usually just one live status card

  return (
    <section className="my-6 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-900 to-red-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={100} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h2 className="text-red-200 text-xs font-bold uppercase tracking-wider">{section.title}</h2>
              </div>
              <p className="text-white/80 text-sm">{section.subtitle}</p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <h3 className="text-white font-medium mb-1">{item.name}</h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight">{item.status}</span>
              <span className="text-red-200 text-sm mb-1 flex items-center gap-1">
                <Users size={14} /> {item.trend}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
