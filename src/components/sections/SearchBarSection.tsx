import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBarSection({ section }: { section: any }) {
  return (
    <div className="px-4 mt-4 mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder={section.placeholder || "Search places..."}
          className="w-full bg-white border border-gray-200 text-slate-800 text-sm rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
        />
      </div>
    </div>
  );
}
