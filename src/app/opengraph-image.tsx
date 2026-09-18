import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Saarthi - Tirupati & Tirumala Pilgrim Guide | Live Darshan & Offline Maps';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: 'linear-gradient(145deg, #1C0F0A 0%, #451A03 35%, #78350F 75%, #92400E 100%)',
          color: '#FAF8F5',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle decorative concentric border */}
        <div
          style={{
            position: 'absolute',
            inset: '20px',
            border: '2px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '24px',
            pointerEvents: 'none',
          }}
        />

        {/* Top Bar: Brand Pill & Domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(254, 243, 199, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              padding: '8px 20px',
              borderRadius: '999px',
            }}
          >
            {/* Sacred Flame SVG Mark */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#F59E0B" />
            </svg>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#FDE68A',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              SAARTHI • సారథి
            </span>
          </div>

          <div
            style={{
              fontSize: '18px',
              color: '#FCD34D',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            saarthiguide.in
          </div>
        </div>

        {/* Center Content: Main Headline & Tagline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 1,
            marginTop: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              lineHeight: 1.12,
              fontWeight: 900,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 18px rgba(0, 0, 0, 0.5)',
            }}
          >
            Tirupati & Tirumala Pilgrim Guide
          </h1>
          <p
            style={{
              fontSize: '24px',
              lineHeight: 1.4,
              color: '#FEF3C7',
              margin: 0,
              maxWidth: '960px',
              opacity: 0.92,
            }}
          >
            Live TTD Darshan wait times, free SSD token counter statuses, 74+ offline precinct maps, and Ghat Road rules.
          </p>
        </div>

        {/* Bottom Feature Badges */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            zIndex: 1,
          }}
        >
          {[
            'Live Queue Wait Times',
            'Free SSD Token Status',
            '74+ Offline Precinct Maps',
            '28-Min Ghat Road Speed Rules',
            'Sthala Puranas & Stories',
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(253, 230, 138, 0.28)',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFBEB',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
