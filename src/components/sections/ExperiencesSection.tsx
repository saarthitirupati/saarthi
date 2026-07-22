import React from 'react';
import { Landmark, Leaf, Book, Waves } from 'lucide-react';

export default function ExperiencesSection({ section }: { section: any }) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'landmark': return <Landmark size={24} className="text-rose-500" />;
      case 'leaf': return <Leaf size={24} className="text-emerald-500" />;
      case 'book': return <Book size={24} className="text-amber-600" />;
      case 'waves': return <Waves size={24} className="text-cyan-500" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-10">
      {section.title && (
        <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>
      )}
      <div className="grid grid-cols-4 gap-2">
        {section.items?.map((item: any, idx: number) => (
          <div key={item.id || idx} className="flex flex-col items-center gap-2">
            <button className="w-16 h-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center active:scale-95 transition-transform">
              {renderIcon(item.icon)}
            </button>
            <span className="text-xs font-medium text-slate-600 text-center">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
