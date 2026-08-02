'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, BookOpen, Clock, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { STORIES } from '@/data/stories';

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'mythology', label: 'Mythology' },
  { id: 'history', label: 'History' },
  { id: 'tradition', label: 'Tradition' },
  { id: 'pilgrim_knowledge', label: 'Pilgrim Knowledge' },
  { id: 'nature', label: 'Nature & Science' }
];

export default function StoriesLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStories = useMemo(() => {
    return STORIES.filter(s => {
      const matchesCat = activeCategory === 'all' || s.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        s.title.toLowerCase().includes(query) ||
        s.subtitle.toLowerCase().includes(query) ||
        s.quickSummary.toLowerCase().includes(query) ||
        (s.tags || []).some(t => t.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#FAF8F4', paddingBottom: '90px' }}>
      {/* ─── STICKY HEADER ─── */}
      <header style={{
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 30,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        borderBottom: '1px solid #ECE9E3'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <Link href="/" style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
            <ArrowLeft size={20} /> Home
          </Link>
          <h1 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0, fontFamily: 'var(--font-hero), Georgia, serif' }}>
            Story Library
          </h1>
          <div style={{ width: '50px' }} />
        </div>

        {/* SEARCH BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F1F5F9',
          borderRadius: '14px',
          padding: '8px 12px',
          border: '1px solid #E2E8F0'
        }}>
          <Search size={16} color="#64748B" />
          <input 
            type="text"
            placeholder="Search by keyword e.g. Hair, Seven Hills, Laddu, Kubera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '13px',
              fontWeight: 600,
              width: '100%',
              color: '#0F172A'
            }}
          />
        </div>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px' }}>

        {/* ─── CATEGORY SCROLL ─── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                background: activeCategory === cat.id ? '#14532D' : '#FFFFFF',
                color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                border: activeCategory === cat.id ? 'none' : '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── STORIES LIST ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredStories.map(story => (
            <Link 
              href={`/story/${story.slug || story.id}`}
              key={story.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #ECE9E3',
                borderRadius: '20px',
                padding: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                gap: '14px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '16px',
                  backgroundImage: `url(${story.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#E2E8F0',
                  flexShrink: 0
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '1px 6px', borderRadius: '6px' }}>
                      {story.readTime}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', background: '#D1FAE5', padding: '1px 6px', borderRadius: '6px', textTransform: 'uppercase' }}>
                      {story.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', margin: '0 0 2px 0', lineHeight: 1.35 }}>
                    {story.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {story.subtitle}
                  </p>
                </div>

                <ChevronRight size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
              </div>
            </Link>
          ))}

          {filteredStories.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 16px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #ECE9E3' }}>
              <BookOpen size={32} color="#94A3B8" style={{ marginBottom: '8px' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>No stories found</h3>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>Try searching for a different keyword like 'Seven Hills', 'Hair', or 'Laddu'</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
