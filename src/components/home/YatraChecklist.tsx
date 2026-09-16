'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, IdCard, Shirt, Coins, Pill, Smartphone, Check, Briefcase } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleTe: string;
  shortEn: string;
  shortTe: string;
  descEn: string;
  descTe: string;
  tagEn: string;
  tagTe: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'aadhaar',
    titleEn: 'Original Physical Aadhaar Card',
    titleTe: 'అసలు ఆధార్ కార్డు (ఒరిజినల్)',
    shortEn: 'ID Card',
    shortTe: 'ఆధార్ ID',
    descEn: 'Required for all members. Photos or xerox copies are rejected at Vaikuntam queue.',
    descTe: 'అన్ని వయసుల వారికి తప్పనిసరి. ఫోన్ ఫోటోలను అనుమతించరు.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి'
  },
  {
    id: 'dress',
    titleEn: 'Traditional Dress Code Compliant',
    titleTe: 'సాంప్రదాయ వస్త్రధారణ నియమావళి',
    shortEn: 'Dress Code',
    shortTe: 'వస్త్రధారణ',
    descEn: 'Men: Dhoti/Kurta. Women: Saree/Chudidar. Jeans and Western wear are barred.',
    descTe: 'పురుషులు: ధోతీ/కుర్తా. స్త్రీలు: చీర/చుడీదార్.',
    tagEn: 'Mandatory',
    tagTe: 'తప్పనిసరి'
  },
  {
    id: 'cash',
    titleEn: 'Physical Cash & ₹50 Notes',
    titleTe: 'నగదు & ₹50 నోట్లు',
    shortEn: 'Cash & Coins',
    shortTe: 'నగదు',
    descEn: 'For extra Srivari Laddus (₹50 each) and locker tokens. Mobile UPI often fails.',
    descTe: 'అదనపు లడ్డూల కోసం. కొండపై యూపీఐ ఆగిపోయే ప్రమాదం ఉంది.',
    tagEn: 'Recommended',
    tagTe: 'సిఫార్సు'
  },
  {
    id: 'medicine',
    titleEn: 'Personal Medication & Water',
    titleTe: 'వ్యక్తిగత మందులు & నీరు',
    shortEn: 'Meds & Water',
    shortTe: 'మందులు',
    descEn: 'Queue waiting in compartments can span 4–10 hours. Keep daily pills handy.',
    descTe: 'క్యూ వేచి ఉండే సమయం 4-10 గంటలు ఉండవచ్చు. మందులను పౌచ్‌లో ఉంచుకోండి.',
    tagEn: 'Elders & Kids',
    tagTe: 'ముఖ్యమైనది'
  },
  {
    id: 'powerbank',
    titleEn: 'Charged Phone & Power Bank',
    titleTe: 'ఫోన్ & పవర్ బ్యాంక్',
    shortEn: 'Phone & Power',
    shortTe: 'ఫోన్',
    descEn: 'Phones are permitted inside waiting compartments; deposit safely before sanctum.',
    descTe: 'కంపార్ట్‌మెంట్లలో ఫోన్లు అనుమతిస్తారు. గర్భాలయ ప్రవేశానికి ముందు ఉచితంగా డిపాజిట్ చేయవచ్చు.',
    tagEn: 'Helpful',
    tagTe: 'ఉపయోగకరం'
  }
];

const STORAGE_KEY = 'saarthi_yatra_checklist_v1';

export function YatraChecklist() {
  const lang = useLanguage();
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCheckedIds(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const getItemIcon = (id: string, isChecked: boolean, color = '#D97706') => {
    if (isChecked) return <Check size={16} color="#16A34A" />;
    switch (id) {
      case 'aadhaar': return <IdCard size={16} color={color} />;
      case 'dress': return <Shirt size={16} color={color} />;
      case 'cash': return <Coins size={16} color={color} />;
      case 'medicine': return <Pill size={16} color={color} />;
      case 'powerbank': return <Smartphone size={16} color={color} />;
      default: return <Briefcase size={16} color={color} />;
    }
  };

  const completedCount = CHECKLIST_ITEMS.filter(item => checkedIds[item.id]).length;
  const isAllDone = completedCount === CHECKLIST_ITEMS.length;

  return (
    <div style={{ padding: '0 14px', marginBottom: '14px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04), 0 2px 6px rgba(15, 23, 42, 0.02)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)'
      }}>
        {/* Header Row */}
        <div
          onClick={() => setIsExpanded(prev => !prev)}
          style={{
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: isAllDone ? 'rgba(240, 253, 244, 0.6)' : '#FFFFFF',
            borderBottom: isExpanded ? '1px solid rgba(15, 23, 42, 0.06)' : 'none',
            transition: 'background-color 0.2s ease'
          }}
          role="button"
          aria-expanded={isExpanded}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(217, 119, 6, 0.12)',
              border: `1.5px solid ${isAllDone ? '#86EFAC' : '#0F172A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={15} color={isAllDone ? '#15803D' : '#D97706'} />
            </div>
            <span style={{
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.01em'
            }}>
              {lang === 'te' ? 'యాత్ర అత్యవసర చెక్‌లిస్ట్' : 'Yatra Essentials'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2.5px 9px',
              borderRadius: '12px',
              backgroundColor: isAllDone ? '#DCFCE7' : 'rgba(15, 23, 42, 0.06)',
              color: isAllDone ? '#166534' : '#334155',
              border: `1px solid ${isAllDone ? '#BBF7D0' : 'rgba(15, 23, 42, 0.1)'}`
            }}>
              {isClient ? `${completedCount}/5` : '5 Items'}
            </span>
            {isExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
          </div>
        </div>

        {/* FAST SVG ICON CHIPS ROW (STRICTLY NO EMOJIS) */}
        <div style={{
          padding: '10px 12px 12px 12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px',
          backgroundColor: '#FAF8F4'
        }}>
          {CHECKLIST_ITEMS.map(item => {
            const isChecked = isClient && !!checkedIds[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => toggleItem(item.id, e)}
                title={lang === 'te' ? item.titleTe : item.titleEn}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 4px',
                  borderRadius: '12px',
                  background: isChecked ? 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' : '#FFFFFF',
                  border: `1.5px solid ${isChecked ? '#86EFAC' : '#E2E8F0'}`,
                  boxShadow: isChecked ? '0 2px 6px rgba(22, 163, 74, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '22px', marginBottom: '2px' }}>
                  {getItemIcon(item.id, isChecked, isChecked ? '#15803D' : '#D97706')}
                </div>
                <span style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  color: isChecked ? '#14532D' : '#334155',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}>
                  {lang === 'te' ? item.shortTe : item.shortEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expandable Details for Each Item */}
        {isExpanded && (
          <div style={{ padding: '10px 14px 12px 14px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CHECKLIST_ITEMS.map(item => {
              const isChecked = isClient && !!checkedIds[item.id];
              return (
                <div
                  key={item.id}
                  onClick={(e) => toggleItem(item.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    backgroundColor: isChecked ? '#F0FDF4' : '#FFFFFF',
                    border: `1px solid ${isChecked ? '#BBF7D0' : '#E2E8F0'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>
                    {getItemIcon(item.id, isChecked, isChecked ? '#16A34A' : '#475569')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: isChecked ? '#166534' : '#0F172A', textDecoration: isChecked ? 'line-through' : 'none' }}>
                      {lang === 'te' ? item.titleTe : item.titleEn}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#475569', marginTop: '1px' }}>
                      {lang === 'te' ? item.descTe : item.descEn}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
