'use client';

import { useState, useEffect } from 'react';
import { 
  AlertCircle, Plus, Trash2, ShieldCheck, 
  Send, Users, Eye, HelpCircle, X, CheckCircle 
} from 'lucide-react';
import styles from './alerts.module.css';
import { notifyRealtimeUpdate } from '@/lib/useRealtimeStatus';

interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

import { useLiveRefresh } from '@/hooks/useLiveRefresh';

import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Realtime updates
  const { isConnected } = useLiveRefresh('alerts');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<'Emergency' | 'High Priority' | 'Advisory' | 'Information'>('Advisory');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [popupType, setPopupType] = useState<'Banner' | 'Popup' | 'Fullscreen'>('Banner');
  const [cta, setCta] = useState<'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None'>('None');
  const [targetLocation, setTargetLocation] = useState<'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby'>('All Users');
  const [expiryHours, setExpiryHours] = useState<number>(2); // Default 2 hours

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await safeFetchJson<LiveAlert[]>('/api/v1/alerts?all=true&t=' + Date.now());
      if (data && Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching admin alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [isConnected]); // Refetch if connection establishes/drops as a safety measure

  const handleCreateAlert = async (e: React.FormEvent, isDraft = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill out Title and Description.');
      return;
    }

    const now = new Date();
    const expiryTime = new Date(now.getTime() + expiryHours * 60 * 60 * 1000).toISOString();

    const body = {
      title,
      description,
      image: imageUrl.trim(),
      category,
      severity,
      popup_type: popupType,
      cta,
      status: isDraft ? 'Draft' : 'Published',
      target_location: targetLocation,
      start_time: now.toISOString(),
      expiry_time: expiryTime
    };

    try {
      const createdAlert = await safeFetchJson<LiveAlert>('/api/v1/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (createdAlert && createdAlert.id) {
        notifyRealtimeUpdate();
        // Optimistic UI update: add directly to list immediately
        setAlerts(prev => [createdAlert, ...prev.filter(a => a.id !== createdAlert.id)]);
        // Reset form
        setTitle('');
        setDescription('');
        setImageUrl('');
        setCategory('Advisory');
        setSeverity('Medium');
        setPopupType('Banner');
        setCta('None');
        setTargetLocation('All Users');
        setExpiryHours(2);
        setShowCreateForm(false);
      } else {
        alert('Failed to publish alert.');
      }
    } catch (err) {
      console.error('Error publishing alert:', err);
    }
  };

  const handleExpireAlert = async (id: string) => {
    if (!confirm('Are you sure you want to expire this alert immediately?')) return;
    
    // Optimistic UI update
    setAlerts(prev => prev.filter(a => a.id !== id));

    try {
      const res = await safeFetchJson(`/api/v1/alerts/${id}`, { method: 'DELETE' });
      if (res && res.success) {
        notifyRealtimeUpdate();
      } else {
        const fallbackRes = await safeFetchJson(`/api/v1/alerts?id=${id}`, { method: 'DELETE' });
        if (fallbackRes && fallbackRes.success) {
          notifyRealtimeUpdate();
        } else {
          alert('Failed to expire alert.');
          fetchAlerts(); // Revert on failure
        }
      }
    } catch (err) {
      console.error('Error expiring alert:', err);
      fetchAlerts(); // Revert on failure
    }
  };

  // Helper to color tags based on category
  const getCategoryClass = (cat: string) => {
    switch (cat) {
      case 'Emergency': return styles.tagRed;
      case 'High Priority': return styles.tagOrange;
      case 'Advisory': return styles.tagYellow;
      case 'Information': return styles.tagGreen;
      default: return styles.tagYellow;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Live Alerts Module</h1>
          <p className={styles.subtitle}>Admin Controlled Emergency &amp; Important Pilgrim Notifications</p>
        </div>
        <button 
          className={styles.createBtn} 
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? <X size={16} /> : <Plus size={16} />}
          {showCreateForm ? 'Close Form' : 'Create Alert'}
        </button>
      </header>

      <div className={styles.grid}>
        {/* Left Column: Form or Active Alerts List */}
        <div>
          {showCreateForm ? (
            <div className={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#1E293B' }}>
                Create New Live Alert
              </h2>
              
              <form onSubmit={(e) => handleCreateAlert(e, false)}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Title</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="e.g. Heavy Rain in Tirumala" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Description</label>
                  <textarea 
                    className={styles.textarea} 
                    placeholder="e.g. Heavy rainfall reported around Papavinasam. Carry umbrellas and avoid hill walking routes." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Alert Image (Optional Cloudinary / Photo Link)</label>
                  <input 
                    type="url" 
                    className={styles.input} 
                    placeholder="e.g. https://res.cloudinary.com/kniegqlj/image/upload/..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  {imageUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={imageUrl} 
                        alt="Alert Preview" 
                        style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 700 }}>✓ Image attached</span>
                      <button 
                        type="button" 
                        onClick={() => setImageUrl('')} 
                        style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '11.5px', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Alert Category</label>
                    <select 
                      className={styles.select} 
                      value={category} 
                      onChange={(e: any) => setCategory(e.target.value)}
                    >
                      <option value="Emergency">🔴 Emergency</option>
                      <option value="High Priority">🟠 High Priority</option>
                      <option value="Advisory">🟡 Advisory</option>
                      <option value="Information">🟢 Information</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Popup Style</label>
                    <select 
                      className={styles.select} 
                      value={popupType} 
                      onChange={(e: any) => setPopupType(e.target.value)}
                    >
                      <option value="Banner">Top Banner (Normal)</option>
                      <option value="Popup">Centered Popup (High Priority)</option>
                      <option value="Fullscreen">Fullscreen Overlay (Emergency)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Alert Severity</label>
                    <div className={styles.sliderContainer}>
                      <input 
                        type="range" 
                        min="0" 
                        max="3" 
                        step="1"
                        className={styles.slider} 
                        value={
                          severity === 'Low' ? 0 : 
                          severity === 'Medium' ? 1 : 
                          severity === 'High' ? 2 : 3
                        }
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setSeverity(
                            val === 0 ? 'Low' : 
                            val === 1 ? 'Medium' : 
                            val === 2 ? 'High' : 'Critical'
                          );
                        }}
                      />
                      <div className={styles.sliderLabels}>
                        <span style={{ color: severity === 'Low' ? '#E9801D' : '#64748B' }}>Low</span>
                        <span style={{ color: severity === 'Medium' ? '#E9801D' : '#64748B' }}>Medium</span>
                        <span style={{ color: severity === 'High' ? '#E9801D' : '#64748B' }}>High</span>
                        <span style={{ color: severity === 'Critical' ? '#E9801D' : '#64748B' }}>Critical</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>CTA Target</label>
                    <select 
                      className={styles.select} 
                      value={cta} 
                      onChange={(e: any) => setCta(e.target.value)}
                    >
                      <option value="None">None</option>
                      <option value="Open Queue">Open Queue Status</option>
                      <option value="Open Essentials">Open Pilgrim Essentials</option>
                      <option value="Open Maps">Open Map Navigation</option>
                      <option value="Open Parking">Open Parking Info</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Target Location (Audience)</label>
                  <select 
                    className={styles.select} 
                    value={targetLocation} 
                    onChange={(e: any) => setTargetLocation(e.target.value)}
                  >
                    <option value="All Users">All Connected Pilgrims</option>
                    <option value="Tirumala">Only Users in Tirumala</option>
                    <option value="Tirupati">Only Users in Tirupati</option>
                    <option value="Alipiri">Only Users at Alipiri Footpath</option>
                    <option value="Nearby">Within 5 km radius</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Expiry Timer</label>
                  <div className={styles.expiryGroup}>
                    {[
                      { hours: 0.5, label: '30 Mins' },
                      { hours: 1, label: '1 Hour' },
                      { hours: 2, label: '2 Hours' },
                      { hours: 8, label: '8 Hours' },
                      { hours: 24, label: 'Today' }
                    ].map((exp) => (
                      <div 
                        key={exp.hours} 
                        className={`${styles.expiryBadge} ${expiryHours === exp.hours ? styles.expiryBadgeActive : ''}`}
                        onClick={() => setExpiryHours(exp.hours)}
                      >
                        {exp.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => handleCreateAlert(null as any, true)}
                  >
                    Save Draft
                  </button>
                  <button 
                    type="submit" 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Publish Alert
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={styles.card}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#1E293B' }}>
                Active &amp; Live Alerts
              </h2>

              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading alerts...</div>
              ) : alerts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                  No active live alerts currently running.
                </div>
              ) : (
                <div className={styles.alertList}>
                  {alerts.map((alert) => (
                    <div key={alert.id} className={styles.alertItem} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {alert.image && (
                        <img 
                          src={alert.image} 
                          alt={alert.title} 
                          style={{ width: '64px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #CBD5E1', flexShrink: 0, marginTop: '2px' }} 
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      )}
                      <div className={styles.alertInfo} style={{ flex: 1 }}>
                        <div className={styles.alertHeader}>
                          <span className={`${styles.tag} ${getCategoryClass(alert.category)}`}>
                            {alert.category}
                          </span>
                          <span className={styles.statusBadge}>
                            {alert.severity}
                          </span>
                          <h3 className={styles.alertTitleText}>{alert.title}</h3>
                        </div>
                        <p className={styles.alertDescText}>{alert.description}</p>
                        
                        <div className={styles.alertMetaRow}>
                          <span>📍 Location: {alert.target_location}</span>
                          <span>⏳ Expires: {new Date(alert.expiry_time).toLocaleTimeString()}</span>
                          <span>Style: {alert.popup_type}</span>
                        </div>
                      </div>
                      <button 
                        className={styles.expireBtn}
                        onClick={() => handleExpireAlert(alert.id)}
                      >
                        Expire
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Mockup Preview */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div className={styles.card} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 16px 0', color: '#1E293B' }}>
              Client Live Preview
            </h2>
            
            {/* iPhone Mockup Frame */}
            <div style={{ 
              width: '280px', 
              height: '500px', 
              background: '#FFF8EB', 
              border: '8px solid #1E293B', 
              borderRadius: '30px', 
              margin: '0 auto', 
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
              {/* iPhone Status Bar */}
              <div style={{ height: '24px', background: '#0F172A', display: 'flex', justifyContent: 'space-between', padding: '0 16px', alignItems: 'center', color: '#fff', fontSize: '10px' }}>
                <span>9:41</span>
                <span>📶 🔋</span>
              </div>

              {/* Mockup Home Header */}
              <div style={{ padding: '12px 16px 4px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>Namaste, Raghav 🙏</span>
                <span style={{ fontSize: '12px' }}>⚙️</span>
              </div>

              {/* Dynamic Preview Elements based on form values */}
              {title && description ? (
                <div style={{ padding: '8px 12px' }}>
                  {popupType === 'Banner' && (
                    <div style={{
                      background: category === 'Emergency' ? '#FEE2E2' : category === 'High Priority' ? '#FFEDD5' : category === 'Advisory' ? '#FEF9C3' : '#D1FAE5',
                      border: category === 'Emergency' ? '1.5px solid #DC2626' : category === 'High Priority' ? '#EA580C' : category === 'Advisory' ? '#F59E0B' : '#10B981',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      marginBottom: '10px',
                      textAlign: 'left',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px' }}>
                          {category === 'Emergency' ? '🔴' : category === 'High Priority' ? '🟠' : category === 'Advisory' ? '🟡' : '🟢'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>
                          {category} Alert
                        </span>
                      </div>
                      <h4 style={{ fontSize: '12px', fontWeight: 800, margin: '0 0 2px 0', color: '#0F172A' }}>{title}</h4>
                      <p style={{ fontSize: '10px', color: '#475569', margin: '0 0 6px 0', lineHeight: 1.3 }}>{description}</p>
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Alert preview" 
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                        />
                      )}
                      {cta !== 'None' && (
                        <button style={{ background: '#0F172A', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '9px', fontWeight: 700 }}>
                          {cta}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Next Best Action Placeholder */}
                  <div style={{ background: '#052e16', borderRadius: '12px', padding: '10px', color: '#fff', fontSize: '10px', textAlign: 'left', opacity: popupType === 'Fullscreen' ? 0.15 : 0.8 }}>
                    <strong>NEXT ACTION</strong>
                    <p style={{ margin: '2px 0 0 0' }}>Queue is 2 hours. Proceed now.</p>
                  </div>

                  {/* Centered Popup Style Preview */}
                  {popupType === 'Popup' && (
                    <div style={{
                      position: 'absolute',
                      top: '100px',
                      left: '16px',
                      right: '16px',
                      background: '#FFFFFF',
                      border: '2px solid #F59E0B',
                      borderRadius: '16px',
                      padding: '16px',
                      zIndex: 100,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <span>🟠</span>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                          Live Advisory Alert
                        </span>
                      </div>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>{title}</h4>
                      <p style={{ fontSize: '10.5px', color: '#4B5563', margin: '0 0 8px 0', lineHeight: 1.4 }}>{description}</p>
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Alert preview" 
                          style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} 
                        />
                      )}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {cta !== 'None' && (
                          <button style={{ flex: 1, background: '#E9801D', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 700 }}>
                            {cta}
                          </button>
                        )}
                        <button style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px', fontSize: '10px', fontWeight: 700 }}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Fullscreen Overlay Style Preview */}
                  {popupType === 'Fullscreen' && (
                    <div style={{
                      position: 'absolute',
                      inset: '24px 0 0 0',
                      background: '#0F172A',
                      zIndex: 200,
                      color: '#FFFFFF',
                      padding: '24px 16px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '10px', fontSize: '20px' }}>
                        🚨
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#EF4444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        CRITICAL EMERGENCY ALERT
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>{title}</h3>
                      <p style={{ fontSize: '11px', color: '#94A3B8', margin: '0 0 12px 0', lineHeight: 1.4 }}>{description}</p>
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Alert preview" 
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }} 
                        />
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        {cta !== 'None' && (
                          <button style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 800 }}>
                            {cta}
                          </button>
                        )}
                        <button style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px', fontSize: '11px', fontWeight: 700 }}>
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80%', color: '#94A3B8', padding: '20px' }}>
                  <AlertCircle size={32} style={{ marginBottom: '12px', color: '#CBD5E1' }} />
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Fill out the form on the left to see a live mockup preview.</span>
                </div>
              )}

              {/* iPhone Home Indicator */}
              <div style={{ position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '3px', backgroundColor: '#000', borderRadius: '2px' }} />
            </div>

            <div className={styles.previewBox}>
              <div className={styles.previewTitle}>Distribution Parameters</div>
              <p style={{ fontSize: '11px', margin: 0, color: '#475569', lineHeight: 1.4 }}>
                • <strong>Audience:</strong> {targetLocation}
                <br />
                • <strong>Interval:</strong> Published now, expires in {expiryHours} hours.
                <br />
                • <strong>Priority:</strong> severity level {severity}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
