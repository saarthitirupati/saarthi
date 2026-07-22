import React from 'react';
import { MapPin, Sun, Clock } from 'lucide-react';

export default function ContextStripSection({ section }: { section: any }) {
  // We can dynamically map icons if needed, but for now we hardcode the ones provided in the api
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'pin': return <MapPin size={14} className="text-emerald-600" />;
      case 'sun': return <Sun size={14} className="text-amber-500" />;
      case 'clock': return <Clock size={14} className="text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-4">
      <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
        {section.items?.map((item: any, idx: number) => (
          <div key={item.id || idx} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm whitespace-nowrap shrink-0">
            {renderIcon(item.icon)}
            <span className="text-xs font-medium text-slate-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
