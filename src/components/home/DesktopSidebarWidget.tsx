'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, PhoneCall, Utensils, Award, ShieldAlert, Footprints, Clock, MapPin, ExternalLink, HeartPulse } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export function DesktopSidebarWidget() {
  const lang = useLanguage();

  const isTe = lang === 'te';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* ── CARD 1: FREE ANNAPRASADAM & LADDU RADAR ── */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Utensils size={17} color="#D97706" />
            <span>{isTe ? 'అన్నప్రసాదం & లడ్డూ కౌంటర్లు' : 'Annaprasadam & Laddu Radar'}</span>
          </h3>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '2px 7px', borderRadius: '6px' }}>
            {isTe ? 'ఉచిత భోజనం' : 'Free Service'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Annaprasadam Complex */}
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '14px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Utensils size={12} color="#D97706" />
              <span>{isTe ? 'మాతృశ్రీ తరిగొండ వెంగమాంబ' : 'Tarigonda Vengamamba'}</span>
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#78350F', lineHeight: 1.2 }}>
              {isTe ? 'ఉచిత అన్నప్రసాదం' : 'Free Unlimited Meals'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#B45309', marginTop: '4px', fontWeight: 600 }}>
              {isTe ? 'ఉదయం 9:00 - రాత్రి 11:00' : '9:00 AM – 11:00 PM'}
            </div>
          </div>

          {/* Laddu Counters */}
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '10px 12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} color="#16A34A" />
              <span>{isTe ? 'శ్రీవారి లడ్డూ కౌంటర్లు' : 'Srivari Laddu Complex'}</span>
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#14532D', lineHeight: 1.2 }}>
              {isTe ? '32 కౌంటర్లు ప్రారంభంలో' : '32 Active Counters'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
              {isTe ? '₹50/లడ్డూ (టోకెన్‌కు 4)' : '₹50/laddu (4 per token)'}
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 2: 24x7 HELPLINE & EMERGENCY DECK ── */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '7px' }}>
            <PhoneCall size={17} color="#DC2626" />
            <span>{isTe ? 'TTD 24x7 సహాయ కేంద్రాలు & అత్యవసరం' : '24x7 Helpline & Emergency Contacts'}</span>
          </h3>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '2px 7px', borderRadius: '6px' }}>
            {isTe ? 'టోల్ ఫ్రీ' : 'Toll Free'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* TTD Main Toll Free */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                {isTe ? 'TTD ఉచిత కాల్ సెంటర్' : 'TTD Toll-Free Call Centre'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                1800 425 4141 / 0877 2277777
              </div>
            </div>
            <a 
              href="tel:18004254141"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <Phone size={12} />
              <span>{isTe ? 'కాల్ చేయండి' : 'Call'}</span>
            </a>
          </div>

          {/* CRO Inquiry & Ashwini Hospital Emergency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '9px 10px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="#0284C7" />
                <span>{isTe ? 'సీఆర్వో విచారణ' : 'Tirumala CRO'}</span>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                0877 2263590
              </div>
            </div>

            <div style={{ backgroundColor: '#FEF2F2', padding: '9px 10px', borderRadius: '12px', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HeartPulse size={12} color="#DC2626" />
                <span>{isTe ? 'అశ్విని ఆసుపత్రి' : 'Medical 108'}</span>
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#7F1D1D', marginTop: '2px' }}>
                0877 2263456
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 3: FOOTPATH TREK RADAR ── */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '7px' }}>
            <Footprints size={17} color="#16A34A" />
            <span>{isTe ? 'సోపాన మార్గాలు & ఘాట్ రోడ్ సమయం' : 'Footpath Treks & Ghat Road Times'}</span>
          </h3>
          <Link href="/route" style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
            {isTe ? 'మార్గం చూడండి >' : 'View Route >'}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '9px 10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534' }}>
              {isTe ? 'అలిపిరి మెట్ల మార్గం' : 'Alipiri Footpath'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#14532D', marginTop: '2px' }}>
              ~3,550 {isTe ? 'మెట్లు' : 'Steps'} (3-4 hrs)
            </div>
          </div>

          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '9px 10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534' }}>
              {isTe ? 'శ్రీవారి మెట్టు మార్గం' : 'Srivari Mettu'}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#14532D', marginTop: '2px' }}>
              ~2,388 {isTe ? 'మెట్లు' : 'Steps'} (1.5-2 hrs)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
