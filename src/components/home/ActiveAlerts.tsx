import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, AlertCircle, Info, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    criticalAlert: 'CRITICAL EMERGENCY ALERT',
    ackClose: 'Acknowledge & Close',
    dismiss: 'Dismiss',
    livePilgrimAlert: 'Live Pilgrim Alert'
  },
  te: {
    criticalAlert: 'అత్యవసర హెచ్చరిక',
    ackClose: 'తెలుసుకున్నాను & మూసివేయి',
    dismiss: 'తొలగించు',
    livePilgrimAlert: 'యాత్రికుల లైవ్ అలర్ట్'
  }
};

export function ActiveAlerts({ activePopupAlert, dismissAlert }: any) {
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang];

  if (!activePopupAlert) return null;

  const handleCtaClick = () => {
    dismissAlert(activePopupAlert.id);
    if (activePopupAlert.cta === 'Open Queue') router.push('/essentials');
    else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
    else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
    else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
  };

  // 1. Fullscreen style overlay
  if (activePopupAlert.popup_type === 'Fullscreen') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              border: '2px solid #EF4444',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '16px' }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{t.criticalAlert}</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 10px 0', fontFamily: 'var(--font-hero), Georgia, serif', lineHeight: 1.3 }}>{activePopupAlert.title}</h2>
            <p style={{ fontSize: '13.5px', color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.5, maxWidth: '400px' }}>{activePopupAlert.description}</p>
            {activePopupAlert.image && (
              <img src={activePopupAlert.image} alt={activePopupAlert.title} style={{ width: '100%', maxWidth: '340px', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '18px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '320px' }}>
              {activePopupAlert.cta && activePopupAlert.cta !== 'None' && (
                <button
                  onClick={handleCtaClick}
                  style={{
                    background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13.5px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', border: '1.5px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
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

  // 2. Popup Modal style
  if (activePopupAlert.popup_type === 'Popup') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '100%', maxWidth: '380px', backgroundColor: '#FFFFFF', color: '#0F172A', borderRadius: '24px', padding: '22px', boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
              border: activePopupAlert.category === 'Emergency' ? '2.5px solid #DC2626' : (activePopupAlert.category === 'High Priority' ? '2.5px solid #EA580C' : '2.5px solid #F59E0B'),
              boxSizing: 'border-box', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={15} color={activePopupAlert.category === 'Emergency' ? '#DC2626' : (activePopupAlert.category === 'High Priority' ? '#EA580C' : '#D97706')} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: activePopupAlert.category === 'Emergency' ? '#DC2626' : (activePopupAlert.category === 'High Priority' ? '#EA580C' : '#D97706'), textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.livePilgrimAlert}</span>
              </div>
              <button 
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={16} />
              </button>
            </div>
            <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', fontFamily: 'var(--font-hero), Georgia, serif' }}>{activePopupAlert.title}</h3>
            <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 12px 0', lineHeight: 1.45 }}>{activePopupAlert.description}</p>
            {activePopupAlert.image && (
              <img src={activePopupAlert.image} alt={activePopupAlert.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '14px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              {activePopupAlert.cta && activePopupAlert.cta !== 'None' && (
                <button
                  onClick={handleCtaClick}
                  style={{ flex: 1, background: '#0F5132', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '10px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '10px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
              >
                {t.dismiss}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // 3. Banner style (Inline / Top Alert Card)
  const isEmergency = activePopupAlert.category === 'Emergency';
  const isHighPriority = activePopupAlert.category === 'High Priority';
  const isAdvisory = activePopupAlert.category === 'Advisory';

  const bgColor = isEmergency ? '#FEF2F2' : (isHighPriority ? '#FFF7ED' : (isAdvisory ? '#FEFCE8' : '#F0FDF4'));
  const borderColor = isEmergency ? '#F87171' : (isHighPriority ? '#FB923C' : (isAdvisory ? '#FACC15' : '#4ADE80'));
  const textColor = isEmergency ? '#991B1B' : (isHighPriority ? '#9A3412' : (isAdvisory ? '#854D0E' : '#166534'));
  const badgeBg = isEmergency ? '#DC2626' : (isHighPriority ? '#EA580C' : (isAdvisory ? '#CA8A04' : '#16A34A'));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        margin: '0 0 14px 0',
        backgroundColor: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '14px 16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
          <div style={{ 
            backgroundColor: badgeBg, color: '#FFFFFF', borderRadius: '8px', padding: '4px 8px', 
            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
            display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginTop: '2px'
          }}>
            <AlertTriangle size={11} /> {activePopupAlert.category}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: textColor, margin: '0 0 3px 0' }}>
              {activePopupAlert.title}
            </h4>
            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.4 }}>
              {activePopupAlert.description}
            </p>
            {activePopupAlert.image && (
              <img 
                src={activePopupAlert.image} 
                alt={activePopupAlert.title} 
                style={{ width: '100%', maxHeight: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} 
              />
            )}
            {activePopupAlert.cta && activePopupAlert.cta !== 'None' && (
              <button
                onClick={handleCtaClick}
                style={{
                  backgroundColor: '#0F5132', color: '#FFFFFF', border: 'none', borderRadius: '8px',
                  padding: '5px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px'
                }}
              >
                {activePopupAlert.cta} <ChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => dismissAlert(activePopupAlert.id)}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
          title="Dismiss Alert"
        >
          <X size={15} />
        </button>
      </div>
    </motion.div>
  );
}
