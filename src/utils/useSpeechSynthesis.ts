import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  mode?: 'devotional' | 'explainer' | 'normal';
}

/**
 * Normalizes specialized Indian / Telugu / Sanskrit terms into phonetic spellings
 * so Web Speech API text-to-speech engines pronounce them accurately, reverently, and naturally.
 */
export function normalizePhoneticsForSpeech(text: string, mode: 'devotional' | 'explainer' | 'normal' = 'normal'): string {
  if (!text) return '';

  let processed = text
    .replace(/\bOm\b/g, 'Aum')
    .replace(/\bJapali\b/gi, 'Jaapali')
    .replace(/\bSwayambhu\b/gi, 'Swayam-bhoo')
    .replace(/\bSeshachalam\b/gi, 'Shesaa-chalam')
    .replace(/\bPapavanasam\b/gi, 'Paapa-vanaasam')
    .replace(/\bTeertham\b/gi, 'Theer-tham')
    .replace(/\bPushkarini\b/gi, 'Push-ka-ri-ni')
    .replace(/\bVenkateswara\b/gi, 'Ven-ka-tesh-wa-ra')
    .replace(/\bVenkateswara's\b/gi, "Ven-ka-tesh-wa-ra's")
    .replace(/\bGovindaraja\b/gi, 'Go-vin-da-raa-ja')
    .replace(/\bTiruchanur\b/gi, 'Thi-ru-cha-noor')
    .replace(/\bPadmavathi\b/gi, 'Pad-maa-va-thi')
    .replace(/\bKodandarama\b/gi, 'Ko-dan-da-Raa-ma')
    .replace(/\bBhu Varaha\b/gi, 'Bhoo Va-raa-ha')
    .replace(/\bAnjaneya\b/gi, 'An-ja-ney-a')
    .replace(/\bSrivari\b/gi, 'Sree-vaa-ri')
    .replace(/\bAmmavari\b/gi, 'Am-ma-vaa-ri')
    .replace(/\bPrasadam\b/gi, 'Pra-saa-dam')
    .replace(/\bDarshan\b/gi, 'Daar-shan')
    .replace(/\bAlipiri\b/gi, 'Ali-pi-ri')
    .replace(/\bTirupati\b/gi, 'Thi-ru-pa-thi')
    .replace(/\bTirumala\b/gi, 'Thi-ru-ma-la')
    .replace(/\bSankeertana\b/gi, 'San-keer-tha-na')
    .replace(/\bAnnamayya\b/gi, 'Anna-maa-ya')
    .replace(/\bCharama Shloka\b/gi, 'Cha-ra-ma Shlo-ka')
    .replace(/\bSarva Darshan\b/gi, 'Sar-va Daar-shan')
    .replace(/\bVaikuntham\b/gi, 'Vai-kun-tham')
    .replace(/\bSaptagiri\b/gi, 'Sap-ta-gi-ri')
    .replace(/\bBhagavad Gita\b/gi, 'Bha-ga-vad Gee-tha');

  // For devotional chanting mode, insert gentle breath pauses at line breaks
  if (mode === 'devotional') {
    processed = processed.replace(/\n+/g, '... ');
  }

  return processed;
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
    if (!isSupported || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback((text: string, optionsOrLang?: string | SpeakOptions) => {
    if (!isSupported || typeof window === 'undefined') return;

    window.speechSynthesis.cancel(); // Stop any active utterance

    const options: SpeakOptions = typeof optionsOrLang === 'string'
      ? { lang: optionsOrLang }
      : (optionsOrLang || {});

    const {
      lang = 'en-IN',
      mode = 'normal',
      rate: customRate,
      pitch: customPitch,
      volume = 1.0
    } = options;

    // Determine voice tone defaults based on mode
    let defaultRate = 0.90;
    let defaultPitch = 1.0;

    if (mode === 'devotional') {
      defaultRate = 0.82; // Reverent, slow rhythmic cadence
      defaultPitch = 0.95; // Warm, slightly deeper resonant tone
    } else if (mode === 'explainer') {
      defaultRate = 0.88; // Clear, engaging guide tone
      defaultPitch = 0.98; // Warm and clear
    }

    const finalRate = customRate ?? defaultRate;
    const finalPitch = customPitch ?? defaultPitch;

    // Phonetically normalize text for clean pronunciation and natural cadence
    const cleanText = normalizePhoneticsForSpeech(text, mode);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = finalRate;
    utterance.pitch = finalPitch;
    utterance.volume = volume;

    // Rank available voices to prioritize high-quality natural Indian & language-matched voices
    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    if (availableVoices.length > 0) {
      const targetLang = lang.toLowerCase().replace('_', '-');
      const targetBaseLang = targetLang.split('-')[0]; // e.g. 'te', 'hi', 'en', 'sa'

      const ranked = [...availableVoices].sort((a, b) => {
        const aLang = a.lang.toLowerCase().replace('_', '-');
        const bLang = b.lang.toLowerCase().replace('_', '-');
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        // 1. Exact match on language code (e.g. te-IN)
        const aExactMatch = aLang === targetLang;
        const bExactMatch = bLang === targetLang;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // 2. Base language match (e.g. te vs te)
        const aBaseMatch = aLang.startsWith(targetBaseLang);
        const bBaseMatch = bLang.startsWith(targetBaseLang);
        if (aBaseMatch && !bBaseMatch) return -1;
        if (!aBaseMatch && bBaseMatch) return 1;

        // 3. Indian English / Indian regional voice preference
        const isAIndia = aLang.endsWith('-in') || aName.includes('india');
        const isBIndia = bLang.endsWith('-in') || bName.includes('india');
        if (isAIndia && !isBIndia) return -1;
        if (!isAIndia && isBIndia) return 1;

        // 4. Voice quality ranking (Natural > Neural > Google > Siri/Apple > Standard)
        const getQualityScore = (name: string) => {
          if (name.includes('natural') || name.includes('online')) return 5;
          if (name.includes('neural') || name.includes('wavenet')) return 4;
          if (name.includes('google')) return 3;
          if (name.includes('siri') || name.includes('premium')) return 2;
          return 1;
        };

        return getQualityScore(bName) - getQualityScore(aName);
      });

      if (ranked.length > 0) {
        utterance.voice = ranked[0];
      }
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

  const toggleSpeak = useCallback((text: string, optionsOrLang?: string | SpeakOptions) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, optionsOrLang);
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

  return { isSpeaking, isSupported, speak, stop, toggleSpeak, voices };
};
