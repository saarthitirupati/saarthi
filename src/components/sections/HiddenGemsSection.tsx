import React from 'react';
import Link from 'next/link';

export default function HiddenGemsSection({ section }: { section: any }) {
  return (
    <div className="px-4 mt-10 mb-8">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      
      <div className="flex flex-col gap-4">
        {section.items?.map((item: any, idx: number) => (
          <Link href={`/place/${item.slug}`} key={item.id || idx} className="flex gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform">
            <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden shrink-0">
              {item.heroImage && (
                <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {item.reasons?.map((r: string, i: number) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
