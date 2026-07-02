import React from 'react';
import { MapPin, Route, Wallet, Clock, Camera } from 'lucide-react';

export default function PersonalStatistics() {
  const stats = [
    { label: 'Places Visited', value: '32', icon: MapPin, color: 'text-orange-500' },
    { label: 'Distance Explored', value: '245 km', icon: Route, color: 'text-green-500' },
    { label: 'Money Saved', value: '₹4,200', icon: Wallet, color: 'text-emerald-500' },
    { label: 'Trips Planned', value: '12', icon: Clock, color: 'text-purple-500' },
    { label: 'Photos Captured', value: '146', icon: Camera, color: 'text-blue-500' },
  ];

  return (
    <div className="bg-[#1a1b2e] text-white rounded-2xl p-6 shadow-xl my-6">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">Your Travel Stats</h2>

      <div className="space-y-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-gray-300 font-medium">{stat.label}</span>
            </div>
            <span className="font-bold text-lg">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
