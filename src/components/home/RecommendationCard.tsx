import React from 'react';
import Link from 'next/link';
import { Sparkles, Navigation, Users, Info } from 'lucide-react';

export function RecommendationCard({ liveStatus, todayFestival }: { liveStatus: any; todayFestival?: any }) {
  if (!liveStatus) return null;

  const date = new Date();
  const dayOfWeek = date.getDay();
  const hr = date.getHours();
  const isNight = hr >= 21 || hr < 5;
  const crowd = (liveStatus.crowdLevel || 'normal').toLowerCase();
  const weatherStr = (liveStatus.weather || '').toLowerCase();
  const isRainy = weatherStr.includes('rain') || weatherStr.includes('shower') || weatherStr.includes('storm');

  // Default Priority 4 Recommendation
  let rec = {
    title: 'Kapila Theertham',
    distance: '12 min away',
    crowdStatus: 'Peaceful Evening',
    link: '/place/kapila-theertham',
    image: '/assets/temples/kapila-theertham.png',
    priorityTag: 'Priority 3: Weekday Theme',
    reason: 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills'
  };

  // PRIORITY 1: Festival Calendar Override
  if (todayFestival && (todayFestival.isToday || todayFestival.isLive)) {
    rec = {
      title: todayFestival.location || 'Sri Venkateswara Swamy Temple',
      distance: '15 min away',
      crowdStatus: 'Festive Gathering',
      link: todayFestival.placeId ? `/place/${todayFestival.placeId}` : '/festivals',
      image: todayFestival.coverImage || '/assets/temples/venkateswara.png',
      priorityTag: 'Priority 1: Festival Calendar',
      reason: `Official venue for ${todayFestival.name || todayFestival.title}`
    };
  }
  // PRIORITY 2: Important Temple Day (Saturdays & Fridays)
  else if (dayOfWeek === 6) { // Saturday
    rec = {
      title: 'Sri Venkateswara Swamy Temple',
      distance: '15 min away',
      crowdStatus: 'High Devotion (Srivari Saturday)',
      link: '/place/venkateswara',
      image: '/assets/temples/venkateswara.png',
      priorityTag: 'Priority 2: Important Temple Day',
      reason: 'Holy Saturday · Primary Tirumala Seven Hills sanctum'
    };
  } else if (dayOfWeek === 5) { // Friday
    rec = {
      title: 'Sri Padmavathi Ammavari Temple',
      distance: '10 min away',
      crowdStatus: 'Divine Abhishekam Day',
      link: '/place/padmavathi',
      image: '/assets/temples/padmavathi.png',
      priorityTag: 'Priority 2: Important Temple Day',
      reason: 'Goddess Lakshmi Friday · Official Tiruchanoor divine consort shrine'
    };
  }
  // PRIORITY 3: Weekday Spiritual Calendar (Deity Respect)
  else if (dayOfWeek === 1) { // Monday - Lord Shiva
    rec = {
      title: 'Kapila Theertham',
      distance: '12 min away',
      crowdStatus: isNight ? 'Peaceful Evening' : 'Moderate Crowd',
      link: '/place/kapila-theertham',
      image: '/assets/temples/kapila-theertham.png',
      priorityTag: 'Priority 3: Lord Shiva Monday',
      reason: 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills'
    };
  } else if (dayOfWeek === 2) { // Tuesday - Hanuman / Bedi Anjaneya
    rec = {
      title: 'Japali Hanuman Temple',
      distance: '14 min away',
      crowdStatus: 'Low Wait Time',
      link: '/place/japali-hanuman',
      image: '/assets/temples/bedi-anjaneya.png',
      priorityTag: 'Priority 3: Hanuman Tuesday',
      reason: 'Hanuman Tuesday · Sacred Hanuman shrine on the Seven Hills'
    };
  } else if (dayOfWeek === 3) { // Wednesday - Lord Rama
    rec = {
      title: 'Sri Kodandarama Swamy Temple',
      distance: '8 min away',
      crowdStatus: 'Serene Atmosphere',
      link: '/place/kodandarama-temple',
      image: '/assets/temples/padmavathi.png',
      priorityTag: 'Priority 3: Lord Rama Wednesday',
      reason: 'Lord Rama Wednesday · 1,000-year historic Vijayanagara shrine'
    };
  } else if (dayOfWeek === 4) { // Thursday - Guru & Annamayya
    rec = {
      title: 'Sri Govindaraja Swamy Temple',
      distance: '6 min away',
      crowdStatus: 'Low Crowd',
      link: '/place/govindaraja',
      image: '/assets/temples/govindaraja.png',
      priorityTag: 'Priority 3: Guru Thursday',
      reason: 'Guru & Annamayya Thursday · Ancient heritage shrine in Tirupati town'
    };
  } else if (dayOfWeek === 0) { // Sunday - Surya Narayana
    rec = {
      title: 'Sri Bhu Varaha Swamy Temple',
      distance: '14 min away',
      crowdStatus: 'Traditional Entry',
      link: '/place/bhu-varaha',
      image: '/assets/temples/venkateswara.png',
      priorityTag: 'Priority 3: Surya Narayana Sunday',
      reason: 'Surya Narayana Sunday · Ancient shrine to be visited before main darshan'
    };
  }

  // PRIORITY 4: Weather / Live Crowd Context Override
  if (isRainy) {
    rec = {
      title: 'ISKCON Tirupati',
      distance: '8 min away',
      crowdStatus: 'Covered & Indoor',
      link: '/place/iskcon-tirupati',
      image: '/assets/temples/iskcon.png',
      priorityTag: 'Weather Context: Rain Friendly',
      reason: 'Rainy Weather · Covered indoor sanctum and comfortable seating'
    };
  } else if (crowd === 'heavy') {
    rec = {
      title: 'Sri Govindaraja Swamy Temple',
      distance: '6 min away',
      crowdStatus: 'Fast-Moving Line',
      link: '/place/govindaraja',
      image: '/assets/temples/govindaraja.png',
      priorityTag: 'Queue Context: High Crowd Alternate',
      reason: 'High Crowd in Tirumala · Fast entry alternate shrine in Tirupati town'
    };
  }

  return (
    <div style={{ padding: '0 16px 16px 16px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
      }}>
        
        {/* RECOMMENDED BADGE WITH PRIORITY TAG */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#10B981" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              RECOMMENDED
            </span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '8px' }}>
            {rec.priorityTag}
          </span>
        </div>

        {/* MAIN CONTENT ROW: LEFT DETAILS + RIGHT IMAGE THUMBNAIL */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
              {rec.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>
                <Navigation size={15} color="#475569" />
                <span>{rec.distance}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#0284C7', fontWeight: 700 }}>
                <Users size={15} color="#0284C7" />
                <span>{rec.crowdStatus}</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE THUMBNAIL */}
          <div style={{
            width: '90px',
            height: '75px',
            borderRadius: '16px',
            backgroundImage: `url(${rec.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#F1F5F9',
            flexShrink: 0
          }} />
        </div>

        {/* MANDATORY EXPLAINABLE REASON BADGE */}
        <div style={{
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#047857',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          padding: '8px 12px',
          borderRadius: '12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          lineHeight: '1.4'
        }}>
          <Info size={15} color="#047857" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span><strong>Why Recommended:</strong> {rec.reason}</span>
        </div>

        {/* FULL-WIDTH BUTTON */}
        <Link href={rec.link} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '11px',
          borderRadius: '14px',
          fontSize: '14px',
          fontWeight: 800,
          textDecoration: 'none',
          width: '100%',
          textAlign: 'center'
        }}>
          View Details
        </Link>

      </div>
    </div>
  );
}
