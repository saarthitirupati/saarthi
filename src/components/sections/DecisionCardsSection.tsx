import React from 'react';
import { Clock, Users, Leaf, Wallet } from 'lucide-react';

export default function DecisionCardsSection({ section }: { section: any }) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'clock': return <Clock size={20} className="text-indigo-500" />;
      case 'users': return <Users size={20} className="text-emerald-500" />;
      case 'leaf': return <Leaf size={20} className="text-teal-500" />;
      case 'wallet': return <Wallet size={20} className="text-amber-500" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-8">
      {section.title && (
        <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>
      )}
      <div className="grid grid-cols-2 gap-3">
        {section.items?.map((item: any, idx: number) => (
          <button 
            key={item.id || idx}
            className="flex flex-col items-start p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              {renderIcon(item.icon)}
            </div>
            <span className="text-sm font-semibold text-slate-800 text-left leading-tight">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
