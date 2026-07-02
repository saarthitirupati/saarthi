'use client';
import React, { useState, useEffect } from 'react';
import { Utensils, Camera, BookOpen } from 'lucide-react';

export default function DailyDiscovery() {
  const [discoverData, setDiscoverData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/content/daily')
      .then(res => res.json())
      .then(data => setDiscoverData(data.discover))
      .catch(err => console.error(err));
  }, []);

  if (!discoverData) return <div className="p-4 text-center">Loading daily discovery...</div>;

  return (
    <div className="space-y-4 my-6">
      <h3 className="text-xl font-bold text-gray-800">Daily Discovery</h3>

      {/* Place of the Day */}
      <div className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
        <img 
          src={discoverData.placeOfTheDay.image || '/images/default-place.jpg'} 
          alt={discoverData.placeOfTheDay.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full z-20">
          <span className="text-white text-xs font-semibold">Today&apos;s Discovery</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h4 className="text-white font-bold text-xl">{discoverData.placeOfTheDay.name}</h4>
          <p className="text-gray-300 text-sm">{discoverData.placeOfTheDay.location}</p>
          <p className="text-emerald-300 text-xs font-semibold mt-2">Best time: {discoverData.placeOfTheDay.bestTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Food */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Food of the Day</span>
            <span className="font-bold text-gray-800">{discoverData.foodOfTheDay.name}</span>
          </div>
        </div>

        {/* Photo Spot */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Photo Spot</span>
            <span className="font-bold text-gray-800">{discoverData.photoSpot.name}</span>
          </div>
        </div>

        {/* Temple Fact */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">Temple Fact</span>
            <span className="text-sm text-gray-700 block line-clamp-2">{discoverData.templeFact.fact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
