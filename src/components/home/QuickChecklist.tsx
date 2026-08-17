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
      <div style={{ padding: '0 16px 4px 16px' }}>
        <div
          onClick={() => router.push('/live')}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.06)',
            borderRadius: '22px',
            padding: '18px 18px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)'
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ticket size={15} color="#0F5132" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{t.ssdStatus}</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '20px',
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
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', display: 'block' }}>
                  {t.nextRelease}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B', marginTop: '1px', display: 'block' }}>
                  {liveStatus.ssdNextTokenTime ? liveStatus.ssdNextTokenTime : (liveStatus.ssdTokenStatus === 'issuing' ? t.tokensBeingIssued : '4:00 AM')}
                </span>
              </div>
            </div>
            {liveStatus.ssdNotice && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#334155',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                padding: '4px 10px',
                borderRadius: '8px',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {liveStatus.ssdNotice}
              </span>
            )}
          </div>

          {/* Non-redundant status helper text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, lineHeight: 1.4 }}>
              {liveStatus.ssdTokenStatus === 'issuing'
                ? t.activelyIssuing
                : liveStatus.ssdTokenStatus === 'paused'
                ? t.issuingPaused
                : t.quotaCompleted}
            </span>
          </div>

          {/* Counter locations */}
          {liveStatus.ssdCounters && liveStatus.ssdCounters.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
                {t.collectionCentres}
              </span>
              {liveStatus.ssdCounters.map((c: any, i: number) => {
                const counterDescs: Record<string, string> = {
                  'Vishnu Nivasam Counter': lang === 'te' ? 'తిరుపతి రైల్వే స్టేషన్ ఎదురుగా (రైలు ప్రయాణికులకు సులభం)' : 'Opposite Railway Station (Convenient for train travelers)',
                  'Srinivasam Complex Counter': lang === 'te' ? 'RTC సెంట్రల్ బస్ స్టాండ్ ఎదురుగా (బస్సు ప్రయాణికులకు సులభం)' : 'Opposite Central Bus Stand (Ideal for bus travelers)',
                  'Bhudevi Complex Counter': lang === 'te' ? 'అలిపిరి నడకదారి వద్ద (కాలిబాట యాత్రికులకు సులభం)' : 'Near Alipiri Footpath (Ideal for walking pilgrims)',
                };
                const desc = counterDescs[c.name] || c.description;
                const name = lang === 'te' ? (c.name.includes('Vishnu') ? 'విష్ణు నివాసం కౌంటర్' : c.name.includes('Srinivasam') ? 'శ్రీనివాసం కాంప్లెక్స్ కౌంటర్' : c.name.includes('Bhudevi') ? 'భూదేవి కాంప్లెక్స్ కౌంటర్' : c.name) : c.name;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={14} color="#0F5132" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', lineHeight: 1.3 }}>{name}</span>
                      <span style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4, marginTop: '1px', display: 'block' }}>{desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Daily timing guide */}
          {liveStatus.ssdTimingsGuide && (
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <Clock size={12} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.5 }}>
                {lang === 'te' 
                  ? 'ఉచిత SSD టోకెన్లు ప్రతిరోజూ ఉదయం జారీ చేయబడతాయి. రోజువారీ కోటా (~15,000 - 20,000 టోకెన్లు) పూర్తయిన వెంటనే కౌంటర్లు మూసివేయబడతాయి.'
                  : liveStatus.ssdTimingsGuide}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

