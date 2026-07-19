'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, Compass, Navigation, Info, ExternalLink, Check
} from 'lucide-react';
import styles from '../Essentials.module.css';

import { KNOWLEDGE_ITEMS } from '@/content/knowledge';
import { useTrip } from '@/components/TripContext';
import { calculateDistance } from '@/utils/location';

// Map iconName strings to Lucide React components
import { 
  Briefcase, Smartphone, Footprints, Utensils, 
  Droplets, Users, Hospital, Bus, Shirt, Camera
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  briefcase: Briefcase,
  smartphone: Smartphone,
  footprints: Footprints,
  utensils: Utensils,
  droplets: Droplets,
  users: Users,
  hospital: Hospital,
  bus: Bus,
  shirt: Shirt,
  camera: Camera
};

export default function EssentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { userLocation } = useTrip();
  const item = KNOWLEDGE_ITEMS.find(t => t.id === id);

  // Real-time distance from user to this facility
  const liveDistance = useMemo(() => {
    if (!userLocation || !item?.coordinates) return null;
    const distKm = calculateDistance(userLocation.lat, userLocation.lng, item.coordinates.lat, item.coordinates.lng);
    const distM = Math.round(distKm * 1000);
    return {
      label: distM < 1000 ? `${distM} m` : `${distKm.toFixed(1)} km`,
      walkMins: Math.max(1, Math.round(distM / 80)), // ~80m/min walking pace
    };
  }, [userLocation, item]);

  if (!isMounted) {
    return (
      <div className={styles.detailMain} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #F59E0B',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.detailMain} style={{ justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Essential Not Found</h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 20px 0' }}>The facility or rule you are looking for does not exist in our directory.</p>
        <Link href="/essentials" className={styles.bannerBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
          Back to Essentials
        </Link>
      </div>
    );
  }

  const IconComp = ICON_MAP[item.iconName] || Info;
  const isImportant = item.importance === 'must-know';
  const isRecommended = item.importance === 'highly-recommended';

  // Handle Google Maps navigation
  const handleOpenMap = () => {
    if (item.coordinates) {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08 } 
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  } as const;

  return (
    <div className={styles.detailMain}>
      {/* Photo Header */}
      <motion.div 
        className={styles.detailImageHeader}
        style={{ backgroundImage: `url(${item.image})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.detailHeaderOverlay} />
        <button 
          className={styles.detailBackButton} 
          onClick={() => router.push('/essentials')}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
      </motion.div>

      {/* Main Details Panel */}
      <motion.div 
        className={styles.detailContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title metadata card */}
        <motion.section className={styles.detailMetaCard} variants={itemVariants}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span className={`${styles.badge} ${styles.badgeVerified}`} style={{ fontSize: '11px', padding: '3px 10px' }}>
              {item.category}
            </span>
            <div className={styles.cardBadges}>
              <span className={`${styles.badge} ${
                isImportant ? styles.badgeAlert : isRecommended ? styles.badgeRule : styles.badgeFree
              }`}>
                {item.importance.replace('-', ' ')}
              </span>
              <span className={`${styles.badge} ${styles.badgeVerified}`}>
                {item.tag}
              </span>
            </div>
          </div>

          <h2 className={styles.detailTitle}>{item.name}</h2>
          
          <div className={styles.detailRow}>
            <MapPin size={16} color="#D97706" />
            <span>{item.location}</span>
          </div>

          <div className={styles.detailRow} style={{ marginTop: '8px' }}>
            <Clock size={16} color="#0E6B72" />
            <span style={{ fontWeight: 700, color: '#0E6B72' }}>Status: {item.status}</span>
          </div>
        </motion.section>

        {/* Why it Matters (Product High Light Card) */}
        <motion.section className={styles.detailSection} variants={itemVariants}>
          <div className={styles.detailWhyBox}>
            <h5 className={styles.detailWhyTitle}>
              <Info size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Why This Matters
            </h5>
            <p className={styles.detailWhyText}>{item.whyItMatters}</p>
          </div>
        </motion.section>

        {/* About / Description */}
        <motion.section className={styles.detailSection} variants={itemVariants}>
          <h3 className={styles.detailSectionTitle}>About This Facility</h3>
          <div className={styles.detailCard}>
            <p className={styles.detailDescriptionText}>{item.description}</p>
          </div>
        </motion.section>

        {/* Map Routing CTA */}
        {item.coordinates && (
          <motion.section className={styles.detailSection} variants={itemVariants}>
            <button className={styles.mapCtaButton} onClick={handleOpenMap}>
              <Navigation size={18} />
              Open in Google Maps
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px', color: '#64748B', marginTop: '8px', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} />
                Distance: {liveDistance ? liveDistance.label : item.distance}
              </span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={14} />
                Transit: {liveDistance ? `${liveDistance.walkMins} min walk` : item.walkingTime}
              </span>
            </div>
          </motion.section>
        )}

        {/* Related Guidelines & Tips */}
        {item.tips && item.tips.length > 0 && (
          <motion.section className={styles.detailSection} variants={itemVariants}>
            <h3 className={styles.detailSectionTitle}>Visitor Guidelines & Tips</h3>
            <div className={styles.detailCard} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className={styles.tipsList}>
                {item.tips.map((tip, idx) => (
                  <div key={idx} className={styles.tipItem}>
                    <span className={styles.tipBullet}>✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
