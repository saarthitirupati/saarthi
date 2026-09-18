import { useState, useEffect, useCallback, useRef } from 'react';
import { startSpeechDevotionalAmbient, stopSpeechDevotionalAmbient } from '@/lib/audioIdentity';

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  mode?: 'devotional' | 'explainer' | 'normal' | 'sanskrit';
  fallbackText?: string;
}

/**
 * Strips Sanskrit / IAST diacritics so speech synthesis engines pronounce words cleanly without stuttering.
 */
export function cleanDiacriticsForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ee')
    .replace(/ū/g, 'oo')
    .replace(/ṛ/g, 'ri')
    .replace(/ṇ/g, 'n')
    .replace(/ñ/g, 'n')
    .replace(/ṭ/g, 't')
    .replace(/ḍ/g, 'd')
    .replace(/ś/g, 'sh')
    .replace(/ṣ/g, 'sh')
    .replace(/ḥ/g, 'h')
    .replace(/ṁ/g, 'm')
    .replace(/ṃ/g, 'm')
    .replace(/’/g, '')
    .replace(/-/g, ' ');
}

/**
 * Normalizes specialized Indian / Telugu / Sanskrit terms into clean phonetic spellings
 * so Web Speech API text-to-speech engines pronounce them accurately, reverently, and smoothly.
 */
export function normalizePhoneticsForSpeech(text: string, mode: 'devotional' | 'explainer' | 'normal' | 'sanskrit' = 'normal'): string {
  if (!text) return '';

  let processed = cleanDiacriticsForSpeech(text);

  // Sanskrit Pada & Verse Chhandas Pause Formatting
  if (mode === 'sanskrit') {
    processed = processed
      .replace(/\|\|/g, '... ... ') // Full verse resolution pause
      .replace(/\|/g, '... ')       // Half verse pada breath pause
      .replace(/\n+/g, '... ');     // Line break breath pause
  } else if (mode === 'devotional') {
    processed = processed.replace(/\n+/g, '... ');
  }

  processed = processed
    .replace(/\bOm\b/g, 'Aum')
    .replace(/\bJapali\b/gi, 'Jaapali')
    .replace(/\bSwayambhu\b/gi, 'Swayambhoo')
    .replace(/\bSeshachalam\b/gi, 'Sheshaachalam')
    .replace(/\bPapavanasam\b/gi, 'Paapavaanaasam')
    .replace(/\bTeertham\b/gi, 'Theertham')
    .replace(/\bPushkarini\b/gi, 'Pushkarini')
    .replace(/\bVenkateswara\b/gi, 'Venkateshwara')
    .replace(/\bVenkateswara's\b/gi, "Venkateshwara's")
    .replace(/\bGovindaraja\b/gi, 'Govindaraja')
    .replace(/\bTiruchanur\b/gi, 'Thiruchanoor')
    .replace(/\bPadmavathi\b/gi, 'Padmaavathi')
    .replace(/\bKodandarama\b/gi, 'Kodanda Raama')
    .replace(/\bBhu Varaha\b/gi, 'Bhoo Varaaha')
    .replace(/\bAnjaneya\b/gi, 'Anjaneya')
    .replace(/\bSrivari\b/gi, 'Sreevaari')
    .replace(/\bAmmavari\b/gi, 'Amma vaari')
    .replace(/\bPrasadam\b/gi, 'Prasaadam')
    .replace(/\bDarshan\b/gi, 'Daarshan')
    .replace(/\bAlipiri\b/gi, 'Alipiri')
    .replace(/\bTirupati\b/gi, 'Thirupathi')
    .replace(/\bTirumala\b/gi, 'Thirumala')
    .replace(/\bSankeertana\b/gi, 'Sankeerthana')
    .replace(/\bAnnamayya\b/gi, 'Anna maaya')
    .replace(/\bCharama Shloka\b/gi, 'Charama Shloka')
    .replace(/\bSarva Darshan\b/gi, 'Sarva Daarshan')
    .replace(/\bVaikuntham\b/gi, 'Vaikuntham')
    .replace(/\bSaptagiri\b/gi, 'Saptagiri')
    .replace(/\bBhagavad Gita\b/gi, 'Bhagavad Geetha');

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
    stopSpeechDevotionalAmbient();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback((text: string, optionsOrLang?: string | SpeakOptions) => {
    if (!isSupported || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();
    stopSpeechDevotionalAmbient();

    const options: SpeakOptions = typeof optionsOrLang === 'string'
      ? { lang: optionsOrLang }
      : (optionsOrLang || {});

    const {
      lang = 'en-IN',
      mode = 'normal',
      rate: customRate,
      pitch: customPitch,
      volume = 1.0,
      fallbackText
    } = options;

    const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    const hasIndicScript = /[\u0C00-\u0C7F\u0900-\u097F]/.test(text);
    const hasMatchingIndicVoice = availableVoices.some(v =>
      v.lang.toLowerCase().startsWith('te') || v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().startsWith('sa')
    );

    let targetText = text;
    let targetLang = lang;

    if (hasIndicScript && !hasMatchingIndicVoice) {
      targetText = fallbackText || text;
      targetLang = 'en-IN';
    }

    // Voice tone defaults based on sacred mode
    let defaultRate = 0.90;
    let defaultPitch = 1.0;

    if (mode === 'sanskrit') {
      defaultRate = 0.74;  // Deep, rhythmic, meditative Sanskrit shloka chanting cadence
      defaultPitch = 0.88; // Reverent, warm, deep vocal pitch
    } else if (mode === 'devotional') {
      defaultRate = 0.82; // Reverent, slow rhythmic cadence
      defaultPitch = 0.95; // Warm, slightly deeper resonant tone
    } else if (mode === 'explainer') {
      defaultRate = 0.88; // Clear, engaging guide tone
      defaultPitch = 0.98; // Warm and clear
    }

    const finalRate = customRate ?? defaultRate;
    const finalPitch = customPitch ?? defaultPitch;

    const cleanText = normalizePhoneticsForSpeech(targetText, mode);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLang;
    utterance.rate = finalRate;
    utterance.pitch = finalPitch;
    utterance.volume = volume;

    if (availableVoices.length > 0) {
      const codeLang = targetLang.toLowerCase().replace('_', '-');
      const baseLang = codeLang.split('-')[0];

      const ranked = [...availableVoices].sort((a, b) => {
        const aLang = a.lang.toLowerCase().replace('_', '-');
        const bLang = b.lang.toLowerCase().replace('_', '-');
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (mode === 'sanskrit' || baseLang === 'sa' || baseLang === 'hi') {
          const isASkt = aLang.startsWith('sa') || aLang.startsWith('hi') || aName.includes('sanskrit') || aName.includes('hindi');
          const isBSkt = bLang.startsWith('sa') || bLang.startsWith('hi') || bName.includes('sanskrit') || bName.includes('hindi');
          if (isASkt && !isBSkt) return -1;
          if (!isASkt && isBSkt) return 1;
        }

        const aExactMatch = aLang === codeLang;
        const bExactMatch = bLang === codeLang;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        const aBaseMatch = aLang.startsWith(baseLang);
        const bBaseMatch = bLang.startsWith(baseLang);
        if (aBaseMatch && !bBaseMatch) return -1;
        if (!aBaseMatch && bBaseMatch) return 1;

        const isAIndia = aLang.endsWith('-in') || aName.includes('india');
        const isBIndia = bLang.endsWith('-in') || bName.includes('india');
        if (isAIndia && !isBIndia) return -1;
        if (!isAIndia && isBIndia) return 1;

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

    utterance.onstart = () => {
      setIsSpeaking(true);
      startSpeechDevotionalAmbient();
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      stopSpeechDevotionalAmbient();
      utteranceRef.current = null;
    };
    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('Speech synthesis warning/error:', e);
      }
      setIsSpeaking(false);
      stopSpeechDevotionalAmbient();
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
        stopSpeechDevotionalAmbient();
      }
    };
  }, []);

  return { isSpeaking, isSupported, speak, stop, toggleSpeak, voices };
};

