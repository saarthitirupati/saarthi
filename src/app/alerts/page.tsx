'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';

export default function AlertsPage() {
  const router = useRouter();
  const { status, loading } = useRealtimeStatus();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F5', paddingBottom: 40, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <ChevronLeft size={28} color="#1F2937" />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1F2937' }}>Temple Alerts</h1>
      </div>

      <div style={{ padding: '0 24px', marginTop: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6B7280' }}>Checking for alerts...</div>
        ) : status?.notice ? (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#991B1B', margin: '0 0 8px 0' }}>Important Notice</h2>
              <p style={{ fontSize: 15, color: '#B91C1C', lineHeight: 1.6, margin: 0 }}>
                {status.notice}
              </p>
            </div>
            <div style={{ fontSize: 12, color: '#EF4444', fontWeight: 500, marginTop: 8 }}>
              Last updated: {new Date(status.lastUpdated).toLocaleString()}
            </div>
          </div>
        ) : (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldAlert size={28} color="#16A34A" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#166534', margin: '0 0 8px 0' }}>No Active Alerts</h2>
              <p style={{ fontSize: 15, color: '#15803D', lineHeight: 1.6, margin: 0 }}>
                Conditions are normal at Tirumala. There are no travel restrictions or severe weather warnings at this time.
              </p>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: 40, marginBottom: 16, fontSize: 16, fontWeight: 600, color: '#4B5563' }}>Standard Guidelines</h3>
        <ul style={{ background: 'white', padding: '20px 20px 20px 40px', borderRadius: 16, margin: 0, color: '#4B5563', lineHeight: 1.6, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <li style={{ marginBottom: 12 }}>Traditional dress code is mandatory for Darshan.</li>
          <li style={{ marginBottom: 12 }}>Electronic gadgets including mobile phones are strictly prohibited inside the temple.</li>
          <li>Plastic items are banned in Tirumala.</li>
        </ul>
      </div>
    </div>
  );
}
