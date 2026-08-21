import React from 'react';
import { Clock, MapPin, Ticket, Flag, CheckCircle2, ArrowRight, Circle, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    ssdStatus: 'SSD Token Status',
    issuingNow: 'Issuing Now',
    paused: 'Paused',
    closed: 'Closed for Day',
    nextRelease: 'Next Release / Issuing Time',
    tokensBeingIssued: 'Tokens Being Issued Now',
    activelyIssuing: 'Tokens actively issuing — collect at counters listed below',
    issuingPaused: 'Issuing temporarily paused — next batch resume time above',
    quotaCompleted: 'Daily quota completed — next token release time indicated above',
    collectionCentres: 'Collection Centres',
  },
  te: {
    ssdStatus: 'SSD టోకెన్ స్థితి',
    issuingNow: 'ఇప్పుడు జారీ అవుతోంది',
    paused: 'తాత్కాలికంగా నిలిపివేయబడింది',
    closed: 'ఈ రోజుకు మూసివేయబడింది',
    nextRelease: 'తదుపరి విడుదల / జారీ సమయం',
    tokensBeingIssued: 'టోకెన్లు ఇప్పుడు జారీ అవుతున్నాయి',
    activelyIssuing: 'టోకెన్లు జారీ అవుతున్నాయి — కింద ఉన్న కౌంటర్ల వద్ద సేకరించండి',
    issuingPaused: 'జారీ తాత్కాలికంగా నిలిపివేయబడింది — తదుపరి బ్యాచ్ పునఃప్రారంభ సమయం పైన ఉంది',
    quotaCompleted: 'రోజువారీ కోటా పూర్తయింది — తదుపరి టోకెన్ విడుదల సమయం పైన సూచించబడింది',
    collectionCentres: 'సేకరణ కేంద్రాలు',
  }
};

export function QuickChecklist(props: any) {
  const { liveStatus } = props;
  const router = useRouter();
  const lang = useLanguage();
  const t = TEXTS[lang];

  if (!liveStatus) return null;

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          SSD TOKEN CARD (SOFT ELEVATION, HARMONIOUS TOKENS)
          ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '0 14px 2px 14px' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '18px',
            padding: '14px 14px',
            boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif)'
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={13} color="#0F5132" />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{t.ssdStatus}</span>
            </div>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '16px',
              background: liveStatus.ssdTokenStatus === 'issuing' ? '#DCFCE7' : liveStatus.ssdTokenStatus === 'paused' ? '#FEF3C7' : '#FEE2E2',
              color: liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#DC2626',
              border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#86EFAC' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`
            }}>
              {liveStatus.ssdTokenStatus === 'issuing' ? t.issuingNow : liveStatus.ssdTokenStatus === 'paused' ? t.paused : t.closed}
            </span>
          </div>

          {/* DYNAMIC ISSUING TIME BOX */}
          <div style={{
            background: liveStatus.ssdTokenStatus === 'issuing' ? '#F0FDF4' : liveStatus.ssdTokenStatus === 'paused' ? '#FFFBEB' : '#FEF2F2',
            border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#BBF7D0' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`,
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', display: 'block' }}>
                  {t.nextRelease}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B', marginTop: '1px', display: 'block' }}>
                  {liveStatus.ssdNextTokenTime ? liveStatus.ssdNextTokenTime : (liveStatus.ssdTokenStatus === 'issuing' ? t.tokensBeingIssued : '4:00 AM')}
                </span>
              </div>
            </div>
            {liveStatus.ssdNotice && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#991B1B',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                padding: '4px 10px',
                borderRadius: '8px',
                lineHeight: 1.3,
                textAlign: 'right'
              }}>
                {liveStatus.ssdNotice}
              </span>
            )}
          </div>

          {/* Non-redundant status helper text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500, lineHeight: 1.35 }}>
              {liveStatus.ssdTokenStatus === 'issuing'
                ? t.activelyIssuing
                : liveStatus.ssdTokenStatus === 'paused'
                ? t.issuingPaused
                : t.quotaCompleted}
            </span>
          </div>

          {/* Counter locations */}
          {liveStatus.ssdCounters && liveStatus.ssdCounters.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B' }}>
                {t.collectionCentres}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {liveStatus.ssdCounters.map((c: any, i: number) => {
                  const counterLocations: Record<string, string> = {
                    'Vishnu Nivasam Counter': lang === 'te' ? 'రైల్వే స్టేషన్ ఎదురుగా' : 'Opp. Railway Station',
                    'Srinivasam Complex Counter': lang === 'te' ? 'బస్ స్టాండ్ ఎదురుగా' : 'Opp. Central Bus Stand',
                    'Bhudevi Complex Counter': lang === 'te' ? 'అలిపిరి వద్ద' : 'Near Alipiri',
                  };
                  const loc = counterLocations[c.name] || c.description;
                  const name = lang === 'te' ? (c.name.includes('Vishnu') ? 'విష్ణు నివాసం' : c.name.includes('Srinivasam') ? 'శ్రీనివాసం' : c.name.includes('Bhudevi') ? 'భూదేవి' : c.name) : c.name.replace(' Counter', '');
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <MapPin size={12} color="#0F5132" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{name}</span>
                      <span style={{ color: '#64748B', fontSize: '11px', fontWeight: 500 }}>• {loc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Daily timing guide / Custom Admin Info */}
          {liveStatus.ssdTimingsGuide && (
            <div style={{
              borderTop: '1px solid #F1F5F9',
              paddingTop: '10px',
              marginTop: '8px',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              background: liveStatus.ssdTokenStatus === 'closed-for-day' ? '#FFFBEB' : '#F8FAFC',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${liveStatus.ssdTokenStatus === 'closed-for-day' ? '#FDE68A' : '#E2E8F0'}`
            }}>
              <Clock size={13} color={liveStatus.ssdTokenStatus === 'closed-for-day' ? '#B45309' : '#64748B'} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '11.5px', color: liveStatus.ssdTokenStatus === 'closed-for-day' ? '#92400E' : '#475569', lineHeight: 1.45, fontWeight: 500 }}>
                {liveStatus.ssdTimingsGuide}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

