'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Sparkles, Clock, ShieldCheck, BookOpen, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORIES, Story } from '@/data/stories';
import { PLACES } from '@/data/places';
import { safeFetchJson } from '@/lib/safeFetch';

export default function StoryOfTheDayPage() {
  const [stories, setStories] = useState<Story[]>(STORIES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [voted, setVoted] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    safeFetchJson<any>('/api/v1/content/daily')
      .then((data) => {
        if (data && data.allStories && Array.isArray(data.allStories) && data.allStories.length > 0) {
          setStories(data.allStories);
        }
        const day = new Date().getDate();
        setCurrentIndex(day % STORIES.length);
      })
      .catch(() => {
        const day = new Date().getDate();
        setCurrentIndex(day % STORIES.length);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleShare = () => {
    const currentStory = stories[currentIndex] || STORIES[0];
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: currentStory.title,
        text: currentStory.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF8F4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3.5px solid #D97706', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B', fontSize: 13, fontWeight: 700 }}>Loading Story of the Day...</p>
        </div>
      </div>
    );
  }

  const story = stories[currentIndex] || STORIES[0];
  const relatedPlaces = (story.relatedPlaceIds || [])
    .map(id => PLACES.find(p => p.id === id))
    .filter(Boolean);

  const prevStory = () => {
    setVoted(null);
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const nextStory = () => {
    setVoted(null);
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', paddingBottom: '90px' }}>
      {/* ─── STICKY HEADER ─── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 30,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        borderBottom: '1px solid #ECE9E3'
      }}>
        <Link href="/" style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={20} /> Home
        </Link>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
            Daily Spiritual Companion
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
            Story of the Day ({currentIndex + 1}/{stories.length})
          </span>
        </div>

        <button 
          onClick={handleShare}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A', position: 'relative' }}
        >
          <Share2 size={19} />
          {copied && (
            <span style={{ position: 'absolute', right: 0, top: '26px', background: '#0F172A', color: '#FFF', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
              Copied!
            </span>
          )}
        </button>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>

        {/* ─── NAVIGATION CONTROLS ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button 
            onClick={prevStory}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ChevronLeft size={16} /> Prev Story
          </button>

          <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', background: '#FFFBEB', padding: '3px 10px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
            Featured Today
          </span>

          <button 
            onClick={nextStory}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Next Story <ChevronRight size={16} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={story.id || currentIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* ─── SECTION 1: HERO HEADER ─── */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#B45309',
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={12} /> {story.readTime || '2 min read'}
                </span>

                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#15803D',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} /> {story.trustBadge || 'Verified by TTD Literature'}
                </span>
              </div>

              <h1 style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#0F172A',
                margin: '0 0 6px 0',
                lineHeight: 1.3,
                fontFamily: 'var(--font-hero), Georgia, serif'
              }}>
                {story.title}
              </h1>

              <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontWeight: 600 }}>
                {story.subtitle}
              </p>
            </div>

            {/* ─── HERO IMAGE ─── */}
            <div style={{
              width: '100%',
              height: '220px',
              borderRadius: '20px',
              backgroundImage: `url(${story.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#E2E8F0',
              marginBottom: '20px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }} />

            {/* ─── SECTION 2: QUICK SUMMARY ─── */}
            <div style={{
              background: '#FFFBEB',
              border: '1.5px solid #FDE68A',
              borderRadius: '18px',
              padding: '16px 18px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', marginBottom: '6px' }}>
                <Sparkles size={16} />
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Quick Summary (30-Sec Read)
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#78350F', margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
                {story.quickSummary}
              </p>
            </div>

            {/* ─── SECTION 3: STORY CONTENT CARDS ─── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {(story.storyBlocks || []).map((block, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #ECE9E3',
                    borderRadius: '18px',
                    padding: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 900,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {idx + 1}
                    </span>
                    {block.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: 1.65 }}>
                    {block.content}
                  </p>
                </div>
              ))}
            </div>

            {/* ─── SECTION 4: DID YOU KNOW? (HORIZONTAL SWIPE) ─── */}
            {story.didYouKnow && story.didYouKnow.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <BookOpen size={18} color="#D97706" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Did You Know?
                  </h3>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none'
                }}>
                  {story.didYouKnow.map((fact, idx) => (
                    <div 
                      key={idx}
                      style={{
                        flex: '0 0 220px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '14px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <p style={{ fontSize: '13px', color: '#1E293B', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
                        💡 {fact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SECTION 5: RELATED PLACES ─── */}
            {relatedPlaces.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={18} color="#2F6144" /> Visit These Related Places
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {relatedPlaces.map((place: any) => (
                    <Link
                      href={`/place/${place.id}`}
                      key={place.id}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{
                        background: '#FFFFFF',
                        border: '1px solid #ECE9E3',
                        borderRadius: '16px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundImage: `url(${place.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#E2E8F0',
                            flexShrink: 0
                          }} />
                          <div>
                            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                              {place.name}
                            </h4>
                            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                              {place.location || 'Tirupati'} • ★ {place.rating}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} color="#94A3B8" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SECTION 6: SOURCES ─── */}
            {story.sources && story.sources.length > 0 && (
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: '8px' }}>
                  Authentic Verification & Sources
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {story.sources.map((src, idx) => (
                    <span key={idx} style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#1E293B',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '4px 10px'
                    }}>
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ─── SECTION 7: FEEDBACK ─── */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #ECE9E3',
              borderRadius: '18px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 12px 0' }}>
                Did this story help you understand Tirupati better?
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  onClick={() => setVoted('up')}
                  style={{
                    background: voted === 'up' ? '#DCFCE7' : '#F1F5F9',
                    color: voted === 'up' ? '#15803D' : '#475569',
                    border: voted === 'up' ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsUp size={16} /> Helpful
                </button>
                <button
                  onClick={() => setVoted('down')}
                  style={{
                    background: voted === 'down' ? '#FEE2E2' : '#F1F5F9',
                    color: voted === 'down' ? '#DC2626' : '#475569',
                    border: voted === 'down' ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ThumbsDown size={16} /> Not Useful
                </button>
              </div>
              {voted && (
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, marginTop: '8px', display: 'block' }}>
                  Thank you for your feedback!
                </span>
              )}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
