import React from 'react';
import { PhoneCall } from 'lucide-react';

export default function ContactsSection({ section }: { section: any }) {
  return (
    <div className="px-4 mt-8 mb-12">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      <div className="flex flex-col gap-3">
        {section.items?.map((item: any, idx: number) => (
          <div 
            key={item.id || idx}
            className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-bold text-slate-800">{item.name}</span>
              <span className="text-sm font-semibold text-emerald-600">{item.number}</span>
            </div>
            <a 
              href={`tel:${item.number.replace(/\s/g, '')}`}
              className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center active:scale-95 transition-transform"
            >
              <PhoneCall size={18} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
