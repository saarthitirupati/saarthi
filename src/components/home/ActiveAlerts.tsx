import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, AlertCircle, Info, X, ChevronRight, Bell } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    criticalAlert: 'CRITICAL EMERGENCY ALERT',
    ackClose: 'Acknowledge & Close',
    dismiss: 'Dismiss',
    livePilgrimAlert: 'Live Pilgrim Advisory',
    officialNotice: 'Official Tirumala Notice',
    learnMore: 'Open Info'
  },
  te: {
    criticalAlert: 'అత్యవసర హెచ్చరిక',
    ackClose: 'తెలుసుకున్నాను & మూసివేయి',
    dismiss: 'తొలగించు',
    livePilgrimAlert: 'యాత్రికుల లైవ్ సమాచారం',
    officialNotice: 'తిరుమల అధికారిక సమాచారం',
    learnMore: 'వివరాలు చూడండి'
  }
};

export function ActiveAlerts({ activePopupAlert, dismissAlert }: any) {
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang];

  if (!activePopupAlert) return null;

  const handleCtaClick = () => {
    dismissAlert(activePopupAlert.id);
    if (activePopupAlert.cta === 'Open Queue') router.push('/alerts');
    else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
    else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
    else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
    else router.push('/alerts');
  };

  const isEmergency = activePopupAlert.category === 'Emergency';
  const isHighPriority = activePopupAlert.category === 'High Priority';
  const isAdvisory = activePopupAlert.category === 'Advisory';

  // 1. Fullscreen style overlay (Critical Emergency takeover only)
  if (activePopupAlert.popup_type === 'Fullscreen') {
    return (
      <AnimatePresence>
        <motion.div
          key="fullscreen-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 22px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              border: '2px solid #EF4444',
              boxSizing: 'border-box',
              position: 'relative'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EF4444',
              marginBottom: '14px'
            }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#F87171',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              {t.criticalAlert}
            </span>

            <h2 style={{
              fontSize: '19px',
              fontWeight: 800,
              margin: '0 0 10px 0',
              lineHeight: 1.3,
              fontFamily: 'var(--font-hero), Georgia, serif'
            }}>
              {activePopupAlert.title}
            </h2>

            <p style={{
              fontSize: '13px',
              color: '#CBD5E1',
              margin: '0 0 16px 0',
              lineHeight: 1.5,
              maxWidth: '380px'
            }}>
              {activePopupAlert.description}
            </p>

            {activePopupAlert.image && (
              <img 
                src={activePopupAlert.image} 
                alt={activePopupAlert.title} 
                style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '14px', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.15)' }} 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {activePopupAlert.cta && activePopupAlert.cta !== 'None' && (
                <button
                  onClick={handleCtaClick}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '12px',
                  padding: '11px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t.ackClose}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 2. Centered Modal Popup style (for High Priority or modal configuration)
  if (activePopupAlert.popup_type === 'Popup') {
    return (
      <AnimatePresence>
        <motion.div
          key="modal-popup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            style={{
              width: '100%',
              maxWidth: '390px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              borderRadius: '22px',
              padding: '20px 22px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
              border: isEmergency 
                ? '2px solid #EF4444' 
                : (isHighPriority ? '2px solid #F97316' : '2px solid #EAB308'),
              boxSizing: 'border-box',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: isEmergency ? '#FEE2E2' : (isHighPriority ? '#FFEDD5' : '#FEF3C7'),
                  color: isEmergency ? '#DC2626' : (isHighPriority ? '#EA580C' : '#D97706'),
                  fontSize: '10.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '12px'
                }}>
                  <AlertCircle size={12} /> {activePopupAlert.category}
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {t.officialNotice}
                </span>
              </div>
              <button 
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>

            <h3 style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px 0',
              lineHeight: 1.35,
              fontFamily: 'var(--font-hero), Georgia, serif'
            }}>
              {activePopupAlert.title}
            </h3>

            <p style={{
              fontSize: '13px',
              color: '#475569',
              margin: '0 0 14px 0',
              lineHeight: 1.45
            }}>
              {activePopupAlert.description}
            </p>

            {activePopupAlert.image && (
              <img 
                src={activePopupAlert.image} 
                alt={activePopupAlert.title} 
                style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px', border: '1px solid #E2E8F0' }} 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
              />
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {activePopupAlert.cta && activePopupAlert.cta !== 'None' && (
                <button
                  onClick={handleCtaClick}
                  style={{
                    flex: 1,
                    background: isEmergency ? '#DC2626' : (isHighPriority ? '#EA580C' : '#0F5132'),
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{
                  flex: 1,
                  background: '#F8FAFC',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {t.dismiss}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. Modern Floating Notification Card (Dynamic Island Toast — Replaces Old Top Banner)
  // Floats seamlessly over the UI without shifting or disrupting page layout
  const accentColor = isEmergency ? '#EF4444' : (isHighPriority ? '#F97316' : (isAdvisory ? '#D97706' : '#10B981'));
  const accentBg = isEmergency ? '#FEF2F2' : (isHighPriority ? '#FFF7ED' : (isAdvisory ? '#FFFBEB' : '#F0FDF4'));

  return (
    <AnimatePresence>
      <motion.div
        key="floating-alert-pill"
        initial={{ opacity: 0, y: -30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 350 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0.1 }}
        onDragEnd={(_, info) => {
          if (info.offset.y < -25 || info.velocity.y < -250) {
            dismissAlert(activePopupAlert.id);
          }
        }}
        style={{
          position: 'fixed',
          top: 'max(68px, calc(env(safe-area-inset-top, 0px) + 62px))',
          left: '14px',
          right: '14px',
          margin: '0 auto',
          maxWidth: '430px',
          width: 'auto',
          zIndex: 99999,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '18px',
          border: `1.5px solid ${accentColor}`,
          boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(0, 0, 0, 0.06)',
          padding: '12px 14px',
          boxSizing: 'border-box',
          touchAction: 'pan-x'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          {/* Category Icon Badge */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: accentBg,
            border: `1px solid ${accentColor}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
            flexShrink: 0,
            marginTop: '1px'
          }}>
            {isEmergency ? <AlertTriangle size={18} /> : (isHighPriority ? <AlertCircle size={18} /> : <Bell size={18} />)}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: accentColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {activePopupAlert.category}
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>•</span>
              <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                {activePopupAlert.target_location || 'Live Advisory'}
              </span>
            </div>

            <h4 style={{
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 2px 0',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word'
            }}>
              {activePopupAlert.title}
            </h4>

            <p style={{
              fontSize: '12px',
              color: '#475569',
              margin: 0,
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {activePopupAlert.description}
            </p>

            {/* Quick CTA or View Info link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              {activePopupAlert.cta && activePopupAlert.cta !== 'None' ? (
                <button
                  onClick={handleCtaClick}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {activePopupAlert.cta} <ChevronRight size={12} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    dismissAlert(activePopupAlert.id);
                    router.push('/alerts');
                  }}
                  style={{
                    backgroundColor: accentBg,
                    color: accentColor,
                    border: `1px solid ${accentColor}44`,
                    borderRadius: '8px',
                    padding: '3px 9px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {t.learnMore} <ChevronRight size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={() => dismissAlert(activePopupAlert.id)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
              transition: 'background 0.15s ease'
            }}
            title="Dismiss"
            aria-label="Dismiss alert"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

