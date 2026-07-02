import React from 'react';
import { Flame, Leaf, Landmark, Camera, Utensils, MapPin } from 'lucide-react';

export default function ExplorerPassport() {
  const stats = [
    { label: 'Temples', current: 18, total: 40, icon: Flame, color: 'text-amber-500', bg: 'bg-amber-100', fill: 'bg-amber-500' },
    { label: 'Nature', current: 5, total: 20, icon: Leaf, color: 'text-green-500', bg: 'bg-green-100', fill: 'bg-green-500' },
    { label: 'Heritage', current: 9, total: 15, icon: Landmark, color: 'text-indigo-500', bg: 'bg-indigo-100', fill: 'bg-indigo-500' },
    { label: 'Photography', current: 9, total: 15, icon: Camera, color: 'text-purple-500', bg: 'bg-purple-100', fill: 'bg-purple-500' },
    { label: 'Food', current: 12, total: 30, icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100', fill: 'bg-orange-500' },
    { label: 'Hidden Gems', current: 4, total: 18, icon: MapPin, color: 'text-teal-500', bg: 'bg-teal-100', fill: 'bg-teal-500' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 my-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Explorer Passport</h3>
      
      <div className="space-y-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">{stat.label}</span>
                <span className="text-sm font-bold text-gray-900">{stat.current} / {stat.total}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${stat.fill}`} 
                  style={{ width: `${(stat.current / stat.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
