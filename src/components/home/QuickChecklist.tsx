import React from 'react';
import { Clock, MapPin, Ticket, Flag, CheckCircle2, ArrowRight, Circle, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickChecklist(props: any) {
  const { liveStatus } = props;
  const router = useRouter();

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
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>SSD Token Status</span>
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
              {liveStatus.ssdTokenStatus === 'issuing' ? 'Issuing Now' : liveStatus.ssdTokenStatus === 'paused' ? 'Paused' : 'Closed for Day'}
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
                  Next Release / Issuing Time
                </span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: liveStatus.ssdTokenStatus === 'issuing' ? '#15803D' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B', marginTop: '2px', display: 'block' }}>
                  {liveStatus.ssdNextTokenTime ? liveStatus.ssdNextTokenTime : (liveStatus.ssdTokenStatus === 'issuing' ? 'Tokens Being Issued Now' : '4:00 AM')}
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
                ? 'Tokens actively issuing — collect at counters listed below'
                : liveStatus.ssdTokenStatus === 'paused'
                ? 'Issuing temporarily paused — next batch resume time above'
                : 'Daily quota completed — next token release time indicated above'}
            </span>
          </div>

          {/* Counter locations */}
          {liveStatus.ssdCounters && liveStatus.ssdCounters.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Collection Centres
              </span>
              {liveStatus.ssdCounters.map((c: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={14} color="#7C3AED" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', lineHeight: 1.3 }}>{c.name}</span>
                    <span style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.4, marginTop: '1px', display: 'block' }}>{c.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily timing guide */}
          {liveStatus.ssdTimingsGuide && (
            <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '10px', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <Clock size={11} color="#a8a29e" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#a8a29e', lineHeight: 1.5 }}>
                {liveStatus.ssdTimingsGuide}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

