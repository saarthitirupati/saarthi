'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Clock, Users, Shirt, Car, Sparkles, CalendarDays, Info, Flame, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { safeFetchJson } from '@/lib/safeFetch';

const CROWD_COLORS: Record<string, { bg: string; text: string }> = {
  'very high': { bg: '#FEE2E2', text: '#991B1B' },
  'high':      { bg: '#FEF3C7', text: '#92400E' },
  'moderate':  { bg: '#ECFDF5', text: '#065F46' },
  'low':       { bg: '#EFF6FF', text: '#1E40AF' },
  'extreme':   { bg: '#FEE2E2', text: '#991B1B' },
};

function getImportanceIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('brahmotsavam')) return <Flame size={48} color="#FFFFFF" />;
  return <Sparkles size={48} color="#FFFFFF" />;
}

function fmt(d: string) {
  try { return new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return d; }
}

type FestivalDetail = { longDescription: string; highlights: string[]; travelTips: string[] };

const FESTIVAL_DETAILS: Record<string, FestivalDetail> = {
  brahmotsavam: {
    longDescription: `On September 15–23, 2026, Tirumala will host the grand Salakatla Srivari Brahmotsavams — the most sacred nine-day festival of the year. The festivities begin with Dhwajarohanam (flag hoisting) on September 15 and culminate with Chakra Snanam on September 23.

Each day features magnificent processions (vahanams) around the Mada Streets. On September 17, the Lord is carried on the Simha Vahanam in the morning and the Mutyapu Pandiri Vahanam at night. A special Snapana Tirumanjanam (sacred bath) also takes place from 1:00 PM to 3:00 PM.

Garuda Vahanam — the most spectacular procession — takes place on September 19, when Lord Malayappa Swamy rides the divine eagle to bless thousands of assembled devotees.`,
    highlights: [
      'Dhwajarohanam (Flag Hoisting) — Sep 15',
      'Simha Vahanam (Morning) — Sep 17',
      'Mutyapu Pandiri Vahanam (Night) — Sep 17',
      'Garuda Vahanam — Sep 19 (Most Spectacular)',
      'Chakra Snanam — Sep 23',
    ],
    travelTips: [
      'Most Arjitha Sevas & Virtual Sevas are cancelled during Brahmotsavams.',
      'Darshan limited to ₹300 Special Entry & SRIVANI Trust quotas.',
      'Book tickets exclusively on the official TTD Online Booking Portal.',
      'Arrive 2–3 days early; accommodation fills weeks in advance.',
      'Private vehicles not permitted on Tirumala Hill roads during peak days.',
    ],
  },
  'vaikunta-ekadashi': {
    longDescription: `Vaikuntha Ekadasi is the most auspicious day in the Vaishnava calendar, believed to be the day when the gates of Vaikuntam (Lord Vishnu's divine abode) are opened to all. At Tirumala, this is celebrated with extraordinary devotion.

The signature event is the Uttara Dwara Darshanam — devotees pass through the celestial Vaikuntha Dwaram gate that is opened exclusively on this one day, symbolising liberation (moksha). The queue spans many kilometres as lakhs of pilgrims from across India converge on Tirumala.

The Ekadasi fast (Upavasam) is observed by millions, and special sevas like Thomala and Archana are performed throughout the night.`,
    highlights: [
      'Vaikuntha Dwaram gate opened — Uttara Dwara Darshanam',
      'Night-long Upavasam (fasting) observed by devotees',
      'Thomala & Archana sevas performed all night',
      'Chakra Snanam at Swami Pushkarini on Dwadasi (next day)',
      'Lord seen in Hamsa Vahanam in the evening',
    ],
    travelTips: [
      'Darshan tokens sell out months in advance — book as soon as TTD opens slots.',
      'Expect 20–30 hour queue waits for general darshan without a token.',
      'All special sevas (Arjitha, Virtual) are typically suspended.',
      'Stay in Tirupati city and take TTD-operated buses to Tirumala.',
      'Bring warm clothing — Tirumala is cold in December nights.',
    ],
  },
  rathasapthami: {
    longDescription: `Rathasapthami marks the seventh day after Vaikuntha Ekadasi and is celebrated as the birthday of Surya (the Sun God). At Tirumala, it is observed as an auspicious day when Lord Venkateswara is taken out in a procession on seven different vahanams, representing the seven horses of the Sun's chariot.

The festival is also known as "Surya Jayanthi" and is celebrated across India. At Tirumala, the seven consecutive vahanams — starting from the Surya Prabha Vahanam at dawn and ending with the Chandra Prabha Vahanam at night — make it one of the most visually spectacular festivals.`,
    highlights: [
      'Surya Prabha Vahanam at dawn',
      'Seven consecutive vahanams throughout the day',
      'Chandra Prabha Vahanam (Moon Chariot) at night',
      'Auspicious Abhishekam performed for Suryanarayana',
      'Devotees take a ritual bath before sunrise',
    ],
    travelTips: [
      'Arrive the evening before to secure a good viewing spot on the Mada Streets.',
      'Crowd peaks during morning and evening vahanams.',
      'Book accommodation in Tirupati at least 2 weeks in advance.',
      'Dress in traditional attire as a mark of respect.',
      'TTD runs special buses from Tirupati bus stand from 3:00 AM.',
    ],
  },
  'garuda-seva': {
    longDescription: `Pournami Garuda Seva is one of the most visually spectacular festivals at Tirumala, held on full moon nights. Lord Malayappa Swamy, the processional deity of Sri Venkateswara, is ceremonially mounted on the golden Garuda (divine eagle) Vahanam and taken in a procession around the four Mada Streets.

The spectacle of the gilded eagle carrier moving under the full moonlight, with thousands of devotees singing "Govinda! Govinda!" on either side of the street, is described by pilgrims as a once-in-a-lifetime spiritual experience.

The Garuda is believed to be the divine vehicle of Lord Vishnu, and having his darshan while seated on Garuda is considered equivalent to attaining moksha.`,
    highlights: [
      'Lord Malayappa Swamy on golden Garuda Vahanam',
      'Full-moon night procession around all four Mada Streets',
      'Thousands of devotees chanting "Govinda! Govinda!"',
      'Special Archana and Pushpa Kainkaryam (flower offering)',
      'Procession visible from vantage points along the Mada Streets',
    ],
    travelTips: [
      'Procession typically begins around 7:00 PM — arrive by 6:00 PM to secure a spot.',
      'The streets get extremely crowded; stay near official barricades.',
      'Photography is allowed from designated zones only.',
      'Darshan inside the temple is restricted during the procession hours.',
      'Book Tirupati hotels as full-moon days are always high-traffic.',
    ],
  },
  jyeshtabhishekam: {
    longDescription: `Jyeshtabhishekam is a three-day sacred ritual (June 26–28, 2026) where the divine gold protective armour (Kavacham) is placed on the deities to shield them from the intense summer heat. It is one of the rarest sevas performed at Tirumala, observed during the Jyeshtha month.

The Abhishekam involves sacred baths of the main deity with panchamritam (a mixture of milk, honey, curd, ghee, and sugar), followed by elaborate decorations with fresh sandalwood paste and fragrant flowers. Devotees who witness this Abhishekam are believed to be cleansed of all sins.`,
    highlights: [
      'Three-day Panchamritam Abhishekam (June 26–28)',
      'Sacred gold Kavacham (armour) placed on the deities',
      'Sandalwood paste decoration of the idol',
      'Rare live darshan of the main deity during bathing ritual',
      'Special Homams and Vedic chanting throughout',
    ],
    travelTips: [
      'This is a rare seva — book the earliest available slot on the TTD portal.',
      'Crowds are moderate compared to Brahmotsavams — a good time to visit.',
      'Best time: early morning sevas from 7:00 AM to 11:00 AM.',
      'Traditional attire (dhoti/saree) is strictly required.',
      'Avoid June weekends — opt for Monday or Thursday for shorter queues.',
    ],
  },
  'hanuman-jayanthi': {
    longDescription: `Hanuman Jayanthi at Tirumala is celebrated with special significance at the ancient Japali Hanuman Temple, located deep within the sacred forests of Tirumala. This temple is believed to be one of the oldest shrines on the Tirumala hills, predating even the main Venkateswara temple by centuries.

The festival involves a trek through the lush green forest of the Seshachalam range to reach the Japali temple. Special pujas, abhishekams, and decorations are performed for the Hanuman deity. Thousands of devotees — many observing a fast — undertake the forest trek as an act of devotion.`,
    highlights: [
      'Special Abhishekam at the ancient Japali Hanuman Temple',
      'Sacred forest trek through Seshachalam hills',
      'Large-scale Sundarakanda Parayanam (recitation)',
      'Prasadam distribution of Panakam and Vadapappu',
      'Rare open-air puja in the middle of the forest',
    ],
    travelTips: [
      'Wear comfortable trekking shoes — the forest path can be slippery.',
      'Carry water and light snacks; no shops on the trek route.',
      'The trek takes approximately 45 minutes one-way.',
      'Start early (by 6:00 AM) to avoid the midday heat.',
      'Forest entry is closed after 12:00 PM on Hanuman Jayanthi.',
    ],
  },
  'kartika-vanabhojana': {
    longDescription: `Kartika Vanabhojana Utsavam is one of the most unique and joyful festivals of Tirumala — a sacred community picnic held in the Purusaivari Thota (royal garden) of Tirumala. Held during the auspicious Kartika month, the festival celebrates the divine play of Lord Venkateswara in nature.

The Lord is taken in a procession to the sacred garden, where elaborate outdoor pujas, bhajans, and cultural performances take place. Thousands of devotees sit together in the open air for a community meal (prasadam), symbolising equality and brotherhood. The forested surroundings and cool Kartika weather make it a truly special experience.`,
    highlights: [
      'Lord\'s procession to Purusaivari Thota (royal garden)',
      'Open-air community prasadam meal for all devotees',
      'Cultural performances and Harikatha (devotional storytelling)',
      'Bhajan and music concerts in the garden',
      'Rare opportunity to see the Lord in an open-air natural setting',
    ],
    travelTips: [
      'Arrive early to find seating in the garden — it fills up by 9:00 AM.',
      'Dress warmly; December mornings in Tirumala are cold (10–15°C).',
      'Free prasadam is served — no need to buy food.',
      'The garden is about 1 km from the main temple — walkable.',
      'Photography permitted in the garden but not during the Lord\'s procession.',
    ],
  },
};

function getRichDetail(id: string, slug: string, name: string): FestivalDetail | null {
  const key = `${id} ${slug} ${name}`.toLowerCase();
  for (const [pattern, detail] of Object.entries(FESTIVAL_DETAILS)) {
    if (key.includes(pattern)) return detail;
  }
  return null;
}



export default function FestivalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [fest, setFest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all festivals (no date filter) so detail page works for any slug
    safeFetchJson<any>('/api/v1/festivals?all=1')
      .then((d) => {
        if (d) {
          const list = d.data || [];
          const match = list.find(
            (f: any) => f.slug === slug || f.id === slug
          );
          setFest(match || null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FDF8F5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '4px solid #FF9933', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#999', fontSize: 14 }}>Loading festival details…</p>
        </div>
      </div>
    );
  }

  if (!fest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FDF8F5', gap: 16 }}>
        <Sparkles size={48} color="#FF9933" />
        <h2 style={{ margin: 0, color: '#1F2937' }}>Festival not found</h2>
        <button onClick={() => router.back()} style={{ padding: '10px 24px', borderRadius: 12, background: '#FF9933', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const icon = getImportanceIcon(fest.name || '');
  const rawCrowd = String(fest.crowdPrediction || fest.crowd_level || fest.expectedCrowd || '').toLowerCase();
  const crowdColors = CROWD_COLORS[rawCrowd] || CROWD_COLORS['moderate'];
  const crowdLabel = rawCrowd ? rawCrowd.charAt(0).toUpperCase() + rawCrowd.slice(1) : '';
  const dateStr = fest.date ? `${fmt(fest.date)}${fest.dateEnd ? ` — ${fmt(fest.dateEnd)}` : ''}` : '';

  // Augment with rich detail based on festival id/slug/name
  const richDetail = getRichDetail(fest.id || '', fest.slug || '', fest.name || '');

  const highlights: string[] = richDetail?.highlights || (fest.rituals as string[]) || [];
  const travelTips: string[] = richDetail?.travelTips || (fest.specialTips ? [fest.specialTips] : []);
  const description = richDetail?.longDescription || fest.description || '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F5', fontFamily: 'var(--font-sans)' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #FF9933 0%, #FF6600 50%, #CC3300 100%)',
        padding: '56px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <button
          onClick={() => router.back()}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}
        >
          <ChevronLeft size={20} color="white" />
          <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>Festivals</span>
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 12 }}>{icon}</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{fest.name}</h1>
          {dateStr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays size={16} color="rgba(255,255,255,0.85)" />
              <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: 14 }}>{dateStr}</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Body card — floats up over hero */}
      <div style={{ padding: '0 16px', marginTop: -32 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: 24, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', marginBottom: 16 }}
        >
          {/* Quick chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {crowdLabel && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 12px', borderRadius: 20, background: crowdColors.bg, color: crowdColors.text, fontWeight: 700 }}>
                <Users size={13} /> {crowdLabel} Crowd
              </span>
            )}
            {fest.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1E40AF', fontWeight: 700 }}>
                <MapPin size={13} /> {fest.location}
              </span>
            )}
            {(fest.recommendedTime || fest.recommended_time) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 12px', borderRadius: 20, background: '#F0FDF4', color: '#166534', fontWeight: 700 }}>
                <Clock size={13} /> {fest.recommendedTime || fest.recommended_time}
              </span>
            )}
            {(fest.dressCode || fest.dress_code) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 12px', borderRadius: 20, background: '#F3F0FF', color: '#6C63FF', fontWeight: 700 }}>
                <Shirt size={13} /> {fest.dressCode || fest.dress_code}
              </span>
            )}
            {fest.parking && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '5px 12px', borderRadius: 20, background: '#FFF7ED', color: '#9A3412', fontWeight: 700 }}>
                <Car size={13} /> Parking: {fest.parking}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <>
              <h2 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>About this Festival</h2>
              {description.split('\n\n').map((para: string, i: number) => (
                <p key={i} style={{ margin: '0 0 12px', fontSize: 14, color: '#4B5563', lineHeight: 1.7 }}>{para.trim()}</p>
              ))}
            </>
          )}

          {/* Recommended Temple Link Box */}
          {(fest.placeId || fest.place_id) && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <Link
                href={`/place/${fest.placeId || fest.place_id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 16px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  border: '1px solid #A7F3D0',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.08)'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Recommended Shrine Visit
                  </span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '15px', fontWeight: 800, color: '#064E3B' }}>
                    {fest.location || 'Sri Kapileswara Swamy Temple'}
                  </h4>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669', background: 'white', padding: '6px 12px', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
                  View Temple &rarr;
                </span>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            style={{ background: 'white', borderRadius: 24, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.05)', marginBottom: 16 }}
          >
            <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#1F2937', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#FF9933" /> Key Highlights
            </h2>
            {highlights.map((h: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <Flame size={14} color="#FF9933" style={{ marginTop: 4, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{h}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Travel Tips */}
        {travelTips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            style={{ background: '#FFFBEB', borderRadius: 24, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: 32, border: '1px solid #FDE68A' }}
          >
            <h2 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={18} color="#D97706" /> Travel & Darshan Tips
            </h2>
            {travelTips.map((tip: string, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <AlertTriangle size={14} color="#D97706" style={{ marginTop: 4, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#78350F', lineHeight: 1.5 }}>{tip}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
