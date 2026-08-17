/**
 * 🔔 Native Web Audio Temple Bell Chime
 * Synthesizes a soothing bronze temple bell chime using harmonic overtone physics.
 * Zero external audio assets required.
 */

export function playTempleBellChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    // Harmonic frequencies of a sacred Indian bronze bell (Fundamental 432 Hz)
    const harmonics = [
      { freq: 432, gain: 0.35, decay: 2.2 },
      { freq: 864, gain: 0.18, decay: 1.6 },
      { freq: 1296, gain: 0.10, decay: 1.1 },
      { freq: 1728, gain: 0.04, decay: 0.8 }
    ];
    
    harmonics.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    // Ignore if audio permissions are restricted
  }
}
