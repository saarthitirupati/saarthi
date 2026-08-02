'use client';

import React from 'react';
import PersonalStatistics from '@/components/journey/PersonalStatistics';
import ExplorerPassport from '@/components/journey/ExplorerPassport';
import JourneyTimeline from '@/components/journey/JourneyTimeline';
import { ArrowLeft, MapPin, Trophy, Target } from 'lucide-react';
import Link from 'next/link';

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-5 pt-12 pb-4 shadow-sm sticky top-0 z-50 flex justify-between items-center">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">My Journey</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>
      
      <div className="p-5 max-w-lg mx-auto">
        <PersonalStatistics />
        <ExplorerPassport />
        
        <section className="mt-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Target className="text-orange-500" size={20} />
            Local Challenges
          </h2>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-1 text-orange-600">Weekend Challenge</h3>
            <h4 className="font-bold text-gray-900 text-lg mb-2">Visit 3 Waterfalls</h4>
            <div className="h-32 rounded-xl bg-gray-100 mb-4 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=800')" }}></div>
            <div className="flex justify-between text-xs text-gray-500 font-medium mb-1">
              <span>0 / 3 Completed</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
            <button className="w-full py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm">Join Challenge</button>
          </div>
        </section>

        <section className="mt-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Trophy className="text-yellow-500" size={20} />
            Achievements
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white aspect-square rounded-2xl border border-gray-200 flex flex-col items-center justify-center p-2 text-center opacity-50">
                <span className="text-3xl mb-1">🔒</span>
                <span className="text-[10px] font-semibold text-gray-500">Locked</span>
              </div>
            ))}
          </div>
        </section>

        <JourneyTimeline />

        <section className="mt-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            <MapPin className="text-teal-600" size={20} />
            Recent Check-ins
          </h2>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="text-teal-500" size={28} />
            </div>
            <p className="text-sm text-gray-600 mb-4">You haven&apos;t checked into any places today.</p>
            <button className="px-5 py-2 bg-teal-50 text-teal-700 font-semibold rounded-full text-sm">Check-in Now</button>
          </div>
        </section>
      </div>
    </main>
  );
}
