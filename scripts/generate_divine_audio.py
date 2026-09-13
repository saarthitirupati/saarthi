"""
🕉️ Master Saarthi Divine Journey Audio Synthesizer
Generates studio-grade acoustic assets using physical modeling:
1. public/audio/saarthi-divine-journey.wav - Master 5.8s sonic ident
2. public/audio/veena-pluck.wav - Warm single string pluck for bead chants
3. public/audio/mala-completion.wav - 3.2s celebratory bansuri & veena milestone flourish

Aesthetic Palette:
- Pure Tanpura (Sa-Pa drone with Javari thread resonance)
- North Indian Bamboo Bansuri (3-note motif: Sa -> Pa -> Sa' with breath turbulence & micro-meend)
- Saraswati Veena Pluck (Jackwood body resonance, biradai bridge buzz, natural damping)
- Sacred "Om" Vocal Cavity Formant Swell (Open vowel O -> Nasal M)
- Stone Sanctum (Garbhagriha) stereo impulse reverb convolution
- NO temple bells, NO metallic brass clangs, NO fast drums, NO singing lyrics
"""

import os
import wave
import struct
import numpy as np
import scipy.signal as sig

SR = 44100  # 44.1 kHz broadcast standard

def save_wav_stereo(filename, left, right, sample_rate=SR):
    # Normalize with headroom (-1.5 dB peak)
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)), 1e-6)
    target_peak = 0.85
    left = (left / peak) * target_peak
    right = (right / peak) * target_peak
    
    # Soft saturation (analog tape warmth)
    left = np.tanh(1.1 * left) / 1.1
    right = np.tanh(1.1 * right) / 1.1
    
    # 16-bit PCM conversion
    left_int = (left * 32767).astype(np.int16)
    right_int = (right * 32767).astype(np.int16)
    
    interleaved = np.empty((len(left) * 2,), dtype=np.int16)
    interleaved[0::2] = left_int
    interleaved[1::2] = right_int
    
    with wave.open(filename, 'wb') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(interleaved.tobytes())
    
    print(f"[OK] Generated studio asset: {filename} ({len(left)/sample_rate:.2f}s, {os.path.getsize(filename)//1024} KB)")

def make_sanctum_reverb(duration=2.5, sample_rate=SR, decay_rate=2.0):
    """Generates stereo impulse response of a sacred granite stone sanctum"""
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    # Early reflections
    ir_l = np.zeros_like(t)
    ir_r = np.zeros_like(t)
    
    delays_l = [int(ms * sample_rate / 1000) for ms in [14, 28, 48, 72, 105, 140]]
    delays_r = [int(ms * sample_rate / 1000) for ms in [18, 33, 54, 80, 115, 155]]
    gains = [0.7, 0.55, 0.42, 0.32, 0.22, 0.15]
    
    for d, g in zip(delays_l, gains):
        if d < len(ir_l):
            ir_l[d] += g
    for d, g in zip(delays_r, gains):
        if d < len(ir_r):
            ir_r[d] += g
            
    # Dense late reverberant field with exponential decay
    noise_l = np.random.normal(0, 1, len(t))
    noise_r = np.random.normal(0, 1, len(t))
    decay = np.exp(-decay_rate * t)
    
    late_l = noise_l * decay * 0.3
    late_r = noise_r * decay * 0.3
    
    # Warm lowpass absorption (stone walls absorb high frequencies)
    b, a = sig.butter(2, 2800 / (sample_rate / 2), btype='low')
    late_l = sig.lfilter(b, a, late_l)
    late_r = sig.lfilter(b, a, late_r)
    
    ir_l += late_l
    ir_r += late_r
    
    ir_l /= np.max(np.abs(ir_l))
    ir_r /= np.max(np.abs(ir_r))
    return ir_l, ir_r

def generate_tanpura(duration, sample_rate=SR):
    """
    Synthesizes authentic Indian Tanpura with non-linear Javari thread resonance.
    Tuning: Pa (G2 ~ 98Hz), Sa1 (C3 ~ 130.81Hz), Sa2 (C3 ~ 130.95Hz detuned), Kharaj Sa (C2 ~ 65.41Hz)
    """
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    
    left = np.zeros(N)
    right = np.zeros(N)
    
    strings = [
        {'f': 98.00, 'pan': -0.45, 'phase_rate': 0.32, 'vol': 0.85},  # Pa
        {'f': 130.81, 'pan': -0.15, 'phase_rate': 0.41, 'vol': 1.00}, # Sa 1
        {'f': 130.95, 'pan': 0.20, 'phase_rate': 0.38, 'vol': 1.00},  # Sa 2 (natural acoustic beating)
        {'f': 65.41, 'pan': 0.00, 'phase_rate': 0.25, 'vol': 0.75},   # Low Kharaj Sa
    ]
    
    for s in strings:
        f0 = s['f']
        pan = s['pan']
        pr = s['phase_rate']
        vol = s['vol']
        
        string_signal = np.zeros(N)
        # Sum harmonics with non-linear Javari shimmer
        for k in range(1, 18):
            fk = f0 * k
            if fk > sample_rate / 2 - 500:
                break
            
            # Harmonic decay law + dynamic Javari amplitude modulation
            amp = (1.0 / (k ** 1.15)) * (1.0 + 0.35 * np.sin(2 * np.pi * pr * t + k * 0.6))
            harmonic = amp * np.sin(2 * np.pi * fk * t + np.random.uniform(0, 2*np.pi))
            string_signal += harmonic
            
        # Panning (constant power)
        angle = (pan + 1.0) * (np.pi / 4.0)
        gain_l = np.cos(angle) * vol
        gain_r = np.sin(angle) * vol
        
        left += string_signal * gain_l
        right += string_signal * gain_r
        
    # Warm resonant body filter (Gourd Kudam resonance ~ 220Hz - 600Hz)
    b, a = sig.butter(2, [180 / (sample_rate/2), 650 / (sample_rate/2)], btype='band')
    left = sig.lfilter(b, a, left)
    right = sig.lfilter(b, a, right)
    
    # Master Tanpura Envelope: Gentle 1.4s swell, sustained bed, smooth fade out at end
    env = np.ones(N)
    fade_in = int(1.4 * sample_rate)
    env[:fade_in] = np.linspace(0, 1, fade_in) ** 2
    
    fade_out_start = int((duration - 1.2) * sample_rate)
    fade_out_len = N - fade_out_start
    if fade_out_len > 0:
        env[fade_out_start:] = np.linspace(1, 0, fade_out_len) ** 2
        
    return left * env, right * env

def generate_bansuri_motif(duration, sample_rate=SR, start_time=1.35):
    """
    Synthesizes authentic Bamboo Bansuri playing the 3-note signature motif:
    Sa (C4 / 261.63 Hz) -> Pa (G4 / 392.00 Hz) -> High Sa' (C5 / 523.25 Hz)
    Features breath noise, dynamic lip vibrato (5.2 Hz), and seamless micro-meend glides.
    """
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    
    # Pitch curve definition
    f_curve = np.zeros(N)
    f_curve[:] = 261.63
    
    # Time points
    t_sa = start_time
    t_pa_glide = t_sa + 0.65
    t_pa = t_pa_glide + 0.18
    t_sa_high_glide = t_pa + 0.55
    t_sa_high = t_sa_high_glide + 0.22
    t_end = t_sa_high + 0.75
    
    idx_sa = int(t_sa * sample_rate)
    idx_pa_glide = int(t_pa_glide * sample_rate)
    idx_pa = int(t_pa * sample_rate)
    idx_sa_high_glide = int(t_sa_high_glide * sample_rate)
    idx_sa_high = int(t_sa_high * sample_rate)
    idx_end = min(int(t_end * sample_rate), N)
    
    # Note 1: Sa (261.63 Hz)
    f_curve[idx_sa:idx_pa_glide] = 261.63
    # Micro-meend glide to Pa
    f_curve[idx_pa_glide:idx_pa] = np.geomspace(261.63, 392.00, idx_pa - idx_pa_glide)
    # Note 2: Pa (392.00 Hz)
    f_curve[idx_pa:idx_sa_high_glide] = 392.00
    # Micro-meend glide to High Sa'
    f_curve[idx_sa_high_glide:idx_sa_high] = np.geomspace(392.00, 523.25, idx_sa_high - idx_sa_high_glide)
    # Note 3: High Sa' (523.25 Hz)
    f_curve[idx_sa_high:idx_end] = 523.25
    
    # Authentic Bansuri Vibrato (5.2 Hz, depth ramps in on sustained notes)
    vibrato_depth = np.zeros(N)
    for seg_start, seg_end in [(idx_sa + int(0.2*sample_rate), idx_pa_glide),
                               (idx_pa + int(0.2*sample_rate), idx_sa_high_glide),
                               (idx_sa_high + int(0.15*sample_rate), idx_end)]:
        if seg_end > seg_start:
            vibrato_depth[seg_start:seg_end] = np.linspace(0.5, 4.0, seg_end - seg_start)
            
    vibrato = vibrato_depth * np.sin(2 * np.pi * 5.2 * t)
    f_instantaneous = f_curve + vibrato
    
    # Phase accumulation
    phase = np.cumsum(f_instantaneous) / sample_rate * 2 * np.pi
    
    # Bansuri harmonic spectrum (pure hollow bamboo: strong fundamental + warm 2nd & 3rd)
    flute_body = (1.0 * np.sin(phase) + 
                  0.38 * np.sin(2 * phase + 0.2) + 
                  0.18 * np.sin(3 * phase + 0.5) +
                  0.07 * np.sin(4 * phase + 0.8))
    
    # Breath turbulence noise (pink noise bandpassed around fundamental)
    white = np.random.normal(0, 1, N)
    b_noise, a_noise = sig.butter(2, [400 / (sample_rate/2), 1800 / (sample_rate/2)], btype='band')
    breath = sig.lfilter(b_noise, a_noise, white) * 0.08
    
    # Flute overall amplitude envelope
    env = np.zeros(N)
    # Note 1 entry
    attack_len = int(0.18 * sample_rate)
    env[idx_sa:idx_sa + attack_len] = np.linspace(0, 1, attack_len) ** 2
    env[idx_sa + attack_len:idx_end - int(0.35*sample_rate)] = 1.0
    # Gentle breath tail
    release_len = int(0.35 * sample_rate)
    env[idx_end - release_len:idx_end] = np.linspace(1, 0, release_len) ** 2
    
    flute_signal = (flute_body + breath) * env
    
    # Warm tone filter (cutting harsh highs > 2200Hz)
    b_tone, a_tone = sig.butter(2, 2200 / (sample_rate/2), btype='low')
    flute_signal = sig.lfilter(b_tone, a_tone, flute_signal)
    
    # Slight stereo width
    left = flute_signal * 0.95
    right = flute_signal * 1.05
    return left, right

def generate_veena_pluck(duration, sample_rate=SR, pluck_time=2.95, is_standalone=False):
    """
    Synthesizes a Saraswati Veena acoustic string pluck.
    Jackwood resonator, biradai curved bridge buzzing, fast 4ms transient and warm decay.
    """
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    
    left = np.zeros(N)
    right = np.zeros(N)
    
    p_idx = int(pluck_time * sample_rate)
    if p_idx >= N:
        return left, right
        
    t_pluck = t[p_idx:] - pluck_time
    M = len(t_pluck)
    
    # Primary Pluck: C4 (261.63 Hz) + Octave C3 (130.81 Hz)
    veena = np.zeros(M)
    harmonics = [
        {'f': 261.63, 'weight': 1.00, 'decay': 1.8},  # Fundamental Sa
        {'f': 523.25, 'weight': 0.65, 'decay': 1.2},  # 2nd
        {'f': 784.88, 'weight': 0.35, 'decay': 0.75}, # 3rd (Pa)
        {'f': 1046.5, 'weight': 0.18, 'decay': 0.45}, # 4th
        {'f': 1308.1, 'weight': 0.08, 'decay': 0.30}, # 5th (Ga)
        {'f': 130.81, 'weight': 0.45, 'decay': 2.2},  # Lower octave resonance
    ]
    
    for h in harmonics:
        f = h['f']
        w = h['weight']
        d = h['decay']
        # Exponential string decay
        decay_env = np.exp(-t_pluck / (d * 0.4))
        # Subtle biradai bridge modulation
        bridge_mod = 1.0 + 0.15 * np.sin(2 * np.pi * 2.8 * t_pluck)
        veena += w * decay_env * bridge_mod * np.sin(2 * np.pi * f * t_pluck)
        
    # Metallic wire plectrum initial click (0 - 8ms)
    transient_len = int(0.008 * sample_rate)
    transient = np.random.normal(0, 1, transient_len) * np.linspace(1, 0, transient_len)
    veena[:transient_len] += transient * 0.45
    
    # Resonance through Jackwood Kudam body (peaking bandpass at 340Hz, Q=3)
    b, a = sig.butter(2, [220 / (sample_rate/2), 520 / (sample_rate/2)], btype='band')
    veena_filtered = sig.lfilter(b, a, veena) * 1.6 + veena * 0.4
    
    # Add subtle gamaka grace touch at +180ms (Fifth G4 = 392Hz)
    grace_idx = int(0.18 * sample_rate)
    if grace_idx < M:
        t_grace = t_pluck[grace_idx:]
        grace_signal = 0.35 * np.exp(-t_grace / 0.4) * np.sin(2 * np.pi * 392.00 * t_grace)
        veena_filtered[grace_idx:] += grace_signal
        
    left[p_idx:] += veena_filtered * 0.95
    right[p_idx:] += veena_filtered * 1.05
    return left, right

def generate_om_formant_swell(duration, sample_rate=SR, swell_start=4.0):
    """
    Synthesizes the subtle "Om" sacred vocal cavity formant texture and cinematic shanti swell.
    Shanti chord (C2, G2, C3, E3, G3) morphing softly from open vowel 'O' to nasal 'M'.
    """
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    
    s_idx = int(swell_start * sample_rate)
    if s_idx >= N:
        return np.zeros(N), np.zeros(N)
        
    M = N - s_idx
    t_swell = t[s_idx:] - swell_start
    
    # 5-Note Divine Shanti Pad Chord
    pitches = [65.41, 98.00, 130.81, 164.81, 196.00]
    pad = np.zeros(M)
    for p in pitches:
        pad += (1.0 / np.sqrt(p)) * np.sin(2 * np.pi * p * t_swell + np.random.uniform(0, 2*np.pi))
        
    # Vowel Formant Filtering: 'O' (F1=450Hz, F2=800Hz) transitioning to 'M' (F1=280Hz, F2=500Hz)
    b_formant, a_formant = sig.butter(2, [280 / (sample_rate/2), 650 / (sample_rate/2)], btype='band')
    pad = sig.lfilter(b_formant, a_formant, pad)
    
    # Swell Envelope: Gentle crest at +0.7s, long peaceful release
    swell_len = M
    crest_idx = int(0.75 * sample_rate)
    env = np.zeros(M)
    env[:crest_idx] = np.linspace(0, 1, crest_idx) ** 2
    env[crest_idx:] = np.linspace(1, 0, M - crest_idx) ** 2.5
    
    swell_signal = pad * env * 1.2
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:] = swell_signal * 0.98
    right[s_idx:] = swell_signal * 1.02
    return left, right

def build_divine_journey_ident():
    """Generates the master 5.8s Saarthi Divine Journey sonic logo"""
    duration = 5.8
    N = int(duration * SR)
    
    print("Building Tanpura Drone...")
    t_l, t_r = generate_tanpura(duration)
    
    print("Building Bamboo Bansuri Motif...")
    f_l, f_r = generate_bansuri_motif(duration, start_time=1.35)
    
    print("Building Saraswati Veena Pluck...")
    v_l, v_r = generate_veena_pluck(duration, pluck_time=2.95)
    
    print("Building 'Om' Vocal Swell...")
    o_l, o_r = generate_om_formant_swell(duration, swell_start=3.95)
    
    # Balance mix levels
    mix_l = t_l * 0.45 + f_l * 0.70 + v_l * 0.85 + o_l * 0.40
    mix_r = t_r * 0.45 + f_r * 0.70 + v_r * 0.85 + o_r * 0.40
    
    print("Applying Sacred Stone Sanctum Convolution Reverb...")
    ir_l, ir_r = make_sanctum_reverb(duration=2.2, decay_rate=2.2)
    
    wet_l = sig.fftconvolve(mix_l, ir_l, mode='full')[:N] * 0.35
    wet_r = sig.fftconvolve(mix_r, ir_r, mode='full')[:N] * 0.35
    
    final_l = mix_l * 0.85 + wet_l
    final_r = mix_r * 0.85 + wet_r
    
    out_path = os.path.join("public", "audio", "saarthi-divine-journey.wav")
    save_wav_stereo(out_path, final_l, final_r)

def build_veena_pluck_asset():
    """Generates standalone warm Veena Pluck for single Japa Mala bead taps"""
    duration = 1.3
    N = int(duration * SR)
    v_l, v_r = generate_veena_pluck(duration, pluck_time=0.01, is_standalone=True)
    
    ir_l, ir_r = make_sanctum_reverb(duration=1.0, decay_rate=3.5)
    wet_l = sig.fftconvolve(v_l, ir_l, mode='full')[:N] * 0.28
    wet_r = sig.fftconvolve(v_r, ir_r, mode='full')[:N] * 0.28
    
    final_l = v_l * 0.9 + wet_l
    final_r = v_r * 0.9 + wet_r
    
    out_path = os.path.join("public", "audio", "veena-pluck.wav")
    save_wav_stereo(out_path, final_l, final_r)

def build_mala_completion_asset():
    """Generates celebratory 3.2s Bansuri + Veena flourish for 108 Mala Poorthi"""
    duration = 3.2
    N = int(duration * SR)
    
    t_l, t_r = generate_tanpura(duration)
    f_l, f_r = generate_bansuri_motif(duration, start_time=0.05)
    v_l, v_r = generate_veena_pluck(duration, pluck_time=0.85)
    o_l, o_r = generate_om_formant_swell(duration, swell_start=1.2)
    
    mix_l = t_l * 0.35 + f_l * 0.80 + v_l * 0.90 + o_l * 0.45
    mix_r = t_r * 0.35 + f_r * 0.80 + v_r * 0.90 + o_r * 0.45
    
    ir_l, ir_r = make_sanctum_reverb(duration=1.8, decay_rate=2.4)
    wet_l = sig.fftconvolve(mix_l, ir_l, mode='full')[:N] * 0.32
    wet_r = sig.fftconvolve(mix_r, ir_r, mode='full')[:N] * 0.32
    
    final_l = mix_l * 0.85 + wet_l
    final_r = mix_r * 0.85 + wet_r
    
    out_path = os.path.join("public", "audio", "mala-completion.wav")
    save_wav_stereo(out_path, final_l, final_r)

if __name__ == "__main__":
    print("[Saarthi Sound] Synthesizing Saarthi Sacred Audio Suite from First Principles...")
    build_divine_journey_ident()
    build_veena_pluck_asset()
    build_mala_completion_asset()
    print("[Saarthi Sound] All Saarthi studio audio assets generated successfully!")
