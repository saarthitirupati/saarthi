'use client';

import { useState, useEffect } from 'react';
import { Ticket, Clock, CheckCircle2, PauseCircle, XCircle, Save, RefreshCw, AlertCircle } from 'lucide-react';
import styles from '../Dashboard.module.css';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';
import { safeFetchJson } from '@/lib/safeFetch';

interface SsdSlot {
  slotTime: string;
  status: 'available' | 'filling' | 'closed';
  tokensLeft?: string;
}

export default function AdminSsdTokensPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [ssdTokenStatus, setSsdTokenStatus] = useState<'issuing' | 'paused' | 'closed-for-day'>('issuing');
  const [ssdNextTokenTime, setSsdNextTokenTime] = useState<string>('2:00 PM');
  const [ssdNotice, setSsdNotice] = useState<string>('');
  const [ssdTimingsGuide, setSsdTimingsGuide] = useState<string>('Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM. Batches are allocated hourly for that day\'s Darshan. Counters close as soon as the daily quota runs out (~15,000 - 20,000 tokens).');
  const [ssdSlots, setSsdSlots] = useState<SsdSlot[]>([
    { slotTime: '5:00 AM - 7:00 AM', status: 'closed', tokensLeft: 'Full' },
    { slotTime: '7:00 AM - 9:00 AM', status: 'closed', tokensLeft: 'Full' },
    { slotTime: '9:00 AM - 11:00 AM', status: 'filling', tokensLeft: '~200 remaining' },
    { slotTime: '11:00 AM - 1:00 PM', status: 'available', tokensLeft: 'Available' },
    { slotTime: '2:00 PM - 4:00 PM', status: 'available', tokensLeft: 'Available' },
    { slotTime: '4:00 PM - 6:00 PM', status: 'available', tokensLeft: 'Available' },
  ]);

  const fetchSsdData = async () => {
    try {
      setLoading(true);
      const data = await safeFetchJson<any>('/api/admin/ssd-tokens');
      if (data) {
        if (data.ssdTokenStatus) setSsdTokenStatus(data.ssdTokenStatus);
        if (data.ssdNextTokenTime) setSsdNextTokenTime(data.ssdNextTokenTime);
        if (data.ssdNotice !== undefined) setSsdNotice(data.ssdNotice);
        if (data.ssdTimingsGuide !== undefined) setSsdTimingsGuide(data.ssdTimingsGuide);
        if (Array.isArray(data.ssdTokenSlots)) setSsdSlots(data.ssdTokenSlots);
      }
    } catch (e) {
      console.error('Failed to load SSD data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSsdData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/ssd-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ssdTokenStatus,
          ssdNextTokenTime,
          ssdNotice,
          ssdTimingsGuide,
          ssdTokenSlots: ssdSlots
        })
      });

      if (res.ok) {
        setMessage('SSD Token updates published live successfully!');
        notifyRealtimeUpdate();
      } else {
        setMessage('Failed to publish updates. Please try again.');
      }
    } catch (e) {
      setMessage('Error updating SSD status.');
    } finally {
      setSaving(false);
    }
  };

  const handleSlotStatusChange = (index: number, newStatus: 'available' | 'filling' | 'closed') => {
    const updated = [...ssdSlots];
    updated[index].status = newStatus;
    if (newStatus === 'closed') updated[index].tokensLeft = 'Full';
    else if (newStatus === 'available') updated[index].tokensLeft = 'Available';
    else if (newStatus === 'filling') updated[index].tokensLeft = '~200 remaining';
    setSsdSlots(updated);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>SSD Token Management</h1>
          <p className={styles.subtitle}>Manage Slotted Sarva Darshan offline token issuance & slot states</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{
            backgroundColor: '#0E6B72', color: '#FFF', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Save size={16} />
          {saving ? 'Publishing...' : 'Publish Live Updates'}
        </button>
      </div>

      {message && (
        <div style={{
          backgroundColor: message.includes('successfully') ? '#F0FDF4' : '#FEF2F2',
          color: message.includes('successfully') ? '#166534' : '#991B1B',
          border: `1px solid ${message.includes('successfully') ? '#BBF7D0' : '#FECACA'}`,
          borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', fontWeight: 600
        }}>
          {message}
        </div>
      )}

      {/* Main Issuing Status Controls */}
      <div className={styles.dataQualitySection} style={{ marginBottom: '24px' }}>
        <h3 className={styles.sectionTitle}>
          <Ticket size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          Global Issuing Status
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <button 
            onClick={() => setSsdTokenStatus('issuing')}
            style={{
              padding: '16px', borderRadius: '12px', cursor: 'pointer',
              border: `2px solid ${ssdTokenStatus === 'issuing' ? '#16A34A' : '#E2E8F0'}`,
              background: ssdTokenStatus === 'issuing' ? '#F0FDF4' : '#FFFFFF',
              display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: ssdTokenStatus === 'issuing' ? '#166534' : '#64748B'
            }}
          >
            <CheckCircle2 size={20} color="#16A34A" />
            Issuing Now
          </button>

          <button 
            onClick={() => setSsdTokenStatus('paused')}
            style={{
              padding: '16px', borderRadius: '12px', cursor: 'pointer',
              border: `2px solid ${ssdTokenStatus === 'paused' ? '#D97706' : '#E2E8F0'}`,
              background: ssdTokenStatus === 'paused' ? '#FFFBEB' : '#FFFFFF',
              display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: ssdTokenStatus === 'paused' ? '#B45309' : '#64748B'
            }}
          >
            <PauseCircle size={20} color="#D97706" />
            Paused / Wait Queue
          </button>

          <button 
            onClick={() => setSsdTokenStatus('closed-for-day')}
            style={{
              padding: '16px', borderRadius: '12px', cursor: 'pointer',
              border: `2px solid ${ssdTokenStatus === 'closed-for-day' ? '#DC2626' : '#E2E8F0'}`,
              background: ssdTokenStatus === 'closed-for-day' ? '#FEF2F2' : '#FFFFFF',
              display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, color: ssdTokenStatus === 'closed-for-day' ? '#991B1B' : '#64748B'
            }}
          >
            <XCircle size={20} color="#DC2626" />
            Closed for Today
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Next Batch Release Time
            </label>
            <input 
              type="text" 
              value={ssdNextTokenTime}
              onChange={(e) => setSsdNextTokenTime(e.target.value)}
              placeholder="e.g. 2:00 PM or Tomorrow 4 AM"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Live SSD Notice / Alert (Optional)
            </label>
            <input 
              type="text" 
              value={ssdNotice}
              onChange={(e) => setSsdNotice(e.target.value)}
              placeholder="e.g. Counters experiencing high rush at Srinivasam Complex"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* SSD Info Text */}
      <div className={styles.dataQualitySection} style={{ marginBottom: '24px' }}>
        <h3 className={styles.sectionTitle}>
          <AlertCircle size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
          SSD Info Text (shown on Live page)
        </h3>
        <textarea
          value={ssdTimingsGuide}
          onChange={(e) => setSsdTimingsGuide(e.target.value)}
          rows={3}
          placeholder="Describe how SSD tokens work — timing, quota, process..."
          style={{
            width: '100%', padding: '10px', borderRadius: '8px',
            border: '1px solid #CBD5E1', fontSize: '14px', resize: 'vertical',
            fontFamily: 'inherit', lineHeight: '1.5', boxSizing: 'border-box'
          }}
        />
        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
          This text appears as the info block on the Live Status page under SSD Token section.
        </div>
      </div>
      <div className={styles.dataQualitySection}>
        <h3 className={styles.sectionTitle}>Hourly Slot Allotment Status</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ssdSlots.map((slot, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0'
            }}>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{slot.slotTime}</span>
                <span style={{ marginLeft: '12px', fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                  ({slot.tokensLeft || 'N/A'})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleSlotStatusChange(idx, 'available')}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: '1px solid #BBF7D0',
                    background: slot.status === 'available' ? '#16A34A' : '#FFFFFF',
                    color: slot.status === 'available' ? '#FFFFFF' : '#166534'
                  }}
                >
                  Available
                </button>

                <button
                  onClick={() => handleSlotStatusChange(idx, 'filling')}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: '1px solid #FDE68A',
                    background: slot.status === 'filling' ? '#D97706' : '#FFFFFF',
                    color: slot.status === 'filling' ? '#FFFFFF' : '#B45309'
                  }}
                >
                  Filling Fast
                </button>

                <button
                  onClick={() => handleSlotStatusChange(idx, 'closed')}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    border: '1px solid #FECACA',
                    background: slot.status === 'closed' ? '#DC2626' : '#FFFFFF',
                    color: slot.status === 'closed' ? '#FFFFFF' : '#991B1B'
                  }}
                >
                  Full / Closed
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
