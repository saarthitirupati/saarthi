import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import Image from 'next/image';

export default function BestRightNowSection({ section }: { section: any }) {
  if (!section.items || section.items.length === 0) return null;

  return (
    <section className="my-8 px-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 font-outfit">{section.title}</h2>
        {section.subtitle && (
          <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
        {section.items.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="snap-start shrink-0 w-64 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
          >
            <Link href={`/place/${item.slug}`} className="block relative h-40 w-full bg-gray-100">
              {item.heroImage && (
                <Image
                  src={item.heroImage}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                Recommended
              </div>
            </Link>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.name}</h3>
              <div className="flex items-center text-xs text-gray-500 mb-3">
                <Clock size={12} className="mr-1" />
                <span>{item.travelTime} mins away</span>
              </div>
              <div className="mt-auto">
                {item.reasons && item.reasons.length > 0 && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block font-medium">
                    {item.reasons[0]}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
