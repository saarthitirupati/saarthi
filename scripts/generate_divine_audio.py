"""
🕉️ Master Saarthi Dual-Screen Spiritual Soundscapes
Built from First Principles:

Screen 1: "Saarthi Guide" (Arrival & Intention-Setting - Temple Courtyard at Dawn)
1. saarthi-opening-ident.wav (7.0s): Distant dreamlike Shankha + single deep bell + 3-note greeting Veena + Tanpura
2. saarthi-courtyard-ambient.wav (22.0s loop): Spacious Veena + shruti drone + faint distant 'Hari...' vocal

Screen 2: "Japa Mala" (Active Devotion & Repetition - Sanctum Sanctorum)
3. japa-ambient-loop.wav (20.0s loop): Meditative continuous bed (Shruti + veena motif + subtle bansuri)
4. bead-complete.wav (0.75s): Tactile mala bead click + single acoustic Veena note
5. reflection-end.wav (1.20s): Harmonic resolution cue when 10-second reflection timer ends
6. milestone-quarter.wav (2.20s): Ethereal distant 'Govinda...' vocal resonance at 27, 54, 81 beads
7. japa-complete-108.wav (4.80s): Triumphant Shankha + full Veena chord + deep Garbhagriha reverb finale
"""

import os
import wave
import numpy as np
import scipy.signal as sig

SR = 44100  # 44.1 kHz broadcast audio standard

def save_wav_stereo(filename, left, right, sample_rate=SR):
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)), 1e-6)
    target_peak = 0.85
    left = (left / peak) * target_peak
    right = (right / peak) * target_peak
    
    # Analog tape saturation warmth
    left = np.tanh(1.15 * left) / 1.15
    right = np.tanh(1.15 * right) / 1.15
    
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
    
    print(f"[OK] Generated: {filename} ({len(left)/sample_rate:.2f}s, {os.path.getsize(filename)//1024} KB)")

def make_sanctum_reverb(duration=2.5, sample_rate=SR, decay_rate=2.0, wet_mix=0.35):
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    ir_l = np.zeros_like(t)
    ir_r = np.zeros_like(t)
    
    delays_l = [int(ms * sample_rate / 1000) for ms in [14, 28, 48, 72, 105, 140]]
    delays_r = [int(ms * sample_rate / 1000) for ms in [18, 33, 54, 80, 115, 155]]
    gains = [0.7, 0.55, 0.42, 0.32, 0.22, 0.15]
    
    for d, g in zip(delays_l, gains):
        if d < len(ir_l): ir_l[d] += g
    for d, g in zip(delays_r, gains):
        if d < len(ir_r): ir_r[d] += g
            
    noise_l = np.random.normal(0, 1, len(t))
    noise_r = np.random.normal(0, 1, len(t))
    decay = np.exp(-decay_rate * t)
    
    late_l = noise_l * decay * 0.3
    late_r = noise_r * decay * 0.3
    
    b, a = sig.butter(2, 2600 / (sample_rate / 2), btype='low')
    late_l = sig.lfilter(b, a, late_l)
    late_r = sig.lfilter(b, a, late_r)
    
    ir_l += late_l
    ir_r += late_r
    ir_l /= np.max(np.abs(ir_l))
    ir_r /= np.max(np.abs(ir_r))
    return ir_l * wet_mix, ir_r * wet_mix

def apply_reverb(left, right, ir_l, ir_r):
    N = len(left)
    wet_l = sig.fftconvolve(left, ir_l, mode='full')[:N]
    wet_r = sig.fftconvolve(right, ir_r, mode='full')[:N]
    return left * 0.82 + wet_l, right * 0.82 + wet_r

def generate_shankha(duration, sample_rate=SR, start_time=0.0, is_distant=True):
    """Acoustic simulation of Sacred Conch Shell (Shankha) horn harmonics"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(start_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_shankha = t[s_idx:] - start_time
    # Characteristic conical bore fundamental ~235 Hz with lip buzz
    f0 = 235.0
    # Natural embouchure air flutter
    flutter = 1.0 + 0.04 * np.sin(2 * np.pi * 6.5 * t_shankha)
    phase = np.cumsum(f0 * flutter) / sample_rate * 2 * np.pi
    
    # Conch harmonic profile
    raw = (1.00 * np.sin(phase) +
           0.75 * np.sin(2 * phase + 0.3) +
           0.55 * np.sin(3 * phase + 0.7) +
           0.35 * np.sin(4 * phase + 1.1) +
           0.20 * np.sin(5 * phase + 1.4) +
           0.10 * np.sin(6 * phase + 1.8))
    
    # Breath noise inside spiral shell
    noise = np.random.normal(0, 1, M)
    b_n, a_n = sig.butter(2, [300 / (sample_rate/2), 1600 / (sample_rate/2)], btype='band')
    breath = sig.lfilter(b_n, a_n, noise) * 0.12
    
    # Swell envelope
    env = np.zeros(M)
    shankha_len = int(min(2.8, duration - start_time) * sample_rate)
    attack = int(0.7 * sample_rate)
    decay = shankha_len - attack
    env[:attack] = np.linspace(0, 1, attack) ** 1.8
    env[attack:shankha_len] = np.linspace(1, 0, decay) ** 1.5
    
    shankha_sig = (raw + breath) * env
    if is_distant:
        # High frequency air absorption for distant horizon feel
        b_dist, a_dist = sig.butter(2, 1400 / (sample_rate/2), btype='low')
        shankha_sig = sig.lfilter(b_dist, a_dist, shankha_sig) * 0.55
        
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:] = shankha_sig * 0.95
    right[s_idx:] = shankha_sig * 1.05
    return left, right

def generate_deep_bell(duration, sample_rate=SR, strike_time=0.8):
    """Acoustic simulation of a single deep temple bronze bell"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(strike_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_bell = t[s_idx:] - strike_time
    bell_sig = np.zeros(M)
    
    # Bronze bell physics: Fundamental (Hum tone 108Hz, Prime 216Hz, Tierce 256Hz, Quint 324Hz, Octave 432Hz)
    partials = [
        {'f': 108.0, 'amp': 0.70, 'decay': 4.5}, # Deep hum tone
        {'f': 216.0, 'amp': 1.00, 'decay': 3.8}, # Fundamental strike
        {'f': 258.0, 'amp': 0.55, 'decay': 3.2}, # Minor third (Tierce)
        {'f': 324.0, 'amp': 0.40, 'decay': 2.6}, # Fifth (Quint)
        {'f': 432.0, 'amp': 0.30, 'decay': 2.1}, # Nominal octave
        {'f': 648.0, 'amp': 0.15, 'decay': 1.4}, # Upper harmonic
        {'f': 864.0, 'amp': 0.08, 'decay': 0.9}, # Super-octave
    ]
    
    for p in partials:
        f = p['f']
        amp = p['amp']
        decay = p['decay']
        bell_sig += amp * np.exp(-t_bell / decay) * np.sin(2 * np.pi * f * t_bell)
        
    # Strike transient (felt hammer on bronze rim)
    trans_len = int(0.012 * sample_rate)
    trans = np.random.normal(0, 1, trans_len) * np.linspace(1, 0, trans_len)
    bell_sig[:trans_len] += trans * 0.25
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:] = bell_sig * 0.92
    right[s_idx:] = bell_sig * 1.08
    return left, right

def generate_veena_note(duration, sample_rate=SR, start_time=0.0, pitch=261.63, amp_scale=1.0, decay_scale=1.0):
    """Single expressive Saraswati Veena note with Jackwood Kudam resonance"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(start_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_n = t[s_idx:] - start_time
    sig_n = np.zeros(M)
    
    harmonics = [
        {'mult': 1.0, 'w': 1.00, 'd': 1.8 * decay_scale},
        {'mult': 2.0, 'w': 0.65, 'd': 1.3 * decay_scale},
        {'mult': 3.0, 'w': 0.35, 'd': 0.8 * decay_scale},
        {'mult': 4.0, 'w': 0.18, 'd': 0.5 * decay_scale},
        {'mult': 0.5, 'w': 0.35, 'd': 2.0 * decay_scale}, # Lower octave body sympathetic
    ]
    
    for h in harmonics:
        f = pitch * h['mult']
        d = h['d']
        w = h['w']
        sig_n += w * np.exp(-t_n / d) * np.sin(2 * np.pi * f * t_n)
        
    # Wire click
    trans_len = int(0.006 * sample_rate)
    sig_n[:trans_len] += np.random.normal(0, 1, trans_len) * np.linspace(1, 0, trans_len) * 0.35
    
    # Kudam body filter
    b, a = sig.butter(2, [200 / (sample_rate/2), 580 / (sample_rate/2)], btype='band')
    sig_n = (sig.lfilter(b, a, sig_n) * 1.5 + sig_n * 0.4) * amp_scale
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:] = sig_n * 0.96
    right[s_idx:] = sig_n * 1.04
    return left, right

def generate_vocal_formant(duration, sample_rate=SR, start_time=10.0, word="hari", amp=0.35):
    """Acoustic vocal formant simulation ('Hari...' or 'Govinda...')"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(start_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_v = t[s_idx:] - start_time
    v_len = int(min(2.5, duration - start_time) * sample_rate)
    
    # Male sacred chant pitch ~ 130 Hz (C3)
    f0 = 130.81 * (1.0 + 0.03 * np.sin(2 * np.pi * 4.5 * t_v[:v_len]))
    phase = np.cumsum(f0) / sample_rate * 2 * np.pi
    
    # Vocal glottal source
    glottal = np.sin(phase) + 0.5 * np.sin(2 * phase) + 0.25 * np.sin(3 * phase)
    
    # Formant filtering based on vowel transition
    if word == "hari":
        # /ha/ -> /ri/
        b_f, a_f = sig.butter(2, [400 / (sample_rate/2), 1400 / (sample_rate/2)], btype='band')
    else: # "govinda"
        # /go/ -> /vin/ -> /da/
        b_f, a_f = sig.butter(2, [320 / (sample_rate/2), 1100 / (sample_rate/2)], btype='band')
        
    vocal = sig.lfilter(b_f, a_f, glottal)
    
    # Breath envelope
    env = np.zeros(v_len)
    att = int(0.5 * sample_rate)
    env[:att] = np.linspace(0, 1, att) ** 2
    env[att:] = np.linspace(1, 0, v_len - att) ** 2.2
    
    sig_v = vocal * env * amp
    
    # Air distance lowpass
    b_dist, a_dist = sig.butter(2, 1200 / (sample_rate/2), btype='low')
    sig_v = sig.lfilter(b_dist, a_dist, sig_v)
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:s_idx + v_len] = sig_v * 0.92
    right[s_idx:s_idx + v_len] = sig_v * 1.08
    return left, right

def generate_tanpura_bed(duration, sample_rate=SR, volume=0.5):
    """Continuous warm Tanpura drone bed (C3 & G2)"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    left = np.zeros(N)
    right = np.zeros(N)
    
    for f0, pan, pr in [(98.0, -0.4, 0.31), (130.81, -0.1, 0.42), (130.95, 0.2, 0.37), (65.41, 0.0, 0.23)]:
        string_sig = np.zeros(N)
        for k in range(1, 16):
            amp = (1.0 / (k ** 1.2)) * (1.0 + 0.3 * np.sin(2 * np.pi * pr * t + k * 0.5))
            string_sig += amp * np.sin(2 * np.pi * f0 * k * t)
        angle = (pan + 1.0) * (np.pi / 4.0)
        left += string_sig * np.cos(angle) * volume
        right += string_sig * np.sin(angle) * volume
        
    b, a = sig.butter(2, [160 / (sample_rate/2), 620 / (sample_rate/2)], btype='band')
    return sig.lfilter(b, a, left), sig.lfilter(b, a, right)

# =============================================================================
# 🛕 SCREEN 1: SAARTHI GUIDE ASSETS
# =============================================================================

def generate_sacred_shankha(duration=5.5, sample_rate=SR, start_time=0.1):
    """Authentic acoustic simulation of Sacred Conch Shell (శంఖ నాదం)"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(start_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_sh = t[s_idx:] - start_time
    sh_len = int(min(3.2, duration - start_time) * sample_rate)
    f0 = 232.0
    pitch_contour = f0 * (1.0 + 0.03 * np.exp(-t_sh[:sh_len] * 1.5) + 0.015 * np.sin(2 * np.pi * 5.5 * t_sh[:sh_len]))
    phase = np.cumsum(pitch_contour) / sample_rate * 2 * np.pi
    
    raw = (
        1.00 * np.sin(phase) +
        0.70 * np.sin(2 * phase + 0.2) +
        0.48 * np.sin(3 * phase + 0.5) +
        0.30 * np.sin(4 * phase + 0.9) +
        0.18 * np.sin(5 * phase + 1.2) +
        0.10 * np.sin(6 * phase + 1.6)
    )
    noise = np.random.normal(0, 1, sh_len)
    b_n, a_n = sig.butter(2, [350 / (sample_rate/2), 1800 / (sample_rate/2)], btype='band')
    breath = sig.lfilter(b_n, a_n, noise) * 0.14
    
    env = np.zeros(sh_len)
    att = int(0.8 * sample_rate)
    dec = sh_len - att
    env[:att] = np.linspace(0, 1, att) ** 1.8
    env[att:] = np.linspace(1, 0, dec) ** 1.5
    
    sh_sig = (raw + breath) * env
    b_sm, a_sm = sig.butter(2, 2400 / (sample_rate/2), btype='low')
    sh_sig = sig.lfilter(b_sm, a_sm, sh_sig) * 0.65
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:s_idx + sh_len] = sh_sig * 0.94
    right[s_idx:s_idx + sh_len] = sh_sig * 1.06
    return left, right

def generate_sanctum_bell(duration=5.5, sample_rate=SR, strike_time=0.4, pitch=216.0, amp=0.85):
    """Sacred Bronze Temple Bell (కంచు ఘంట) with authentic strike transient and multi-harmonic hum"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(strike_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_b = t[s_idx:] - strike_time
    bell_sig = np.zeros(M)
    partials = [
        {'ratio': 0.50, 'amp': 0.55, 'decay': 4.8},
        {'ratio': 1.00, 'amp': 1.00, 'decay': 4.0},
        {'ratio': 1.19, 'amp': 0.50, 'decay': 3.4},
        {'ratio': 1.50, 'amp': 0.38, 'decay': 2.8},
        {'ratio': 2.00, 'amp': 0.25, 'decay': 2.0},
        {'ratio': 2.76, 'amp': 0.12, 'decay': 1.4},
        {'ratio': 4.07, 'amp': 0.06, 'decay': 0.8},
    ]
    for p in partials:
        f = pitch * p['ratio']
        decay = p['decay']
        w = p['amp']
        bell_sig += w * np.exp(-t_b / decay) * np.sin(2 * np.pi * f * t_b)
        
    trans_len = int(0.012 * sample_rate)
    trans = np.random.normal(0, 1, trans_len) * np.linspace(1, 0, trans_len)
    bell_sig[:trans_len] += trans * 0.20
    bell_sig *= amp
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:] = bell_sig * 0.92
    right[s_idx:] = bell_sig * 1.08
    return left, right

def generate_meditative_tanpura(duration=5.5, sample_rate=SR, volume=0.45):
    """Sacred Tanpura Drone tuned to 136.10 Hz (C# / Cosmic OM)"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    left = np.zeros(N)
    right = np.zeros(N)
    strings = [
        (102.08, -0.30, 0.25),
        (136.10, -0.08, 0.35),
        (136.25,  0.12, 0.32),
        (68.05,   0.00, 0.20)
    ]
    for f0, pan, pr in strings:
        str_sig = np.zeros(N)
        for k in range(1, 14):
            harmonic_amp = (1.0 / (k ** 1.3)) * (1.0 + 0.25 * np.sin(2 * np.pi * pr * t + k * 0.5))
            str_sig += harmonic_amp * np.sin(2 * np.pi * f0 * k * t)
        angle = (pan + 1.0) * (np.pi / 4.0)
        left += str_sig * np.cos(angle) * volume
        right += str_sig * np.sin(angle) * volume
        
    b, a = sig.butter(2, [110 / (sample_rate/2), 950 / (sample_rate/2)], btype='band')
    return sig.lfilter(b, a, left), sig.lfilter(b, a, right)

def generate_sacred_om_voice(duration=5.5, sample_rate=SR, start_time=1.0):
    """Mellow, acoustic sacred OM (ఓం) vocal drone"""
    N = int(duration * sample_rate)
    t = np.linspace(0, duration, N, endpoint=False)
    s_idx = int(start_time * sample_rate)
    M = N - s_idx
    if M <= 0: return np.zeros(N), np.zeros(N)
    
    t_v = t[s_idx:] - start_time
    v_len = int(min(3.8, duration - start_time) * sample_rate)
    f0 = 136.10
    vibrato = 1.0 + 0.008 * np.sin(2 * np.pi * 4.0 * t_v[:v_len])
    phase = np.cumsum(f0 * vibrato) / sample_rate * 2 * np.pi
    
    vocal = (
        1.00 * np.sin(phase) +
        0.55 * np.sin(2 * phase + 0.1) +
        0.30 * np.sin(3 * phase + 0.3) +
        0.15 * np.sin(4 * phase + 0.6) +
        0.08 * np.sin(5 * phase + 0.9)
    )
    vocal += 0.35 * np.sin(0.5 * phase)
    
    env = np.zeros(v_len)
    att = int(1.0 * sample_rate)
    hold = int(1.8 * sample_rate)
    rel = v_len - att - hold
    env[:att] = np.linspace(0, 1, att) ** 2.0
    env[att:att+hold] = 1.0
    env[att+hold:] = np.linspace(1, 0, rel) ** 1.8
    
    b_voc, a_voc = sig.butter(2, 550 / (sample_rate/2), btype='low')
    vocal_sig = sig.lfilter(b_voc, a_voc, vocal * env) * 0.70
    
    left = np.zeros(N)
    right = np.zeros(N)
    left[s_idx:s_idx + v_len] = vocal_sig * 0.95
    right[s_idx:s_idx + v_len] = vocal_sig * 1.05
    return left, right

def build_screen1_opening():
    """1. saarthi-opening-ident.wav (5.5s First-Principle Tirumala Temple Soundscape)"""
    dur = 5.5
    N = int(dur * SR)
    
    sh_l, sh_r = generate_sacred_shankha(dur, start_time=0.1)
    b1_l, b1_r = generate_sanctum_bell(dur, strike_time=0.5, pitch=216.0, amp=0.90)
    b2_l, b2_r = generate_sanctum_bell(dur, strike_time=1.9, pitch=272.2, amp=0.65)
    tan_l, tan_r = generate_meditative_tanpura(dur, volume=0.42)
    om_l, om_r = generate_sacred_om_voice(dur, start_time=1.0)
    
    mix_l = sh_l * 0.75 + b1_l * 0.85 + b2_l * 0.65 + tan_l * 0.55 + om_l * 0.85
    mix_r = sh_r * 0.75 + b1_r * 0.85 + b2_r * 0.65 + tan_r * 0.55 + om_r * 0.85
    
    ir_l, ir_r = make_sanctum_reverb(duration=3.2, decay_rate=1.4, wet_mix=0.45)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    fade_len = int(0.8 * SR)
    fade = np.linspace(1, 0, fade_len) ** 1.6
    final_l[-fade_len:] *= fade
    final_r[-fade_len:] *= fade
    
    peak = max(np.max(np.abs(final_l)), np.max(np.abs(final_r)), 1e-6)
    final_l = (final_l / peak) * 0.88
    final_r = (final_r / peak) * 0.88
    final_l = np.tanh(1.15 * final_l) / 1.15
    final_r = np.tanh(1.15 * final_r) / 1.15
    
    out = os.path.join("public", "audio", "saarthi-opening-ident.wav")
    save_wav_stereo(out, final_l, final_r)

def build_screen1_ambient_loop():
    """2. saarthi-courtyard-ambient.wav (22.0s seamless loop)"""
    dur = 22.0
    N = int(dur * SR)
    
    t_l, t_r = generate_tanpura_bed(dur, volume=0.40)
    
    # Slow, spacious meditative Veena phrases (Temple courtyard at 4 AM)
    v_total_l = np.zeros(N)
    v_total_r = np.zeros(N)
    
    notes = [
        (1.5, 261.63, 0.7),   # Sa
        (4.2, 327.03, 0.6),   # Ga
        (7.0, 392.00, 0.75),  # Pa
        (13.5, 392.00, 0.65), # Pa
        (16.2, 490.55, 0.6),  # Ni
        (18.8, 523.25, 0.8),  # High Sa'
    ]
    for st, p, a in notes:
        vl, vr = generate_veena_note(dur, start_time=st, pitch=p, amp_scale=a, decay_scale=1.5)
        v_total_l += vl
        v_total_r += vr
        
    # Faint breath-like 'Hari...' vocal at second 10.5
    voc_l, voc_r = generate_vocal_formant(dur, start_time=10.5, word="hari", amp=0.28)
    
    mix_l = t_l * 0.6 + v_total_l * 0.8 + voc_l
    mix_r = t_r * 0.6 + v_total_r * 0.8 + voc_r
    
    ir_l, ir_r = make_sanctum_reverb(duration=2.2, decay_rate=2.0, wet_mix=0.32)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    # Smooth crossfade boundary (0.5s) for seamless looping
    xfade = int(0.5 * SR)
    final_l[:xfade] = final_l[:xfade] * np.linspace(0, 1, xfade) + final_l[N-xfade:] * np.linspace(1, 0, xfade)
    final_r[:xfade] = final_r[:xfade] * np.linspace(0, 1, xfade) + final_r[N-xfade:] * np.linspace(1, 0, xfade)
    
    out = os.path.join("public", "audio", "saarthi-courtyard-ambient.wav")
    save_wav_stereo(out, final_l, final_r)

# =============================================================================
# 📿 SCREEN 2: JAPA MALA ASSETS
# =============================================================================

def build_japa_ambient_loop():
    """3. japa-ambient-loop.wav (20.0s seamless meditative loop)"""
    dur = 20.0
    N = int(dur * SR)
    
    t_l, t_r = generate_tanpura_bed(dur, volume=0.48)
    
    # Minimal repetitive meditative Veena + soft flute motif
    v_l = np.zeros(N)
    v_r = np.zeros(N)
    for st, p in [(1.0, 261.63), (6.0, 392.00), (11.0, 327.03), (16.0, 261.63)]:
        vl, vr = generate_veena_note(dur, start_time=st, pitch=p, amp_scale=0.55, decay_scale=1.6)
        v_l += vl
        v_r += vr
        
    mix_l = t_l * 0.65 + v_l * 0.70
    mix_r = t_r * 0.65 + v_r * 0.70
    
    ir_l, ir_r = make_sanctum_reverb(duration=2.0, decay_rate=2.2, wet_mix=0.30)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    xfade = int(0.5 * SR)
    final_l[:xfade] = final_l[:xfade] * np.linspace(0, 1, xfade) + final_l[N-xfade:] * np.linspace(1, 0, xfade)
    final_r[:xfade] = final_r[:xfade] * np.linspace(0, 1, xfade) + final_r[N-xfade:] * np.linspace(1, 0, xfade)
    
    out = os.path.join("public", "audio", "japa-ambient-loop.wav")
    save_wav_stereo(out, final_l, final_r)

def build_bead_complete():
    """4. bead-complete.wav (0.75s)"""
    dur = 0.75
    N = int(dur * SR)
    # Tactile prayer bead click + resonant Veena Sa (261.63 Hz)
    vl, vr = generate_veena_note(dur, start_time=0.01, pitch=261.63, amp_scale=1.0, decay_scale=0.8)
    
    # Wooden bead tactile click (0-4ms)
    t_len = int(0.005 * SR)
    click = np.random.normal(0, 1, t_len) * np.linspace(1, 0, t_len) * 0.4
    vl[:t_len] += click
    vr[:t_len] += click
    
    ir_l, ir_r = make_sanctum_reverb(duration=0.6, decay_rate=4.0, wet_mix=0.25)
    final_l, final_r = apply_reverb(vl, vr, ir_l, ir_r)
    
    out = os.path.join("public", "audio", "bead-complete.wav")
    save_wav_stereo(out, final_l, final_r)

def build_reflection_end():
    """5. reflection-end.wav (1.20s): Harmonic resolution cue"""
    dur = 1.20
    N = int(dur * SR)
    # Gentle harmonic resolution: G4 -> C5
    v1_l, v1_r = generate_veena_note(dur, start_time=0.01, pitch=392.00, amp_scale=0.75, decay_scale=1.0)
    v2_l, v2_r = generate_veena_note(dur, start_time=0.18, pitch=523.25, amp_scale=0.90, decay_scale=1.2)
    
    mix_l = v1_l + v2_l
    mix_r = v1_r + v2_r
    
    ir_l, ir_r = make_sanctum_reverb(duration=0.8, decay_rate=3.0, wet_mix=0.30)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    out = os.path.join("public", "audio", "reflection-end.wav")
    save_wav_stereo(out, final_l, final_r)

def build_milestone_quarter():
    """6. milestone-quarter.wav (2.20s): Ethereal 'Govinda' resonance for 27, 54, 81"""
    dur = 2.20
    N = int(dur * SR)
    # Faint distant 'Govinda' vocal + shimmering Veena fifth
    voc_l, voc_r = generate_vocal_formant(dur, start_time=0.05, word="govinda", amp=0.45)
    v_l, v_r = generate_veena_note(dur, start_time=0.15, pitch=392.00, amp_scale=0.80, decay_scale=1.8)
    
    mix_l = voc_l + v_l
    mix_r = voc_r + v_r
    
    ir_l, ir_r = make_sanctum_reverb(duration=1.8, decay_rate=2.2, wet_mix=0.35)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    out = os.path.join("public", "audio", "milestone-quarter.wav")
    save_wav_stereo(out, final_l, final_r)

def build_japa_complete_108():
    """7. japa-complete-108.wav (4.80s): Grand Shankha + Veena finale"""
    dur = 4.80
    N = int(dur * SR)
    
    # Grand Shankha (triumphant close call)
    sh_l, sh_r = generate_shankha(dur, start_time=0.05, is_distant=False)
    # Resonant Veena C chord (C3 + G3 + C4 + G4 + C5)
    v_chord_l = np.zeros(N)
    v_chord_r = np.zeros(N)
    for p in [130.81, 196.00, 261.63, 392.00, 523.25]:
        vl, vr = generate_veena_note(dur, start_time=0.45, pitch=p, amp_scale=0.7, decay_scale=2.4)
        v_chord_l += vl
        v_chord_r += vr
        
    mix_l = sh_l * 0.75 + v_chord_l * 0.90
    mix_r = sh_r * 0.75 + v_chord_r * 0.90
    
    ir_l, ir_r = make_sanctum_reverb(duration=2.5, decay_rate=1.8, wet_mix=0.42)
    final_l, final_r = apply_reverb(mix_l, mix_r, ir_l, ir_r)
    
    out = os.path.join("public", "audio", "japa-complete-108.wav")
    save_wav_stereo(out, final_l, final_r)

if __name__ == "__main__":
    print("[Saarthi Sound] Generating Dual-Screen Spiritual Soundscape Suite...")
    print("--- Screen 1: Saarthi Guide (The Threshold) ---")
    build_screen1_opening()
    build_screen1_ambient_loop()
    print("--- Screen 2: Japa Mala (The Sanctum) ---")
    build_japa_ambient_loop()
    build_bead_complete()
    build_reflection_end()
    build_milestone_quarter()
    build_japa_complete_108()
    print("[Saarthi Sound] All 7 sacred soundscape assets generated successfully!")
