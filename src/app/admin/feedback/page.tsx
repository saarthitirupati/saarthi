'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, RefreshCw, CheckCircle2 } from 'lucide-react';
import styles from '../Dashboard.module.css';

interface FeedbackItem {
  id: string;
  placeId?: string;
  placeName?: string;
  isPositive: boolean;
  comment?: string;
  createdAt: string;
}

import { safeFetchJson } from '@/lib/safeFetch';

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const positiveCount = feedbackList.filter(f => f.isPositive).length;
  const negativeCount = feedbackList.length - positiveCount;
  const satisfactionRate = feedbackList.length > 0 ? Math.round((positiveCount / feedbackList.length) * 100) : 100;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className={styles.title}>Pilgrim Feedback & Quality Signals</h1>
          <p className={styles.subtitle}>Real-time ratings, comments, and place accuracy reports from travelers</p>
        </div>
        <button 
          onClick={fetchFeedback}
          style={{
            backgroundColor: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', borderRadius: '8px',
            padding: '8px 16px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
          }}
        >
          <RefreshCw size={14} className={loading ? styles.spin : ''} />
          {loading ? 'Refreshing...' : 'Refresh Feedback'}
        </button>
      </div>

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
            <span className={styles.subStatSuccess}>{positiveCount} Helpful</span>
            {negativeCount > 0 && <span className={styles.subStatWarning}>{negativeCount} Corrections</span>}
          </div>
        </div>
      </div>

      <div className={styles.dataQualitySection}>
        <h3 className={styles.sectionTitle}>Live Comments & Accuracy Reports</h3>
        <div className={styles.warningList}>
          {feedbackList.length === 0 ? (
            <div style={{ color: '#64748B', fontSize: '14px' }}>No feedback submissions recorded yet.</div>
          ) : (
            feedbackList.map((item) => (
              <div key={item.id} className={styles.warningItem} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span className={styles.warningPlace}>
                    {item.isPositive ? '👍' : '👎'} {item.placeName || 'General Feedback'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{item.createdAt}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  {item.comment || (item.isPositive ? 'Pilgrim marked information as accurate.' : 'Pilgrim flagged information for update.')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
