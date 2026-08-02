import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 96,
          background: 'linear-gradient(135deg, #0E6B72 0%, #073B40 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F59E0B',
          borderRadius: '40px',
          fontWeight: 900,
          border: '6px solid #E9801D',
          boxSizing: 'border-box'
        }}
      >
        🛕
      </div>
    ),
    {
      ...size,
    }
  );
}
