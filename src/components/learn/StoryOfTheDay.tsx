'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function StoryOfTheDay() {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    fetch('/api/v1/content/daily')
      .then(res => res.json())
      .then(data => setStory(data.learn.storyOfTheDay))
      .catch(err => console.error(err));
  }, []);

  if (!story) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 my-4 shadow-sm relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
        <BookOpen className="w-32 h-32 text-indigo-900" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Story of the Day</h3>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{story.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {story.snippet}
        </p>
        <Link 
          href="/learn/story-of-the-day"
          className="text-indigo-600 font-semibold text-sm flex items-center gap-1 hover:text-indigo-800 transition-colors"
        >
          Read Full Story <span aria-hidden="true" className="transform transition-transform">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
