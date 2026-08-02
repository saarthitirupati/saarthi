'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Music, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import styles from './MantraPlayer.module.css';

interface MantraPlayerProps {
  mantra: string;
  deity: string;
}

// Using a reliable MP3 track for demonstration (since OGG might not be supported in all browsers).
// In production, this would be passed as a prop (e.g., place.spiritualInfo.mantraAudioUrl)
const DEMO_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function MantraPlayer({ mantra, deity }: MantraPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(DEMO_AUDIO_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.8;
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          const current = audioRef.current.currentTime;
          const duration = audioRef.current.duration;
          if (duration) {
            setProgress((current / duration) * 100);
          }
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggle = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.visualizer}>
        <motion.div 
          className={styles.breathingRing}
          animate={{
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className={styles.iconCenter}>
          <Music size={32} color="var(--primary)" />
        </div>
      </div>

      <div className={styles.info}>
        <h3>Meditative Chant</h3>
        <p>Seeking blessings of {(deity || '').replace(/\s*\([^)]*\)/g, '').trim() || 'Lord Sri Venkateswara'}</p>
      </div>

      <div className={styles.controls}>
        <button 
          className={styles.playButton}
          onClick={handleToggle}
        >
          {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '4px' }} />}
        </button>
        
        <div className={styles.rightControls}>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
          <Volume2 size={16} color="#999" />
        </div>
      </div>

      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            className={styles.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Synchronizing breath with {mantra}...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
