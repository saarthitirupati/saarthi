import React from 'react';
import { Cross, Search, Shield, Users, Flame, AlertTriangle } from 'lucide-react';

export default function EmergencySection({ section }: { section: any }) {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'cross': return <Cross size={24} className="text-rose-500" />;
      case 'search': return <Search size={24} className="text-rose-500" />;
      case 'shield': return <Shield size={24} className="text-rose-500" />;
      case 'users': return <Users size={24} className="text-rose-500" />;
      case 'flame': return <Flame size={24} className="text-rose-500" />;
      case 'alert_triangle': return <AlertTriangle size={24} className="text-rose-500" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-8">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      <div className="grid grid-cols-3 gap-3">
        {section.items?.map((item: any, idx: number) => (
          <button 
            key={item.id || idx}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
              {renderIcon(item.icon)}
            </div>
            <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
