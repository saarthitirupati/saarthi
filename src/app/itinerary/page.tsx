'use client';

import { PLACES as PLACES } from '@/data/places';
import { ArrowLeft, MapPin, Clock, Navigation, CheckCircle, Info, Car, Share2, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import styles from './Itinerary.module.css';
import { useTrip } from '@/components/TripContext';
import { generateItinerary } from '@/utils/planner';

export default function Itinerary() {
  const { days, visitedPlaces, toggleVisited } = useTrip();
  const [activeDay, setActiveDay] = useState(1);
  
  const itinerary = useMemo(() => generateItinerary(days || 1), [days]);
  const currentDayPlan = itinerary.find(d => d.day === activeDay) || itinerary[0];

  const fullDayPlan = currentDayPlan.items.map(item => ({
    ...item,
    place: PLACES.find(t => t.id === item.placeId)!,
    isVisited: visitedPlaces.includes(item.placeId)
  }));

  const totalPlaces = itinerary.reduce((acc, d) => acc + d.items.length, 0);
  const totalVisited = visitedPlaces.length;
  const progressPercent = Math.min(Math.round((totalVisited / totalPlaces) * 100), 100);

  const [copied, setCopied] = useState(false);

  const shareItinerary = () => {
    let text = `My ${days}-Day Tirupati Journey\n\n`;
    itinerary.forEach(d => {
      text += `Day ${d.day}: ${d.theme}\n`;
      d.items.forEach(item => {
        const t = PLACES.find(t => t.id === item.placeId);
        text += `- ${item.time}: ${t?.name} (${item.duration})\n`;
      });
      text += '\n';
    });
    
    if (navigator.share) {
      navigator.share({
        title: 'My Tirupati Journey',
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const driverTips = [
    "Always start your Tirumala climb early morning (around 5 AM) to avoid the heat.",
    "Bargain politely with auto drivers near the railway station; use prepaid autos if possible.",
    "Keep your footwear in your vehicle when visiting Kapila Theertham to avoid locker queues.",
    "For Padmavathi Place, Fridays are extremely crowded; plan for a 2-hour queue minimum."
  ];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <div className={styles.headerTitle}>
          <h1>{days}-Day Plan</h1>
          <div className={styles.overallProgress}>
            <div className={styles.progressTrack}>
              <motion.div 
                className={styles.progressFill}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
            <span>{progressPercent}% Journey Complete</span>
          </div>
        </div>
        <button onClick={shareItinerary} className={styles.shareButton} aria-label="Share Itinerary">
          <Share2 size={24} />
          {copied && <span className={styles.copyTooltip}>Copied!</span>}
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h2>{currentDayPlan.theme}</h2>
          <p>{totalPlaces} Places • {days} Days • Your Route</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <Clock size={16} />
              <span>Starts {currentDayPlan.items[0].time}</span>
            </div>
            <div className={styles.stat}>
              <CheckCircle size={16} />
              <span>{totalVisited}/{totalPlaces} Visited</span>
            </div>
          </div>
        </div>
      </section>

      {days > 1 && (
        <div className={styles.tabs}>
          {itinerary.map(d => (
            <button
              key={d.day}
              className={`${styles.tabItem} ${activeDay === d.day ? styles.activeTab : ''}`}
              onClick={() => setActiveDay(d.day)}
            >
              Day {d.day}
              {activeDay === d.day && (
                <motion.div layoutId="dayUnderline" className={styles.underline} />
              )}
            </button>
          ))}
        </div>
      )}

      <section className={styles.timeline}>
        <div className={styles.driverTipBox}>
          <div className={styles.driverTipHeader}>
            <Lightbulb size={18} color="#FF9933" />
            <h4>Local Driver Tip</h4>
          </div>
          <p>{driverTips[Math.min(activeDay - 1, driverTips.length - 1)]}</p>
        </div>
        {fullDayPlan.map((item, index) => (
          <div key={`${item.placeId}-${index}`}>
            {item.travelFromPrev && (
              <motion.div 
                className={styles.travelTime}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Car size={14} />
                <span>{item.travelFromPrev} travel from previous</span>
              </motion.div>
            )}
            
            <motion.div 
              className={`${styles.timelineItem} ${item.isVisited ? styles.itemVisited : ''}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.timeLine}>
                <div className={item.isVisited ? styles.dotVisited : index === 0 ? styles.dotActive : styles.dot} />
                {index < fullDayPlan.length - 1 && <div className={styles.line} />}
              </div>
              
              <div className={styles.itemContent}>
                <div className={styles.timeLabel}>{item.time}</div>
                <div className={styles.templeCard}>
                  <div 
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${item.place?.image || '/assets/ai/meditative_lotus.png'})` }}
                  >
                    {item.isVisited && (
                      <div className={styles.visitedBadge}>
                        <CheckCircle size={20} fill="white" color="var(--primary)" />
                      </div>
                    )}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardHeader}>
                      <div>
                        {item.place && (
                          <span className={`${styles.categoryBadge} ${
                            item.place.category === 'Core Place' ? styles.coreBadge : 
                            item.place.category === 'Tirumala Spot' ? styles.spotBadge : styles.nearbyBadge
                          }`}>
                            {item.place.category}
                          </span>
                        )}
                        <h3>{item.place?.name || 'Unknown Place'}</h3>
                      </div>
                      <button 
                        className={`${styles.visitedToggle} ${item.isVisited ? styles.activeToggle : ''}`}
                        onClick={() => toggleVisited(item.placeId)}
                      >
                        {item.isVisited ? 'Visited' : 'Mark Visited'}
                      </button>
                    </div>
                    <p className={styles.note}>
                      <Info size={14} color="var(--primary)" />
                      {item.note}
                    </p>
                    <div className={styles.itemFooter}>
                      <span><Clock size={12} /> {item.duration}</span>
                      <Link href={`/place/${item.placeId}`} className={styles.detailsLink}>Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </section>

      <div className={styles.stickyFooter}>
        <button className={styles.startButton}>
          <Navigation size={20} />
          <span>Follow Day {activeDay} Route</span>
        </button>
      </div>
    </main>
  );
}
