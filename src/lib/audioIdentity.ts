/**
 * 🕉️ Saarthi "Divine Journey" Signature Sonic Identity
 * 
 * Aesthetic Architecture:
 * - 0.0s–1.5s: Hypnotic Tanpura drone (Sa-Pa / C-G) fading in gently
 * - 1.4s–3.0s: Warm Bamboo Flute (Bansuri) 3-note signature motif (Sa → Pa → Sa' / C4 → G4 → C5)
 * - 2.95s–4.5s: Resonant Saraswati Veena string pluck (marking the Sacred Namam / Saarthi mark lock)
 * - 4.2s–5.8s: Subtle choral / "Om" vocal formant pad & cinematic warm harmonic swell trailing into silence
 * 
 * Strict Negative Constraints:
 * ❌ Zero temple bell chimes / metallic brass clangs
 * ❌ Zero loud percussion / tabla / mridangam
 * ❌ Zero singing lyrics / Bollywood tropes
 * ❌ Pure organic acoustic resonance synthesized natively via Web Audio API (0KB network assets)
 */

let activeAudioCtx: AudioContext | null = null;
let activeMasterGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return null;
    if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
      activeAudioCtx = new AudioCtxClass();
    }
    if (activeAudioCtx.state === 'suspended') {
      activeAudioCtx.resume().catch(() => {});
    }
    return activeAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Gracefully stop and fade out any currently active sonic ident
 */
export function stopSaarthiSonicIdent() {
  if (activeMasterGain && activeAudioCtx && activeAudioCtx.state !== 'closed') {
    try {
      const now = activeAudioCtx.currentTime;
      activeMasterGain.gain.cancelScheduledValues(now);
      activeMasterGain.gain.setValueAtTime(activeMasterGain.gain.value, now);
      activeMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
    } catch {
      // Ignored
    }
  }
}

/**
 * 🎵 Master Saarthi "Divine Journey" Signature Sonic Logo
 * Total duration: ~5.8 seconds
 */
export function playSaarthiSonicIdent() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Master bus with brickwall limiter compressor to ensure zero distortion
    const masterGain = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-14, now);
    compressor.knee.setValueAtTime(8, now);
    compressor.ratio.setValueAtTime(3, now);
    compressor.attack.setValueAtTime(0.005, now);
    compressor.release.setValueAtTime(0.2, now);

    masterGain.gain.setValueAtTime(1.0, now);
    masterGain.connect(compressor);
    compressor.connect(ctx.destination);
    activeMasterGain = masterGain;

    // =========================================================================
    // 🪕 1. TANPURA DRONE (0.0s – 5.8s)
    // Root = C3 (130.81 Hz), Fifth = G2 (98.00 Hz), Sub = C2 (65.41 Hz)
    // Rich string shimmer through resonant acoustic filter
    // =========================================================================
    const tanpuraGain = ctx.createGain();
    const tanpuraFilter = ctx.createBiquadFilter();
    tanpuraFilter.type = 'lowpass';
    tanpuraFilter.frequency.setValueAtTime(380, now);
    tanpuraFilter.Q.setValueAtTime(2.2, now);

    // Subtle swirling LFO simulating cotton thread buzz (Javari)
    const tanpuraLfo = ctx.createOscillator();
    const tanpuraLfoGain = ctx.createGain();
    tanpuraLfo.frequency.setValueAtTime(0.4, now); // Slow hypnotic cycle
    tanpuraLfoGain.gain.setValueAtTime(45, now);
    tanpuraLfo.connect(tanpuraFilter.frequency);
    tanpuraLfo.start(now);
    tanpuraLfo.stop(now + 6.0);

    tanpuraGain.gain.setValueAtTime(0.0001, now);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.14, now + 1.2);
    tanpuraGain.gain.setValueAtTime(0.14, now + 4.2);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

    const tanpuraStrings = [
      { freq: 98.00, type: 'sawtooth' as OscillatorType, detune: 0 },    // Pa (G2)
      { freq: 130.81, type: 'sawtooth' as OscillatorType, detune: -2 },  // Sa (C3 detuned)
      { freq: 130.81, type: 'sawtooth' as OscillatorType, detune: 3 },   // Sa (C3 detuned)
      { freq: 65.41, type: 'sine' as OscillatorType, detune: 0 }         // Low Kharaj Sa (C2)
    ];

    tanpuraStrings.forEach(({ freq, type, detune }) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);
      osc.connect(tanpuraFilter);
      osc.start(now);
      osc.stop(now + 5.85);
    });

    tanpuraFilter.connect(tanpuraGain);
    tanpuraGain.connect(masterGain);

    // =========================================================================
    // 🎋 2. WARM BAMBOO FLUTE / BANSURI MOTIF (1.4s – 3.3s)
    // 3-Note Signature Motif: Sa (C4 / 261.63 Hz) → Pa (G4 / 392.00 Hz) → Sa' (C5 / 523.25 Hz)
    // Silky portamento glides with authentic breath vibrato
    // =========================================================================
    const fluteStart = now + 1.35;
    const fluteGain = ctx.createGain();
    const fluteFilter = ctx.createBiquadFilter();
    fluteFilter.type = 'lowpass';
    fluteFilter.frequency.setValueAtTime(1400, now);
    fluteFilter.Q.setValueAtTime(1.2, now);

    // Flute Vibrato LFO (5.2 Hz North Indian bansuri style)
    const fluteVibrato = ctx.createOscillator();
    const fluteVibratoGain = ctx.createGain();
    fluteVibrato.frequency.setValueAtTime(5.2, fluteStart);
    fluteVibratoGain.gain.setValueAtTime(0.0, fluteStart);
    // Ramp vibrato depth in after note begins
    fluteVibratoGain.gain.linearRampToValueAtTime(3.8, fluteStart + 0.6);
    fluteVibrato.connect(fluteVibratoGain);
    fluteVibrato.start(fluteStart);
    fluteVibrato.stop(fluteStart + 2.0);

    const fluteOsc = ctx.createOscillator();
    fluteOsc.type = 'sine';
    fluteVibratoGain.connect(fluteOsc.frequency);

    // Flute 2nd harmonic for warm wooden bamboo body
    const fluteHarmonic = ctx.createOscillator();
    const fluteHarmonicGain = ctx.createGain();
    fluteHarmonic.type = 'triangle';
    fluteHarmonicGain.gain.setValueAtTime(0.06, now);

    // Pitch trajectory: Sa (261.63) -> Pa (392.0) -> Sa' (523.25)
    fluteOsc.frequency.setValueAtTime(261.63, fluteStart); // Sa
    fluteHarmonic.frequency.setValueAtTime(261.63 * 2, fluteStart);

    // Legato glide to Pa at 1.95s
    const tPa = fluteStart + 0.60;
    fluteOsc.frequency.exponentialRampToValueAtTime(392.00, tPa);
    fluteHarmonic.frequency.exponentialRampToValueAtTime(392.00 * 2, tPa);

    // Legato glide to High Sa' at 2.45s
    const tSaHigh = fluteStart + 1.15;
    fluteOsc.frequency.exponentialRampToValueAtTime(523.25, tSaHigh);
    fluteHarmonic.frequency.exponentialRampToValueAtTime(523.25 * 2, tSaHigh);

    // Flute amplitude envelope (breathy attack, warm sustaining glide, smooth release)
    fluteGain.gain.setValueAtTime(0.0001, fluteStart);
    fluteGain.gain.linearRampToValueAtTime(0.18, fluteStart + 0.2);
    fluteGain.gain.setValueAtTime(0.18, fluteStart + 1.2);
    fluteGain.gain.exponentialRampToValueAtTime(0.0001, fluteStart + 1.95);

    fluteOsc.connect(fluteFilter);
    fluteHarmonic.connect(fluteHarmonicGain);
    fluteHarmonicGain.connect(fluteFilter);
    fluteFilter.connect(fluteGain);
    fluteGain.connect(masterGain);

    fluteOsc.start(fluteStart);
    fluteOsc.stop(fluteStart + 2.0);
    fluteHarmonic.start(fluteStart);
    fluteHarmonic.stop(fluteStart + 2.0);

    // =========================================================================
    // 🪷 3. SARASWATI VEENA ACOUSTIC STRING PLUCK (2.95s – 4.8s)
    // Synchronized precisely as the Sacred Tirumala Namam locks into place
    // Multi-harmonic acoustic string model with wooden Kudam body resonance
    // =========================================================================
    const veenaTime = now + 2.95;
    const veenaGain = ctx.createGain();
    const veenaResonator = ctx.createBiquadFilter();
    veenaResonator.type = 'peaking';
    veenaResonator.frequency.setValueAtTime(340, veenaTime); // Jackwood resonance
    veenaResonator.Q.setValueAtTime(2.5, veenaTime);
    veenaResonator.gain.setValueAtTime(4.0, veenaTime);

    veenaGain.gain.setValueAtTime(0.0001, veenaTime);
    veenaGain.gain.linearRampToValueAtTime(0.24, veenaTime + 0.006); // Fast string pluck transient
    veenaGain.gain.exponentialRampToValueAtTime(0.04, veenaTime + 0.6); // String damping
    veenaGain.gain.exponentialRampToValueAtTime(0.0001, veenaTime + 1.85); // Gentle sustain fade

    // Veena string harmonic series (Fundamental C4 = 261.63 Hz)
    const veenaHarmonics = [
      { freq: 261.63, weight: 0.35, decay: 1.85 },
      { freq: 523.25, weight: 0.22, decay: 1.20 },
      { freq: 784.88, weight: 0.12, decay: 0.75 },
      { freq: 1046.5, weight: 0.06, decay: 0.45 }
    ];

    veenaHarmonics.forEach(({ freq, weight, decay }) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, veenaTime);
      hGain.gain.setValueAtTime(weight, veenaTime);
      hGain.gain.exponentialRampToValueAtTime(0.0001, veenaTime + decay);
      osc.connect(hGain);
      hGain.connect(veenaResonator);
      osc.start(veenaTime);
      osc.stop(veenaTime + decay);
    });

    // Subtle Veena Meend / Gamaka grace touch at +180ms (Fifth G4 = 392 Hz)
    const graceTime = veenaTime + 0.18;
    const graceOsc = ctx.createOscillator();
    const graceGain = ctx.createGain();
    graceOsc.type = 'sine';
    graceOsc.frequency.setValueAtTime(392.00, graceTime);
    graceGain.gain.setValueAtTime(0.0001, graceTime);
    graceGain.gain.linearRampToValueAtTime(0.08, graceTime + 0.01);
    graceGain.gain.exponentialRampToValueAtTime(0.0001, graceTime + 0.9);
    graceOsc.connect(graceGain);
    graceGain.connect(veenaResonator);
    graceOsc.start(graceTime);
    graceOsc.stop(graceTime + 0.95);

    veenaResonator.connect(veenaGain);
    veenaGain.connect(masterGain);

    // =========================================================================
    // 🌌 4. SUBTLE "OM" VOCAL TEXTURE & CINEMATIC SWELL (4.1s – 5.8s)
    // As "Saarthi Guide - Spiritual Pilgrim Companion" typography & lotus illuminate
    // Gentle open-vowel vocal formant + deep warm root pad trailing into peaceful silence
    // =========================================================================
    const swellStart = now + 4.0;
    const swellGain = ctx.createGain();
    const formantFilter = ctx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(420, swellStart); // "Om" vocal cavity vowel formant
    formantFilter.Q.setValueAtTime(1.8, swellStart);

    swellGain.gain.setValueAtTime(0.0001, swellStart);
    swellGain.gain.linearRampToValueAtTime(0.12, swellStart + 0.7); // Gentle crest
    swellGain.gain.exponentialRampToValueAtTime(0.0001, swellStart + 1.8);

    // Harmonic chords (C2, G2, C3, E3 - Pure Shanti Pad)
    const padPitches = [65.41, 98.00, 130.81, 164.81];
    padPitches.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, swellStart);
      osc.connect(formantFilter);
      osc.start(swellStart);
      osc.stop(swellStart + 1.85);
    });

    formantFilter.connect(swellGain);
    swellGain.connect(masterGain);

  } catch (err) {
    // Graceful fallback for non-supported or restricted audio contexts
    console.warn('[Saarthi Sound] Audio playback fallback:', err);
  }
}

/**
 * 🪕 In-App Tactile Veena String Pluck
 * Replaces the metallic temple bell for single Japa Mala bead taps & spiritual interactions.
 * Delivers a warm, soothing, modern acoustic resonance.
 */
export function playVeenaPluck() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);
    filter.Q.setValueAtTime(2.0, now);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    // Plucked string harmonics (C4 = 261.63 Hz & G4 = 392.0 Hz)
    [261.63, 523.25, 784.88].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 0.7);
    });

    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
  } catch {
    // Ignore restricted audio
  }
}

/**
 * 🪷 108 Mala Poorthi (Milestone Completion) Sonic Flourish
 * Celebratory 3-second bansuri upward glide + double resonant veena chord + warm peaceful release.
 * Completely replaces the loud double bell gong.
 */
export function playMalaCompletionSonicIdent() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(1.0, now);
    master.connect(ctx.destination);

    // 1. Celebratory Bansuri upward glide (C4 -> G4 -> C5)
    const fluteOsc = ctx.createOscillator();
    const fluteGain = ctx.createGain();
    fluteOsc.type = 'sine';
    fluteOsc.frequency.setValueAtTime(261.63, now);
    fluteOsc.frequency.exponentialRampToValueAtTime(392.00, now + 0.25);
    fluteOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.55);

    fluteGain.gain.setValueAtTime(0.0001, now);
    fluteGain.gain.linearRampToValueAtTime(0.20, now + 0.15);
    fluteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    fluteOsc.connect(fluteGain);
    fluteGain.connect(master);
    fluteOsc.start(now);
    fluteOsc.stop(now + 1.45);

    // 2. Resonant Veena chord at apex (C4 + G4 + C5)
    const chordTime = now + 0.5;
    const chordPitches = [261.63, 392.00, 523.25];
    chordPitches.forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, chordTime);
      g.gain.setValueAtTime(0.0001, chordTime);
      g.gain.linearRampToValueAtTime(0.15, chordTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, chordTime + 2.2);
      osc.connect(g);
      g.connect(master);
      osc.start(chordTime);
      osc.stop(chordTime + 2.25);
    });

    // 3. Warm peaceful pad release (C3 + G3)
    const padTime = now + 0.8;
    [130.81, 196.00].forEach((freq) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, padTime);
      g.gain.setValueAtTime(0.0001, padTime);
      g.gain.linearRampToValueAtTime(0.09, padTime + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, padTime + 2.2);
      osc.connect(g);
      g.connect(master);
      osc.start(padTime);
      osc.stop(padTime + 2.3);
    });

  } catch {
    // Ignore restricted audio
  }
}
