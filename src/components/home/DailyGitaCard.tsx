'use client';

import React, { useState } from 'react';
import { BookOpen, Share2, Sparkles, Check, HeartHandshake, Volume2, VolumeX } from 'lucide-react';
import { getDailyGitaShloka, GitaShloka } from '@/data/bhagavadGita';
import { useLanguage } from '@/lib/useLanguage';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { playSaarthiSonicIdent } from '@/lib/audioIdentity';

interface DailyGitaCardProps {
  date?: Date;
  variant?: 'mobile' | 'desktop';
}

export function DailyGitaCard({ date, variant = 'desktop' }: DailyGitaCardProps) {
  const lang = useLanguage();
  const shloka: GitaShloka = getDailyGitaShloka(date);
  const [script, setScript] = useState<'te' | 'sa' | 'en'>(lang === 'te' ? 'te' : 'en');
  const [activeTab, setActiveTab] = useState<'meaning' | 'practice'>('meaning');
  const [copied, setCopied] = useState(false);
  const { isSpeaking, toggleSpeak, stop } = useSpeechSynthesis();

  const handleAudioPlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      playSaarthiSonicIdent(true);
      const textToRecite = script === 'en' ? shloka.transliteration : script === 'sa' ? shloka.shlokaSanskrit : shloka.shlokaTelugu;
      const speechLang = script === 'te' ? 'te-IN' : script === 'sa' ? 'hi-IN' : 'en-IN';
      toggleSpeak(textToRecite, speechLang);
    }
  };

  const handleShare = async () => {
    const activeShlokaText = script === 'en' ? shloka.transliteration : script === 'sa' ? shloka.shlokaSanskrit : shloka.shlokaTelugu;
    const textToShare = `*శ్రీమద్భగవద్గీత నిత్య శ్లోకం • Daily Gita Shloka*\n${lang === 'te' ? shloka.referenceTe : shloka.referenceEn}\n\n"${activeShlokaText}"\n\n• భావం (Meaning):\n${lang === 'te' ? shloka.meaningTe : shloka.meaningEn}\n\n• యాత్ర సాధన (Pilgrim Reflection):\n${lang === 'te' ? shloka.pilgrimReflectionTe : shloka.pilgrimReflectionEn}\n\n— Saarthi Tirumala Yatra Companion (saarthiguide.in)`;

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
          padding: '12px 14px',
          marginBottom: '10px',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.04)'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: script === 'en' ? '12.5px' : '14.5px',
            fontWeight: 800,
            color: '#78350F',
            lineHeight: '1.55',
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

      {/* ── TAB SEGMENT CONTROL FOR MEANING vs PRACTICE (Halves text height!) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('meaning')}
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: '8px',
            border: activeTab === 'meaning' ? '1.5px solid #D97706' : '1px solid #E2E8F0',
            backgroundColor: activeTab === 'meaning' ? '#FEF3C7' : '#FFFFFF',
            color: activeTab === 'meaning' ? '#92400E' : '#64748B',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <BookOpen size={12} color={activeTab === 'meaning' ? '#B45309' : '#64748B'} />
          <span>{lang === 'te' ? 'భావం' : 'Meaning'}</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          style={{
            flex: 1,
            padding: '5px 8px',
            borderRadius: '8px',
            border: activeTab === 'practice' ? '1.5px solid #166534' : '1px solid #E2E8F0',
            backgroundColor: activeTab === 'practice' ? '#DCFCE7' : '#FFFFFF',
            color: activeTab === 'practice' ? '#14532D' : '#64748B',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <HeartHandshake size={12} color={activeTab === 'practice' ? '#166534' : '#64748B'} />
          <span>{lang === 'te' ? 'యాత్ర సాధన' : 'Pilgrim Practice'}</span>
        </button>
      </div>

      {/* ── TAB CONTENT: MEANING ── */}
      {activeTab === 'meaning' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #FCD34D',
          borderRadius: '12px',
          padding: '10px 12px',
          marginBottom: '10px',
          boxShadow: '0 2px 6px rgba(217, 119, 6, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {lang === 'te' ? 'భగవద్గీత సారం' : 'CORE TAKEAWAY'}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#B45309', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '1px 6px', borderRadius: '4px' }}>
              {lang === 'te' ? 'దివ్య అభయం' : 'DIVINE ASSURANCE'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#78350F', margin: 0, lineHeight: '1.45', fontWeight: 700 }}>
            {lang === 'te' ? shloka.meaningTe : shloka.meaningEn}
          </p>
        </div>
      )}

      {/* ── TAB CONTENT: PILGRIM PRACTICE ── */}
      {activeTab === 'practice' && (
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {lang === 'te' ? 'నేటి సాధన' : 'DAILY PRACTICE'}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#15803D', backgroundColor: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>
              {lang === 'te' ? 'మనశ్శాంతి' : 'INNER PEACE'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#14532D', lineHeight: '1.4', fontWeight: 700 }}>
            {lang === 'te' ? shloka.pilgrimReflectionTe : shloka.pilgrimReflectionEn}
          </div>
        </div>
      )}

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={handleAudioPlay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: isSpeaking ? '#FEF3C7' : '#FFFFFF',
              border: `1px solid ${isSpeaking ? '#D97706' : '#FCD34D'}`,
              borderRadius: '9px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#92400E',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
          >
            {isSpeaking ? <VolumeX size={12} color="#DC2626" /> : <Volume2 size={12} color="#D97706" />}
            <span>{isSpeaking ? (lang === 'te' ? 'ఆపండి' : 'Stop Audio') : (lang === 'te' ? 'శ్లోకం వినండి' : 'Listen Shloka')}</span>
          </button>

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
    </div>
  );
}
