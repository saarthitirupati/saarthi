import React from 'react';
import { Ticket } from 'lucide-react';

interface SsdTokenAlertProps {
  section: {
    id: string;
    title: string;
    message: string;
    status: string; // OPEN, CLOSED, CROWDED
  };
}

const SsdTokenAlert: React.FC<SsdTokenAlertProps> = ({ section }) => {
  const getStatusConfig = () => {
    switch (section.status?.toUpperCase()) {
      case 'OPEN':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: 'text-green-600' };
      case 'CROWDED':
        return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', icon: 'text-orange-600' };
      case 'CLOSED':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: 'text-red-600' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: 'text-blue-600' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="px-5 py-3">
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.border} ${config.bg}`}>
        <div className={`mt-0.5 ${config.icon}`}>
          <Ticket size={20} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold text-[15px] ${config.text} leading-none tracking-tight font-outfit`}>
              SSD Tokens: {section.title}
            </h3>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/50 ${config.text}`}>
              {section.status}
            </span>
          </div>
          <p className={`text-sm ${config.text} opacity-90 leading-tight`}>
            {section.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SsdTokenAlert;
