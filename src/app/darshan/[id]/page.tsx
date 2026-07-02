'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { darshanRegistry } from '@/data/darshans';
import styles from './page.module.css';
import { DarshanDetail } from '@/types/darshan';
import { ArrowLeft, CheckCircle2, XCircle, Activity, Info } from 'lucide-react';

export default function DarshanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<DarshanDetail | null>(null);
  const [liveWaitTime, setLiveWaitTime] = useState<string>('');

  useEffect(() => {
    if (id && darshanRegistry[id]) {
      setData(darshanRegistry[id]);
    }
  }, [id]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/admin/status');
        const json = await res.json();
        const darshans = json.darshans || [];
        
        const mapNameToId = (name: string): string => {
          const lower = name.toLowerCase();
          if (lower.includes('sarva')) return 'sarva-darshan';
          if (lower.includes('300') || lower.includes('special')) return 'special-entry';
          if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
          if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
          return 'sarva-darshan';
        };

        const match = darshans.find((d: any) => mapNameToId(d.name) === id);
        if (match) {
          setLiveWaitTime(match.waitTime);
        }
      } catch (err) {
        console.error("Failed to fetch live status", err);
      }
    };

    fetchStatus();
  }, [id]);

  if (!data) return <div className={styles.container}>Loading...</div>;

  const getFacilityEmoji = (type: string) => {
    switch(type) {
      case 'water': return '💧';
      case 'food': return '🍱';
      case 'restroom': return '🚻';
      case 'medical': return '🏥';
      case 'wheelchair': return '♿';
      case 'infant': return '🍼';
      default: return '📍';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h2 className={styles.title}>{data.title}</h2>
      </header>

      {/* Live Tracker Hero */}
      <section className={styles.hero}>
        <div className={`${styles.metricBox} ${styles.metricBoxActive}`}>
          <span className={styles.metricVal}>
            <Activity size={20} className="inline-block mr-2 mb-1" />
            {liveWaitTime || data.waitTime}
          </span>
          <span className={styles.metricLbl}>Live Queue Tracker</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricVal}>{data.cost}</span>
          <span className={styles.metricLbl}>Ticket Cost</span>
        </div>
      </section>

      {/* Description */}
      <section className={styles.section}>
        <h3>What is {data.title}?</h3>
        <p className={styles.description}>{data.description}</p>
      </section>

      {/* Empathy & Accessibility Box */}
      {data.accessibility && data.accessibility.length > 0 && (
        <section className={styles.accessibilityBox}>
          <h3 style={{ color: 'var(--color-indigo-700)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} /> Empathy & Accessibility
          </h3>
          <ul className={styles.list}>
            {data.accessibility.map((acc, idx) => (
              <li key={idx} style={{ color: 'var(--color-indigo-900)' }}>{acc}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Journey Steps */}
      {data.journeySteps && data.journeySteps.length > 0 && (
        <section className={styles.section}>
          <h3>📍 Journey Flow</h3>
          <div className={styles.journeyFlow}>
            {data.journeySteps.map((step, idx) => (
              <div key={idx} className={styles.journeyStep}>
                <div className={styles.stepNumber}>{step.step}</div>
                <div className={styles.stepContent}>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Facilities Grid */}
      {data.facilities && data.facilities.length > 0 && (
        <section className={styles.section}>
          <h3>✅ Inside the Queue Complex</h3>
          <div className={styles.facilityGrid}>
            {data.facilities.map((fac, idx) => (
              <div key={idx} className={styles.facilityCard}>
                <div className={styles.facilityIcon}>
                  {getFacilityEmoji(fac.type)}
                </div>
                <div className={styles.facilityLabel}>{fac.type}</div>
                <div className={styles.facilityNotes}>{fac.notes}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visual Dress Code */}
      {data.dressCodeRules && (
        <section className={styles.section}>
          <h3>👔 Dress Code Guide</h3>
          <div className={styles.dressCodeGrid}>
            <div className={`${styles.dressCodeCard} ${styles.dressCodeAllowed}`}>
              <h4><CheckCircle2 size={18} /> Accepted Traditional Wear</h4>
              <ul className={styles.list}>
                {data.dressCodeRules.allowed.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.dressCodeCard} ${styles.dressCodeProhibited}`}>
              <h4><XCircle size={18} /> Strictly Prohibited</h4>
              <ul className={styles.list}>
                {data.dressCodeRules.prohibited.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          {data.dressCodeRules.exceptions && (
            <p className={styles.dressCodeExceptions}>* {data.dressCodeRules.exceptions}</p>
          )}
        </section>
      )}

      {/* Legacy Fallbacks / Tips */}
      {data.tips && data.tips.length > 0 && (
        <section className={`${styles.section} ${styles.tipsBox}`}>
          <h3>💡 Senior Insider Tips</h3>
          <ul className={styles.list}>
            {data.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
