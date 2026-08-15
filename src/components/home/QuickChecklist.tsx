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
          SSD TOKEN CARD
          ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '0 16px 4px 16px' }}>
        <div
          onClick={() => router.push('/live')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #ECE9E3',
            borderRadius: '20px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ticket size={18} color="#7C3AED" />
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
            padding: '12px 16px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={20} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#64748B', display: 'block' }}>
                  {t.nextRelease}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B', marginTop: '2px', display: 'block' }}>
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
                border: '1px solid #CBD5E1',
                padding: '4px 10px',
                borderRadius: '8px',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
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
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                {t.collectionCentres}
              </span>
              {liveStatus.ssdCounters.map((c: any, i: number) => {
                const counterDescs: Record<string, string> = {
                  'Vishnu Nivasam Counter': lang === 'te' ? 'తిరుపతి రైల్వే స్టేషన్ ఎదురుగా ఉంది (రైలు ప్రయాణికులకు అనుకూలం)' : 'Located opposite Tirupati Railway Station (Highly convenient for train travelers)',
                  'Srinivasam Complex Counter': lang === 'te' ? 'తిరుపతి RTC సెంట్రల్ బస్ స్టాండ్ ఎదురుగా ఉంది (బస్సు ప్రయాణికులకు అనుకూలం)' : 'Located opposite Tirupati RTC Central Bus Stand (Ideal for bus travelers)',
                  'Bhudevi Complex Counter': lang === 'te' ? 'అలిపిరి నడకదారి లింక్ రోడ్ వద్ద ఉంది (కాలిబాట యాత్రికులకు అనుకూలం)' : 'Located near Alipiri Footpath Link Road (Ideal for pedestrian pilgrims)',
                };
                const desc = counterDescs[c.name] || c.description;
                const name = lang === 'te' ? (c.name.includes('Vishnu') ? 'విష్ణు నివాసం కౌంటర్' : c.name.includes('Srinivasam') ? 'శ్రీనివాసం కాంప్లెక్స్ కౌంటర్' : c.name.includes('Bhudevi') ? 'భూదేవి కాంప్లెక్స్ కౌంటర్' : c.name) : c.name;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={14} color="#7C3AED" style={{ marginTop: '2px', flexShrink: 0 }} />
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
            <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '10px', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <Clock size={11} color="#a8a29e" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#a8a29e', lineHeight: 1.5 }}>
                {lang === 'te' 
                  ? 'ఉచిత SSD టోకెన్లు ప్రతిరోజూ ఉదయం 10:30 నుండి జారీ చేయబడతాయి. ఆ రోజు దర్శనం కోసం గంటకో బ్యాచ్ చొప్పున కేటాయించబడతాయి. రోజువారీ కోటా (~15,000 - 20,000 టోకెన్లు) పూర్తయిన వెంటనే కౌంటర్లు మూసివేయబడతాయి.'
                  : liveStatus.ssdTimingsGuide}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

