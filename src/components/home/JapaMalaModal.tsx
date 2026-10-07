import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowLeft,
  Volume2, 
  VolumeX, 
  Share2, 
  Sparkles, 
  RotateCcw, 
  Pause, 
  Play, 
  Check,
  Award,
  Zap,
  Languages
} from 'lucide-react';
import { getGovindaNamaForBead, getNamaShortMeaning } from '../../data/govindaNamas';
import { 
  playBeadComplete, 
  playJapa108Complete, 
  playQuarterMilestone, 
  setAudioGloballyEnabled,
  stopAllAudio,
  startJapaAmbient,
  ensureJapaAmbientPlaying,
  transitionToJapa,
  returnFromJapa
} from '../../lib/audioIdentity';
import { triggerBeadHaptic } from '../../lib/audioBell';
import { generateJapaCard, shareOrDownloadCard } from '../../lib/shareCardGenerator';
import { LotusMandalaVector, SrivariNamamVector } from '../common/DevotionalSvgIcons';
import { useSpeechSynthesis } from '../../utils/useSpeechSynthesis';
import { useLanguage } from '../../lib/useLanguage';

interface JapaMalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'te' | 'en';
}

export function JapaMalaModal({ isOpen, onClose, lang }: JapaMalaModalProps) {
  // Synchronize language with user selection or global app state
  const appLang = useLanguage();
  const [currentLang, setCurrentLang] = useState<'te' | 'en'>(lang || appLang || 'en');

  useEffect(() => {
    if (lang) setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (appLang) setCurrentLang(appLang);
  }, [appLang]);

  const handleToggleLang = () => {
    const nextLang = currentLang === 'te' ? 'en' : 'te';
    setCurrentLang(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_user_language', nextLang);
      window.dispatchEvent(new CustomEvent('saarthi_language_change', { detail: nextLang }));
    }
  };

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

  // Chanting session state (unstarted vs started)
  const [hasStartedJapa, setHasStartedJapa] = useState<boolean>(false);
  const [previewBead, setPreviewBead] = useState<number | null>(null);
  const [justCompletedMala, setJustCompletedMala] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [isAutoChanting, setIsAutoChanting] = useState(false);
  const [isSharingJapa, setIsSharingJapa] = useState(false);
  const [isCardTransitioning, setIsCardTransitioning] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const autoChantTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Native speech synthesis for authentic Telugu pronunciation
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  // Ambient sound toggle (persisted in localStorage)
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

  // Extract transliteration from namaEn
  const rawEn = activeNama.namaEn;
  const parenMatch = rawEn.match(/^(.*?)\s*\((.*?)\)\s*$/);
  const transliteration = parenMatch ? parenMatch[1].trim() : rawEn;

  // Localized meaning title & full blessing according to user selected language
  const localizedMeaningTitle = getNamaShortMeaning(activeBead, currentLang);
  const localizedBlessingBody = currentLang === 'te' ? activeNama.blessingTe : activeNama.blessingEn;

  // Audio environment synchronization
  useEffect(() => {
    if (isOpen && isSoundEnabled) {
      transitionToJapa();
    }
    return () => {
      if (isOpen) {
        returnFromJapa(false);
        stop();
      }
    };
  }, [isOpen, isSoundEnabled, stop]);

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
        if (!hasStartedJapa) {
          handleStartJapa();
        } else {
          advanceBead();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeBead, chantCount, hasStartedJapa]);

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
    setTimeout(() => setIsCardTransitioning(false), 160);
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
        if (!hasStartedJapa) {
          handleStartJapa();
        } else if (previewBead !== null) {
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

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleStartJapa = () => {
    setHasStartedJapa(true);
    if (isSoundEnabled) {
      ensureJapaAmbientPlaying(0.35);
      playBeadComplete();
    }
    triggerBeadHaptic(false);
  };

  const advanceBead = () => {
    const is108Reach = chantCount >= 108;
    const isQuarterMilestone = chantCount === 27 || chantCount === 54 || chantCount === 81;

    if (isSoundEnabled) {
      ensureJapaAmbientPlaying(0.35);
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
    }, 180);

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
    setHasStartedJapa(true);
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
    setHasStartedJapa(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', '1');
    }
    triggerBeadHaptic(false);
  };

  const handleListenPronunciation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stop();
    } else {
      // Speak the sacred Telugu nama clearly
      speak(activeNama.namaTe, { lang: 'te-IN', fallbackText: transliteration });
    }
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

      const text = currentLang === 'te'
        ? `శ్రీ వేంకటేశ్వర 108 దివ్య నామ జప మాల\n\nనామం #${activeBead}/108:\n${currentNama.namaTe}\n(${localizedMeaningTitle})\n\nదివ్య ఆశీర్వచనం:\n"${currentNama.blessingTe}"\n\nమాల ప్రగతి: ${activeBead}/108 నామ జపం పూర్తయింది\n${siteUrl}`
        : `Srivari 108 Sacred Japa Mala\n\nBead #${activeBead} of 108:\n${currentNama.namaTe}\n(${transliteration})\n\nMeaning:\n"${localizedMeaningTitle}"\n\nDivine Blessing:\n"${currentNama.blessingEn}"\n\nMala Progress: ${activeBead}/108 Beads Chanted\n${siteUrl}`;

      const blob = await generateJapaCard({
        type: cardType as any,
        beadNumber: activeBead,
        namaTe: currentNama.namaTe,
        namaEn: currentNama.namaEn,
        blessingTe: currentNama.blessingTe,
        blessingEn: currentNama.blessingEn,
        completedMalas,
        lang: currentLang
      });

      if (blob) {
        await shareOrDownloadCard(
          blob,
          `Saarthi-Japa-Bead-${activeBead}.png`,
          currentLang === 'te' ? `శ్రీ వేంకటేశ్వర నామ జపం #${activeBead}` : `Srivari Japa Mala Bead #${activeBead}`,
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
        background: 'rgba(3, 10, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          background: '#071A14',
          border: '1px solid rgba(217, 164, 65, 0.22)',
          boxShadow: '0 24px 64px -8px rgba(0, 0, 0, 0.95), 0 0 32px rgba(15, 81, 50, 0.2)',
          color: '#FFF8E7',
          padding: '20px 18px',
          boxSizing: 'border-box',
          maxHeight: '92vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Subtle Sacred Lotus Mandala Background */}
        <LotusMandalaVector
          size={340}
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

        {/* 1. Header Bar: Safe Area Top Padding & Srivari Thirunamam Center Lockup */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '16px',
          paddingTop: 'max(4px, env(safe-area-inset-top, 0px))'
        }}>
          {/* Top Control Action Row: Back Button (Left), Srivari Thirunamam (Center), Language + Settings/Close (Right) */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            {/* Back Button */}
            <button
              onClick={onClose}
              aria-label="Back"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(217, 164, 65, 0.25)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                color: '#FFF8E7',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <ArrowLeft size={18} />
            </button>

            {/* Sacred Srivari Thirunamam Icon (Center Emblem) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SrivariNamamVector size={38} />
            </div>

            {/* Right Controls: Language Selector + Settings/Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Language Switcher */}
              <button 
                type="button"
                onClick={handleToggleLang}
                title="Switch Language"
                style={{
                  background: 'rgba(217, 164, 65, 0.12)',
                  border: '1px solid rgba(217, 164, 65, 0.35)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  color: '#FDE047',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Languages size={13} color="#FDE047" />
                <span>{currentLang === 'te' ? 'తెలుగు' : 'English'}</span>
              </button>

              {/* Settings / Close Button */}
              <button 
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(217, 164, 65, 0.25)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Prominent Header Titles */}
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 800, 
            color: '#FFF8E7', 
            margin: '2px 0 0 0',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            textAlign: 'center',
            fontFamily: "var(--font-sacred-serif), Georgia, serif",
            textShadow: '0 2px 10px rgba(217, 164, 65, 0.3)'
          }}>
            {currentLang === 'te' ? 'శ్రీవారి జపమాల' : 'SRI VARI JAPA MALA'}
          </h2>
          <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '3px', textAlign: 'center', fontWeight: 500 }}>
            <span>{currentLang === 'te' ? '108 దివ్య నామాలు' : '108 Sacred Names'}</span>
            <span style={{ margin: '0 6px', color: '#D9A441' }}>•</span>
            <span>{currentLang === 'te' ? 'నిత్య నామస్మరణ' : 'Daily devotional chanting'}</span>
          </div>
        </div>

        {/* 2. Visual 108-Bead Japa Strand Progress */}
        {!justCompletedMala && (
          <div style={{
            position: 'relative',
            padding: '10px 0 14px',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Top Bead Number Indicator with Underline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#FDE047', lineHeight: 1 }}>
                {activeBead}
              </span>
              <div style={{ width: '28px', height: '2px', background: '#D9A441', marginTop: '4px', borderRadius: '1px' }} />
            </div>

            {/* Connecting Strand Thread */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '4%',
                right: '4%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(217, 164, 65, 0.3) 20%, rgba(217, 164, 65, 0.7) 50%, rgba(217, 164, 65, 0.3) 80%, transparent 100%)',
                transform: 'translateY(-50%)',
                zIndex: 1
              }} />

              {/* 7 Visible Beads Row: 3 past, 1 active center, 3 future */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px'
              }}>
                {visibleBeadNumbers.map((beadNum, idx) => {
                  const isCenter = idx === 3;
                  const isPast = beadNum < chantCount;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => triggerBeadChange(beadNum)}
                      title={`Bead #${beadNum}`}
                      style={{
                        border: isCenter ? '2px solid #FDE047' : isPast ? '1px solid rgba(217, 164, 65, 0.5)' : '1px solid rgba(255, 248, 231, 0.25)',
                        borderRadius: '50%',
                        background: isCenter
                          ? 'radial-gradient(circle at 35% 35%, #FEF08A 0%, #D9A441 60%, #92400E 100%)'
                          : isPast
                          ? 'rgba(217, 164, 65, 0.45)'
                          : 'rgba(255, 248, 231, 0.12)',
                        boxShadow: isCenter ? '0 0 18px rgba(253, 224, 71, 0.65), inset 0 0 6px rgba(255, 255, 255, 0.8)' : 'none',
                        width: isCenter ? '26px' : '15px',
                        height: isCenter ? '26px' : '15px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isCenter ? 'scale(1.15)' : 'scale(1)'
                      }}
                    >
                      {isCenter && (
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#071A14' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Strand Counter: 1 / 108 */}
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FDE047', marginTop: '10px', letterSpacing: '0.04em' }}>
              {activeBead} / 108
            </div>
          </div>
        )}

        {/* 3. Main Content: Celebration vs Main Mantra Card */}
        {justCompletedMala ? (
          /* MALA COMPLETION CELEBRATION */
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 81, 50, 0.4) 0%, rgba(6, 78, 59, 0.5) 100%)',
            border: '1.5px solid #D9A441',
            borderRadius: '24px',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Award size={36} color="#FDE047" />
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#FEF08A',
              marginBottom: '12px',
              lineHeight: 1.35
            }}>
              {currentLang === 'te' ? 'అష్టోత్తర శత నామ జప మాల సంపూర్ణం!' : '108 Sacred Names Completed!'}
            </div>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: '#F1F5F9'
            }}>
              {currentLang === 'te' 
                ? 'గోవిందా! భక్తిశ్రద్ధలతో 108 శ్రీవారి దివ్య నామ జప మాలను సంపూర్ణం చేశారు. స్వామివారి సంపూర్ణ ఆశీస్సులు, సకల పాప నివారణ, కుటుంబంలో శాంతి వర్ధిల్లుగాక!'
                : 'Govinda! You have completed the 108 Sacred Srivari Japa Mala. May Lord Venkateswara and Goddess Padmavathi shower boundless peace and divine grace upon your family.'}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(217, 164, 65, 0.2)',
              border: '1px solid #D9A441',
              borderRadius: '14px',
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 800,
              color: '#FDE047',
              marginBottom: '18px'
            }}>
              <Check size={15} color="#FDE047" />
              <span>{currentLang === 'te' ? `మొత్తం పూర్తయిన మాలలు: ${completedMalas}` : `Total Completed Malas: ${completedMalas}`}</span>
            </div>

            <button
              type="button"
              onClick={handleStartNextMala}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
                border: '1.5px solid #D9A441',
                color: '#FFF8E7',
                fontSize: '15px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(15, 81, 50, 0.4)',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={17} color="#FDE047" />
              <span>{currentLang === 'te' ? 'నూతన 108 మాల ప్రారంభించండి' : 'Start Next 108 Mala'}</span>
            </button>
          </div>
        ) : (
          /* MAIN MANTRA HERO CARD (EMERALD GREEN + REFINED GOLD BORDER & DEVOTIONAL FRAME) */
          <div style={{
            background: 'linear-gradient(180deg, rgba(7, 34, 25, 0.85) 0%, rgba(4, 24, 18, 0.95) 100%)',
            border: '1.5px solid rgba(217, 164, 65, 0.4)',
            borderRadius: '24px',
            padding: '24px 20px 22px 20px',
            marginBottom: '16px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            position: 'relative',
            transform: isCardTransitioning ? 'scale(0.985)' : 'scale(1)',
            opacity: isCardTransitioning ? 0.88 : 1,
            transition: 'all 0.16s ease'
          }}>
            {/* Top Pill: BEAD 1 OF 108 (Devotional Gold Frame Badge) */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(217, 164, 65, 0.12)',
                border: '1px solid rgba(217, 164, 65, 0.4)',
                borderRadius: '20px',
                padding: '4px 16px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#FDE047',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isMilestoneBead && <Zap size={12} color="#FDE047" />}
                <span>
                  {isBrowsingOtherBead 
                    ? (currentLang === 'te' ? `నామ పఠనం #${activeBead} / 108` : `BROWSING BEAD ${activeBead} OF 108`)
                    : (currentLang === 'te' ? `శ్రీవారి నామం #${activeBead} / 108` : `BEAD ${activeBead} OF 108`)}
                </span>
              </div>
            </div>

            {/* Telugu Sacred Mantra (Large, Centered, Highly Readable) */}
            <div style={{
              fontSize: 'clamp(28px, 7.5vw, 34px)',
              fontWeight: 800,
              fontFamily: "var(--font-telugu-serif), 'Noto Serif Telugu', Georgia, serif",
              color: '#FFFFFF',
              margin: '0 0 8px 0',
              lineHeight: 1.35,
              letterSpacing: '0.01em',
              textShadow: '0 2px 24px rgba(253, 224, 71, 0.25)'
            }}>
              {activeNama.namaTe}
            </div>

            {/* Romanized Transliteration */}
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#FDE047',
              fontStyle: 'italic',
              lineHeight: 1.4,
              margin: '0 0 16px 0'
            }}>
              {transliteration}
            </div>

            {/* Meaning Section (Refined Card with Heading + English Explanation) */}
            <div style={{
              margin: '0 auto 20px',
              maxWidth: '360px',
              padding: '14px 16px',
              background: 'rgba(15, 81, 50, 0.25)',
              borderRadius: '16px',
              border: '1px solid rgba(217, 164, 65, 0.2)',
              textAlign: 'center'
            }}>
              {localizedMeaningTitle && (
                <div style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#FEF08A',
                  marginBottom: '6px',
                  lineHeight: 1.4,
                  fontFamily: currentLang === 'te' ? "var(--font-telugu-serif), 'Noto Serif Telugu', Georgia, serif" : 'inherit'
                }}>
                  {localizedMeaningTitle}
                </div>
              )}
              <div style={{
                fontSize: currentLang === 'te' ? '13px' : '12.5px',
                lineHeight: 1.6,
                color: '#E2E8F0',
                fontFamily: currentLang === 'te' ? "var(--font-telugu-serif), 'Noto Serif Telugu', Georgia, serif" : 'inherit'
              }}>
                "{localizedBlessingBody}"
              </div>
            </div>

            {/* Audio & Symmetrical Navigation Controls Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '6px'
            }}>
              {/* Previous Bead Button */}
              <button
                type="button"
                onClick={() => triggerBeadChange(Math.max(1, activeBead - 1))}
                disabled={activeBead <= 1}
                aria-label="Previous Bead"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(217, 164, 65, 0.3)',
                  color: activeBead <= 1 ? '#475569' : '#FFF8E7',
                  opacity: activeBead <= 1 ? 0.4 : 1,
                  cursor: activeBead <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowLeft size={18} />
              </button>

              {/* Functional Gold Audio "Listen" Button */}
              <button
                type="button"
                onClick={handleListenPronunciation}
                style={{
                  height: '44px',
                  padding: '0 24px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, #B8860B 0%, #D9A441 50%, #F5C563 100%)',
                  border: 'none',
                  color: '#071A14',
                  fontSize: '14px',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(217, 164, 65, 0.4)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Volume2 size={18} color="#071A14" />
                <span>{isSpeaking ? (currentLang === 'te' ? 'వింటున్నారు...' : 'Listening...') : (currentLang === 'te' ? 'ఉచ్చారణ వినండి' : 'Listen')}</span>
              </button>

              {/* Next Bead Button */}
              <button
                type="button"
                onClick={() => {
                  if (activeBead < 108) {
                    triggerBeadChange(activeBead + 1);
                  }
                }}
                disabled={activeBead >= 108}
                aria-label="Next Bead"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(217, 164, 65, 0.3)',
                  color: activeBead >= 108 ? '#475569' : '#FFF8E7',
                  opacity: activeBead >= 108 ? 0.4 : 1,
                  cursor: activeBead >= 108 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>

            {/* Muted Subtext */}
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              {currentLang === 'te' ? 'ఉచ్చారణ కోసం Listen నొక్కండి' : 'Tap to hear pronunciation'}
            </div>
          </div>
        )}

        {/* 4. Japa Progress Section */}
        {!justCompletedMala && (
          <div style={{
            width: '100%',
            marginBottom: '16px',
            backgroundColor: 'rgba(7, 34, 25, 0.6)',
            border: '1px solid rgba(217, 164, 65, 0.2)',
            borderRadius: '16px',
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFF8E7' }}>
                {currentLang === 'te' ? 'జప ప్రగతి' : 'Japa Progress'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#FDE047' }}>
                {chantCount} / 108
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(100, (chantCount / 108) * 100)}%`,
                height: '100%',
                backgroundColor: '#D9A441',
                boxShadow: '0 0 10px rgba(253, 224, 71, 0.6)',
                borderRadius: '3px',
                transition: 'width 0.25s ease'
              }} />
            </div>
          </div>
        )}

        {/* 5. Primary Action Chanting Button */}
        {!justCompletedMala && (
          <div style={{ marginBottom: '16px' }}>
            {isBrowsingOtherBead ? (
              <button
                type="button"
                onClick={() => setPreviewBead(null)}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(15, 81, 50, 0.35)',
                  border: '1px solid #D9A441',
                  color: '#FFF8E7',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} color="#D9A441" />
                <span>{currentLang === 'te' ? `ప్రస్తుత జపానికి తిరిగి వెళ్ళండి (#${chantCount}/108)` : `Return to Active Chant (#${chantCount}/108)`}</span>
              </button>
            ) : !hasStartedJapa ? (
              /* BEFORE STARTING: [ Start Japa ] */
              <button
                type="button"
                onClick={handleStartJapa}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
                  border: '1.5px solid #D9A441',
                  color: '#FFF8E7',
                  fontSize: '16px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(15, 81, 50, 0.45)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={18} color="#FDE047" />
                <span>{currentLang === 'te' ? 'జపం ప్రారంభించండి' : 'Start Japa'}</span>
              </button>
            ) : (
              /* ONCE STARTED: [ Next Bead → ] */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  type="button"
                  onClick={advanceBead}
                  style={{
                    width: '100%',
                    height: '52px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #B8860B 0%, #D9A441 50%, #F5C563 100%)',
                    border: 'none',
                    color: '#071A14',
                    fontSize: '16px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(217, 164, 65, 0.35)',
                    transform: isChanting ? 'scale(0.97)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>
                    {chantCount < 108 
                      ? (currentLang === 'te' ? 'తదుపరి నామం →' : 'Next Bead →')
                      : (currentLang === 'te' ? '108 మాల సంపూర్ణం' : 'Complete 108 Mala')}
                  </span>
                </button>

                {/* Sub-row: Auto Chanting Toggle + Swipe hint */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                  fontSize: '11px',
                  color: '#94A3B8'
                }}>
                  <button
                    type="button"
                    onClick={() => setIsAutoChanting(!isAutoChanting)}
                    style={{
                      background: isAutoChanting ? 'rgba(217, 164, 65, 0.2)' : 'transparent',
                      border: isAutoChanting ? '1px solid #D9A441' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      color: isAutoChanting ? '#D9A441' : '#CBD5E1',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}
                  >
                    {isAutoChanting ? <Pause size={12} color="#D9A441" /> : <Play size={12} color="#CBD5E1" />}
                    <span>{isAutoChanting ? (currentLang === 'te' ? 'ఆపు' : 'Pause') : (currentLang === 'te' ? 'ఆటో-ప్లే' : 'Auto')}</span>
                  </button>

                  <span>
                    {currentLang === 'te' ? 'స్వైప్ లేదా ట్యాప్ ద్వారా కొనసాగించండి' : 'Swipe / Tap to continue'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Footer Utility Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(217, 164, 65, 0.15)',
          paddingTop: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Ambient Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={isSoundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
              style={{
                background: 'transparent',
                border: 'none',
                color: isSoundEnabled ? '#D9A441' : '#64748B',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px'
              }}
            >
              {isSoundEnabled ? <Volume2 size={13} color="#D9A441" /> : <VolumeX size={13} color="#64748B" />}
              <span>{isSoundEnabled ? (currentLang === 'te' ? 'శబ్దం' : 'Sound') : (currentLang === 'te' ? 'నిశ్శబ్దం' : 'Muted')}</span>
            </button>

            {/* Share Card */}
            <button
              type="button"
              onClick={handleShareBlessing}
              disabled={isSharingJapa}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A7F3D0',
                cursor: isSharingJapa ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px'
              }}
            >
              <Share2 size={12} color="#A7F3D0" />
              <span>{isSharingJapa ? (currentLang === 'te' ? 'కార్డ్...' : 'Card...') : (currentLang === 'te' ? 'కార్డ్' : 'Card')}</span>
            </button>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={handleResetMala}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px'
            }}
          >
            <RotateCcw size={11} />
            <span>{currentLang === 'te' ? 'రీసెట్' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
