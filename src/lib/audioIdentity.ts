/**
 * 🕉️ Saarthi "Divine Journey" Studio Sonic Identity
 * 
 * Built from First Principles:
 * 1. Studio-grade physical acoustic assets pre-rendered in granite sanctum reverberation:
 *    - /audio/saarthi-divine-journey.wav (Master 5.8s sonic logo)
 *    - /audio/veena-pluck.wav (Warm acoustic single-string touch)
 *    - /audio/mala-completion.wav (3.2s celebratory milestone flourish)
 * 2. Instant HTML5 Audio playback with smooth gain fade-out control on skip/dismiss.
 * 3. Graceful fallback to real-time Web Audio API synthesis if asset network is restricted.
 * 4. Zero temple bells, zero brass clangs, zero loud percussion, zero vocal singing.
 */

let activeAudioEl: HTMLAudioElement | null = null;
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
  // 1. Fade out active HTML5 Audio element
  if (activeAudioEl) {
    const el = activeAudioEl;
    activeAudioEl = null;
    try {
      const fadeStep = 0.08;
      const fadeInterval = setInterval(() => {
        if (el.volume > fadeStep) {
          el.volume = Math.max(0, el.volume - fadeStep);
        } else {
          clearInterval(fadeInterval);
          el.pause();
          el.currentTime = 0;
        }
      }, 15);
    } catch {
      el.pause();
    }
  }

  // 2. Fade out synthetic master gain if active
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
 * Primary: Studio-grade acoustic master asset with granite sanctum resonance.
 * Fallback: Native Web Audio synthesizer.
 */
export function playSaarthiSonicIdent() {
  if (typeof window === 'undefined') return;

  stopSaarthiSonicIdent();

  try {
    const audio = new Audio('/audio/saarthi-divine-journey.wav');
    audio.volume = 0.95;
    activeAudioEl = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If autoplay policy or asset fails, fallback to Web Audio synthesizer
        playSyntheticSonicIdent();
      });
    }
  } catch {
    playSyntheticSonicIdent();
  }
}

/**
 * 🪕 In-App Tactile Veena String Pluck
 * Played on each prayer mala bead tap.
 */
export function playVeenaPluck() {
  if (typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/veena-pluck.wav');
    audio.volume = 0.85;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => playSyntheticVeenaPluck());
    }
  } catch {
    playSyntheticVeenaPluck();
  }
}

/**
 * 🪷 108 Mala Poorthi (Milestone Completion) Flourish
 */
export function playMalaCompletionSonicIdent() {
  if (typeof window === 'undefined') return;

  try {
    const audio = new Audio('/audio/mala-completion.wav');
    audio.volume = 0.95;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => playSyntheticMalaCompletion());
    }
  } catch {
    playSyntheticMalaCompletion();
  }
}

// =============================================================================
// 🌿 FALLBACK SYNTHESIZER (Web Audio API)
// Used whenever offline assets are unavailable or blocked by browser policies.
// =============================================================================

function playSyntheticSonicIdent() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
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

    // 1. Tanpura Drone (C3 / G2 / C2)
    const tanpuraGain = ctx.createGain();
    const tanpuraFilter = ctx.createBiquadFilter();
    tanpuraFilter.type = 'lowpass';
    tanpuraFilter.frequency.setValueAtTime(380, now);
    tanpuraFilter.Q.setValueAtTime(2.2, now);

    tanpuraGain.gain.setValueAtTime(0.0001, now);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.14, now + 1.2);
    tanpuraGain.gain.setValueAtTime(0.14, now + 4.2);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

    [98.00, 130.81, 130.95, 65.41].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = freq === 65.41 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(tanpuraFilter);
      osc.start(now);
      osc.stop(now + 5.85);
    });

    tanpuraFilter.connect(tanpuraGain);
    tanpuraGain.connect(masterGain);

    // 2. Bansuri Motif (1.35s - 3.2s)
    const fluteStart = now + 1.35;
    const fluteGain = ctx.createGain();
    const fluteOsc = ctx.createOscillator();
    fluteOsc.type = 'sine';
    fluteOsc.frequency.setValueAtTime(261.63, fluteStart);
    fluteOsc.frequency.exponentialRampToValueAtTime(392.00, fluteStart + 0.65);
    fluteOsc.frequency.exponentialRampToValueAtTime(523.25, fluteStart + 1.20);

    fluteGain.gain.setValueAtTime(0.0001, fluteStart);
    fluteGain.gain.linearRampToValueAtTime(0.18, fluteStart + 0.2);
    fluteGain.gain.setValueAtTime(0.18, fluteStart + 1.2);
    fluteGain.gain.exponentialRampToValueAtTime(0.0001, fluteStart + 1.95);

    fluteOsc.connect(fluteGain);
    fluteGain.connect(masterGain);
    fluteOsc.start(fluteStart);
    fluteOsc.stop(fluteStart + 2.0);

    // 3. Veena Pluck (2.95s)
    const veenaTime = now + 2.95;
    const veenaGain = ctx.createGain();
    veenaGain.gain.setValueAtTime(0.0001, veenaTime);
    veenaGain.gain.linearRampToValueAtTime(0.24, veenaTime + 0.006);
    veenaGain.gain.exponentialRampToValueAtTime(0.0001, veenaTime + 1.85);

    [261.63, 523.25, 784.88].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, veenaTime);
      osc.connect(veenaGain);
      osc.start(veenaTime);
      osc.stop(veenaTime + 1.85);
    });
    veenaGain.connect(masterGain);

    // 4. Om Pad Swell (4.0s)
    const swellStart = now + 4.0;
    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0.0001, swellStart);
    swellGain.gain.linearRampToValueAtTime(0.12, swellStart + 0.7);
    swellGain.gain.exponentialRampToValueAtTime(0.0001, swellStart + 1.8);

    [65.41, 98.00, 130.81].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, swellStart);
      osc.connect(swellGain);
      osc.start(swellStart);
      osc.stop(swellStart + 1.85);
    });
    swellGain.connect(masterGain);
  } catch {
    // Ignored
  }
}

function playSyntheticVeenaPluck() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    [261.63, 523.25, 784.88].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.7);
    });
    gainNode.connect(ctx.destination);
  } catch {}
}

function playSyntheticMalaCompletion() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(1.0, now);
    master.connect(ctx.destination);

    const fluteOsc = ctx.createOscillator();
    const fluteGain = ctx.createGain();
    fluteOsc.type = 'sine';
    fluteOsc.frequency.setValueAtTime(261.63, now);
    fluteOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.55);

    fluteGain.gain.setValueAtTime(0.0001, now);
    fluteGain.gain.linearRampToValueAtTime(0.20, now + 0.15);
    fluteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    fluteOsc.connect(fluteGain);
    fluteGain.connect(master);
    fluteOsc.start(now);
    fluteOsc.stop(now + 1.45);
  } catch {}
}
