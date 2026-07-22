import React from 'react';
import { BookOpen } from 'lucide-react';

export default function QuickGuidesSection({ section }: { section: any }) {
  return (
    <div className="px-4 mt-8 mb-4">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      <div className="grid grid-cols-2 gap-3">
        {section.items?.map((item: any, idx: number) => (
          <button 
            key={item.id || idx}
            className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 active:bg-indigo-100/50 transition-colors"
          >
            <BookOpen size={18} className="text-indigo-600 shrink-0" />
            <span className="text-sm font-semibold text-slate-800 text-left leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
