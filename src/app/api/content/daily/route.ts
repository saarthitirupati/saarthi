import { NextResponse } from 'next/server';
import { FESTIVALS_2026 } from '@/data/festivals';
import { predictCrowdMetrics } from '@/utils/crowdPredictor';
import { supabase } from '@/lib/supabase';



const QUIZZES = [
  {
    question: 'Which of these temples is renowned for its Vayu (Air) Linga?',
    image: '/assets/ai/hero_spiritual_sunset.png',
    options: [
      { id: 'A', text: 'Tirumala Venkateswara Temple' },
      { id: 'B', text: 'Srikalahasti Temple' },
      { id: 'C', text: 'Kanipakam Varasiddhi Vinayaka' },
      { id: 'D', text: 'Kapila Theertham' },
    ],
    correctAnswer: 'B',
    reward: 20,
  },
  {
    question: 'What is the universally famous prasadam offered at the Tirumala Temple?',
    image: '/assets/ai/hero_food.png',
    options: [
      { id: 'A', text: 'Pulihora' },
      { id: 'B', text: 'Tirupati Laddu' },
      { id: 'C', text: 'Chakkera Pongali' },
      { id: 'D', text: 'Vada' },
    ],
    correctAnswer: 'B',
    reward: 25,
  },
  {
    question: 'Which ancient fort near Tirupati served as the 4th capital of the Vijayanagara Empire?',
    image: '/assets/ai/hero_heritage.png',
    options: [
      { id: 'A', text: 'Golkonda Fort' },
      { id: 'B', text: 'Chandragiri Fort' },
      { id: 'C', text: 'Gandikota' },
      { id: 'D', text: 'Kondaveedu Fort' },
    ],
    correctAnswer: 'B',
    reward: 30,
  }
];

export async function GET() {
  const dailyContent = {
    date: new Date().toISOString().split('T')[0],
    moodJourney: {
      question: 'How do you feel today?',
      options: [
        { id: 'peaceful', label: 'Peaceful', icon: '🙏' },
        { id: 'explore', label: 'Explore', icon: '📸' },
        { id: 'nature', label: 'Nature', icon: '🌿' },
        { id: 'family', label: 'Family Time', icon: '👨‍👩‍👧' },
        { id: 'adventure', label: 'Adventure', icon: '🎒' },
      ],
    },
    discover: {
      placeOfTheDay: {
        name: 'Sunset Point',
        location: 'Seshachalam Hills',
        bestTime: '5:30 PM - 6:30 PM',
        image: '/images/sunset-point.jpg',
      },
      foodOfTheDay: {
        name: 'Pulihora',
        description: 'Traditional tamarind rice served as prasadam.',
      },
      photoSpot: {
        name: 'Chandragiri Viewpoint',
      },
      templeFact: {
        fact: 'Did you know? The Tirumala temple kitchen (Potu) prepares over 3 lakh laddu prasadams daily.',
      },
    },
    learn: {
      quiz: QUIZZES[Math.floor(Date.now() / 86400000) % QUIZZES.length],
      storyOfTheDay: null as any,
    },
    festivalCountdown: {
      name: 'Sri Ramanavami',
      location: 'Tirupati',
      daysRemaining: 2,
      expectedCrowd: 'High',
      recommendedTime: '6:00 AM - 9:00 AM',
      dressCode: 'Traditional',
      parking: 'Limited',
      trafficAlert: 'High Congestion',
      specialTips: 'Book tickets early',
    }
  };

  // Find the next upcoming festival dynamically
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let nextFestival = FESTIVALS_2026.find(f => {
    const fDate = new Date(f.date);
    fDate.setHours(0, 0, 0, 0);
    return fDate >= today;
  });

  if (!nextFestival) {
    // Fallback if all 2026 festivals have passed
    nextFestival = FESTIVALS_2026[FESTIVALS_2026.length - 1];
  }

  const fDate = new Date(nextFestival.date);
  fDate.setHours(0, 0, 0, 0);
  const diffTime = fDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine if target festival day (or today if checking current crowd) is a weekend
  // Usually we care if today is a weekend for real-time crowd, but since this is a countdown,
  // we factor in whether today is a weekend for real-time travel planning.
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // Use the new algorithmic crowd predictor
  const prediction = predictCrowdMetrics(
    nextFestival.gravityScore,
    daysRemaining,
    isWeekend
  );

  dailyContent.festivalCountdown = {
    name: nextFestival.name,
    location: nextFestival.location,
    daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
    expectedCrowd: prediction.crowdLevel,
    recommendedTime: nextFestival.recommendedTime,
    dressCode: nextFestival.dressCode,
    parking: prediction.parking,
    trafficAlert: prediction.trafficAlert,
    specialTips: nextFestival.specialTips,
  };

  const { data: dbStories } = await supabase.from('stories').select('*');
  if (dbStories && dbStories.length > 0) {
    dailyContent.learn.storyOfTheDay = dbStories[Math.floor(Date.now() / 86400000) % dbStories.length];
  }

  return NextResponse.json(dailyContent);
}
