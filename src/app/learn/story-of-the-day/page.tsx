'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StoryOfTheDay() {
  const [story, setStory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/daily')
      .then(res => res.json())
      .then(data => {
        setStory(data.learn?.storyOfTheDay);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-background)' }}>Loading...</div>;
  }

  if (!story) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Story not found</div>;
  }

  // Split fullText into paragraphs by sentence boundaries for better reading
  const paragraphs = story.fullText ? story.fullText.match(/[^.!?]+[.!?]+/g) || [story.fullText] : [];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', paddingBottom: '40px' }}>
      {/* Header */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-surface)',
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <Link href="/" style={{ color: 'var(--color-text-primary)' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Story of the Day</h1>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          <Share2 size={22} />
        </button>
      </header>

      {/* Hero Image */}
      <div style={{
        width: '100%',
        height: '30vh',
        minHeight: '250px',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.85)), url(${story.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <BookOpen size={16} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{story.readTime} Read</span>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 4px 0', lineHeight: 1.1, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{story.title}</h2>
        <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0, color: '#F3F4F6', textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>{story.subtitle}</p>
      </div>

      {/* Content */}
      <article style={{
        padding: '24px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'var(--color-surface)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        marginTop: '-20px',
        position: 'relative',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          width: '40px', 
          height: '4px', 
          backgroundColor: 'var(--color-stone-200)', 
          borderRadius: '2px', 
          margin: '0 auto 24px auto' 
        }} />
        
        {paragraphs.map((paragraph: string, index: number) => (
          <motion.p 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '20px'
            }}
          >
            {index === 0 ? (
              <span style={{ 
                fontSize: '3.5rem', 
                float: 'left', 
                lineHeight: '0.8', 
                marginRight: '8px', 
                color: 'var(--color-saffron-500)',
                fontFamily: 'serif'
              }}>
                {paragraph.trim().charAt(0)}
              </span>
            ) : null}
            {index === 0 ? paragraph.trim().substring(1) : paragraph.trim()}
          </motion.p>
        ))}

        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 152, 0, 0.2)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-saffron-700)', fontSize: '1.1rem' }}>Plan Your Visit</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: 'var(--color-stone-600)' }}>
            Experience this majestic location in person.
          </p>
          <Link href="/explore" style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-saffron-500)',
            color: 'white',
            padding: '10px 24px',
            borderRadius: '24px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            View Guides
          </Link>
        </div>
      </article>
    </main>
  );
}
