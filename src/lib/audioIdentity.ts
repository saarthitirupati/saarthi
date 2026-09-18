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

let syntheticAudioCtx: AudioContext | null = null;

export function stopSyntheticOpeningIdent() {
  if (syntheticAudioCtx) {
    try {
      syntheticAudioCtx.close();
    } catch {}
    syntheticAudioCtx = null;
  }
}

async function playSyntheticOpeningIdent(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;

    stopSyntheticOpeningIdent();
    const ctx = new AudioCtx();
    syntheticAudioCtx = ctx;

    if (ctx.state === 'suspended') {
      await ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.40, now + 0.8);
    masterGain.gain.setValueAtTime(0.40, now + 3.6);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2);
    masterGain.connect(ctx.destination);

    // 1. Warm Cosmic Tanpura Drone Bed (136.1 Hz Om + sub-octaves & fifths)
    const tanpuraFreqs = [68.05, 102.08, 136.10, 272.20];
    tanpuraFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.9);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 5.2);
    });

    // 2. Deep Sanctum Bronze Bell (Tuned to 136.1 Hz with rich partials)
    const bellFreqs = [136.1, 272.2, 324.0, 408.3];
    bellFreqs.forEach((freq, idx) => {
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(freq, now + 0.1);

      const amp = idx === 0 ? 0.35 : (0.22 / (idx + 1));
      bellGain.gain.setValueAtTime(0.001, now);
      bellGain.gain.setValueAtTime(amp, now + 0.1);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      bellOsc.connect(bellGain);
      bellGain.connect(masterGain);
      bellOsc.start(now + 0.1);
      bellOsc.stop(now + 4.0);
    });

    // 3. Primordial Sacred OM (A-U-M) Vocal Formant Chanted Drone
    const omOsc = ctx.createOscillator();
    const omGain = ctx.createGain();
    const formantFilter = ctx.createBiquadFilter();

    omOsc.type = 'sawtooth';
    omOsc.frequency.setValueAtTime(136.10, now + 0.15); // Cosmic OM fundamental

    // Micro-vibrato (4.2 Hz) for human breath warmth
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4.2, now);
    lfoGain.gain.setValueAtTime(1.5, now);
    lfo.connect(omOsc.frequency);
    lfo.start(now + 0.15);
    lfo.stop(now + 5.0);

    // Dynamic A -> U -> M Formant Filter
    formantFilter.type = 'bandpass';
    formantFilter.Q.setValueAtTime(2.8, now);
    // "Aaah" formant at opening
    formantFilter.frequency.setValueAtTime(740, now + 0.15);
    // Smooth glide to "Ooo"
    formantFilter.frequency.exponentialRampToValueAtTime(420, now + 1.4);
    // Transition to deep nasal "Mmmm..."
    formantFilter.frequency.exponentialRampToValueAtTime(260, now + 2.6);

    // Vocal envelope
    omGain.gain.setValueAtTime(0.001, now);
    omGain.gain.linearRampToValueAtTime(0.32, now + 0.9);
    omGain.gain.setValueAtTime(0.32, now + 3.2);
    omGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.9);

    omOsc.connect(formantFilter);
    formantFilter.connect(omGain);
    omGain.connect(masterGain);

    omOsc.start(now + 0.15);
    omOsc.stop(now + 5.0);

    return true;
  } catch {
    return false;
  }
}

/**
 * 🎵 Screen 1 Opening Sonic Ident (5–8s on load/splash)
 * Returns Promise<boolean> indicating whether playback actually started.
 */
export async function playScreen1Opening(force: boolean = false): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!force && !isAudioGloballyEnabled()) return false;

  stopScreen1Opening();

  if (force) {
    setAudioGloballyEnabled(true);
  }

  try {
    const audio = new Audio('/audio/saarthi-opening-ident.wav');
    audio.preload = 'auto';
    audio.volume = 0.92;
    screen1OpeningAudio = audio;

    await audio.play();
    return true;
  } catch {
    // If HTML5 Audio was blocked by autoplay or failed to fetch, attempt Web Audio synthesis
    try {
      const synOk = await playSyntheticOpeningIdent();
      return synOk;
    } catch {
      return false;
    }
  }
}

export function stopScreen1Opening() {
  if (screen1OpeningAudio) {
    const el = screen1OpeningAudio;
    screen1OpeningAudio = null;
    fadeOutAndStop(el, 250);
  }
  stopSyntheticOpeningIdent();
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

let sharedAudioCtx: AudioContext | null = null;
let userGestureReceived = false;

function attachUserGestureListener() {
  if (typeof window === 'undefined' || userGestureReceived) return;
  const unlockAudio = () => {
    userGestureReceived = true;
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  attachUserGestureListener();
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended' && userGestureReceived) {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * 🪕 Real-time Web Audio API Veena Pluck Synthesizer
 * Generates an acoustic Veena string pluck + tactile wooden bead click
 * tuned to sacred Raga pentatonic scale frequencies.
 */
export function synthesizeVeenaPluck(beadNumber: number = 1) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  try {
    const now = ctx.currentTime;

    // Sacred Raga Pentatonic Frequencies (Sa, Ri, Ga, Pa, Dha)
    const scale = [220, 234.6, 275, 330, 366.6, 440, 469.3, 550, 660, 733.3];
    const baseFreq = scale[(beadNumber - 1) % scale.length];

    // 1. Tactile Wooden Bead Snap (8ms noise burst)
    const bufferSize = Math.floor(ctx.sampleRate * 0.008);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseNode.start(now);

    // 2. Fundamental Veena Osc (Triangle Wave - 650ms decay)
    const oscMain = ctx.createOscillator();
    oscMain.type = 'triangle';
    oscMain.frequency.setValueAtTime(baseFreq, now);

    const gainMain = ctx.createGain();
    gainMain.gain.setValueAtTime(0.001, now);
    gainMain.gain.linearRampToValueAtTime(0.32, now + 0.004);
    gainMain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

    oscMain.connect(gainMain);
    gainMain.connect(ctx.destination);
    oscMain.start(now);
    oscMain.stop(now + 0.65);

    // 3. Ethereal Overtone Osc (Sine Wave 2x frequency)
    const oscHarmonic = ctx.createOscillator();
    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(baseFreq * 2, now);

    const gainHarmonic = ctx.createGain();
    gainHarmonic.gain.setValueAtTime(0.001, now);
    gainHarmonic.gain.linearRampToValueAtTime(0.12, now + 0.003);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    oscHarmonic.connect(gainHarmonic);
    gainHarmonic.connect(ctx.destination);
    oscHarmonic.start(now);
    oscHarmonic.stop(now + 0.35);
  } catch (err) {
    console.error(err);
  }
}

/**
 * 🪕 Interaction: Single Bead Complete
 * Tactile mala bead click + single pure Veena note
 */
export function playBeadComplete(beadNumber: number = 1) {
  if (!isAudioGloballyEnabled() || typeof window === 'undefined') return;

  // Real-time Web Audio API synthesis for zero latency and pitch progression
  synthesizeVeenaPluck(beadNumber);

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
  stopSpeechDevotionalAmbient();
  if (activeSFXAudio) {
    try {
      activeSFXAudio.pause();
      activeSFXAudio.currentTime = 0;
    } catch {}
    activeSFXAudio = null;
  }
}

let speechAmbientCtx: AudioContext | null = null;
let speechMasterGain: GainNode | null = null;
let speechOscs: OscillatorNode[] = [];

/**
 * Extended Devotional Background Ambient Soundscape Bed
 * Continuous 136.1Hz Cosmic OM Tanpura + soft acoustic Veena harmonics bed
 * for text-to-speech reading sections. Zero external network dependencies.
 */
export function startSpeechDevotionalAmbient() {
  if (typeof window === 'undefined') return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;

  stopSpeechDevotionalAmbient();

  try {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.14, now + 0.6);
    masterGain.connect(ctx.destination);

    speechAmbientCtx = ctx;
    speechMasterGain = masterGain;

    const freqs = [136.1, 204.15, 272.2];
    speechOscs = [];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 0.5);

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now);
      speechOscs.push(osc);
    });
  } catch {}
}

export function stopSpeechDevotionalAmbient() {
  if (!speechMasterGain || !speechAmbientCtx) return;
  try {
    const now = speechAmbientCtx.currentTime;
    const currentGain = speechMasterGain.gain.value;
    speechMasterGain.gain.setValueAtTime(currentGain, now);
    speechMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    const oscsToStop = [...speechOscs];
    speechOscs = [];
    speechMasterGain = null;
    speechAmbientCtx = null;

    setTimeout(() => {
      oscsToStop.forEach(osc => {
        try {
          osc.stop();
        } catch {}
      });
    }, 850);
  } catch {
    speechOscs = [];
    speechMasterGain = null;
    speechAmbientCtx = null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔁 BACKWARD-COMPATIBLE ALIASES
// ─────────────────────────────────────────────────────────────────────────────

export const playSaarthiSonicIdent = playScreen1Opening;
export const stopSaarthiSonicIdent = stopScreen1Opening;
export const playVeenaPluck = playBeadComplete;
export const playMalaCompletionSonicIdent = playJapa108Complete;

