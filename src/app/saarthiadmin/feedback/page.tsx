'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, RefreshCw, Plus, Trash2, CheckCircle2, Filter, Sparkles, Send } from 'lucide-react';
import styles from '../Dashboard.module.css';
import { safeFetchJson } from '@/lib/safeFetch';
import { PLACES } from '@/data/places';

interface FeedbackItem {
  id: string;
  placeId?: string;
  placeName?: string;
  isPositive: boolean;
  comment?: string;
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'positive' | 'negative'>('all');
  
  // Submit New Feedback Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(PLACES[0]?.id || 'general');
  const [isPositive, setIsPositive] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await safeFetchJson<any>('/api/v1/feedback');
      if (Array.isArray(data)) {
        setFeedbackList(data);
      }
    } catch (e) {
      console.error('Failed to fetch feedback:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this feedback entry?')) return;
    try {
      await fetch(`/api/v1/feedback?id=${id}`, { method: 'DELETE' });
      setFeedbackList(prev => prev.filter(item => item.id !== id));
    } catch (e) {
      alert('Failed to delete feedback');
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const selectedPlace = PLACES.find(p => p.id === selectedPlaceId);
      const payload = {
        placeId: selectedPlaceId,
        placeName: selectedPlace?.name || 'General Feedback',
        isPositive,
        comment: commentText.trim()
      };

      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCommentText('');
        setShowAddModal(false);
        fetchFeedback();
      } else {
        alert('Failed to submit feedback');
      }
    } catch (err: any) {
      alert('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const positiveCount = feedbackList.filter(f => f.isPositive).length;
  const negativeCount = feedbackList.length - positiveCount;
  const satisfactionRate = feedbackList.length > 0 ? Math.round((positiveCount / feedbackList.length) * 100) : 100;

  const filteredList = feedbackList.filter(item => {
    if (filterType === 'positive') return item.isPositive;
    if (filterType === 'negative') return !item.isPositive;
    return true;
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className={styles.title}>Pilgrim Feedback & Quality Signals</h1>
          <p className={styles.subtitle}>Real-time ratings, comments, and place accuracy reports from travelers</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#16A34A', color: '#FFFFFF', border: 'none', borderRadius: '10px',
              padding: '9px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)'
            }}
          >
            <Plus size={16} /> Submit Feedback
          </button>
          <button 
            onClick={fetchFeedback}
            style={{
              backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '10px',
              padding: '9px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? styles.spin : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* STATS SUMMARY ROW */}
      <div className={styles.statsGrid} style={{ marginBottom: '24px' }}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><MessageSquare size={20} color="#2563eb"/></div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{feedbackList.length}</span>
            <span className={styles.statLabel}>Total Reviews Received</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}><ThumbsUp size={20} color="#16a34a"/></div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{satisfactionRate}%</span>
            <span className={styles.statLabel}>Pilgrim Satisfaction Rate</span>
          </div>
          <div className={styles.subStats}>
            <span className={styles.subStatSuccess}>{positiveCount} Helpful 👍</span>
            {negativeCount > 0 && <span className={styles.subStatWarning}>{negativeCount} Corrections 👎</span>}
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setFilterType('all')}
          style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            background: filterType === 'all' ? '#0F172A' : '#F1F5F9',
            color: filterType === 'all' ? '#FFFFFF' : '#475569',
            border: 'none'
          }}
        >
          All Feedback ({feedbackList.length})
        </button>
        <button
          onClick={() => setFilterType('positive')}
          style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            background: filterType === 'positive' ? '#DCFCE7' : '#F1F5F9',
            color: filterType === 'positive' ? '#15803D' : '#475569',
            border: filterType === 'positive' ? '1px solid #86EFAC' : 'none'
          }}
        >
          👍 Helpful ({positiveCount})
        </button>
        <button
          onClick={() => setFilterType('negative')}
          style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            background: filterType === 'negative' ? '#FEE2E2' : '#F1F5F9',
            color: filterType === 'negative' ? '#B91C1C' : '#475569',
            border: filterType === 'negative' ? '1px solid #FCA5A5' : 'none'
          }}
        >
          👎 Corrections ({negativeCount})
        </button>
      </div>

      {/* FEEDBACK LIST */}
      <div className={styles.dataQualitySection}>
        <h3 className={styles.sectionTitle}>Live Comments & Accuracy Reports</h3>
        <div className={styles.warningList}>
          {filteredList.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '14px', padding: '20px 0' }}>No feedback submissions matching filter.</div>
          ) : (
            filteredList.map((item) => (
              <div key={item.id} className={styles.warningItem} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className={styles.warningPlace} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{item.isPositive ? '👍' : '👎'}</span>
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{item.placeName || 'General Feedback'}</strong>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>{item.createdAt}</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '6px 0 0 0', lineHeight: 1.5, background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', borderLeft: item.isPositive ? '3px solid #16A34A' : '3px solid #DC2626' }}>
                  {item.comment || (item.isPositive ? 'Pilgrim marked information as accurate.' : 'Pilgrim flagged information for update.')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: SUBMIT NEW FEEDBACK */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#0F172A' }}>
              Submit Pilgrim Feedback
            </h2>
            <form onSubmit={handleAddFeedback}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Select Destination / Spot</label>
                <select
                  value={selectedPlaceId}
                  onChange={(e) => setSelectedPlaceId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                >
                  <option value="general">General App Feedback</option>
                  {PLACES.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Sentiment / Rating</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsPositive(true)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: isPositive ? '2px solid #16A34A' : '1px solid #CBD5E1',
                      background: isPositive ? '#DCFCE7' : '#F8FAFC', color: isPositive ? '#15803D' : '#64748B', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <ThumbsUp size={16} /> Helpful 👍
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPositive(false)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: !isPositive ? '2px solid #DC2626' : '1px solid #CBD5E1',
                      background: !isPositive ? '#FEE2E2' : '#F8FAFC', color: !isPositive ? '#B91C1C' : '#64748B', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <ThumbsDown size={16} /> Needs Update 👎
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Comment / Correction Note</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter pilgrim feedback or timing accuracy note..."
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#16A34A', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Post Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
