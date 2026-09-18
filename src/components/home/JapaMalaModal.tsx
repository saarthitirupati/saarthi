import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Pause, 
  Play, 
  Check,
  Award,
  Zap
} from 'lucide-react';
import { GOVINDA_NAMAVALI, getGovindaNamaForBead } from '../../data/govindaNamas';
import { 
  playBeadComplete, 
  playJapa108Complete, 
  playQuarterMilestone, 
  setAudioGloballyEnabled,
  stopAllAudio,
  startJapaAmbient,
  transitionToJapa,
  returnFromJapa
} from '../../lib/audioIdentity';
import { triggerBeadHaptic } from '../../lib/audioBell';
import { generateJapaCard, shareOrDownloadCard } from '../../lib/shareCardGenerator';
import {
  SrivariNamamVector,
  SacredShankhaVector,
  SacredChakraVector,
  LotusMandalaVector,
  RudrakshaBeadVector,
  TempleArchVector
} from '../common/DevotionalSvgIcons';

interface JapaMalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'te' | 'en';
}

export function JapaMalaModal({ isOpen, onClose, lang }: JapaMalaModalProps) {
  // Active chant bead (1 to 108)
  const [chantCount, setChantCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = parseInt(localStorage.getItem('srivari_chant_count') || '1', 10);
      return stored >= 1 && stored <= 108 ? stored : 1;
    }
    return 1;
  });

  // Total completed Malas
  const [completedMalas, setCompletedMalas] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('srivari_completed_malas') || '0', 10);
    }
    return 0;
  });

  // Browse bead index (when user scrolls < or > away from active chant bead)
  const [previewBead, setPreviewBead] = useState<number | null>(null);
  const [justCompletedMala, setJustCompletedMala] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [isAutoChanting, setIsAutoChanting] = useState(false);
  const [isSharingJapa, setIsSharingJapa] = useState(false);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const autoChantTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound toggle (persisted in localStorage)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('srivari_japa_sound') !== 'muted';
    }
    return true;
  });

  const activeBead = previewBead !== null ? previewBead : chantCount;
  const activeNama = getGovindaNamaForBead(activeBead);
  const isBrowsingOtherBead = previewBead !== null && previewBead !== chantCount;
  const isMilestoneBead = activeBead === 27 || activeBead === 54 || activeBead === 81;

  // Audio environment synchronization
  useEffect(() => {
    if (isOpen && isSoundEnabled) {
      transitionToJapa();
    }
    return () => {
      if (isOpen) {
        returnFromJapa(false);
      }
    };
  }, [isOpen, isSoundEnabled]);

  // Keyboard navigation shortcuts (Left/Right arrows, Spacebar chant, Escape close)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerBeadChange(Math.max(1, activeBead - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerBeadChange(Math.min(108, activeBead + 1));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advanceBead();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeBead, chantCount]);

  // Auto-chant timer cadence (advances every 6 seconds if enabled)
  useEffect(() => {
    if (isAutoChanting && isOpen && !justCompletedMala) {
      autoChantTimerRef.current = setTimeout(() => {
        advanceBead();
      }, 6000);
    } else {
      if (autoChantTimerRef.current) {
        clearTimeout(autoChantTimerRef.current);
      }
    }
    return () => {
      if (autoChantTimerRef.current) {
        clearTimeout(autoChantTimerRef.current);
      }
    };
  }, [isAutoChanting, isOpen, chantCount, justCompletedMala]);

  if (!isOpen) return null;

  const triggerBeadChange = (targetBead: number) => {
    setIsCardTransitioning(true);
    setPreviewBead(targetBead);
    triggerBeadHaptic(false);
    setTimeout(() => setIsCardTransitioning(false), 180);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        // Swipe left -> advance or next bead
        if (previewBead !== null) {
          triggerBeadChange(Math.min(108, previewBead + 1));
        } else {
          advanceBead();
        }
      } else {
        // Swipe right -> previous bead
        triggerBeadChange(Math.max(1, activeBead - 1));
      }
    }
    touchStartXRef.current = null;
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('srivari_japa_sound', next ? 'enabled' : 'muted');
      }
      setAudioGloballyEnabled(next);
      if (!next) {
        stopAllAudio();
      } else {
        startJapaAmbient(0.35);
      }
      return next;
    });
    triggerBeadHaptic(false);
  };

  const advanceBead = () => {
    const is108Reach = chantCount >= 108;
    const isQuarterMilestone = chantCount === 27 || chantCount === 54 || chantCount === 81;

    if (isSoundEnabled) {
      if (is108Reach) {
        playJapa108Complete();
      } else if (isQuarterMilestone) {
        playQuarterMilestone();
      } else {
        playBeadComplete();
      }
    }
    triggerBeadHaptic(is108Reach);

    setIsChanting(true);
    setIsCardTransitioning(true);
    setPreviewBead(null); // Snap back to active bead path
    setTimeout(() => {
      setIsChanting(false);
      setIsCardTransitioning(false);
    }, 200);

    if (is108Reach) {
      const nextMalas = completedMalas + 1;
      setCompletedMalas(nextMalas);
      setJustCompletedMala(true);
      setIsAutoChanting(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('srivari_completed_malas', nextMalas.toString());
      }
    } else {
      const nextCount = chantCount + 1;
      setChantCount(nextCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('srivari_chant_count', nextCount.toString());
      }
    }
  };

  const handleStartNextMala = () => {
    setChantCount(1);
    setJustCompletedMala(false);
    setPreviewBead(null);
    setIsAutoChanting(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', '1');
    }
    if (isSoundEnabled) {
      playBeadComplete();
      startJapaAmbient(0.35);
    }
    triggerBeadHaptic(false);
  };

  const handleResetMala = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChantCount(1);
    setJustCompletedMala(false);
    setPreviewBead(null);
    setIsAutoChanting(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', '1');
    }
    triggerBeadHaptic(false);
  };

  const handleShareBlessing = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSharingJapa) return;
    setIsSharingJapa(true);

    try {
      const currentNama = activeNama;
      const isMilestone = activeBead === 27 || activeBead === 54 || activeBead === 81;
      const cardType = isMilestone ? 'milestone' : 'bead';
      const siteUrl = 'https://saarthiguide.in';

      const text = lang === 'te'
        ? `✨ 📿 *శ్రీ వేంకటేశ్వర 108 దివ్య నామ జప మాల* 📿 ✨\n\n🌸 *నామం #${activeBead}/108:*\n*${currentNama.namaTe}*\n_(${currentNama.namaEn})_\n\n🌿 *దివ్య ఆశీర్వచనం:*\n"${currentNama.blessingTe}"\n\n🪔 *మాల ప్రగతి:* ${activeBead}/108 నామ జపం పూర్తయింది\n👉 ${siteUrl}`
        : `✨ 📿 *Srivari 108 Sacred Japa Mala* 📿 ✨\n\n🌸 *Bead #${activeBead} of 108:*\n*${currentNama.namaTe}*\n_(${currentNama.namaEn})_\n\n🌿 *Divine Blessing:*\n"${currentNama.blessingEn}"\n\n🪔 *Mala Progress:* ${activeBead}/108 Beads Chanted\n👉 ${siteUrl}`;

      const blob = await generateJapaCard({
        type: cardType as any,
        beadNumber: activeBead,
        namaTe: currentNama.namaTe,
        namaEn: currentNama.namaEn,
        blessingTe: currentNama.blessingTe,
        blessingEn: currentNama.blessingEn,
        completedMalas,
        lang
      });

      if (blob) {
        await shareOrDownloadCard(
          blob,
          `Saarthi-Japa-Bead-${activeBead}.png`,
          lang === 'te' ? `శ్రీ వేంకటేశ్వర నామ జపం #${activeBead}` : `Srivari Japa Mala Bead #${activeBead}`,
          text,
          siteUrl
        );
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSharingJapa(false);
    }
  };

  // Generate 7 visible beads around activeBead for horizontal mala strand
  const visibleBeadNumbers = [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
    const raw = activeBead + offset;
    if (raw < 1) return 108 + raw;
    if (raw > 108) return raw - 108;
    return raw;
  });

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 9, 16, 0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          borderRadius: '28px',
          background: 'radial-gradient(circle at 50% 0%, #111A29 0%, #0A0F1A 60%, #05080F 100%)',
          border: justCompletedMala 
            ? '1.5px solid rgba(74, 222, 128, 0.6)' 
            : '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: justCompletedMala
            ? '0 25px 80px -10px rgba(0,0,0,0.95), 0 0 50px rgba(34, 197, 94, 0.3)'
            : '0 25px 80px -10px rgba(0,0,0,0.95), 0 0 50px rgba(245, 158, 11, 0.22)',
          color: '#FFFFFF',
          padding: '22px 20px',
          boxSizing: 'border-box',
          maxHeight: '92vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Sacred Lotus Mandala Vector Watermark Background */}
        <LotusMandalaVector
          size={300}
          opacity={0.06}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Top Header Bar */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {justCompletedMala ? <Award size={28} color="#86EFAC" /> : <SrivariNamamVector size={38} />}
            </div>
            <div>
              <div style={{ 
                fontSize: '13.5px', 
                fontWeight: 900, 
                color: justCompletedMala ? '#86EFAC' : '#FDE047', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em',
                fontFamily: "var(--font-sacred-serif), 'Cinzel', Georgia, serif"
              }}>
                {justCompletedMala 
                  ? (lang === 'te' ? 'శ్రీవారి 108 మాల సంపూర్ణం!' : '108 Japa Mala Completed!') 
                  : (lang === 'te' ? 'శ్రీ వేంకటేశ్వర 108 జప మాల' : 'SRIVARI 108 SACRED JAPA MALA')}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>
                {justCompletedMala 
                  ? (lang === 'te' ? 'మహా పూర్ణ ఫల ప్రాప్తిరస్తు' : 'Supreme Devotional Fulfillment') 
                  : (lang === 'te' ? 'కలియుగ ప్రత్యక్ష దైవ నామస్మరణ' : 'Sacred Devotional Chanting Sadhana')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mute/Unmute */}
            <button
              type="button"
              onClick={toggleSound}
              title={isSoundEnabled ? 'Mute audio' : 'Enable audio'}
              style={{
                background: isSoundEnabled ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isSoundEnabled ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: isSoundEnabled ? '#FDE047' : '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              {isSoundEnabled ? <Volume2 size={15} color="#FDE047" /> : <VolumeX size={15} color="#94A3B8" />}
            </button>

            {/* Close */}
            <button 
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#CBD5E1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 📿 VISUAL 108 BEAD STRAND (INTERACTIVE MALA THREAD) */}
        {!justCompletedMala && (
          <div style={{
            position: 'relative',
            padding: '10px 0 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Connecting Sacred Mala Thread */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #D97706 30%, #F59E0B 50%, #D97706 70%, transparent 100%)',
              transform: 'translateY(-50%)',
              zIndex: 1
            }} />

            {/* Bead Nodes Row */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              {visibleBeadNumbers.map((beadNum, idx) => {
                const isCenter = idx === 3;
                const isPast = beadNum < chantCount;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => triggerBeadChange(beadNum)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isCenter ? 'scale(1.2)' : 'scale(0.88)',
                      opacity: isCenter ? 1 : 0.6
                    }}
                  >
                    <RudrakshaBeadVector
                      size={isCenter ? 44 : 26}
                      isCenter={isCenter}
                      isPast={isPast}
                      beadNumber={beadNum}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content View */}
        {justCompletedMala ? (
          /* MALA COMPLETION CELEBRATION CARD */
          <div style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(34, 197, 94, 0.18) 0%, rgba(245, 158, 11, 0.08) 100%)',
            border: '1.5px solid rgba(74, 222, 128, 0.45)',
            borderRadius: '22px',
            padding: '20px 18px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={28} color="#86EFAC" />
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 900,
              color: '#FEF08A',
              marginBottom: '10px',
              lineHeight: 1.35
            }}>
              {lang === 'te' ? 'అష్టోత్తర శత నామ జప మాల సంపూర్ణం!' : '108 Srivari Sacred Chants Completed!'}
            </div>
            <p style={{
              margin: '0 0 14px 0',
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: '#F1F5F9'
            }}>
              {lang === 'te' 
                ? 'గోవిందా! భక్తిశ్రద్ధలతో 108 శ్రీవారి దివ్య నామ జప మాలను సంపూర్ణం చేశారు. స్వామివారి సంపూర్ణ ఆశీస్సులు, సకల పాప నివారణ, కుటుంబంలో నిరంతర ఆనందం మరియు శాంతి వర్ధిల్లుగాక!'
                : 'Govinda! You have completed the 108 Sacred Srivari Japa Mala. May Lord Venkateswara and Goddess Padmavathi shower boundless peace, vibrant health, and divine grace upon your family.'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              borderRadius: '12px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#86EFAC',
              marginBottom: '16px'
            }}>
              <Check size={14} color="#86EFAC" />
              <span>{lang === 'te' ? `మొత్తం పూర్తయిన మాలలు: ${completedMalas}` : `Total Completed Malas: ${completedMalas}`}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={handleStartNextMala}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
                  border: '1px solid rgba(134, 239, 172, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={16} color="#FFFFFF" />
                <span>{lang === 'te' ? 'నూతన 108 మాల ప్రారంభించండి' : 'Start Next 108 Mala'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* MAIN SANCTUM ALTAR CARD */
          <div style={{
            background: 'radial-gradient(circle at 50% 25%, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '22px',
            padding: '18px 16px',
            marginBottom: '14px',
            textAlign: 'center',
            transform: isCardTransitioning ? 'scale(0.985) translateY(2px)' : 'scale(1)',
            opacity: isCardTransitioning ? 0.8 : 1,
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Milestone Badge Banner */}
            {isMilestoneBead && (
              <div style={{
                marginBottom: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)',
                border: '1px solid rgba(253, 224, 71, 0.5)',
                color: '#FDE047',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.04em'
              }}>
                <Zap size={13} color="#FDE047" />
                <span>
                  {activeBead === 27 ? '✨ Quarter Mala Milestone (#27)' : activeBead === 54 ? '✨ Half Mala Milestone (#54)' : '✨ Sacred Milestone (#81)'}
                </span>
              </div>
            )}

            {/* Bead Pill Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => triggerBeadChange(Math.max(1, activeBead - 1))}
                disabled={activeBead <= 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeBead <= 1 ? '#475569' : '#FDE047',
                  cursor: activeBead <= 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronLeft size={16} />
              </button>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 12px',
                borderRadius: '14px',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '11.5px',
                fontWeight: 900,
                color: '#FDE047',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                <span>{isBrowsingOtherBead 
                  ? (lang === 'te' ? `నామ పఠనం #${activeBead} / 108` : `Browsing Bead #${activeBead} of 108`)
                  : (lang === 'te' ? `శ్రీవారి నామం #${activeBead} / 108` : `BEAD #${activeBead} OF 108`)}</span>
              </div>

              <button
                type="button"
                onClick={() => triggerBeadChange(Math.min(108, activeBead + 1))}
                disabled={activeBead >= 108}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activeBead >= 108 ? '#475569' : '#FDE047',
                  cursor: activeBead >= 108 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Holy Srivari Divine Nama */}
            <div style={{
              fontSize: 'clamp(22px, 6.5vw, 26px)',
              fontWeight: 800,
              fontFamily: "var(--font-telugu-serif), 'Noto Serif Telugu', Georgia, serif",
              color: '#FFFDF5',
              margin: '8px 0 6px 0',
              lineHeight: 1.35,
              letterSpacing: '0.02em',
              textShadow: '0 2px 24px rgba(245, 158, 11, 0.55)'
            }}>
              {activeNama.namaTe}
            </div>

            {/* Transliteration & Meaning */}
            <div style={{
              fontSize: '13px',
              fontFamily: "var(--font-body), 'Inter', sans-serif",
              color: '#CBD5E1',
              fontStyle: 'italic',
              lineHeight: 1.45,
              maxWidth: '360px',
              margin: '0 auto 12px'
            }}>
              {activeNama.namaEn}
            </div>

            {/* Sacred Vector Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '14px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.45))' }} />
              <SacredShankhaVector size={20} />
              <SrivariNamamVector size={22} />
              <SacredChakraVector size={20} />
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.45), transparent)' }} />
            </div>

            {/* Divine Blessing & Grace */}
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                fontFamily: "var(--font-sacred-serif), 'Cinzel', Georgia, serif",
                color: '#F59E0B',
                marginBottom: '6px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                {lang === 'te' ? 'దివ్య ఆశీర్వచనం & అనుగ్రహం:' : 'DIVINE BLESSING & GRACE:'}
              </div>
              <p style={{
                margin: '0 0 6px 0',
                fontSize: '14.5px',
                fontFamily: "var(--font-telugu-serif), 'Noto Serif Telugu', Georgia, serif",
                lineHeight: 1.6,
                color: '#F8FAFC',
                fontWeight: 600
              }}>
                "{activeNama.blessingTe}"
              </p>
              <p style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: 1.45,
                color: '#94A3B8',
                fontStyle: 'italic'
              }}>
                "{activeNama.blessingEn}"
              </p>
            </div>
          </div>
        )}

        {/* MALA PROGRESS STRAND & CONTROLS */}
        {!justCompletedMala && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#FDE047' }}>
                  {lang === 'te' 
                    ? `మాల ప్రగతి: ${chantCount} / 108 నామాలు` 
                    : `Mala Progress: ${chantCount} / 108 Beads`}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#CBD5E1' }}>
                  {Math.round((chantCount / 108) * 100)}%
                </span>
              </div>

              <div style={{
                width: '100%',
                height: '7px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, (chantCount / 108) * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FDE047 100%)',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
                  borderRadius: '4px',
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
            </div>

            {/* Devotional Hint Banner with Keyboard & Swipe Shortcuts */}
            <div style={{
              marginBottom: '12px',
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px dashed rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <Sparkles size={13} color="#F59E0B" />
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#FDE68A' }}>
                {lang === 'te' 
                  ? 'స్వైప్ లేదా స్పేస్‌బార్ ద్వారా నామాలను జపించండి' 
                  : 'Tap, Swipe, or Press Spacebar to Chant'}
              </span>
            </div>

            {/* Primary Action Button */}
            <div style={{ marginBottom: '14px' }}>
              {isBrowsingOtherBead ? (
                <button
                  type="button"
                  onClick={() => setPreviewBead(null)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0F2D22 0%, #164E3A 100%)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    color: '#FEF08A',
                    fontSize: '14px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={15} color="#FEF08A" />
                  <span>{lang === 'te' ? `ప్రస్తుత జపానికి తిరిగి వెళ్ళండి (#${chantCount}/108)` : `Return to Active Chant (#${chantCount}/108)`}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={advanceBead}
                  style={{
                    width: '100%',
                    padding: '15px 18px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #B45309 0%, #D97706 45%, #F59E0B 100%)',
                    border: '1px solid rgba(253, 224, 71, 0.6)',
                    color: '#451A03',
                    fontSize: '15.5px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 6px 28px rgba(217, 119, 6, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                    transform: isChanting ? 'scale(0.96)' : 'scale(1)',
                    transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <Sparkles size={16} color="#451A03" />
                  <span>
                    {chantCount < 108 
                      ? (lang === 'te' ? 'సిద్ధం - తదుపరి నామం' : 'Ready - Next Bead')
                      : (lang === 'te' ? '108 మాల సంపూర్ణం - దివ్య అనుగ్రహం' : 'Complete 108 Mala')}
                  </span>
                </button>
              )}
            </div>

            {/* Footer Control Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(245, 158, 11, 0.2)',
              paddingTop: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Auto-Play Toggle */}
                <button
                  type="button"
                  onClick={() => setIsAutoChanting(!isAutoChanting)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: isAutoChanting ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: isAutoChanting ? '1px solid #FDE047' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '6px 11px',
                    color: isAutoChanting ? '#FDE047' : '#CBD5E1',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isAutoChanting ? <Pause size={13} color="#FDE047" /> : <Play size={13} color="#CBD5E1" />}
                  <span>{isAutoChanting ? (lang === 'te' ? 'ఆటో-ప్లే ఆపు' : 'Pause Auto') : (lang === 'te' ? 'ఆటో-జపం' : 'Auto-Play')}</span>
                </button>

                {/* Share Card */}
                <button
                  type="button"
                  onClick={handleShareBlessing}
                  disabled={isSharingJapa}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(16, 185, 129, 0.18)',
                    border: '1px solid rgba(52, 211, 153, 0.45)',
                    borderRadius: '10px',
                    padding: '6px 11px',
                    color: '#A7F3D0',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: isSharingJapa ? 'wait' : 'pointer',
                    opacity: isSharingJapa ? 0.75 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Share2 size={13} color="#A7F3D0" />
                  <span>{isSharingJapa ? (lang === 'te' ? 'కార్డ్...' : 'Card...') : (lang === 'te' ? 'కార్డ్ షేర్' : 'Share Card')}</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleResetMala}
                  title="Reset Mala to 1"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 600
                  }}
                >
                  <RotateCcw size={12} />
                  <span>{lang === 'te' ? 'రీసెట్' : 'Reset'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
