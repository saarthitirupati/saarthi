import React from 'react';
import { Smartphone, Shirt, Clock, Droplet } from 'lucide-react';

export default function CommonMistakesSection({ section }: { section: any }) {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'smartphone_off': return <Smartphone size={20} className="text-rose-500" />;
      case 'shirt': return <Shirt size={20} className="text-indigo-500" />;
      case 'clock': return <Clock size={20} className="text-amber-500" />;
      case 'droplet': return <Droplet size={20} className="text-cyan-500" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-8">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      <div className="grid grid-cols-2 gap-3">
        {section.items?.map((item: any, idx: number) => (
          <div key={item.id || idx} className="flex flex-col gap-2 bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              {renderIcon(item.icon)}
            </div>
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
