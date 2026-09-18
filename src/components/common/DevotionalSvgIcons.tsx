import React from 'react';

interface IconProps {
  size?: number;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🕉️ Sacred Srivari Thirunamam Vector Artwork
 * White Urdhva Pundra with central glowing Kasturi Tilak
 */
export function SrivariNamamVector({ size = 36, color = '#FDE047', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <linearGradient id="namamWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="tilakRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
        <linearGradient id="goldPadmaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>
        <filter id="namamGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Outer White Namam Wings */}
      <g filter="url(#namamGlow)">
        {/* Left Wing */}
        <path
          d="M 22 15 C 22 45 42 75 50 82 C 43 72 34 45 34 22 C 34 18 28 15 22 15 Z"
          fill="url(#namamWhiteGrad)"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />
        {/* Right Wing */}
        <path
          d="M 78 15 C 78 45 58 75 50 82 C 57 72 66 45 66 22 C 66 18 72 15 78 15 Z"
          fill="url(#namamWhiteGrad)"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />
        {/* Central Red Kasturi Tilak Line */}
        <path
          d="M 50 20 C 47 38 47 62 50 78 C 53 62 53 38 50 20 Z"
          fill="url(#tilakRedGrad)"
          stroke="#991B1B"
          strokeWidth="1"
        />
        {/* Bottom Lotus Base Gem */}
        <path
          d="M 38 80 C 44 86 56 86 62 80 C 56 83 44 83 38 80 Z"
          fill="url(#goldPadmaGrad)"
        />
        {/* Yellow Bindi Dot */}
        <circle cx="50" cy="81" r="3" fill="#FDE047" />
      </g>
    </svg>
  );
}

/**
 * 🐚 Sacred Shankha (Divine Conch) Vector Artwork
 */
export function SacredShankhaVector({ size = 32, color = '#FDE047', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <linearGradient id="shankhaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE047" />
        </linearGradient>
        <filter id="shankhaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#D97706" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#shankhaGlow)">
        {/* Conch Shell Body */}
        <path
          d="M 50 12 C 30 18 18 35 22 58 C 25 72 38 88 52 88 C 64 88 78 76 80 60 C 82 42 72 26 58 16 Z"
          fill="url(#shankhaGrad)"
          stroke="#D97706"
          strokeWidth="2"
        />
        {/* Spiral Ridge Lines */}
        <path
          d="M 46 22 C 34 32 30 50 36 64 C 42 74 54 78 64 72 C 72 66 74 52 68 38 C 62 26 52 20 46 22 Z"
          fill="none"
          stroke="#B45309"
          strokeWidth="1.8"
        />
        <path
          d="M 44 32 C 38 40 38 52 44 60 C 48 66 58 66 62 58 C 66 50 62 38 54 34 Z"
          fill="none"
          stroke="#D97706"
          strokeWidth="1.5"
        />
        {/* Tip Flame Motif */}
        <path
          d="M 50 12 C 54 6 52 2 50 2 C 48 2 46 6 50 12 Z"
          fill="#F59E0B"
        />
      </g>
    </svg>
  );
}

/**
 * ☸️ Sacred Sudarshana Chakra (Divine Disc) Vector Artwork
 */
export function SacredChakraVector({ size = 32, color = '#FDE047', style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <linearGradient id="chakraGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <filter id="chakraGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#F59E0B" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#chakraGlow)">
        {/* Outer Wheel Rim */}
        <circle cx="50" cy="50" r="42" stroke="url(#chakraGold)" strokeWidth="3" fill="none" />
        <circle cx="50" cy="50" r="36" stroke="#D97706" strokeWidth="1.5" fill="none" />

        {/* 8 Outer Radiant Flame Teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <path d="M 50 5 L 53 14 L 47 14 Z" fill="#F59E0B" />
            <line x1="50" y1="14" x2="50" y2="36" stroke="#D97706" strokeWidth="2" />
          </g>
        ))}

        {/* Center Hub */}
        <circle cx="50" cy="50" r="14" fill="url(#chakraGold)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="6" fill="#78350F" />
      </g>
    </svg>
  );
}

/**
 * 🪷 Devotional Sacred Lotus Mandala Vector Background Watermark
 */
export function LotusMandalaVector({ size = 120, opacity = 0.08, style }: { size?: number; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, ...style }}
    >
      <g stroke="#F59E0B" strokeWidth="1.2">
        {/* Center Rings */}
        <circle cx="100" cy="100" r="15" fill="none" />
        <circle cx="100" cy="100" r="30" fill="none" />
        <circle cx="100" cy="100" r="60" fill="none" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="90" fill="none" />

        {/* 12 Outer Lotus Petals */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <g key={i} transform={`rotate(${deg} 100 100)`}>
            <path d="M 100 70 C 90 40 100 15 100 10 C 100 15 110 40 100 70 Z" />
            <path d="M 100 85 C 93 65 100 45 100 40 C 100 45 107 65 100 85 Z" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/**
 * 📿 Authentic 5-Faced Panchamukhi Rudraksha / Sacred Mala Bead Vector
 */
export function RudrakshaBeadVector({
  size = 36,
  isCenter = false,
  isPast = false,
  beadNumber = 1,
  style
}: {
  size?: number;
  isCenter?: boolean;
  isPast?: boolean;
  beadNumber?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <defs>
        <radialGradient id="centerBeadGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <radialGradient id="pastBeadGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#BBF7D0" />
          <stop offset="60%" stopColor="#166534" />
          <stop offset="100%" stopColor="#064E3B" />
        </radialGradient>
        <radialGradient id="normalBeadGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="60%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <filter id="beadGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.75" />
        </filter>
      </defs>

      <g filter={isCenter ? 'url(#beadGlow)' : undefined}>
        {/* Outer Bead Sphere */}
        <circle
          cx="30"
          cy="30"
          r="26"
          fill={isCenter ? 'url(#centerBeadGrad)' : isPast ? 'url(#pastBeadGrad)' : 'url(#normalBeadGrad)'}
          stroke={isCenter ? '#FEF08A' : isPast ? '#86EFAC' : 'rgba(255, 255, 255, 0.25)'}
          strokeWidth={isCenter ? '2.5' : '1.2'}
        />

        {/* 5 Organic Natural Mukhi (Facet Ridge Lines) */}
        <path
          d="M 30 6 C 30 18 30 42 30 54"
          stroke={isCenter ? '#78350F' : 'rgba(255,255,255,0.25)'}
          strokeWidth="1.2"
          strokeDasharray="2 1"
        />
        <path
          d="M 10 20 C 20 25 40 25 50 20"
          stroke={isCenter ? '#78350F' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.2"
        />
        <path
          d="M 10 40 C 20 35 40 35 50 40"
          stroke={isCenter ? '#78350F' : 'rgba(255,255,255,0.2)'}
          strokeWidth="1.2"
        />

        {/* Central Sacred Thread Hole Ring */}
        <circle
          cx="30"
          cy="30"
          r="10"
          fill={isCenter ? '#451A03' : 'rgba(0,0,0,0.4)'}
          stroke={isCenter ? '#FEF08A' : 'rgba(255,255,255,0.3)'}
          strokeWidth="1"
        />

        {/* Bead Number Label */}
        <text
          x="30"
          y="34"
          textAnchor="middle"
          fill={isCenter ? '#FEF08A' : '#FFFFFF'}
          fontSize={isCenter ? '12' : '10'}
          fontWeight="900"
          fontFamily="sans-serif"
        >
          {beadNumber}
        </text>
      </g>
    </svg>
  );
}

/**
 * 🛕 Golden Temple Gopuram Line Art Arch Vector
 */
export function TempleArchVector({ width = '100%', height = 24, style }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M 0 28 L 140 28 C 160 28 175 14 200 4 C 225 14 240 28 260 28 L 400 28"
        stroke="url(#archGoldGrad)"
        strokeWidth="1.5"
      />
      <circle cx="200" cy="4" r="3" fill="#FDE047" />
      <defs>
        <linearGradient id="archGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#D97706" />
          <stop offset="50%" stopColor="#FDE047" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}
