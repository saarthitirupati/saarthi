import { useState, useEffect, useMemo } from 'react';
import { safeFetchJson } from '@/lib/safeFetch';
import { STORIES } from '@/data/stories';
import { FESTIVALS_2026 } from '@/data/festivals';
import { getDayTempleGuidance } from '@/lib/dailyGuidance';

export function useDailyContent(places: any[]) {
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [liveFestivals, setLiveFestivals] = useState<any[]>([]);
  const [completedSteps, setCompletedSteps] = useState({ story: false, quiz: false, visit: false });
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [decisionContext, setDecisionContext] = useState<any>(null);

  useEffect(() => {
    const storyRead = localStorage.getItem('story_read_today') === 'true';
    const quizDone = localStorage.getItem('quiz_answered_today') === 'true';
    const visitDone = localStorage.getItem('temple_visited_today') === 'true';
    setCompletedSteps({ story: storyRead, quiz: quizDone, visit: visitDone });

    safeFetchJson<any>('/api/v1/content/daily').then(data => {
      setDailyContent(data);
      if (data?.quiz?.id) {
        const savedAnswer = localStorage.getItem(`quiz_answered_${data.quiz.id}`);
        if (savedAnswer) {
          setSelectedQuizOption(savedAnswer);
          setQuizAnswered(true);
          setCompletedSteps(prev => ({ ...prev, quiz: true }));
        }
      }
    });

    safeFetchJson<any>('/api/v1/festivals?all=1').then((d: any) => {
      if (d && Array.isArray(d.data) && d.data.length > 0) {
        setLiveFestivals(d.data);
      }
    });
  }, []);

  const todayStory = useMemo(() => {
    let storyData = dailyContent?.learn?.storyOfTheDay || dailyContent?.story;
    if (!storyData && STORIES.length > 0) {
      const day = typeof window !== 'undefined' ? new Date().getDate() : 1;
      storyData = STORIES[day % STORIES.length];
    }
    return storyData;
  }, [dailyContent]);

  const todayFestival = useMemo(() => {
    const rawList = liveFestivals.length > 0 ? liveFestivals : FESTIVALS_2026;
    const list = rawList.map((f: any) => ({
      ...f,
      name: f.name || f.title || 'Guru Purnima',
      date: (f.date || f.date_start || '').split('T')[0],
      location: f.location || f.place_name || 'Sri Kapileswara Swamy Temple',
      recommendedTime: f.recommendedTime || f.recommended_time || '5:30 PM - 9:00 PM',
      placeId: f.placeId || f.place_id,
      coverImage: f.coverImage || f.cover_image
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    const exactMatch = list.find(f => f.date === todayStr);
    if (exactMatch) return { ...exactMatch, isToday: true };
    const upcoming = list.filter(f => f.date >= todayStr).sort((a: any, b: any) => a.date.localeCompare(b.date))[0];
    if (upcoming) return { ...upcoming, isToday: upcoming.date === todayStr };
    const fallback = list.find(f => f.id === 'guru-purnima') || list[0];
    return fallback ? { ...fallback, isToday: false } : null;
  }, [liveFestivals]);

  const templeOfTheDay = useMemo(() => {
    if (dailyContent?.spotlight) return dailyContent.spotlight;
    const dayGuide = getDayTempleGuidance();
    const dayMatch = places.find(p => p.id === dayGuide.placeId);
    if (dayMatch) return dayMatch;
    return places.find(p => p.id === 'venkateswara' || p.id === 'govindaraja') 
      || places.find(p => p.isMustVisit === true)
      || places[0];
  }, [dailyContent, places]);

  return {
    dailyContent,
    todayStory,
    todayFestival,
    templeOfTheDay,
    completedSteps,
    selectedQuizOption,
    quizAnswered,
    decisionContext,
    setDecisionContext,
    setCompletedSteps,
    setSelectedQuizOption,
    setQuizAnswered
  };
}
