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
    
    // Attempt to find a suitable voice (prefer Google/Native local voices)
    const voices = window.speechSynthesis.getVoices();
    // Try to find a specific local voice if lang is specified
    let voice = voices.find(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase());
    
    // Fallback to finding just by the primary language subtag (e.g., 'en' or 'te')
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    }
    
    if (voice) {
      utterance.voice = voice;
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
