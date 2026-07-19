'use client';
import React, { useState, useEffect } from 'react';

export default function MoodJourneyPrompt() {
  const [moods, setMoods] = useState<any[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/content/daily')
      .then(res => res.json())
      .then(data => setMoods(data.moodJourney.options))
      .catch(err => console.error(err));
  }, []);

  if (!moods.length) return null;

  return (
    <div className="p-4 bg-white/50 backdrop-blur-md rounded-xl border border-white/20 shadow-lg my-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">How do you feel today?</h3>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              selectedMood === mood.id 
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
            }`}
          >
            <span className="text-xl">{mood.icon}</span>
            <span className="font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
      
      {selectedMood && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg text-purple-900 text-sm">
          <strong>Saarthi says:</strong> You&apos;re in the mood for {moods.find(m => m.id === selectedMood)?.label}. The weather is clear, crowds are low at Chandragiri Fort, and sunset is at 6:42 PM. Here&apos;s a 3-hour plan.
        </div>
      )}
    </div>
  );
}
