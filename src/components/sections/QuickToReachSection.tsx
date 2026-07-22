import React from 'react';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';

export default function QuickToReachSection({ section }: { section: any }) {
  return (
    <div className="mt-10">
      <div className="px-4 mb-4">
        {section.title && <h2 className="text-lg font-bold text-slate-800 leading-tight">{section.title}</h2>}
        {section.subtitle && <p className="text-sm text-slate-500">{section.subtitle}</p>}
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4">
        {section.items?.map((item: any, idx: number) => (
          <Link href={`/place/${item.slug}`} key={item.id || idx} className="shrink-0 w-48 flex flex-col gap-2">
            <div className="w-full h-32 bg-slate-200 rounded-2xl overflow-hidden relative">
              {item.heroImage && (
                <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm truncate">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <MapPin size={12} /> {item.distance} km
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock size={12} /> {item.travelTime} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
