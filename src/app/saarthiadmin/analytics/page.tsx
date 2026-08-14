'use client';

import React, { useState, useEffect } from 'react';
import { Users, Eye, Activity, RefreshCw, BarChart2, BookOpen, MapPin, Smartphone, Monitor, Trophy, Building2 } from 'lucide-react';
import styles from '../Dashboard.module.css';
import { safeFetchJson } from '@/lib/safeFetch';

interface PageViewMetric {
  path: string;
  pageTitle: string;
  totalViews: number;
  uniqueVisitors: number;
  sharePercentage: number;
}

interface PlaceMetric {
  placeId: string;
  name: string;
  category: string;
  views: number;
}

interface StoryMetric {
  storyId: string;
  title: string;
  category: string;
  reads: number;
}

interface AnalyticsSummaryResponse {
  success: boolean;
  summary: {
    totalVisitors: {
      today: number;
      last7Days: number;
      last30Days: number;
      totalAllTime: number;
    };
    totalPageviews: number;
    liveActiveNow: number;
    avgPagesPerSession: string;
    mostViewedPages: PageViewMetric[];
    topVisitedPlaces: PlaceMetric[];
    topStoriesRead: StoryMetric[];
    deviceBreakdown: {
      mobile: number;
      desktop: number;
      tablet: number;
    };
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummaryResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAnalytics = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const res = await safeFetchJson<AnalyticsSummaryResponse>('/api/admin/analytics/summary');
      if (res && res.summary) {
        setData(res.summary);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Failed to fetch admin analytics:', e);
    } finally {
      if (isManual) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(true);
    // Realtime dynamic polling every 5 seconds
    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const summary = data || {
    totalVisitors: { today: 0, last7Days: 0, last30Days: 0, totalAllTime: 0 },
    totalPageviews: 0,
    liveActiveNow: 0,
    avgPagesPerSession: '0.0 pages',
    mostViewedPages: [],
    topVisitedPlaces: [],
    topStoriesRead: [],
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 }
  };

  return (
    <div className={styles.dashboard} style={{ padding: '24px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', fontFamily: 'var(--font-heading), sans-serif' }}>
            Visitor Analytics & Page View Intelligence
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, fontWeight: 500 }}>
            Realtime pilgrim traffic, active sessions, and most visited pages ranking
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', border: '1px solid #86EFAC', padding: '5px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
            Live Auto-Sync (5s) {lastUpdated && `• ${lastUpdated}`}
          </span>

          <button 
            onClick={() => fetchAnalytics(true)}
            style={{
              backgroundColor: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '10px',
              padding: '8px 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            <RefreshCw size={14} className={loading ? styles.spin : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ─── METRIC CARDS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Unique Visitors */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Unique Visitors Today
            </span>
            <div style={{ background: '#EFF6FF', padding: '6px', borderRadius: '10px', color: '#2563EB' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
            {summary.totalVisitors.today.toLocaleString()}
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px', display: 'block', fontWeight: 600 }}>
            7 Days: <b>{summary.totalVisitors.last7Days.toLocaleString()}</b> • 30 Days: <b>{summary.totalVisitors.last30Days.toLocaleString()}</b>
          </span>
        </div>

        {/* Total Page Views */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Page Views
            </span>
            <div style={{ background: '#F0FDF4', padding: '6px', borderRadius: '10px', color: '#16A34A' }}>
              <Eye size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
            {summary.totalPageviews.toLocaleString()}
          </div>
          <span style={{ fontSize: '11.5px', color: '#16A34A', marginTop: '6px', display: 'block', fontWeight: 700 }}>
            Avg {summary.avgPagesPerSession} per visitor
          </span>
        </div>

        {/* Live Active Now */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Active Now
            </span>
            <div style={{ background: '#FEF2F2', padding: '6px', borderRadius: '10px', color: '#DC2626' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#DC2626', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#DC2626', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            {summary.liveActiveNow} Active
          </div>
          <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '6px', display: 'block', fontWeight: 600 }}>
            Active on Saarthi in last 5 mins
          </span>
        </div>

        {/* Devices */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Device Platform
            </span>
            <div style={{ background: '#F5F3FF', padding: '6px', borderRadius: '10px', color: '#7C3AED' }}>
              <Smartphone size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#1D4ED8', background: '#DBEAFE', padding: '3px 8px', borderRadius: '6px' }}>
              📱 Mobile {summary.deviceBreakdown.mobile}%
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#4C1D95', background: '#EDE9FE', padding: '3px 8px', borderRadius: '6px' }}>
              💻 Desktop {summary.deviceBreakdown.desktop}%
            </span>
          </div>
        </div>
      </div>

      {/* ─── MOST VIEWED PAGES RANKING TABLE ─── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Trophy size={20} color="#D97706" />
          <h2 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: 0, fontFamily: 'var(--font-heading), sans-serif' }}>
            Most Viewed Pages Ranking
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9', color: '#64748B', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Rank & Page Title</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Path URL</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Unique Visitors</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Total Page Views</th>
                <th style={{ padding: '10px 12px', fontWeight: 800 }}>Traffic Share</th>
              </tr>
            </thead>
            <tbody>
              {summary.mostViewedPages.map((page, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '12px', fontWeight: 800, color: '#0F172A', fontSize: '13.5px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: idx === 0 ? '#FEF3C7' : '#F1F5F9',
                      color: idx === 0 ? '#B45309' : '#475569',
                      fontSize: '11px', fontWeight: 900, marginRight: '8px'
                    }}>
                      {idx + 1}
                    </span>
                    {page.pageTitle}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
                    {page.path}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#334155', fontSize: '13px' }}>
                    {page.uniqueVisitors.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 900, color: '#0F172A', fontSize: '13.5px' }}>
                    {page.totalViews.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', width: '180px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${page.sharePercentage}%`, height: '100%', background: idx === 0 ? '#D97706' : '#2563EB', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', width: '32px' }}>
                        {page.sharePercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MOST VISITED PLACES & TOP STORIES ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Most Visited Places */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <Building2 size={18} color="#2563EB" />
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Top Viewed Places
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.topVisitedPlaces.map((place, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                    {place.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    {place.category}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', background: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                  {place.views.toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Stories Read */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <BookOpen size={18} color="#D97706" />
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Top Read Stories of the Day
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary.topStoriesRead.map((story, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                    {story.title}
                  </h4>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    {story.category}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', background: '#FFFBEB', padding: '3px 8px', borderRadius: '6px' }}>
                  {story.reads.toLocaleString()} reads
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
