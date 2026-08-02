import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: 'linear-gradient(135deg, #0E6B72 0%, #073B40 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F59E0B',
          borderRadius: '50%',
          fontWeight: 900,
          border: '2px solid #E9801D',
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
