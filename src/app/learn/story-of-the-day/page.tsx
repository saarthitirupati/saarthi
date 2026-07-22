'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Share2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORIES } from '@/data/stories';
import { safeFetchJson } from '@/lib/safeFetch';

export default function StoryOfTheDay() {
  const [stories, setStories] = useState<any[]>(STORIES);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    safeFetchJson<any>('/api/v1/content/daily')
      .then((data) => {
        if (data && data.allStories && Array.isArray(data.allStories)) {
          setStories(data.allStories);
          const day = new Date().getDate();
          const todayIdx = day % data.allStories.length;
          setCurrentIndex(todayIdx);
        } else {
          const day = new Date().getDate();
          setCurrentIndex(day % STORIES.length);
        }
      })
      .catch(() => {
        const day = new Date().getDate();
        setCurrentIndex(day % STORIES.length);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleShare = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: story.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAF8F5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #FF9933', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>Loading Spiritual Stories...</p>
        </div>
      </div>
    );
  }

  const story = stories[currentIndex] || STORIES[0];
  const paragraphs = story.fullText ? story.fullText.match(/[^.!?]+[.!?]+/g) || [story.fullText] : [];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF8F5', paddingBottom: '60px' }}>
      {/* Sticky Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '14px 20px',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        borderBottom: '1px solid #F1F5F9'
      }}>
        <Link href="/" style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <ArrowLeft size={22} />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Home</span>
        </Link>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#E9801D', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block' }}>
            Tirumala Lore
          </span>
          <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Story of the Day</h1>
        </div>
        <button 
          onClick={handleShare}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F172A', position: 'relative' }}
          title="Share story"
        >
          <Share2 size={20} />
          {copied && (
            <span style={{ position: 'absolute', right: 0, top: '28px', background: '#0F172A', color: 'white', fontSize: '10px', padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
              Link copied!
            </span>
          )}
        </button>
      </header>

      {/* Hero Header with Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={story.id || currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            minHeight: '260px',
            backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(15,23,42,0.92)), url(${story.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px 20px 36px',
            color: 'white'
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ background: '#E9801D', color: 'white', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Featured Today
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.95, display: 'flex', alignItems: 'center', gap: 4 }}>
                <BookOpen size={14} /> {story.readTime || '1 Min Read'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0 0 6px 0', lineHeight: 1.2, color: '#FFFFFF' }}>
              {story.title}
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, color: '#E2E8F0', fontWeight: 500 }}>
              {story.subtitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Story Content Box */}
      <article style={{
        padding: '28px 20px',
        maxWidth: '640px',
        margin: '-16px auto 0',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px 24px 0 0',
        position: 'relative',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #F1F5F9',
        borderBottom: 'none'
      }}>
        <div style={{ 
          width: '36px', 
          height: '4px', 
          backgroundColor: '#E2E8F0', 
          borderRadius: '2px', 
          margin: '0 auto 24px auto' 
        }} />

        {paragraphs.map((paragraph: string, index: number) => (
          <motion.p 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.75,
              color: '#334155',
              marginBottom: '20px'
            }}
          >
            {index === 0 ? (
              <span style={{ 
                fontSize: '3.2rem', 
                float: 'left', 
                lineHeight: '0.85', 
                marginRight: '10px', 
                color: '#E9801D',
                fontFamily: 'serif',
                fontWeight: 900
              }}>
                {paragraph.trim().charAt(0)}
              </span>
            ) : null}
            {index === 0 ? paragraph.trim().substring(1) : paragraph.trim()}
          </motion.p>
        ))}

        {/* Story Navigator Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid #F1F5F9'
        }}>
          <button
            onClick={() => setCurrentIndex((currentIndex - 1 + stories.length) % stories.length)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} /> Previous Legend
          </button>
          
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % stories.length)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: '#E9801D',
              border: 'none',
              color: 'white',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Next Legend <ChevronRight size={16} />
          </button>
        </div>

        {/* All Stories Carousel Selector */}
        <div style={{ marginTop: '36px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#E9801D" /> Explore All Sacred Legends
          </h3>
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'none'
          }}>
            {stories.map((s, idx) => (
              <button
                key={s.id || idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  flexShrink: 0,
                  width: '160px',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: idx === currentIndex ? '#FFF7ED' : '#F8FAFC',
                  border: `1.5px solid ${idx === currentIndex ? '#E9801D' : '#E2E8F0'}`,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 800, color: idx === currentIndex ? '#C2410C' : '#94A3B8', textTransform: 'uppercase', display: 'block' }}>
                  Story #{idx + 1}
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: idx === currentIndex ? '#9A3412' : '#1E293B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3, marginTop: '2px' }}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Plan Your Visit CTA Card */}
        <div style={{
          marginTop: '36px',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          borderRadius: '20px',
          border: '1px solid #FED7AA',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 6px 0', color: '#9A3412', fontSize: '1.15rem', fontWeight: 800 }}>
            Plan Your Spiritual Visit
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#7C2D12', lineHeight: 1.5 }}>
            Experience the divine serenity and history of these sacred places in person.
          </p>
          <Link href="/explore" style={{
            display: 'inline-block',
            backgroundColor: '#E9801D',
            color: 'white',
            padding: '11px 26px',
            borderRadius: '24px',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: '0.95rem',
            boxShadow: '0 2px 8px rgba(233,128,29,0.3)'
          }}>
            Explore Temple Guides &rarr;
          </Link>
        </div>
      </article>
    </main>
  );
}
