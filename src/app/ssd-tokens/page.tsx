'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Ticket, Clock, ShieldAlert, CheckCircle2, XCircle, 
  MapPin, Train, Bus, Mountain, Compass, RefreshCw, Share2, Check, 
  ExternalLink, Info, Sparkles, ChevronRight, Navigation, Users, 
  Lock, AlertCircle, Calendar, ShieldCheck, Gift
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';
import SaarthiGuidanceCard from '@/components/SaarthiGuidanceCard';

const COLLECTION_CENTRES = [
  {
    id: 'vishnu-nivasam',
    nameEn: 'Vishnu Nivasam Complex',
    nameTe: 'విష్ణు నివాసం కాంప్లెక్స్',
    landmarkEn: 'Directly opposite Tirupati Main Railway Station (Platform 1 Exit)',
    landmarkTe: 'తిరుపతి రైల్వే స్టేషన్ ప్లాట్‌ఫారమ్ 1 ఎదురుగా',
    counterHours: 'Opens at 2:00 AM daily (until quota lasts)',
    quotaInfoEn: 'High-capacity counter; fills quickly due to train arrivals',
    quotaInfoTe: 'రైలు భక్తులు ఎక్కువగా వచ్చే ప్రధాన కేంద్రం',
    iconType: 'train',
    mapsUrl: 'https://www.google.com/maps/place/Vishnu+Nivasam/@13.6292776,79.4215889'
  },
  {
    id: 'srinivasam',
    nameEn: 'Srinivasam Complex',
    nameTe: 'శ్రీనివాసం కాంప్లెక్స్',
    landmarkEn: 'Opposite Tirupati Central RTC Bus Station',
    landmarkTe: 'తిరుపతి సెంట్రల్ ఆర్టీసీ బస్టాండ్ ఎదురుగా',
    counterHours: 'Opens at 2:00 AM daily (until quota lasts)',
    quotaInfoEn: 'Primary counter for bus passengers with multi-lane desks',
    quotaInfoTe: 'ఆర్టీసీ బస్సు భక్తుల కోసం బహుళ బయోమెట్రిక్ కౌంటర్లు',
    iconType: 'bus',
    mapsUrl: 'https://www.google.com/maps/place/Srinivasam/@13.6315627,79.4288389'
  },
  {
    id: 'bhudevi',
    nameEn: 'Bhudevi Complex',
    nameTe: 'భూదేవి కాంప్లెక్స్',
    landmarkEn: 'Alipiri Foot of the Hills (Alipiri Bypass Bus Stop)',
    landmarkTe: 'అలిపిరి మెట్ల మార్గం ప్రారంభం వద్ద',
    counterHours: 'Opens at 2:00 AM daily (until quota lasts)',
    quotaInfoEn: 'Recommended for private vehicle travelers & footpath pilgrims',
    quotaInfoTe: 'సొంత వాహనాలు మరియు నడకదారి భక్తులకు అత్యంత అనుకూలం',
    iconType: 'mountain',
    mapsUrl: 'https://www.google.com/maps/place/Bhudevi+complex/@13.6464948,79.4097309'
  }
];

export default function SsdTokensStandalonePage() {
  const router = useRouter();
  const lang = useLanguage();

  const [ssdStatus, setSsdStatus] = useState<'issuing' | 'paused' | 'closed-for-day'>('closed-for-day');
  const [nextTokenTime, setNextTokenTime] = useState<string>('2:00 AM');
  const [notice, setNotice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [copied, setCopied] = useState(false);

  const fetchStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/v1/status', { cache: 'no-store' });
      if (res.ok) {
        const data: TirumalaStatus = await res.json();
        if (data.ssdTokenStatus) setSsdStatus(data.ssdTokenStatus);
        if (data.ssdNextTokenTime) setNextTokenTime(data.ssdNextTokenTime);
        if (data.ssdNotice) setNotice(data.ssdNotice);

        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Failed to fetch SSD token status:', err);
    } finally {
      setLoading(false);
      if (isManual) setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 20000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const getStatusBadge = () => {
    if (ssdStatus === 'issuing') {
      return { textEn: 'Issuing Now', textTe: 'ఇప్పుడు జారీ అవుతున్నాయి', bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' };
    }
    if (ssdStatus === 'paused') {
      return { textEn: 'Issuing Paused', textTe: 'తాత్కాలికంగా నిలిపివేయబడింది', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
    }
    return { textEn: 'Closed for Day', textTe: 'ఈ రోజుకు పూర్తయింది', bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      paddingBottom: '5rem',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)'
    }}>
      {/* ── 1. STICKY TOP APP BAR ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        zIndex: 100
      }}>
        <button 
          onClick={() => router.back()} 
          style={{
            background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
            width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981',
            flexShrink: 0, boxShadow: '0 0 6px #10B981'
          }} />
          <h1 style={{
            fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {lang === 'te' ? 'టీటీడీ ఎస్‌ఎస్‌డి ఉచిత టోకెన్ సెంటర్లు' : 'SSD Free Token Live Status & Counters'}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => fetchStatus(true)} 
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
              width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Refresh status"
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          </button>
          <button 
            onClick={handleShare} 
            style={{
              background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#334155',
              width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
            title="Share"
          >
            {copied ? <Check size={16} color="#16A34A" /> : <Share2 size={16} />}
          </button>
        </div>
      </header>

      {/* Copy Toast */}
      {copied && (
        <div style={{
          position: 'fixed', top: '68px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '12.5px', fontWeight: 700,
          padding: '8px 16px', borderRadius: '99px', display: 'flex', alignItems: 'center',
          gap: '6px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)', zIndex: 1000
        }}>
          <CheckCircle2 size={15} /> Link copied to clipboard
        </div>
      )}

      {/* ── MAIN CONTENT GRID ── */}
      <main style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* ── 1. HERO LIVE STATUS CARD ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.05)'
        }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFE4E6',
                color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Ticket size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0, color: '#0F172A' }}>
                  {lang === 'te' ? 'ఎస్‌ఎస్‌డి టోకెన్ ప్రత్యక్ష సమాచారం' : 'SSD Token Live Status'}
                </h2>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {lang === 'te' ? 'స్లాటెడ్ సర్వదర్శనం (తిరుపతి)' : 'Slotted Sarva Darshan (Tirupati)'}
                </span>
              </div>
            </div>

            <span style={{
              fontSize: '11.5px', fontWeight: 800, padding: '4px 12px', borderRadius: '99px',
              backgroundColor: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}`
            }}>
              {lang === 'te' ? statusBadge.textTe : statusBadge.textEn}
            </span>
          </div>

          {/* Dynamic Advisory Notice Banner */}
          {notice && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px'
            }}>
              <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                  {lang === 'te' ? 'ముఖ్యమైన హెచ్చరిక' : 'IMPORTANT ADVISORY'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#7F1D1D', marginTop: '2px', display: 'block', lineHeight: 1.4 }}>
                  {notice}
                </span>
              </div>
            </div>
          )}

          {/* Next Token Release Time Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
            border: '1px solid #FECDD3',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#E11D48" />
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#9F1239', textTransform: 'uppercase' }}>
                  {lang === 'te' ? 'మరుసటి రోజు టోకెన్ జారీ సమయం' : 'Next Token Release / Counter Opening'}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#881337' }}>
                  {nextTokenTime || '2:00 AM Daily'}
                </div>
              </div>
            </div>

            <span style={{ fontSize: '11px', color: '#9F1239', fontWeight: 700 }}>
              {lastSyncTime}
            </span>
          </div>
        </section>

        {/* ✨ SAARTHI GUIDANCE CARD */}
        <SaarthiGuidanceCard />

        {/* ── 2. COLLECTION CENTRES (TIRUPATI COUNTERS WITH DIRECT MAPS) ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#E11D48" />
              <span>{lang === 'te' ? 'తిరుపతి ఎస్‌ఎస్‌డి టోకెన్ కౌంటర్లు' : 'Tirupati Token Counter Locations'}</span>
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>3 Centers</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COLLECTION_CENTRES.map((center) => {
              const icon = center.iconType === 'train' ? <Train size={18} color="#2563EB" /> : center.iconType === 'bus' ? <Bus size={18} color="#D97706" /> : <Mountain size={18} color="#059669" />;
              const iconBg = center.iconType === 'train' ? '#EFF6FF' : center.iconType === 'bus' ? '#FEF3C7' : '#D1FAE5';
              return (
                <div key={center.id} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', backgroundColor: iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        {icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {lang === 'te' ? center.nameTe : center.nameEn}
                        </h4>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                          {lang === 'te' ? center.landmarkTe : center.landmarkEn}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#E11D48', backgroundColor: '#FFE4E6', padding: '2px 8px', borderRadius: '6px' }}>
                            ⏱ {center.counterHours}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={center.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A',
                        padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800,
                        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0
                      }}
                    >
                      <Compass size={13} /> Maps
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 3. MANDATORY RULES & CHECKLIST ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#16A34A" />
            <span>{lang === 'te' ? 'టోకెన్ పొందడానికి తప్పనిసరి నియమాలు' : 'Mandatory Rules & Requirements'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Original Aadhaar Card Mandatory</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Every individual pilgrim (including children 5+ years) MUST carry their physical original Aadhaar card.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>In-Person Physical Presence Required</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Live biometric facial photo and fingerprint scan is taken at the counter. One person cannot collect for absent family members.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>30-Day Frequency Limit Rule</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>A pilgrim can obtain an SSD biometric token only once every 30 days per Aadhaar number.</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Strict Slotted Reporting Time</strong>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>Report to the specified Tirumala queue gate at the exact slot printed on your biometric slip.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. STEP-BY-STEP DARSHAN FLOW ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Navigation size={16} color="#4F46E5" />
            <span>{lang === 'te' ? 'ఎస్‌ఎస్‌డి టోకెన్ దర్శన విధానం' : 'SSD Token Journey Steps'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { step: 1, title: "Reach Token Counter in Tirupati", desc: "Visit Vishnu Nivasam, Srinivasam, or Bhudevi complex early morning (around 1:30 AM - 3:00 AM).", time: "30 Mins" },
              { step: 2, title: "Aadhaar Biometric Scan & Token Printout", desc: "Scan Aadhaar & take live photo. Receive printed slip with assigned Tirumala reporting time slot.", time: "15 Mins" },
              { step: 3, title: "Rest & Travel to Tirumala", desc: "Relax in Tirupati or ascend to Tirumala via ghat road or footpath 2 hours ahead of your slotted time.", time: "2 - 4 Hours" },
              { step: 4, title: "Report at Slotted Queue Gate in Tirumala", desc: "Arrive at the designated SSD entry gate at the exact slot printed on your token.", time: "15 Mins" },
              { step: 5, title: "Biometric Fingerprint Re-Scan", desc: "Biometric verification matches your fingerprint taken during token collection in Tirupati.", time: "20 Mins" },
              { step: 6, title: "Fast-Track Srivari Darshan & Free Laddu", desc: "Move through minimal holding compartments into Garbhagriha for Srivari Darshan and collect free Laddu.", time: "2.5 - 4 Hours" }
            ].map((st) => (
              <div key={st.step} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#EEF2FF',
                  color: '#4F46E5', fontSize: '12px', fontWeight: 900, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {st.step}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{st.title}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>{st.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. QUICK NAVIGATION ACTION LINKS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <Link href="/darshan/sarva-darshan" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '12px', textAlign: 'center', color: '#0F172A', fontSize: '12px', fontWeight: 800
            }}>
              Sarva Darshan Guide $\rightarrow$
            </div>
          </Link>

          <Link href="/darshan/special-entry" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
              padding: '12px', textAlign: 'center', color: '#4F46E5', fontSize: '12px', fontWeight: 800
            }}>
              ₹300 Special Entry $\rightarrow$
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}
