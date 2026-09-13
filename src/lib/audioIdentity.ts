/**
 * 🕉️ Saarthi First-Principles Spiritual Soundscape Engine
 * 
 * Two spiritually interconnected soundscapes:
 * 
 * 🛕 SCREEN 1: "Saarthi Guide" (The Threshold at Dawn)
 *    - Opening Ident (7.0s): /audio/saarthi-opening-ident.wav
 *      (Distant dreamlike shankha, deep 216Hz temple bell resonance, 3-note Veena greeting Sa->Pa->Sa', warm Tanpura)
 *    - Courtyard Ambient (22.0s Loop): /audio/saarthi-courtyard-ambient.wav
 *      (Spacious Veena + shruti drone, faint breath-like "Hari..." vocal formant)
 * 
 * 📿 SCREEN 2: "Japa Mala" (The Sanctum of Devotion)
 *    - Sanctum Ambient (20.0s Loop): /audio/japa-ambient-loop.wav
 *      (Meditative breathing bed: Shruti + subtle veena motif + soft bansuri)
 *    - Bead Complete (0.75s): /audio/bead-complete.wav
 *      (Tactile mala bead click + single pure Veena note)
 *    - Reflection End (1.20s): /audio/reflection-end.wav
 *      (Harmonic resolution cue when 10-second reflection countdown finishes)
 *    - Quarter Milestone (2.20s): /audio/milestone-quarter.wav
 *      (Distant ethereal "Govinda" resonance at 27, 54, 81 beads)
 *    - 108 Mala Poorthi (4.80s): /audio/japa-complete-108.wav
 *      (Grand triumphant Shankha + full Veena chord + Garbhagriha reverb finale)
 * 
 * 🌿 ZERO external heavy libraries. Native HTML5 Audio + Web Audio gain curves.
 */

// Persistent mute preferences
const STORAGE_KEY = 'saarthi_sound_enabled';

export function isAudioGloballyEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'muted';
  } catch {
    return true;
  }
}

export function setAudioGloballyEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'enabled' : 'muted');
    if (!enabled) {
      stopAllAudio();
    }
  } catch {
    // Ignored
  }
}

// Active Audio Element Holders
let screen1OpeningAudio: HTMLAudioElement | null = null;
let screen1AmbientAudio: HTMLAudioElement | null = null;
let japaAmbientAudio: HTMLAudioElement | null = null;
let activeSFXAudio: HTMLAudioElement | null = null;

// Smooth volume fade helper
function fadeOutAndStop(audio: HTMLAudioElement | null, durationMs: number = 400): Promise<void> {
  return new Promise((resolve) => {
    if (!audio) {
      resolve();
      return;
    }
    const initialVol = audio.volume;
    const steps = 12;
    const stepInterval = Math.max(10, Math.floor(durationMs / steps));
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(timer);
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = initialVol;
        } catch {}
        resolve();
      } else {
        const factor = 1 - (currentStep / steps);
        audio.volume = Math.max(0, initialVol * factor);
      }
    }, stepInterval);
  });
}

function fadeIn(audio: HTMLAudioElement, targetVolume: number, durationMs: number = 400) {
  audio.volume = 0.001;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      const steps = 12;
      const stepInterval = Math.max(10, Math.floor(durationMs / steps));
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          clearInterval(timer);
          audio.volume = targetVolume;
        } else {
          audio.volume = Math.min(targetVolume, (currentStep / steps) * targetVolume);
        }
      }, stepInterval);
    }).catch(() => {
      // Browser autoplay restriction before user gesture
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🛕 SCREEN 1: SAARTHI GUIDE (THE THRESHOLD AT DAWN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 🎵 Screen 1 Opening Sonic Ident (5–8s on load/splash)
 */
export function playScreen1Opening() {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  stopScreen1Opening();

  try {
    const audio = new Audio('/audio/saarthi-opening-ident.wav');
    audio.volume = 0.90;
    screen1OpeningAudio = audio;

    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // Autoplay policy fallback
      });
    }
  } catch {
    // Ignored
  }
}

export function stopScreen1Opening() {
  if (screen1OpeningAudio) {
    const el = screen1OpeningAudio;
    screen1OpeningAudio = null;
    fadeOutAndStop(el, 250);
  }
}

/**
 * 🍃 Screen 1 Courtyard Ambient Loop (22s loop)
 * Spacious Veena + shruti drone + faint breath-like "Hari..." formant.
 */
export function startScreen1Ambient(targetVol: number = 0.38) {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  if (screen1AmbientAudio && !screen1AmbientAudio.paused) return;

  try {
    if (!screen1AmbientAudio) {
      screen1AmbientAudio = new Audio('/audio/saarthi-courtyard-ambient.wav');
      screen1AmbientAudio.loop = true;
    }
    fadeIn(screen1AmbientAudio, targetVol, 600);
  } catch {
    // Ignored
  }
}

export function stopScreen1Ambient(fadeMs: number = 400) {
  if (screen1AmbientAudio) {
    fadeOutAndStop(screen1AmbientAudio, fadeMs);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 📿 SCREEN 2: JAPA MALA (THE SANCTUM OF REPETITION)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 🪔 Screen 2 Sanctum Ambient Bed (20s loop)
 * Meditative breathing bed: Shruti + subtle veena motif + soft bansuri.
 */
export function startJapaAmbient(targetVol: number = 0.35) {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  if (japaAmbientAudio && !japaAmbientAudio.paused) return;

  try {
    if (!japaAmbientAudio) {
      japaAmbientAudio = new Audio('/audio/japa-ambient-loop.wav');
      japaAmbientAudio.loop = true;
    }
    fadeIn(japaAmbientAudio, targetVol, 500);
  } catch {
    // Ignored
  }
}

export function stopJapaAmbient(fadeMs: number = 400) {
  if (japaAmbientAudio) {
    fadeOutAndStop(japaAmbientAudio, fadeMs);
  }
}

/**
 * 🪕 Interaction: Single Bead Complete
 * Tactile mala bead click + single pure Veena note
 */
export function playBeadComplete() {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/bead-complete.wav');
    audio.volume = 0.85;
    audio.play().catch(() => {});
  } catch {}
}

/**
 * 🕊️ Interaction: Reflection End
 * Harmonic resolution cue when 10-second reflection countdown finishes
 */
export function playReflectionEnd() {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/reflection-end.wav');
    audio.volume = 0.88;
    audio.play().catch(() => {});
  } catch {}
}

/**
 * 🌟 Interaction: Quarter Milestone (27, 54, 81 beads)
 * Distant ethereal "Govinda" resonance
 */
export function playQuarterMilestone() {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/milestone-quarter.wav');
    audio.volume = 0.95;
    audio.play().catch(() => {});
  } catch {}
}

/**
 * 🪷 Interaction: Grand 108 Japa Complete
 * Triumphant Shankha + full Veena chord + Garbhagriha reverb finale
 */
export function playJapa108Complete() {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/japa-complete-108.wav');
    audio.volume = 1.0;
    audio.play().catch(() => {});
  } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔄 CROSS-SCREEN TRANSITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Smoothly cross-fade from Screen 1 Courtyard Ambient to Screen 2 Japa Sanctum
 */
export function transitionToJapa() {
  stopScreen1Ambient(350);
  setTimeout(() => {
    startJapaAmbient(0.35);
  }, 200);
}

/**
 * Smoothly exit Screen 2 Japa Sanctum and return to Screen 1 Courtyard
 */
export function returnFromJapa(restoreCourtyardAmbient: boolean = false) {
  stopJapaAmbient(350);
  if (restoreCourtyardAmbient) {
    setTimeout(() => {
      startScreen1Ambient(0.38);
    }, 200);
  }
}

/**
 * Immediately silence all active ambient & SFX tracks
 */
export function stopAllAudio() {
  stopScreen1Opening();
  stopScreen1Ambient(100);
  stopJapaAmbient(100);
  if (activeSFXAudio) {
    try {
      activeSFXAudio.pause();
      activeSFXAudio.currentTime = 0;
    } catch {}
    activeSFXAudio = null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔁 BACKWARD-COMPATIBLE ALIASES
// ─────────────────────────────────────────────────────────────────────────────

export const playSaarthiSonicIdent = playScreen1Opening;
export const stopSaarthiSonicIdent = stopScreen1Opening;
export const playVeenaPluck = playBeadComplete;
export const playMalaCompletionSonicIdent = playJapa108Complete;
