import React from 'react';
import { Info } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ title = 'No data found', message = 'There is nothing to display right now.' }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B', textAlign: 'center' }}>
      <Info size={32} style={{ marginBottom: '12px', color: '#94A3B8' }} />
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 4px 0' }}>{title}</h3>
      <p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{message}</p>
    </div>
  );
}
