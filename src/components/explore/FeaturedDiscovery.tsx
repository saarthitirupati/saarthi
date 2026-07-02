import React from 'react';
import { Lock,  Map } from 'lucide-react';

export default function FeaturedDiscovery({ unlocked = false }) {
  return (
    <div className="bg-emerald-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg my-4">
      <div className="absolute inset-0 opacity-20 bg-[url('/images/forest-bg.jpg')] bg-cover bg-center"></div>
      
      <div className="relative z-10">
        <h3 className="text-emerald-300 text-sm font-bold uppercase tracking-wider mb-2">🌿 This Week&apos;s Discovery</h3>
        
        {unlocked ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">Talakona Hidden Viewpoint</h2>
            <p className="text-emerald-100 mb-4 text-sm">Visited by only 7% of travelers</p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2">
              <Map className="w-4 h-4" />
              Unlock Route
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="bg-emerald-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-600">
              <Lock className="w-8 h-8 text-emerald-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">Mystery Destination</h2>
            <p className="text-emerald-200 text-sm mb-6 max-w-xs mx-auto italic">
              &quot;I fall from a height,<br/>
              Surrounded by forest.<br/>
              I am peaceful, not crowded,<br/>
              And nature is my best.&quot;
            </p>
            <div className="bg-emerald-800/50 rounded-full h-2 mb-4 max-w-xs mx-auto overflow-hidden">
              <div className="bg-emerald-400 w-1/3 h-full rounded-full"></div>
            </div>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full font-bold transition-colors w-full max-w-xs">
              Reveal Clue
            </button>
            <p className="text-xs text-emerald-400 mt-4">Unlocked by 7% Explorers</p>
          </div>
        )}
      </div>
    </div>
  );
}
