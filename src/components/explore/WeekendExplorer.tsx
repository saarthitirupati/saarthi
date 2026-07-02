import React from 'react';
import { Wallet, Users, Camera, Tent, Flame, GraduationCap } from 'lucide-react';

export default function WeekendExplorer() {
  const categories = [
    { id: 'budget', label: 'Budget', sub: 'Under ₹500', icon: Wallet, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 'family', label: 'Family', sub: 'Kid Friendly', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'photo', label: 'Photography', sub: 'Best Spots', icon: Camera, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 'adventure', label: 'Adventure', sub: 'Thrill & Trek', icon: Tent, color: 'text-red-600', bg: 'bg-red-100' },
    { id: 'temple', label: 'Temple Trail', sub: 'Spiritual Journey', icon: Flame, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'student', label: 'Student Trip', sub: 'Friends & Fun', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Choose your vibe</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <button 
            key={cat.id} 
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-100 bg-white hover:border-purple-300 hover:shadow-md transition-all text-center"
          >
            <div className={`p-3 rounded-xl ${cat.bg} mb-3`}>
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
            </div>
            <span className="font-bold text-gray-800">{cat.label}</span>
            <span className="text-xs text-gray-500">{cat.sub}</span>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Top Pick for You</h3>
        <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10"></div>
          <img 
            src="/images/chandragiri-fort.jpg" 
            alt="Chandragiri Fort" 
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h4 className="text-white font-bold text-lg">Chandragiri Fort</h4>
            <p className="text-gray-300 text-sm">History • View • Sunset</p>
            <p className="text-white text-xs font-semibold mt-1">₹120 per person</p>
          </div>
        </div>
      </div>
    </div>
  );
}
