'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { darshanRegistry } from '@/content/darshans';
import styles from './page.module.css';
import { DarshanDetail } from '@/types/darshan';
import { ArrowLeft, CheckCircle2, XCircle, Activity, Info, Coins, ShieldAlert, Heart, MapPin, Sparkles, Shirt, Lightbulb, Droplet, UtensilsCrossed, Toilet, Hospital, Accessibility, Baby } from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';

export default function DarshanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<DarshanDetail | null>(null);
  const [liveWaitTime, setLiveWaitTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && darshanRegistry[id]) {
      setData(darshanRegistry[id]);
    }
  }, [id]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/v1/status');
        if (res.ok) {
          const statusData: TirumalaStatus = await res.json();
          if (statusData && statusData.darshans) {
            const mapNameToId = (name: string): string => {
              const lower = name.toLowerCase();
              if (lower.includes('sarva')) return 'sarva-darshan';
              if (lower.includes('300') || lower.includes('special')) return 'special-entry';
              if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
              if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
              return 'sarva-darshan';
            };

            const match = statusData.darshans.find((d: any) => mapNameToId(d.name) === id);
            if (match) {
              setLiveWaitTime(match.waitTime);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch live status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  if (!data) return <div className={styles.container} style={{ padding: '40px', textAlign: 'center' }}>Loading details...</div>;

  const getFacilityIcon = (type: string) => {
    switch(type) {
      case 'water':      return <Droplet size={16} color="#3B82F6" />;
      case 'food':       return <UtensilsCrossed size={16} color="#F59E0B" />;
      case 'restroom':   return <Toilet size={16} color="#6B7280" />;
      case 'medical':    return <Hospital size={16} color="#EF4444" />;
      case 'wheelchair': return <Accessibility size={16} color="#8B5CF6" />;
      case 'infant':     return <Baby size={16} color="#EC4899" />;
      default:           return <MapPin size={16} color="#9CA3AF" />;
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <ArrowLeft size={18} />
        </button>
        <h1 className={styles.headerTitle}>{data.title}</h1>
      </header>

      {/* HERO / STATS */}
      <section className={styles.hero}>
        <div className={styles.titleArea}>
          <span className={styles.badge}>Status Dashboard</span>
          <h2 className={styles.title}>{data.title}</h2>
        </div>

        <div className={styles.metricsGrid}>
          <div className={`${styles.metricBox} ${styles.metricBoxActive}`}>
            <span className={styles.metricVal}>
              <Activity size={18} />
              {loading ? '...' : (liveWaitTime || data.waitTime)}
            </span>
            <span className={styles.metricLbl}>Live Queue Wait</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricVal}>
              <Coins size={18} className="text-amber-600" />
              {data.cost.includes('Rs.') ? data.cost.replace('Rs.', '₹') : data.cost}
            </span>
            <span className={styles.metricLbl}>Ticket Cost</span>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className={styles.section}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} /> Overview</h3>
        <p className={styles.description}>{data.description}</p>
      </section>

      {/* EMPATHY & ACCESSIBILITY */}
      {data.accessibility && data.accessibility.length > 0 && (
        <section className={styles.accessibilityBox}>
          <h3 className={styles.accessibilityTitle}>
            <Heart size={18} /> Empathy &amp; Accessibility
          </h3>
          <ul className={styles.list}>
            {data.accessibility.map((acc, idx) => (
              <li key={idx} style={{ color: '#1e1b4b' }}>{acc}</li>
            ))}
          </ul>
        </section>
      )}

      {/* JOURNEY STEPS */}
      {data.journeySteps && data.journeySteps.length > 0 && (
        <section className={styles.section}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={18} /> Journey Flow</h3>
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

      {/* FACILITIES */}
      {data.facilities && data.facilities.length > 0 && (
        <section className={styles.section}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} /> Inside the Queue Complex</h3>
          <div className={styles.facilityGrid}>
            {data.facilities.map((fac, idx) => (
              <div key={idx} className={styles.facilityCard}>
                <div className={styles.facilityHeader}>
                  <div className={styles.facilityHeaderLeft} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={16} color="#E9801D" />
                    <div className={styles.facilityLabel}>{fac.type}</div>
                  </div>
                </div>
                <div className={styles.facilityNotes}>{fac.notes}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DRESS CODE */}
      {data.dressCodeRules && (
        <section className={styles.section}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shirt size={18} /> Dress Code Guide</h3>
          <div className={styles.dressCodeGrid}>
            <div className={`${styles.dressCodeCard} ${styles.dressCodeAllowed}`}>
              <h4><CheckCircle2 size={16} /> Accepted Traditional Wear</h4>
              <ul className={styles.list}>
                {data.dressCodeRules.allowed.map((rule, idx) => (
                  <li key={idx} style={{ color: '#14532d' }}>{rule}</li>
                ))}
              </ul>
            </div>
            <div className={`${styles.dressCodeCard} ${styles.dressCodeProhibited}`}>
              <h4><XCircle size={16} /> Strictly Prohibited Wear</h4>
              <ul className={styles.list}>
                {data.dressCodeRules.prohibited.map((rule, idx) => (
                  <li key={idx} style={{ color: '#7f1d1d' }}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
          {data.dressCodeRules.exceptions && (
            <p className={styles.dressCodeExceptions} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lightbulb size={16} /> Note: {data.dressCodeRules.exceptions}
            </p>
          )}
        </section>
      )}

      {/* INSIDER TIPS */}
      {data.tips && data.tips.length > 0 && (
        <section className={styles.tipsBox}>
          <h3 className={styles.tipsTitle}>
            <Info size={18} /> TTD Insider Guidelines
          </h3>
          <ul className={styles.list}>
            {data.tips.map((tip, idx) => (
              <li key={idx} className={styles.tipsContent}>{tip}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
