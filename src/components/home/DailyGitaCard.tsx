'use client';

import React, { useState } from 'react';
import { BookOpen, Share2, Sparkles, Check, HeartHandshake } from 'lucide-react';
import { getDailyGitaShloka, GitaShloka } from '@/data/bhagavadGita';
import { useLanguage } from '@/lib/useLanguage';

interface DailyGitaCardProps {
  date?: Date;
  variant?: 'mobile' | 'desktop';
}

export function DailyGitaCard({ date, variant = 'desktop' }: DailyGitaCardProps) {
  const lang = useLanguage();
  const shloka: GitaShloka = getDailyGitaShloka(date);
  const [script, setScript] = useState<'te' | 'sa' | 'en'>(lang === 'te' ? 'te' : 'en');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const activeShlokaText = script === 'en' ? shloka.transliteration : script === 'sa' ? shloka.shlokaSanskrit : shloka.shlokaTelugu;
    const textToShare = `🕉️ *శ్రీమద్భగవద్గీత నిత్య శ్లోకం • Daily Gita Shloka*\n${lang === 'te' ? shloka.referenceTe : shloka.referenceEn}\n\n"${activeShlokaText}"\n\n📖 *భావం (Meaning):*\n${lang === 'te' ? shloka.meaningTe : shloka.meaningEn}\n\n✨ *యాత్ర సాధన (Pilgrim Reflection):*\n${lang === 'te' ? shloka.pilgrimReflectionTe : shloka.pilgrimReflectionEn}\n\n— *Saarthi Tirumala Yatra Companion* (saarthiguide.in)`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Daily Bhagavad Gita Shloka - Saarthi Guide',
          text: textToShare,
          url: 'https://www.saarthiguide.in'
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF5 50%, #FEF9C3 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '20px',
        padding: variant === 'desktop' ? '18px 20px' : '14px 16px',
        boxShadow: '0 4px 18px rgba(217, 119, 6, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Golden Ambient Watermark */}
      <div
        style={{
          position: 'absolute',
          right: '-12px',
          bottom: '-16px',
          fontSize: '110px',
          color: 'rgba(217, 119, 6, 0.04)',
          fontWeight: 900,
          fontFamily: 'serif',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1
        }}
      >
        ॐ
      </div>

      {/* ── HEADER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
              border: '1px solid #FCD34D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.12)',
              flexShrink: 0
            }}
          >
            <BookOpen size={16} color="#B45309" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#92400E', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
              {lang === 'te' ? 'భగవద్గీత నిత్య శ్లోకం' : 'Daily Gita Shloka'}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', marginTop: '1px' }}>
              {lang === 'te' ? shloka.referenceTe : shloka.referenceEn}
            </div>
          </div>
        </div>

        {/* Script Selector Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FCD34D',
            borderRadius: '10px',
            padding: '2px',
            gap: '2px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <button
            onClick={() => setScript('te')}
            style={{
              background: script === 'te' ? '#D97706' : 'transparent',
              color: script === 'te' ? '#FFFFFF' : '#78350F',
              border: 'none',
              borderRadius: '7px',
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            తెలుగు
          </button>
          <button
            onClick={() => setScript('sa')}
            style={{
              background: script === 'sa' ? '#D97706' : 'transparent',
              color: script === 'sa' ? '#FFFFFF' : '#78350F',
              border: 'none',
              borderRadius: '7px',
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            संस्कृतम्
          </button>
          <button
            onClick={() => setScript('en')}
            style={{
              background: script === 'en' ? '#D97706' : 'transparent',
              color: script === 'en' ? '#FFFFFF' : '#78350F',
              border: 'none',
              borderRadius: '7px',
              padding: '3px 7px',
              fontSize: '10.5px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            English
          </button>
        </div>
      </div>

      {/* ── SACRED SHLOKA BOX ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '14px 16px',
          marginBottom: '12px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: script === 'en' ? '13px' : '15px',
            fontWeight: 800,
            color: '#78350F',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
            textAlign: 'center',
            fontFamily: script === 'en' ? 'inherit' : 'serif'
          }}
        >
          {script === 'te' && shloka.shlokaTelugu}
          {script === 'sa' && shloka.shlokaSanskrit}
          {script === 'en' && shloka.transliteration}
        </p>
      </div>

      {/* ── MEANING (భావం) ── */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>
          {lang === 'te' ? 'భావం' : 'Meaning'}
        </div>
        <p style={{ fontSize: '12.5px', color: '#451A03', margin: 0, lineHeight: '1.45', fontWeight: 600 }}>
          {lang === 'te' ? shloka.meaningTe : shloka.meaningEn}
        </p>
      </div>

      {/* ── PILGRIM QUEUE & LIFE REFLECTION ── */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderLeft: '4px solid #D97706',
          borderRadius: '10px',
          padding: '9px 12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}
      >
        <HeartHandshake size={15} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
            {lang === 'te' ? 'యాత్ర సాధన • మనశ్శాంతి' : 'Pilgrim Reflection • Inner Peace'}
          </div>
          <div style={{ fontSize: '11.5px', color: '#78350F', lineHeight: '1.4', fontWeight: 600 }}>
            {lang === 'te' ? shloka.pilgrimReflectionTe : shloka.pilgrimReflectionEn}
          </div>
        </div>
      </div>

      {/* ── FOOTER ACTIONS ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          borderTop: '1px dashed #FDE68A',
          paddingTop: '10px',
          gap: '8px'
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#B45309',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            padding: '2.5px 8px',
            borderRadius: '6px'
          }}
        >
          {lang === 'te' ? shloka.themeTe : shloka.themeEn}
        </span>

        <button
          onClick={handleShare}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #FCD34D',
            borderRadius: '9px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#92400E',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
            transition: 'background 0.15s ease'
          }}
        >
          {copied ? <Check size={12} color="#059669" /> : <Share2 size={12} color="#D97706" />}
          <span>{copied ? (lang === 'te' ? 'కాపీ చేయబడింది!' : 'Copied!') : (lang === 'te' ? 'శ్లోకం షేర్ చేయండి' : 'Share Shloka')}</span>
        </button>
      </div>
    </div>
  );
}
