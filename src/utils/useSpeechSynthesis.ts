import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Normalizes specialized Indian / Telugu / Sanskrit terms into phonetic spellings
 * so Web Speech API text-to-speech engines pronounce them accurately and naturally.
 */
export function normalizePhoneticsForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/\bJapali\b/gi, 'Jaapali')
    .replace(/\bSwayambhu\b/gi, 'Swayam-bhoo')
    .replace(/\bSeshachalam\b/gi, 'Shesaa-chalam')
    .replace(/\bPapavanasam\b/gi, 'Paapa-vanaasam')
    .replace(/\bTeertham\b/gi, 'Teertham')
    .replace(/\bPushkarini\b/gi, 'Push-karini')
    .replace(/\bVenkateswara\b/gi, 'Venkateshwara')
    .replace(/\bGovindaraja\b/gi, 'Govin-da-raaja')
    .replace(/\bTiruchanur\b/gi, 'Tiru-chanoor')
    .replace(/\bPadmavathi\b/gi, 'Padmaavati')
    .replace(/\bKodandarama\b/gi, 'Kodanda-Raama')
    .replace(/\bBhu Varaha\b/gi, 'Bhoo Varaaha')
    .replace(/\bAnjaneya\b/gi, 'Anja-neya')
    .replace(/\bSrivari\b/gi, 'Sree-vaari')
    .replace(/\bAmmavari\b/gi, 'Amma-vaari')
    .replace(/\bPrasadam\b/gi, 'Pra-saadam')
    .replace(/\bDarshan\b/gi, 'Daar-shan')
    .replace(/\bAlipiri\b/gi, 'Ali-piri')
    .replace(/\bTirupati\b/gi, 'Tiru-pati')
    .replace(/\bTirumala\b/gi, 'Tiru-mala');
}

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
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

    // Phonetically normalize Indian terms for clean speech output
    const cleanText = normalizePhoneticsForSpeech(text);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    
    // Slightly slower rate (0.92) sounds more clear, natural, and human-like
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    
    // Rank available voices to prioritize Indian English / Neural voices
    const availableVoices = voices.length > 0 ? voices : (typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : []);
    
    if (availableVoices.length > 0) {
      const candidates = [...availableVoices].sort((a, b) => {
        const aLang = a.lang.replace('_', '-').toLowerCase();
        const bLang = b.lang.replace('_', '-').toLowerCase();
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        const isAIndia = aLang.startsWith('en-in') || aLang.startsWith('hi-in') || aLang.startsWith('te-in') || aName.includes('india');
        const isBIndia = bLang.startsWith('en-in') || bLang.startsWith('hi-in') || bLang.startsWith('te-in') || bName.includes('india');
        
        if (isAIndia && !isBIndia) return -1;
        if (!isAIndia && isBIndia) return 1;
        
        const getRank = (name: string) => {
          if (name.includes('natural')) return 4;
          if (name.includes('google')) return 3;
          if (name.includes('siri') || name.includes('premium')) return 2;
          return 1;
        };
        
        return getRank(bName) - getRank(aName);
      });
      
      utterance.voice = candidates[0];
    }
    
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
  }, [isSupported, voices]);

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
