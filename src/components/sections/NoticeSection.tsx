import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function NoticeSection({ section }: { section: any }) {
  if (!section.items || section.items.length === 0) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'error': return <AlertCircle size={16} className="text-rose-600" />;
      case 'alert': return <Info size={16} className="text-blue-600" />;
      default: return <Info size={16} className="text-slate-600" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'error': return 'bg-rose-50 border-rose-200 text-rose-900';
      case 'alert': return 'bg-blue-50 border-blue-200 text-blue-900';
      default: return 'bg-slate-50 border-slate-200 text-slate-900';
    }
  };

  return (
    <div className="px-4 mt-6 flex flex-col gap-2">
      {section.items.map((item: any, idx: number) => (
        <div 
          key={item.id || idx} 
          className={`flex items-start gap-3 p-3 rounded-xl border ${getStyles(item.type)}`}
        >
          <div className="mt-0.5 shrink-0">
            {renderIcon(item.type)}
          </div>
          <span className="text-sm font-medium leading-tight">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
