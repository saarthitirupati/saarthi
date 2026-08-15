import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { AlertTriangle, AlertCircle } from 'lucide-react';
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        {activePopupAlert.popup_type === 'Fullscreen' ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '2px solid #EF4444',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '24px' }}>
              <AlertTriangle size={32} color="#EF4444" />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>{t.criticalAlert}</span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px 0', fontFamily: 'var(--font-hero), Georgia, serif', lineHeight: 1.3 }}>{activePopupAlert.title}</h2>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 20px 0', lineHeight: 1.6, maxWidth: '400px' }}>{activePopupAlert.description}</p>
            {activePopupAlert.image && (
              <img src={activePopupAlert.image} alt={activePopupAlert.title} style={{ width: '100%', maxWidth: '340px', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '24px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
              {activePopupAlert.cta !== 'None' && (
                <button
                  onClick={() => {
                    dismissAlert(activePopupAlert.id);
                    if (activePopupAlert.cta === 'Open Queue') router.push('/essentials');
                    else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
                    else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
                    else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
                  }}
                  style={{
                    background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', border: '1.5px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {t.ackClose}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              width: '100%', maxWidth: '360px', backgroundColor: '#FFFFFF', color: '#0F172A', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: activePopupAlert.category === 'High Priority' ? '2.5px solid #EA580C' : '2.5px solid #F59E0B', boxSizing: 'border-box', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <AlertCircle size={14} color={activePopupAlert.category === 'High Priority' ? '#EA580C' : '#D97706'} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: activePopupAlert.category === 'High Priority' ? '#EA580C' : '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.livePilgrimAlert}</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', fontFamily: 'var(--font-hero), Georgia, serif' }}>{activePopupAlert.title}</h3>
            <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 12px 0', lineHeight: 1.45 }}>{activePopupAlert.description}</p>
            {activePopupAlert.image && (
              <img src={activePopupAlert.image} alt={activePopupAlert.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '16px' }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              {activePopupAlert.cta !== 'None' && (
                <button
                  onClick={() => {
                    dismissAlert(activePopupAlert.id);
                    if (activePopupAlert.cta === 'Open Queue') router.push('/essentials');
                    else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
                    else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
                    else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
                  }}
                  style={{ flex: 1, background: '#E9801D', color: '#FFFFFF', border: 'none', borderRadius: '12px', padding: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {activePopupAlert.cta}
                </button>
              )}
              <button
                onClick={() => dismissAlert(activePopupAlert.id)}
                style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                {t.dismiss}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
