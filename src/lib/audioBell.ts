/**
 * 🕉️ Saarthi Audio Engine
 * Replaces traditional metallic temple bells with the modern, spiritual "Divine Journey" sonic identity:
 * - Hypnotic Tanpura drone
 * - Bamboo Flute (Bansuri) motif
 * - Resonant Saraswati Veena acoustic pluck
 * - Subtle "Om" vocal cavity pad swell
 * 
 * Provides backwards-compatible entry points so existing callers gracefully transition to the new sonic palette.
 */

import {
  playSaarthiSonicIdent,
  stopSaarthiSonicIdent,
  playVeenaPluck,
  playMalaCompletionSonicIdent
} from './audioIdentity';

export {
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
  playVeenaPluck();
}

/**
 * 🪷 Grand 108 Mala Completion Chime (replaces legacy double bell gong)
 * Celebratory bansuri flourish + rich resonant veena chord + peaceful pad release.
 */
export function playMalaCompletionChime() {
  playMalaCompletionSonicIdent();
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
