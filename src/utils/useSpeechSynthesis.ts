import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback((text: string, lang: string = 'en-IN') => {
    if (!isSupported) return;

    window.speechSynthesis.cancel(); // stop any current speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Slightly slower rate (0.95) sounds more natural, clear, and human-like
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    // Rank available voices to prioritize natural neural / cloud voices
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split('-')[0].toLowerCase();
    const candidateVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
    
    if (candidateVoices.length > 0) {
      candidateVoices.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const getRank = (name: string) => {
          if (name.includes('natural')) return 4; // Microsoft Edge Online Natural (outstanding)
          if (name.includes('google')) return 3;  // Google Chrome cloud-assisted (high quality)
          if (name.includes('siri') || name.includes('premium')) return 2; // Apple Premium Siri
          return 1; // Standard built-in voice
        };
        
        const rankA = getRank(aName);
        const rankB = getRank(bName);
        
        if (rankA !== rankB) return rankB - rankA;
        
        // Prefer exact locale match (e.g. en-IN over en-US for en-IN request)
        const aExact = a.lang.replace('_', '-').toLowerCase() === lang.toLowerCase();
        const bExact = b.lang.replace('_', '-').toLowerCase() === lang.toLowerCase();
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        return 0;
      });
      
      utterance.voice = candidateVoices[0];
    }
    
    // Workaround for some browsers where onend doesn't fire if utterance is garbage collected
    utteranceRef.current = utterance;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
    };
    utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          console.warn('Speech synthesis warning/error:', e);
        }
        setIsSpeaking(false);
        utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const toggleSpeak = useCallback((text: string, lang?: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, lang);
    }
  }, [isSpeaking, speak, stop]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSpeaking, isSupported, speak, stop, toggleSpeak };
};
