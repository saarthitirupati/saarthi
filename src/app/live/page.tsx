'use client';

import React from 'react';

import SpotlightCard from '@/components/dashboard/SpotlightCard';
import DarshanTimingsCard from '@/components/dashboard/DarshanTimingsCard';
import { ArrowLeft, BellRing } from 'lucide-react';
import Link from 'next/link';

export default function LivePage() {
  return (
    <main className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-5 pt-12 pb-4 shadow-sm sticky top-0 z-50 flex justify-between items-center">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <BellRing size={20} className="text-saffron-500" />
          Live Updates
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>
      
      <div className="p-5 max-w-lg mx-auto space-y-6">
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">Detailed Darshan Timings</h2>
          <DarshanTimingsCard />
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">Spotlight Engine</h2>
          <SpotlightCard />
        </section>
        
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">Active Alerts</h2>
          {/* We will just mock an alert here for the live screen */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
            <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
              <span className="text-xl">⚠️</span> Heavy Traffic on Alipiri Road
            </h3>
            <p className="text-orange-700 text-sm">
              High congestion detected. Expect delays of up to 20 minutes. Consider using alternate routes or starting your journey earlier.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
