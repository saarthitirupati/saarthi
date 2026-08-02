import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid #E2E8F0', borderTopColor: '#0F5132', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
