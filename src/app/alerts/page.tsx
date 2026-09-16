'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Bell,
  BellRing,
  BellOff,
  Check,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useRealtimeAlerts, LiveAlert } from '@/lib/useRealtimeAlerts';
import {
  getNotificationPermission,
  subscribeToPushNotifications,
  sendTestNotification,
  isNativeAndroidApp,
  PushPermissionState
} from '@/lib/pushClient';

export default function AlertsPage() {
  const router = useRouter();
  const { status, loading: statusLoading } = useRealtimeStatus();
  const { alerts, loading: alertsLoading } = useRealtimeAlerts();

  const [permission, setPermission] = useState<PushPermissionState>('default');
  const [isNative, setIsNative] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsNative(isNativeAndroidApp());
      setPermission(getNotificationPermission());
    }
  }, []);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    const res = await subscribeToPushNotifications();
    setIsSubscribing(false);
    setPermission(res.permission);
  };

  const handleTestAlert = async () => {
    setTestStatus('sending');
    const success = await sendTestNotification();
    setTestStatus(success ? 'sent' : 'failed');
    setTimeout(() => {
      setTestStatus('idle');
    }, 4000);
  };

  const isLoading = statusLoading && alertsLoading;
  const hasStatusNotice = !!(status?.notice && status.notice.trim().length > 0);
  const activeAlerts = alerts || [];
  const hasAnyAlerts = hasStatusNotice || activeAlerts.length > 0;

  const getCtaHref = (cta?: string) => {
    switch (cta) {
      case 'Open Queue': return '/route';
      case 'Open Essentials': return '/essentials';
      case 'Open Maps': return '/explore';
      case 'Open Parking': return '/route';
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: 40, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <button 
          onClick={() => router.back()} 
          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          aria-label="Go Back"
        >
          <ChevronLeft size={24} color="#0F172A" />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={20} color="#2563EB" /> Temple Alerts & Notifications
        </h1>
      </div>

      <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
        
        {/* 🔔 PUSH NOTIFICATION PREFERENCE & TEST CARD */}
        <div style={{
          background: permission === 'granted'
            ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
            : permission === 'denied'
            ? '#FEF2F2'
            : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          border: `1px solid ${
            permission === 'granted'
              ? '#86EFAC'
              : permission === 'denied'
              ? '#FECACA'
              : '#93C5FD'
          }`,
          borderRadius: 16,
          padding: '16px',
          marginBottom: '18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
        }}>
          {permission === 'granted' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#15803D',
                  background: '#DCFCE7',
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Check size={12} strokeWidth={3} /> {isNative ? 'Android App Push Active' : 'Live Alerts Active'}
                </span>
                <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>
                  {isNative ? 'App Active' : 'Phone Subscribed'}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#14532D', margin: '0 0 4px 0' }}>
                {isNative ? 'Android Lock-Screen Push Active' : 'Srivari Darshan Alerts are Running'}
              </h3>
              <p style={{ fontSize: 13, color: '#166534', lineHeight: 1.45, margin: '0 0 12px 0' }}>
                {isNative
                  ? 'You will receive instant lock-screen alerts for SSD token drops, queue wait times, and Tirumala advisories directly on your phone.'
                  : 'You will receive instant alerts for SSD token quota releases, queue drops, and Tirumala hill advisories.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={handleTestAlert}
                  disabled={testStatus === 'sending'}
                  style={{
                    backgroundColor: '#15803D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 10,
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: testStatus === 'sending' ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 2px 6px rgba(21, 128, 61, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {testStatus === 'sending' ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Sending Test...</span>
                    </>
                  ) : testStatus === 'sent' ? (
                    <>
                      <Check size={14} />
                      <span>Alert Sent! Check Top Bar</span>
                    </>
                  ) : (
                    <>
                      <BellRing size={14} />
                      <span>Send Test Alert</span>
                    </>
                  )}
                </button>

                {testStatus === 'sent' && (
                  <span style={{ fontSize: '11.5px', color: '#15803D', fontWeight: 700 }}>
                    🔔 Notification delivered to your device!
                  </span>
                )}
                {testStatus === 'failed' && (
                  <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600 }}>
                    Could not display notification. Check phone DND/alert permissions.
                  </span>
                )}
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <BellOff size={16} color="#DC2626" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Notifications Blocked
                </span>
              </div>
              <h3 style={{ fontSize: 14.5, fontWeight: 800, color: '#991B1B', margin: '0 0 4px 0' }}>
                Allow Notifications in Browser Settings
              </h3>
              <p style={{ fontSize: 12.5, color: '#7F1D1D', lineHeight: 1.45, margin: '0 0 8px 0' }}>
                Your browser has notifications disabled for Saarthi. To receive SSD token releases and queue drops:
              </p>
              <div style={{ fontSize: '12px', color: '#991B1B', background: '#FEE2E2', padding: '8px 12px', borderRadius: 8, lineHeight: 1.5, fontWeight: 600 }}>
                1. Tap the tune / lock icon next to the URL address.<br />
                2. Switch <strong>Notifications</strong> to <strong>Allow</strong>.<br />
                3. Reload this page.
              </div>
            </div>
          ) : permission === 'unsupported' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Bell size={16} color="#475569" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  In-App Alerts
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.45, margin: 0 }}>
                Web push is not supported in this browser mode. Add Saarthi to your Home Screen (PWA) or open in Chrome to receive lock-screen alerts.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#1D4ED8',
                  background: '#DBEAFE',
                  padding: '3px 8px',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Sparkles size={12} /> Instant Pilgrim Alerts
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1E3A8A', margin: '0 0 4px 0' }}>
                Enable Live Darshan & Token Alerts
              </h3>
              <p style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.45, margin: '0 0 12px 0' }}>
                Never miss an SSD slot opening or sudden queue drop. Saarthi alerts your phone the moment wait times decrease.
              </p>

              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: isSubscribing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)',
                  transition: 'all 0.15s ease'
                }}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enabling Alerts...</span>
                  </>
                ) : (
                  <>
                    <Bell size={16} />
                    <span>Turn On Darshan Alerts</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B', fontWeight: 600, fontSize: '14px' }}>
            Syncing live temple alerts...
          </div>
        ) : hasAnyAlerts ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Live Status Notice Card */}
            {hasStatusNotice && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#DC2626',
                    background: '#FEE2E2',
                    padding: '3px 8px',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                    <AlertTriangle size={12} /> Operational Notice
                  </span>
                  <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: 600 }}>
                    Live Broadcast
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#991B1B', margin: '0 0 4px 0' }}>
                    Important Operational Notice
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#7F1D1D', lineHeight: 1.5, margin: 0 }}>
                    {status.notice}
                  </p>
                </div>

                {status.lastUpdated && (
                  <div style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Clock size={12} /> Updated: {new Date(status.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            )}

            {/* List of Active Database Alerts */}
            {activeAlerts.map((alert: LiveAlert) => {
              const ctaHref = getCtaHref(alert.cta);
              const isCritical = alert.severity === 'Critical' || alert.severity === 'High';

              return (
                <div 
                  key={alert.id} 
                  style={{
                    background: isCritical ? '#FFFBEB' : '#FFFFFF',
                    border: `1px solid ${isCritical ? '#FDE68A' : '#E2E8F0'}`,
                    borderRadius: 16,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: isCritical ? '#B45309' : '#2563EB',
                      background: isCritical ? '#FEF3C7' : '#EFF6FF',
                      padding: '3px 8px',
                      borderRadius: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {alert.severity} • {alert.category}
                    </span>

                    {alert.target_location && (
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={12} /> {alert.target_location}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                      {alert.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5, margin: '0 0 8px 0' }}>
                      {alert.description}
                    </p>
                    {alert.image && (
                      <img 
                        src={alert.image} 
                        alt={alert.title} 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '12px', marginTop: '4px' }}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    )}
                  </div>

                  {ctaHref && (
                    <Link 
                      href={ctaHref}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: '#2563EB',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        marginTop: 4
                      }}
                    >
                      <span>{alert.cta}</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 16,
            padding: '32px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#16A34A" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#166534', margin: '0 0 4px 0' }}>No Active Advisories</h2>
              <p style={{ fontSize: 13.5, color: '#15803D', lineHeight: 1.5, margin: 0 }}>
                Conditions are normal across Tirumala and Tirupati. There are no travel restrictions or emergency advisories at this time.
              </p>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: 28, marginBottom: 12, fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Standard Temple Guidelines</h3>
        <ul style={{ background: '#FFFFFF', padding: '16px 16px 16px 36px', borderRadius: 16, margin: 0, color: '#475569', fontSize: '13px', lineHeight: 1.6, border: '1px solid #E2E8F0' }}>
          <li style={{ marginBottom: 8 }}>Traditional dress code is mandatory for all Darshan queues.</li>
          <li style={{ marginBottom: 8 }}>Electronic gadgets including mobile phones are strictly prohibited inside the main temple premises.</li>
          <li>Single-use plastic items are strictly prohibited across Tirumala hill.</li>
        </ul>
      </div>
    </div>
  );
}
