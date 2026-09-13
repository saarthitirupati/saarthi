/**
 * 🕉️ Saarthi Audio Engine
 * Dual-Screen First-Principles Spiritual Soundscapes:
 * 
 * 1. Screen 1 ("Saarthi Guide" - Threshold at Dawn):
 *    - Opening Ident (Distant shankha, deep 216Hz bell, 3-note Veena, warm tanpura)
 *    - Courtyard Ambient (Spacious Veena + shruti drone + faint breath-like "Hari...")
 * 
 * 2. Screen 2 ("Japa Mala" - Sanctum Altar):
 *    - Sanctum Ambient (Meditative breathing bed: Shruti + subtle veena motif + soft bansuri)
 *    - Bead complete (Tactile bead click + pure Veena note)
 *    - Reflection end (Harmonic resolution countdown cue)
 *    - Milestone quarter (Ethereal "Govinda" resonance at 27, 54, 81)
 *    - 108 Mala Poorthi (Grand triumphant shankha + full Veena chord + Garbhagriha reverb finale)
 */

import {
  playScreen1Opening,
  stopScreen1Opening,
  startScreen1Ambient,
  stopScreen1Ambient,
  startJapaAmbient,
  stopJapaAmbient,
  playBeadComplete,
  playReflectionEnd,
  playQuarterMilestone,
  playJapa108Complete,
  transitionToJapa,
  returnFromJapa,
  stopAllAudio,
  isAudioGloballyEnabled,
  setAudioGloballyEnabled,
  playSaarthiSonicIdent,
  stopSaarthiSonicIdent,
  playVeenaPluck,
  playMalaCompletionSonicIdent
} from './audioIdentity';

export {
  playScreen1Opening,
  stopScreen1Opening,
  startScreen1Ambient,
  stopScreen1Ambient,
  startJapaAmbient,
  stopJapaAmbient,
  playBeadComplete,
  playReflectionEnd,
  playQuarterMilestone,
  playJapa108Complete,
  transitionToJapa,
  returnFromJapa,
  stopAllAudio,
  isAudioGloballyEnabled,
  setAudioGloballyEnabled,
  playSaarthiSonicIdent,
  stopSaarthiSonicIdent,
  playVeenaPluck,
  playMalaCompletionSonicIdent
};

/**
 * 🪕 Tactile Spiritual Note (replaces legacy temple bell chime)
 * Pure acoustic Veena pluck with zero harsh metallic ringing.
 */
export function playTempleBellChime() {
  playBeadComplete();
}

/**
 * 🪷 Grand 108 Mala Completion Chime (replaces legacy double bell gong)
 * Celebratory bansuri flourish + rich resonant veena chord + peaceful pad release.
 */
export function playMalaCompletionChime() {
  playJapa108Complete();
}

/**
 * 📿 Native Mobile Haptic Bead Pulse
 * Emulates the tactile physical click of a prayer mala bead.
 */
export function triggerBeadHaptic(isMilestone: boolean = false) {
  if (typeof window === 'undefined' || !('navigator' in window)) return;
  try {
    if (navigator.vibrate) {
      if (isMilestone) {
        // Double celebratory pulse on completing 108 or milestones
        navigator.vibrate([20, 60, 35]);
      } else {
        // Gentle single bead click
        navigator.vibrate(12);
      }
    }
  } catch {
    // Graceful fallback for non-supported browsers
  }
}
