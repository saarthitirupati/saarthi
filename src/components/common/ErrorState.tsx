import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#DC2626', textAlign: 'center' }}>
      <AlertTriangle size={32} style={{ marginBottom: '12px', color: '#EF4444' }} />
      <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px 0' }}>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
