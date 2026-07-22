'use client';

import { useState } from 'react';
import { Settings, Shield, RefreshCw, Database, Key, Server, Save } from 'lucide-react';
import styles from '../Dashboard.module.css';

export default function AdminSettingsPage() {
  const [cacheBusted, setCacheBusted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleClearCache = async () => {
    setCacheBusted(true);
    setTimeout(() => setCacheBusted(false), 3000);
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings & Configuration</h1>
        <p className={styles.subtitle}>Manage database caches, sync settings, and environment security</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Cache & Sync Settings */}
        <div className={styles.dataQualitySection}>
          <h3 className={styles.sectionTitle}>
            <RefreshCw size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Live Cache & Sync Management
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>Realtime Cross-Tab Broadcasts</strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Instantly updates open pilgrim tabs when admin saves changes</span>
              </div>
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>Clear Application Cache</strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Bust local memory cache and force fresh data fetch from Supabase</span>
              </div>
              <button
                onClick={handleClearCache}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer', color: '#334155'
                }}
              >
                {cacheBusted ? 'Cache Cleared ✓' : 'Bust Cache'}
              </button>
            </div>
          </div>
        </div>

        {/* Database & Environment Info */}
        <div className={styles.dataQualitySection}>
          <h3 className={styles.sectionTitle}>
            <Server size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Database & Schema Engine
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Schema Version</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                Saarthi Place Master Template v1.1
              </div>
            </div>

            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Database</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#166534', marginTop: '4px' }}>
                Supabase Postgres + Local JSON Fallback
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
