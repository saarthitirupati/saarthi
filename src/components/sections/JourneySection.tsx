import React from 'react';
import { Shirt, FileText, Ticket, Eye, CircleParking, Bus, Train, Lock, Bath, Droplet, ChevronRight } from 'lucide-react';

export default function JourneySection({ section }: { section: any }) {
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'shirt': return <Shirt size={18} className="text-emerald-600" />;
      case 'file_text': return <FileText size={18} className="text-emerald-600" />;
      case 'ticket': return <Ticket size={18} className="text-emerald-600" />;
      case 'eye': return <Eye size={18} className="text-emerald-600" />;
      case 'parking': return <CircleParking size={18} className="text-emerald-600" />;
      case 'bus': return <Bus size={18} className="text-emerald-600" />;
      case 'train': return <Train size={18} className="text-emerald-600" />;
      case 'lock': return <Lock size={18} className="text-emerald-600" />;
      case 'bath': return <Bath size={18} className="text-emerald-600" />;
      case 'droplet': return <Droplet size={18} className="text-emerald-600" />;
      default: return null;
    }
  };

  return (
    <div className="px-4 mt-8">
      {section.title && <h2 className="text-lg font-bold text-slate-800 mb-4">{section.title}</h2>}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {section.items?.map((item: any, idx: number) => (
          <button 
            key={item.id || idx}
            className={`w-full flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors ${
              idx !== section.items.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                {renderIcon(item.icon)}
              </div>
              <span className="font-semibold text-slate-700">{item.name}</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
