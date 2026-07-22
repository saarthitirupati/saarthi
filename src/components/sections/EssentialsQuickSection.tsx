import React from 'react';
import Link from 'next/link';
import { Shirt, BaggageClaim, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ReactNode> = {
  shirt: <Shirt size={24} className="text-emerald-600" />,
  baggage: <BaggageClaim size={24} className="text-emerald-600" />,
  default: <Info size={24} className="text-emerald-600" />
};

export default function EssentialsQuickSection({ section }: { section: any }) {
  if (!section.items || section.items.length === 0) return null;

  return (
    <section className="my-8 px-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-outfit">{section.title}</h2>
          {section.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
          )}
        </div>
        <Link href="/essentials" className="text-emerald-600 text-sm font-medium">
          See All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {section.items.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href="/essentials" className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border border-emerald-100/50 hover:bg-emerald-100 transition-colors">
              <div className="bg-white p-3 rounded-xl shadow-sm">
                {iconMap[item.icon] || iconMap.default}
              </div>
              <span className="font-medium text-emerald-950 text-sm">{item.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
