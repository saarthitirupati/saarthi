import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Flame, Heart, Smile, Shield, Share2, Compass, MessageCircle } from 'lucide-react';
import { getTodaysCompanion, TodaysCompanionData } from '@/data/dailySpiritualEngine';
import { ShareableQuoteCardModal } from './ShareableQuoteCardModal';

export function DailyContent(props: any) {
  const { dailyContent, liveStatus, todayFestival } = props;

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
    <div style={{ padding: '0 16px 8px 16px' }}>

      {/* ── SECTION HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Flame size={19} color="#D97706" />
          <span>Today's Companion</span>
        </h3>
        <span style={{
          fontSize: '10.5px',
          fontWeight: 800,
          color: badge.text,
          backgroundColor: badge.bg,
          border: `1px solid ${badge.border}`,
          padding: '3px 10px',
          borderRadius: '12px',
          letterSpacing: '0.3px',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          maxWidth: '160px',
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
        borderRadius: '20px',
        padding: '18px 16px',
        marginBottom: '14px',
        boxShadow: '0 6px 18px rgba(217, 119, 6, 0.1)'
      }}>
        {/* Theme tag + duration */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.6px', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '6px' }}>
            {companionData.theme}
          </span>
          <span style={{ fontSize: '11px', color: '#78350F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="#D97706" />
            <span>{companionData.divineMoment.duration}</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', marginBottom: '8px' }}>
          {companionData.headline}
        </div>

        {/* Quote */}
        <blockquote style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#78350F',
          margin: '0 0 10px 0',
          lineHeight: '1.5',
          fontStyle: 'italic',
          borderLeft: '3px solid #FCD34D',
          paddingLeft: '12px'
        }}>
          "{companionData.divineMoment.quote}"
        </blockquote>

        {/* Author + Share */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #FDE68A' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
            ~ {companionData.divineMoment.author}
          </div>
          <button
            onClick={() => setIsShareModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #FCD34D',
              borderRadius: '12px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#B45309',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ── DID YOU KNOW ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '14px 16px',
        marginBottom: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={16} color="#D97706" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Did You Know?
            </span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '8px' }}>
            {companionData.significance.category}
          </span>
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E293B', lineHeight: '1.4', marginBottom: '4px' }}>
          {companionData.significance.title}
        </div>
        <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.45' }}>
          {companionData.significance.description}
        </p>
      </div>

      {/* ── MOOD CHECK ── */}
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '16px',
        padding: '12px 14px',
        border: '1px solid #E2E8F0',
        marginBottom: '14px'
      }}>
        <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageCircle size={15} color="#D97706" />
          <span>{companionData.moodPrompt.question}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {companionData.moodPrompt.options.map((opt) => {
            const isSelected = selectedMood === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleMoodSelect(opt.id)}
                style={{
                  backgroundColor: isSelected ? '#FEF3C7' : '#F8FAFC',
                  border: isSelected ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '8px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ marginBottom: '2px' }}>
                  {renderMoodIcon(opt.iconName)}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: isSelected ? '#B45309' : '#64748B', marginTop: '2px' }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMoodObj && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', marginTop: '8px', textAlign: 'center', backgroundColor: '#FFFBEB', padding: '6px', borderRadius: '8px' }}>
            {selectedMoodObj.feedback}
          </div>
        )}
      </div>

      {/* ── HABIT FOOTER ── */}
      <div style={{
        backgroundColor: '#FFFBEB',
        border: '1px dashed #FCD34D',
        borderRadius: '14px',
        padding: '10px 14px',
        textAlign: 'center',
        fontSize: '11.5px',
        fontWeight: 800,
        color: '#B45309',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <Sparkles size={14} color="#D97706" />
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
