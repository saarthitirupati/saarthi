'use client';

import { ArrowLeft, Star, ShieldCheck, UserCheck, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Reviews.module.css';

export default function VerifiedReviews() {
  const reviews = [
    {
      id: 1,
      user: 'Ananya S.',
      location: 'Tirumala Main Temple',
      rating: 5,
      date: '2 Days ago',
      content: 'The queue management has improved a lot. We finished our Darshan in 4.5 hours with a 300 rupee ticket. The verified tips about early morning booking were very helpful!',
      isVerified: true
    },
    {
      id: 2,
      user: 'Vikas Rao',
      location: 'ISKCON Tirupati',
      rating: 4,
      date: '1 Week ago',
      content: 'Beautiful architecture. The restaurant inside serves amazing Satvik food. Highly recommend for a peaceful evening.',
      isVerified: true
    },
    {
      id: 3,
      user: 'Sarah Miller',
      location: 'Kapila Theertham',
      rating: 5,
      date: '3 Days ago',
      content: 'A hidden gem. The waterfall was in full flow. The walk from the main road is short but scenic.',
      isVerified: true
    }
  ];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <h1>Verified Reviews</h1>
        <div style={{ width: 44 }} />
      </header>

      <section className={styles.hero}>
        <ShieldCheck size={48} color="white" />
        <h2>Trust via Verification</h2>
        <p>Only reviews from tourists who have physically visited the location are shown here.</p>
        <div className={styles.trustBanner}>
          <UserCheck size={16} />
          <span>GPS + ID Verified Reviews</span>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.searchBar}>
          <Search size={20} color="#999" />
          <input type="text" placeholder="Search verified feedback..." />
        </div>

        <div className={styles.reviewList}>
          {reviews.map((review, index) => (
            <motion.div 
              key={review.id}
              className={styles.reviewCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.avatar}>{review.user[0]}</div>
                  <div>
                    <h4>{review.user}</h4>
                    <div className={styles.verifiedTag}>
                      <ShieldCheck size={12} />
                      Verified Visit
                    </div>
                  </div>
                </div>
                <div className={styles.ratingInfo}>
                  <Star size={14} fill="#FF9933" color="#FF9933" />
                  <span>{review.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className={styles.locationInfo}>
                <MapPin size={14} />
                <span>{review.location}</span>
                <span className={styles.date}>{review.date}</span>
              </div>
              
              <p className={styles.reviewText}>{review.content}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
