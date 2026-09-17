import React, { useState, useMemo } from 'react';
import { Sparkles, Flame, Share2, Compass, Volume2, VolumeX } from 'lucide-react';
import { getTodaysCompanion, TodaysCompanionData } from '@/data/dailySpiritualEngine';
import { ShareableQuoteCardModal } from './ShareableQuoteCardModal';
import { DailyGitaCard } from './DailyGitaCard';
import { useLanguage } from '@/lib/useLanguage';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { playSaarthiSonicIdent } from '@/lib/audioIdentity';

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

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isSpeaking, toggleSpeak, stop } = useSpeechSynthesis();

  const handleAudioPlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      playSaarthiSonicIdent(true);
      toggleSpeak(companionData.divineMoment.quote, { lang: lang === 'te' ? 'te-IN' : 'en-IN', mode: 'explainer' });
    }
  };

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

      {/* ── VISUAL COMPANION MICRO-CARD ── */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          borderRadius: '16px',
          padding: '14px',
          boxShadow: '0 3px 12px rgba(217, 119, 6, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.5px', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '2px 7px', borderRadius: '5px' }}>
                {companionData.theme}
              </span>
              <span style={{ fontSize: '10.5px', color: '#78350F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={12} color="#D97706" />
                <span>{companionData.divineMoment.duration}</span>
              </span>
            </div>

            <blockquote style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#78350F',
              margin: '0',
              lineHeight: '1.4',
              fontStyle: 'italic',
              borderLeft: '3px solid #FCD34D',
              paddingLeft: '10px'
            }}>
              "{companionData.divineMoment.quote}"
            </blockquote>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #FDE68A' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#B45309' }}>
              ~ {companionData.divineMoment.author}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                onClick={handleAudioPlay}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: isSpeaking ? '#FEF3C7' : '#FFFFFF',
                  border: `1px solid ${isSpeaking ? '#D97706' : '#FCD34D'}`,
                  borderRadius: '8px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#B45309',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                {isSpeaking ? <VolumeX size={11} color="#DC2626" /> : <Volume2 size={11} color="#D97706" />}
                <span>{isSpeaking ? (lang === 'te' ? 'ఆపండి' : 'Stop') : (lang === 'te' ? 'వినండి' : 'Listen')}</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FCD34D',
                  borderRadius: '8px',
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#B45309',
                  cursor: 'pointer'
                }}
              >
                <Share2 size={11} />
                <span>{t.share}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── DAILY BHAGAVAD GITA SHLOKA CARD ── */}
      <div>
        <DailyGitaCard variant={variant} />
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
