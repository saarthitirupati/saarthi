import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Flame, Heart, Smile, Shield, Share2, Compass, MessageCircle } from 'lucide-react';
import { getTodaysCompanion, TodaysCompanionData } from '@/data/dailySpiritualEngine';
import { ShareableQuoteCardModal } from './ShareableQuoteCardModal';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    todaysCompanion: 'Today\'s Companion',
    didYouKnow: 'Did You Know?',
    share: 'Share',
  },
  te: {
    todaysCompanion: 'నేటి సహచరి',
    didYouKnow: 'మీకు తెలుసా?',
    share: 'షేర్ చేయండి',
  }
};

export function DailyContent(props: any) {
  const { dailyContent, liveStatus, todayFestival, variant = 'mobile' } = props;
  const isDesktop = variant === 'desktop';
  const lang = useLanguage();
  const t = TEXTS[lang];

  // Compute companion data — priority: API > engine with live context
  const companionData: TodaysCompanionData = useMemo(() => {
    if (dailyContent?.todaysCompanion) {
      return dailyContent.todaysCompanion;
    }
    return getTodaysCompanion(new Date(), liveStatus, 'general', todayFestival);
  }, [dailyContent, liveStatus, todayFestival]);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMood = localStorage.getItem(`pilgrim_mood_${todayStr}`);
      if (savedMood) setSelectedMood(savedMood);
    }
  }, [todayStr]);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`pilgrim_mood_${todayStr}`, moodId);
    }
  };

  const renderMoodIcon = (iconName: string) => {
    switch (iconName) {
      case 'smile': return <Smile size={18} color="#D97706" />;
      case 'sparkles': return <Sparkles size={18} color="#2563EB" />;
      case 'shield': return <Shield size={18} color="#059669" />;
      default: return <Heart size={18} color="#E11D48" />;
    }
  };

  const selectedMoodObj = companionData.moodPrompt.options.find(o => o.id === selectedMood);

  // Priority badge colour
  const priorityColors = {
    1: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' }, // Festival — red
    2: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' }, // Temple day — orange
    3: { bg: '#FFFBEB', border: '#FDE68A', text: '#78350F' }, // Weekday — amber
    4: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' }, // General — green
  } as const;
  const badge = priorityColors[(companionData.priorityLevel as 1|2|3|4)] ?? priorityColors[3];

  return (
    <div style={{ padding: isDesktop ? '0' : '0 2px 2px 2px' }}>

      {/* ── SECTION HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
        <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={17} color="#D97706" />
          <span>{t.todaysCompanion}</span>
        </h3>
        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          color: badge.text,
          backgroundColor: badge.bg,
          border: `1px solid ${badge.border}`,
          padding: '2px 8px',
          borderRadius: '10px',
          letterSpacing: '0.2px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {companionData.priorityReason}
        </span>
      </div>

      {/* ── DIVINE MOMENT CARD ── */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '1.5px solid #FDE68A',
        borderRadius: '16px',
        padding: '14px 14px',
        marginBottom: '10px',
        boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)'
      }}>
        {/* Theme tag + duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 7px', borderRadius: '5px' }}>
            {companionData.theme}
          </span>
          <span style={{ fontSize: '10.5px', color: '#78350F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Sparkles size={12} color="#D97706" />
            <span>{companionData.divineMoment.duration}</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#92400E', marginBottom: '6px' }}>
          {companionData.headline}
        </div>

        {/* Quote */}
        <blockquote style={{
          fontSize: '13.5px',
          fontWeight: 700,
          color: '#78350F',
          margin: '0 0 8px 0',
          lineHeight: '1.4',
          fontStyle: 'italic',
          borderLeft: '3px solid #FCD34D',
          paddingLeft: '10px'
        }}>
          "{companionData.divineMoment.quote}"
        </blockquote>

        {/* Author + Share */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #FDE68A' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#B45309' }}>
            ~ {companionData.divineMoment.author}
          </div>
          <button
            onClick={() => setIsShareModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FCD34D',
              borderRadius: '10px',
              padding: '4px 8px',
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#B45309',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <Share2 size={12} />
            <span>{t.share}</span>
          </button>
        </div>
      </div>

      {/* ── DID YOU KNOW ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '14px',
        padding: '12px 14px',
        marginBottom: '10px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Compass size={14} color="#D97706" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {t.didYouKnow}
            </span>
          </div>
          <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '2px 6px', borderRadius: '6px' }}>
            {companionData.significance.category}
          </span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E293B', lineHeight: '1.35', marginBottom: '3px' }}>
          {companionData.significance.title}
        </div>
        <p style={{ fontSize: '11.5px', color: '#475569', margin: 0, lineHeight: '1.4' }}>
          {companionData.significance.description}
        </p>
      </div>

      {/* ── MOOD CHECK ── */}
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '14px',
        padding: '10px 12px',
        border: '1px solid #E2E8F0',
        marginBottom: '10px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MessageCircle size={14} color="#D97706" />
          <span>{companionData.moodPrompt.question}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
          {companionData.moodPrompt.options.map((opt) => {
            const isSelected = selectedMood === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleMoodSelect(opt.id)}
                style={{
                  backgroundColor: isSelected ? '#FEF3C7' : '#F8FAFC',
                  border: isSelected ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '6px 3px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginBottom: '1px' }}>
                  {renderMoodIcon(opt.iconName)}
                </div>
                <span style={{ fontSize: '9.5px', fontWeight: 800, color: isSelected ? '#B45309' : '#64748B', marginTop: '1px' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMoodObj && (
          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#B45309', marginTop: '6px', textAlign: 'center', backgroundColor: '#FFFBEB', padding: '5px', borderRadius: '6px' }}>
            {selectedMoodObj.feedback}
          </div>
        )}
      </div>

      {/* ── SACRED GOVINDA NAMALU & PRASADAM TRADITION ── */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFDF9 100%)',
        border: '1px solid rgba(200, 155, 60, 0.25)',
        borderRadius: '16px',
        padding: '13px 14px',
        marginBottom: '10px',
        boxShadow: '0 4px 14px rgba(200, 155, 60, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FDE68A' }}>
            <Sparkles size={12} color="#CA8A04" />
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#854D0E' }}>
            {lang === 'te' ? 'గోవింద నామావళి & ప్రసాద విశేషాలు' : 'Govinda Namavali & Temple Prasadam'}
          </span>
        </div>

        <blockquote style={{
          fontSize: '12px',
          color: '#78350F',
          margin: '0 0 10px 0',
          lineHeight: '1.45',
          fontStyle: 'italic',
          backgroundColor: '#FFFBEB',
          borderLeft: '3px solid #F59E0B',
          padding: '8px 10px',
          borderRadius: '0 8px 8px 0'
        }}>
          {lang === 'te' 
            ? '“శ్రీ శ్రీనివాస గోవిందా • శ్రీ వేంకటేశ గోవిందా • భక్తవత్సల గోవిందా • తిరుమలేశ గోవిందా” — క్యూ లైన్‌లో లేదా ప్రయాణంలో స్మరించండి.'
            : '“Sri Srinivasa Govinda • Sri Venkatesa Govinda • Bhakta Vatsala Govinda • Tirumalesa Govinda” — Chant during queue waiting for mental tranquility.'}
        </blockquote>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '8px'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#DCFCE7',
            border: '1px solid #BBF7D0',
            color: '#166534',
            fontSize: '10.5px',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}>
            🛕 Annaprasadam
          </span>
          <span style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4', fontWeight: 600 }}>
            {lang === 'te' 
              ? 'తరిగొండ వెంగమాంబ అన్నప్రసాద భవనంలో ప్రతిరోజూ ఉదయం 9:00 నుండి రాత్రి 11:00 వరకు ఉచిత భోజనం లభిస్తుంది.'
              : 'Tarigonda Vengamamba Complex serves free hot meals 9:00 AM – 11:00 PM daily.'}
          </span>
        </div>
      </div>

      {/* ── HABIT FOOTER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        border: '1px solid #FDE68A',
        borderRadius: '14px',
        padding: '11px 16px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 800,
        color: '#92400E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)'
      }}>
        <Sparkles size={14} color="#D97706" style={{ flexShrink: 0 }} />
        <span>{companionData.habitPrompt.text}</span>
      </div>

      {/* Share Modal */}
      <ShareableQuoteCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quote={companionData.divineMoment.quote}
        author={companionData.divineMoment.author}
        theme={companionData.theme}
      />
    </div>
  );
}
