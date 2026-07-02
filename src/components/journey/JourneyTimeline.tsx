import React from 'react';
import {} from 'lucide-react';

export default function JourneyTimeline() {
  const journeys = [
    { date: 'Oct 2024', title: 'First Check-in', desc: 'Journey Started', image: '/images/avatar.jpg' },
    { date: 'Aug 2024', title: 'Visited Chandragiri Fort', desc: 'Beautiful Sunset', image: '/images/chandragiri.jpg' },
    { date: 'Jul 2024', title: 'Visited Talakona', desc: 'Amazing Waterfall', image: '/images/talakona.jpg' },
    { date: 'May 2024', title: 'Visited Tirumala', desc: 'Blessed Darshan', image: '/images/tirumala.jpg' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm my-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">My Journey</h3>
      
      <div className="relative border-l-2 border-purple-100 ml-3 space-y-8">
        {journeys.map((item, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm"></div>
            
            <div className="text-sm font-semibold text-purple-600 mb-1">{item.date}</div>
            
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <img src={item.image} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
