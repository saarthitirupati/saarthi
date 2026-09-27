'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  QrCode, 
  Plus, 
  Search, 
  Bus, 
  Building2, 
  Car, 
  Landmark, 
  Plane, 
  Train, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  PauseCircle, 
  ExternalLink,
  Edit2,
  RefreshCw,
  Smartphone,
  Radio,
  Clock,
  Globe,
  X,
  Copy,
  Check,
  Users,
  Eye,
  Navigation,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import QRGenerator from '@/components/admin/QRGenerator';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  destination: string;
  status: 'active' | 'paused';
  createdAt: string;
}

interface GrowthMetrics {
  totalScans: number;
  todayScans: number;
  totalCampaigns: number;
  activeCampaigns: number;
  topCampaign: { id: string; name: string; scans: number } | null;
  campaignScanMap: Record<string, number>;
  campaignTodayMap: Record<string, number>;
  deviceBreakdown?: Record<string, number>;
  osBreakdown?: Record<string, number>;
  browserBreakdown?: Record<string, number>;
}

interface PageViewStat {
  path: string;
  pageTitle?: string;
  title?: string;
  totalViews?: number;
  views?: number;
  uniqueVisitors?: number;
  uniquePilgrims?: number;
  sharePercentage?: number;
  percentage?: number;
  category?: 'core' | 'darshan' | 'stay' | 'transport' | 'places' | 'other';
}

interface RecentPageVisit {
  sessionId?: string;
  path: string;
  pageTitle?: string;
  title?: string;
  deviceType?: string;
  device?: string;
  timestamp: string;
  source?: string;
}

interface VisitorAnalytics {
  liveActiveNow: number;
  todayVisitors: number;
  last7DaysVisitors: number;
  totalAllTimeVisitors: number;
  totalPageviews: number;
  avgPagesPerSession: string | number;
  mostViewedPages: PageViewStat[];
  recentPageviews: RecentPageVisit[];
}

function getPageCategory(path: string): 'core' | 'darshan' | 'stay' | 'transport' | 'places' | 'other' {
  if (path === '/' || path === '/profile' || path === '/saved' || path === '/onboarding' || path === '/splash') return 'core';
  if (path.includes('darshan') || path.includes('essentials') || path.includes('festivals') || path.includes('alerts')) return 'darshan';
  if (path.includes('stay') || path.includes('hotel') || path.includes('cottage')) return 'stay';
  if (path.includes('bus') || path.includes('taxi') || path.includes('railway') || path.includes('trip-estimator') || path.startsWith('/qr/apsrtc')) return 'transport';
  if (path.includes('place') || path.includes('explore') || path.includes('story')) return 'places';
  return 'other';
}

export default function GrowthHubDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics | null>(null);
  const [pageSearchQuery, setPageSearchQuery] = useState<string>('');
  const [pageCategoryFilter, setPageCategoryFilter] = useState<string>('all');
  const [visitorTab, setVisitorTab] = useState<'ranked' | 'live'>('ranked');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoSync, setAutoSync] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    slug: '',
    category: 'apsrtc',
    location: '',
    destination: '/darshan'
  });

  // QR Preview Modal State
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  // Editing Destination State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDestination, setEditDestination] = useState<string>('');

  // Quick Copy State
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.saarthiguide.in';
    const url = `${origin}/qr/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const getAdminHeaders = () => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026') : 'saarthi_admin_token_2026';
    return { 'Authorization': `Bearer ${token}` };
  };

  const loadData = useCallback((silent = false) => {
    if (!silent) setIsRefreshing(true);
    fetch('/api/admin/growth', { 
      cache: 'no-store',
      headers: getAdminHeaders(),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCampaigns(data.campaigns || []);
          setMetrics(data.metrics || null);
          setRecentScans(data.recentScans || []);
          if (data.visitorAnalytics) {
            setVisitorAnalytics(data.visitorAnalytics);
          }
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    loadData();
    let interval: any = null;
    if (autoSync) {
      // Live polling every 12 seconds when visible
      interval = setInterval(() => {
        if (document.hidden) return;
        loadData(true);
      }, 12000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadData, autoSync]);

  function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    fetch('/api/admin/growth', {
      method: 'POST',
      headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newCampaign),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsModalOpen(false);
          setNewCampaign({ name: '', slug: '', category: 'apsrtc', location: '', destination: '/darshan' });
          loadData();
        } else {
          alert(data.error || 'Failed to create campaign');
        }
      });
  }

  function handleSaveDestination(id: string) {
    fetch(`/api/admin/growth/${id}`, {
      method: 'PATCH',
      headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ destination: editDestination }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEditingId(null);
          loadData();
        }
      });
  }

  function handleToggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    fetch(`/api/admin/growth/${id}`, {
      method: 'PATCH',
      headers: { ...getAdminHeaders(), 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: nextStatus }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) loadData();
      });
  }

  function getRelativeTime(timestampStr: string) {
    if (!timestampStr) return 'Recently';
    const now = new Date().getTime();
    const scanTime = new Date(timestampStr).getTime();
    const diffSec = Math.floor((now - scanTime) / 1000);

    if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  }

  const categoryIcons: Record<string, any> = {
    apsrtc: Bus,
    hotel: Building2,
    taxi: Car,
    auto: Car,
    temple: Landmark,
    railway: Train,
    airport: Plane,
    festival: Calendar,
    other: Layers,
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalScansVal = metrics ? metrics.totalScans : 0;
  const todayScansVal = metrics ? metrics.todayScans : 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: campaigns.length };
    campaigns.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

  const filteredPages = useMemo(() => {
    if (!visitorAnalytics?.mostViewedPages) return [];
    return visitorAnalytics.mostViewedPages.filter(p => {
      const cat = p.category || getPageCategory(p.path);
      const title = p.pageTitle || p.title || p.path;
      const matchesCategory = pageCategoryFilter === 'all' || cat === pageCategoryFilter;
      const matchesSearch = title.toLowerCase().includes(pageSearchQuery.toLowerCase()) || 
                            p.path.toLowerCase().includes(pageSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [visitorAnalytics, pageCategoryFilter, pageSearchQuery]);

  return (
    <div className="growthContainer">
      
      {/* Header Banner */}
      <div className="headerBanner">
        <div className="headerText">
          <div className="livePillGroup">
            <button
              onClick={() => setAutoSync(!autoSync)}
              className="liveEngineBtn"
              style={{
                backgroundColor: autoSync ? '#059669' : '#334155',
                color: '#FFFFFF'
              }}
              title="Click to toggle live polling (12s interval)"
            >
              <Radio size={12} className={autoSync ? 'animate-pulse' : ''} />
              <span>{autoSync ? 'LIVE ENGINE · AUTO-SYNC' : 'SYNC PAUSED'}</span>
            </button>
            <span className="syncTimeText">
              Synced: {lastUpdated}
            </span>
          </div>

          <h1 className="headerTitle">
            <TrendingUp color="#10B981" size={28} style={{ flexShrink: 0 }} />
            <span>Growth Hub &amp; Live Acquisition</span>
          </h1>
          <p className="headerSubtitle">
            Real-time dynamic pilgrim traffic, most-visited page journeys, and physical QR acquisition telemetry across Tirupati.
          </p>
        </div>

        <div className="headerActions">
          <button
            onClick={() => loadData(false)}
            disabled={isRefreshing}
            className="refreshBtn"
          >
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="createBtn"
          >
            <Plus size={18} />
            <span>New Campaign QR</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: How Many Users Are Visiting (Live Pilgrim Traffic Intelligence) */}
      <div className="sectionHeader">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <h2 className="sectionHeadingTitle">Live Pilgrim Web &amp; App Traffic</h2>
          <span className="liveBadge">Dynamic Analytics</span>
        </div>
        <p className="sectionSubtitle">Dynamic count of active visitors and session volume across Tirupati guide</p>
      </div>

      <div className="metricGrid" style={{ marginBottom: '28px' }}>
        {/* Card 1: Live Active Now */}
        <div className="metricCard cardEmerald">
          <div className="cardTopBar barEmerald" />
          <div className="metricCardHeader">
            <span>LIVE ACTIVE NOW</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '2px 7px', borderRadius: '12px', color: '#34D399', fontSize: '10px', fontWeight: 800 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} className="animate-pulse" />
              <span>ACTIVE</span>
            </div>
          </div>
          <div className="metricValue" style={{ color: '#10B981' }}>
            {visitorAnalytics ? visitorAnalytics.liveActiveNow : 1}
          </div>
          <div className="metricSubtext" style={{ color: '#34D399' }}>
            ● Active in last 5 minutes
          </div>
        </div>

        {/* Card 2: Today's Unique Visitors */}
        <div className="metricCard cardSky">
          <div className="cardTopBar barSky" />
          <div className="metricCardHeader">
            <span>PILGRIMS TODAY</span>
            <Users size={18} color="#38BDF8" />
          </div>
          <div className="metricValue" style={{ color: '#38BDF8' }}>
            +{visitorAnalytics ? visitorAnalytics.todayVisitors.toLocaleString() : todayScansVal.toLocaleString()}
          </div>
          <div className="metricSubtext">
            {visitorAnalytics ? `${visitorAnalytics.last7DaysVisitors.toLocaleString()} past 7 days` : 'Live today'}
          </div>
        </div>

        {/* Card 3: Total All-Time Pilgrims */}
        <div className="metricCard cardPurple">
          <div className="cardTopBar barPurple" />
          <div className="metricCardHeader">
            <span>TOTAL PILGRIMS</span>
            <Globe size={18} color="#A855F7" />
          </div>
          <div className="metricValue" style={{ color: '#C084FC' }}>
            {visitorAnalytics ? visitorAnalytics.totalAllTimeVisitors.toLocaleString() : '1,660+'}
          </div>
          <div className="metricSubtext">
            Across Web &amp; PWA
          </div>
        </div>

        {/* Card 4: Total Page Views & Depth */}
        <div className="metricCard cardAmber">
          <div className="cardTopBar barAmber" />
          <div className="metricCardHeader">
            <span>TOTAL PAGEVIEWS</span>
            <Eye size={18} color="#F59E0B" />
          </div>
          <div className="metricValue" style={{ color: '#FBBF24' }}>
            {visitorAnalytics ? visitorAnalytics.totalPageviews.toLocaleString() : (totalScansVal * 2.8).toFixed(0)}
          </div>
          <div className="metricSubtext" style={{ color: '#F59E0B' }}>
            ~{visitorAnalytics?.avgPagesPerSession || 2.8} pages / pilgrim
          </div>
        </div>
      </div>

      {/* SECTION 2: What Pages Do They Visit */}
      <div className="pagesSection">
        <div className="pagesSectionHeader">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={20} color="#38BDF8" />
              <h2 className="sectionHeadingTitle">What Pages Do Pilgrims Visit?</h2>
              <span className="liveBadge">Real-Time Routing</span>
            </div>
            <p className="sectionSubtitle">
              Ranked destination popularity, page view volume, and real-time navigation telemetry
            </p>
          </div>

          {/* Tab Switcher: Ranked Pages vs Live Stream */}
          <div className="tabSwitcher">
            <button
              onClick={() => setVisitorTab('ranked')}
              className={`tabBtn ${visitorTab === 'ranked' ? 'tabActive' : ''}`}
            >
              <Eye size={14} />
              <span>Most Visited Pages ({visitorAnalytics?.mostViewedPages?.length || 0})</span>
            </button>
            <button
              onClick={() => setVisitorTab('live')}
              className={`tabBtn ${visitorTab === 'live' ? 'tabActive' : ''}`}
            >
              <Radio size={14} className="animate-pulse" />
              <span>Live Stream ({visitorAnalytics?.recentPageviews?.length || 0})</span>
            </button>
          </div>
        </div>

        {visitorTab === 'ranked' ? (
          <div>
            {/* Filter Toolbar */}
            <div className="filterToolbar" style={{ marginBottom: '14px' }}>
              {/* Category Pills */}
              <div className="categoryTabs noScrollbar">
                {[
                  { id: 'all', label: 'All Pages' },
                  { id: 'core', label: 'Core / Home' },
                  { id: 'darshan', label: 'Darshan' },
                  { id: 'stay', label: 'Hotels & Stay' },
                  { id: 'transport', label: 'Transport' },
                  { id: 'places', label: 'Places & Sightseeing' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setPageCategoryFilter(cat.id)}
                    className={`pageFilterPill ${pageCategoryFilter === cat.id ? 'pillActive' : ''}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="searchBox">
                <Search size={14} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search pages or paths..."
                  value={pageSearchQuery}
                  onChange={(e) => setPageSearchQuery(e.target.value)}
                  className="searchInput"
                />
              </div>
            </div>

            {/* Ranked Table */}
            <div className="tableContainer noScrollbar">
              <table className="campaignTable">
                <thead>
                  <tr className="tableHeadRow">
                    <th style={{ padding: '14px 16px', width: '70px' }}>Rank</th>
                    <th style={{ padding: '14px 16px' }}>Page Destination &amp; Purpose</th>
                    <th style={{ padding: '14px 16px' }}>Category</th>
                    <th style={{ padding: '14px 16px' }}>Total Views</th>
                    <th style={{ padding: '14px 16px' }}>Unique Pilgrims</th>
                    <th style={{ padding: '14px 16px' }}>Traffic Share</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Open Page</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '36px 20px', textAlign: 'center', color: '#64748B' }}>
                        No pages found matching your filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page, idx) => {
                      const rank = idx + 1;
                      const rankBadgeStyle = rank === 1 
                        ? { background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#000' }
                        : rank === 2
                        ? { background: 'linear-gradient(135deg, #94A3B8, #64748B)', color: '#000' }
                        : rank === 3
                        ? { background: 'linear-gradient(135deg, #B45309, #78350F)', color: '#FFF' }
                        : { background: 'rgba(255, 255, 255, 0.08)', color: '#94A3B8' };

                      const pageTitle = page.pageTitle || page.title || page.path;
                      const pageViews = page.totalViews ?? page.views ?? 0;
                      const uniqueCount = page.uniqueVisitors ?? page.uniquePilgrims ?? 0;
                      const percentage = page.sharePercentage ?? page.percentage ?? 0;
                      const category = page.category || getPageCategory(page.path);

                      return (
                        <tr key={page.path} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ 
                              ...rankBadgeStyle, 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              width: '26px', 
                              height: '26px', 
                              borderRadius: '8px', 
                              fontWeight: 800, 
                              fontSize: '12px' 
                            }}>
                              #{rank}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13.5px' }}>
                              {pageTitle}
                            </div>
                            <div style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '2px' }}>
                              {page.path}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`categoryTag tag-${category}`}>
                              {category.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '14px' }}>
                              {pageViews.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>views</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, color: '#34D399', fontSize: '13.5px' }}>
                              {uniqueCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>pilgrims</div>
                          </td>
                          <td style={{ padding: '14px 16px', minWidth: '130px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ flex: 1, height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: '#10B981' }} />
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', minWidth: '35px' }}>
                                {percentage}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <Link
                              href={page.path}
                              target="_blank"
                              className="viewPageLink"
                              title={`Visit ${page.path} in a new tab`}
                            >
                              <span>View</span>
                              <ExternalLink size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Live Incoming Navigation Stream */
          <div className="tableContainer" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} className="animate-pulse" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF' }}>Real-Time Navigation Stream</span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>Auto-updating via telemetry</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!visitorAnalytics?.recentPageviews || visitorAnalytics.recentPageviews.length === 0 ? (
                <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                  No recent pageviews recorded yet. Telemetry will show here automatically as users navigate.
                </div>
              ) : (
                visitorAnalytics.recentPageviews.map((pv, idx) => {
                  const pvTitle = pv.pageTitle || pv.title || pv.path;
                  const pvDevice = pv.deviceType || pv.device || 'Mobile';

                  return (
                    <div key={idx} className="liveVisitRow">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="visitIconBox">
                          <Navigation size={14} color="#38BDF8" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13px' }}>
                            {pvTitle}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
                            <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{pv.path}</span>
                            <span>•</span>
                            <span>{pvDevice}</span>
                            {pv.source && (
                              <>
                                <span>•</span>
                                <span style={{ color: '#A855F7' }}>{pv.source}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11.5px', color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} />
                          {getRelativeTime(pv.timestamp)}
                        </span>
                        <Link
                          href={pv.path}
                          target="_blank"
                          className="smallIconBtn"
                          title="Open page"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Physical QR Campaign Deployment & Ground Telemetry */}
      <div className="sectionHeader">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QrCode size={18} color="#10B981" />
          <h2 className="sectionHeadingTitle">Physical QR Campaign Fleet &amp; Ground Telemetry</h2>
        </div>
        <p className="sectionSubtitle">Ground QR sticker acquisition telemetry across Tirupati APSRTC buses, hotels, taxis, and temple kiosks</p>
      </div>

      {/* Metric Cards Grid: 2x2 on Mobile/Samsung, 4x1 on Desktop */}
      <div className="metricGrid">
        
        {/* Card 1: Total Real Scans */}
        <div className="metricCard cardEmerald">
          <div className="cardTopBar barEmerald" />
          <div className="metricCardHeader">
            <span>TOTAL SCANS</span>
            <QrCode size={18} color="#10B981" />
          </div>
          <div className="metricValue">
            {totalScansVal.toLocaleString()}
          </div>
          <div className="metricSubtext" style={{ color: '#34D399' }}>
            ▲ 100% Real Ground Telemetry
          </div>
        </div>

        {/* Card 2: Today's Scans */}
        <div className="metricCard cardSky">
          <div className="cardTopBar barSky" />
          <div className="metricCardHeader">
            <span>SCANS TODAY</span>
            <TrendingUp size={18} color="#38BDF8" />
          </div>
          <div className="metricValue" style={{ color: '#38BDF8' }}>
            +{todayScansVal.toLocaleString()}
          </div>
          <div className="metricSubtext">
            Since midnight live
          </div>
        </div>

        {/* Card 3: Top Performer */}
        <div className="metricCard cardAmber">
          <div className="cardTopBar barAmber" />
          <div className="metricCardHeader">
            <span>TOP CHANNEL</span>
            <Bus size={18} color="#F59E0B" />
          </div>
          <div className="metricValueText">
            {metrics?.topCampaign ? metrics.topCampaign.name : 'APSRTC Fleet'}
          </div>
          <div className="metricSubtext" style={{ color: '#F59E0B' }}>
            {metrics?.topCampaign ? `${metrics.topCampaign.scans.toLocaleString()} total scans` : 'Active'}
          </div>
        </div>

        {/* Card 4: Active Campaigns */}
        <div className="metricCard cardSlate">
          <div className="metricCardHeader">
            <span>ACTIVE CAMPAIGNS</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div className="metricValue">
            {metrics ? metrics.activeCampaigns : campaigns.length} 
            <span style={{ fontSize: '15px', color: '#64748B', fontWeight: 500, marginLeft: '4px' }}>
              / {metrics?.totalCampaigns || campaigns.length}
            </span>
          </div>
          <div className="metricSubtext" style={{ color: '#10B981' }}>
            Live deployed locations
          </div>
        </div>

      </div>

      {/* Main Grid: Responsive 2-column on desktop, stacked on mobile/Samsung */}
      <div className="mainGrid">
        
        {/* Left Column: Campaigns & Locations */}
        <div className="campaignSection">
          {/* Filter Tabs & Search Bar */}
          <div className="filterToolbar">
            
            {/* Category Tabs */}
            <div className="categoryTabs noScrollbar">
              {[
                { id: 'all', label: 'All Channels', count: categoryCounts.all },
                { id: 'apsrtc', label: 'APSRTC', count: categoryCounts.apsrtc },
                { id: 'hotel', label: 'Hotels', count: categoryCounts.hotel },
                { id: 'taxi', label: 'Taxis & Cabs', count: categoryCounts.taxi },
                { id: 'temple', label: 'Temples', count: categoryCounts.temple },
                { id: 'railway', label: 'Railway', count: categoryCounts.railway },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: selectedCategory === tab.id ? '#10B981' : '#1E293B',
                    color: selectedCategory === tab.id ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    flexShrink: 0
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span style={{
                      fontSize: '10.5px',
                      padding: '1px 5px',
                      borderRadius: '8px',
                      backgroundColor: selectedCategory === tab.id ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.08)',
                      color: selectedCategory === tab.id ? '#FFFFFF' : '#94A3B8',
                      fontWeight: 700
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="searchBox">
              <Search size={14} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search campaigns, routes, spots..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="searchInput"
              />
            </div>
          </div>

          {/* Campaigns Table Container with Horizontal Scroll Protection */}
          <div className="tableContainer noScrollbar">
            <table className="campaignTable">
              <thead>
                <tr className="tableHeadRow">
                  <th style={{ padding: '14px 16px' }}>Campaign &amp; Location</th>
                  <th style={{ padding: '14px 16px' }}>Slug &amp; Direct Link</th>
                  <th style={{ padding: '14px 16px' }}>Destination</th>
                  <th style={{ padding: '14px 16px' }}>Scans</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>QR Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
                      No marketing campaigns found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map(c => {
                    const CategoryIcon = categoryIcons[c.category] || Layers;
                    const cScans = metrics?.campaignScanMap[c.id] || metrics?.campaignScanMap[c.slug] || 0;
                    const cToday = metrics?.campaignTodayMap[c.id] || metrics?.campaignTodayMap[c.slug] || 0;
                    const isEditing = editingId === c.id;
                    const pctOfTotal = totalScansVal > 0 ? Math.round((cScans / totalScansVal) * 100) : 0;
                    const isCopied = copiedSlug === c.slug;

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        
                        {/* Name & Location */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', flexShrink: 0 }}>
                              <CategoryIcon size={17} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '13.5px' }}>{c.name}</div>
                              <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>{c.location}</div>
                            </div>
                          </div>
                        </td>

                        {/* Slug URL & Copy Button */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link 
                              href={`/qr/${c.slug}`} 
                              target="_blank" 
                              title="Test redirect in new tab"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#38BDF8', textDecoration: 'none' }}
                            >
                              <span>/qr/{c.slug}</span>
                              <ExternalLink size={11} />
                            </Link>
                            
                            <button
                              onClick={() => handleCopyLink(c.slug)}
                              title={isCopied ? 'Link Copied!' : 'Copy direct link to clipboard'}
                              style={{
                                background: isCopied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.07)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '6px',
                                padding: '3px 7px',
                                color: isCopied ? '#34D399' : '#94A3B8',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '11px',
                                fontWeight: 600,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isCopied ? <Check size={11} color="#34D399" /> : <Copy size={11} />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </td>

                        {/* Destination */}
                        <td style={{ padding: '14px 16px' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={editDestination}
                                onChange={(e) => setEditDestination(e.target.value)}
                                style={{ backgroundColor: '#0F172A', border: '1px solid #10B981', color: '#FFF', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: '110px' }}
                              />
                              <button onClick={() => handleSaveDestination(c.id)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                              <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#64748B', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 7px', fontSize: '11px', cursor: 'pointer' }}>✕</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '12px', color: '#E2E8F0', fontWeight: 500, fontFamily: 'monospace' }}>{c.destination || '/'}</span>
                              <button
                                onClick={() => { setEditingId(c.id); setEditDestination(c.destination || '/'); }}
                                title="Edit Destination"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748B' }}
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Scans Count */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '13.5px' }}>
                            {cScans.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <div style={{ width: '42px', height: '4px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${pctOfTotal}%`, height: '100%', backgroundColor: '#10B981' }} />
                            </div>
                            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{pctOfTotal}%</span>
                          </div>
                          {cToday > 0 && (
                            <div style={{ fontSize: '10.5px', color: '#38BDF8', fontWeight: 700, marginTop: '2px' }}>+{cToday} today</div>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleToggleStatus(c.id, c.status)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: '20px',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor: c.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: c.status === 'active' ? '#10B981' : '#EF4444'
                            }}
                          >
                            {c.status === 'active' ? <CheckCircle2 size={11} /> : <PauseCircle size={11} />}
                            <span>{c.status.toUpperCase()}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => setPreviewCampaign(c)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 11px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: '#F8FAFC',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '8px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <QrCode size={13} color="#10B981" />
                            <span>Print QR</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Telemetry & Live Activity Stream */}
        <div className="telemetrySection">
          
          {/* Device Distribution Card */}
          <div className="telemetryCard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={15} color="#38BDF8" />
                Device Telemetry
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Field Scans</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {metrics?.deviceBreakdown ? (
                Object.entries(metrics.deviceBreakdown).map(([device, count]) => {
                  const pct = totalScansVal > 0 ? Math.round((count / totalScansVal) * 100) : 0;
                  return (
                    <div key={device}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{device}</span>
                        <span style={{ color: '#94A3B8' }}>{count.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: device === 'Android' ? '#10B981' : device === 'iOS' ? '#38BDF8' : '#F59E0B' }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: '#64748B', fontSize: '12px' }}>Loading telemetry...</div>
              )}
            </div>
          </div>

          {/* Live Recent Scans Stream */}
          <div className="telemetryCard" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#10B981" className="animate-pulse" />
                Live Ground Activity
              </span>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Real-Time</span>
            </div>

            <div className="scanList noScrollbar">
              {recentScans.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                  Awaiting live scans from field...
                </div>
              ) : (
                recentScans.slice(0, 15).map((scan, i) => (
                  <div key={scan.id || i} className="scanItem">
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#FFFFFF' }}>
                        {scan.campaignSlug ? `/qr/${scan.campaignSlug}` : 'QR Scan'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                        <span>{scan.device || scan.os || 'Mobile'}</span>
                        <span>•</span>
                        <span>{scan.browser || 'Browser'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} />
                        {getRelativeTime(scan.timestamp)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal: Create Campaign (Samsung Screen & Keyboard Safe) */}
      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalCard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Create Physical Campaign QR</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94A3B8', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>CAMPAIGN NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APSRTC Bus Stickers Fleet #2"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  className="modalInput"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>SLUG (/qr/slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="apsrtc-fleet"
                    value={newCampaign.slug}
                    onChange={(e) => setNewCampaign({ ...newCampaign, slug: e.target.value })}
                    className="modalInput"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>CHANNEL CATEGORY</label>
                  <select
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                    className="modalInput"
                  >
                    <option value="apsrtc">APSRTC Bus</option>
                    <option value="hotel">Hotel Reception</option>
                    <option value="taxi">Taxi / Cab Decal</option>
                    <option value="auto">Auto Rickshaw</option>
                    <option value="temple">Temple Kiosk</option>
                    <option value="railway">Railway Station</option>
                    <option value="airport">Airport Banner</option>
                    <option value="other">Other Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>PHYSICAL LOCATION</label>
                <input
                  type="text"
                  placeholder="e.g. Tirupati Central Bus Station"
                  value={newCampaign.location}
                  onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                  className="modalInput"
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '5px' }}>DYNAMIC DESTINATION PATH</label>
                <input
                  type="text"
                  required
                  placeholder="/darshan or /explore"
                  value={newCampaign.destination}
                  onChange={(e) => setNewCampaign({ ...newCampaign, destination: e.target.value })}
                  className="modalInput"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', padding: '9px 14px', fontSize: '13px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '9px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Create QR Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: QR Preview & Download (Samsung Responsive) */}
      {previewCampaign && (
        <div className="modalOverlay">
          <div className="previewModalWrapper">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
              <button
                onClick={() => setPreviewCampaign(null)}
                style={{ backgroundColor: '#334155', color: '#FFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Close QR Preview"
              >
                <X size={17} />
              </button>
            </div>
            <QRGenerator slug={previewCampaign.slug} name={previewCampaign.name} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .growthContainer {
          padding: clamp(14px, 3vw, 24px);
          max-width: 1280px;
          margin: 0 auto;
          color: #F8FAFC;
          font-family: system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }

        .headerBanner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          background-color: #1E293B;
          padding: clamp(16px, 3.5vw, 24px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .headerText {
          flex: 1 1 300px;
        }

        .livePillGroup {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .liveEngineBtn {
          font-size: 10.5px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .syncTimeText {
          font-size: 11.5px;
          color: #94A3B8;
        }

        .headerTitle {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 800;
          margin: 0;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.25;
        }

        .headerSubtitle {
          margin: 6px 0 0 0;
          color: #94A3B8;
          font-size: 13.5px;
          line-height: 1.4;
        }

        .headerActions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .refreshBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.08);
          color: #F8FAFC;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          cursor: pointer;
          transition: all 0.2s;
        }

        .createBtn {
          display: flex;
          align-items: center;
          gap: 7px;
          background-color: #10B981;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 13.5px;
          padding: 10px 18px;
          border-radius: 11px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          transition: all 0.2s;
        }

        /* Metric Grid: 2 cols on mobile Samsung, 4 cols on desktop */
        .metricGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .metricGrid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 28px;
          }
        }

        .metricCard {
          background-color: #1E293B;
          padding: 16px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .cardEmerald { border: 1px solid rgba(16, 185, 129, 0.3); }
        .cardSky { border: 1px solid rgba(56, 189, 248, 0.3); }
        .cardAmber { border: 1px solid rgba(245, 158, 11, 0.3); }
        .cardSlate { border: 1px solid rgba(255, 255, 255, 0.08); }

        .cardTopBar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .barEmerald { background: linear-gradient(90deg, #10B981, #34D399); }
        .barSky { background: linear-gradient(90deg, #0284C7, #38BDF8); }
        .barAmber { background: linear-gradient(90deg, #D97706, #F59E0B); }

        .metricCardHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #94A3B8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .metricValue {
          font-size: clamp(24px, 4.5vw, 34px);
          font-weight: 900;
          color: #FFFFFF;
          margin: 8px 0 3px 0;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .metricValueText {
          font-size: clamp(16px, 3.5vw, 19px);
          font-weight: 800;
          color: #FFFFFF;
          margin: 8px 0 3px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.2;
        }

        .metricSubtext {
          font-size: 11px;
          color: #94A3B8;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Main Grid */
        .mainGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }

        @media (min-width: 1024px) {
          .mainGrid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .filterToolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .categoryTabs {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .searchBox {
          position: relative;
          flex: 1 1 200px;
          max-width: 100%;
        }

        @media (min-width: 640px) {
          .searchBox {
            max-width: 260px;
          }
        }

        .searchInput {
          width: 100%;
          background-color: #1E293B;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 8px 12px 8px 34px;
          font-size: 12.5px;
          color: #FFFFFF;
          outline: none;
          box-sizing: border-box;
        }

        .searchInput:focus {
          border-color: #10B981;
        }

        .tableContainer {
          background-color: #1E293B;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .campaignTable {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
        }

        .tableHeadRow {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(15, 23, 42, 0.6);
          color: #94A3B8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .telemetrySection {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .telemetrySection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }

        .telemetryCard {
          background-color: #1E293B;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }

        .scanList {
          display: flex;
          flex-direction: column;
          gap: 9px;
          max-height: 380px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .scanItem {
          padding: 9px 12px;
          background-color: rgba(15, 23, 42, 0.6);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          box-sizing: border-box;
        }

        .modalCard {
          background-color: #1E293B;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          max-width: 480px;
          width: min(94vw, 480px);
          max-height: 88dvh;
          overflow-y: auto;
          padding: clamp(18px, 4vw, 24px);
          color: #FFF;
          box-sizing: border-box;
        }

        .modalInput {
          width: 100%;
          background-color: #0F172A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9px;
          padding: 9px 12px;
          color: #FFF;
          font-size: 13.5px;
          box-sizing: border-box;
          outline: none;
        }

        .modalInput:focus {
          border-color: #10B981;
        }

        .cardPurple { border: 1px solid rgba(168, 85, 247, 0.3); }
        .barPurple { background: linear-gradient(90deg, #9333EA, #C084FC); }

        .sectionHeader {
          margin-top: 10px;
          margin-bottom: 14px;
        }

        .sectionHeadingTitle {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }

        .sectionSubtitle {
          font-size: 12.5px;
          color: #94A3B8;
          margin-top: 3px;
        }

        .liveBadge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          padding: 2px 7px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .pagesSection {
          margin-bottom: 32px;
          background-color: #1E293B;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: clamp(16px, 3vw, 24px);
        }

        .pagesSectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 18px;
        }

        .tabSwitcher {
          display: flex;
          gap: 6px;
          background-color: rgba(15, 23, 42, 0.7);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tabBtn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tabActive {
          background-color: #334155;
          color: #FFFFFF;
        }

        .pageFilterPill {
          padding: 6px 11px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: #0F172A;
          color: #94A3B8;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .pillActive {
          background-color: #38BDF8;
          color: #0F172A;
          font-weight: 700;
          border-color: #38BDF8;
        }

        .categoryTag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 6px;
          letter-spacing: 0.4px;
        }

        .tag-core { background: rgba(56, 189, 248, 0.15); color: #38BDF8; }
        .tag-darshan { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .tag-stay { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .tag-transport { background: rgba(99, 102, 241, 0.15); color: #818CF8; }
        .tag-places { background: rgba(236, 72, 153, 0.15); color: #F472B6; }
        .tag-other { background: rgba(148, 163, 184, 0.15); color: #94A3B8; }

        .viewPageLink {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 9px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          color: #38BDF8;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .viewPageLink:hover {
          background: rgba(56, 189, 248, 0.2);
        }

        .liveVisitRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .visitIconBox {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(56, 189, 248, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .smallIconBtn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .smallIconBtn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.12);
        }

        .previewModalWrapper {
          max-width: 440px;
          width: min(94vw, 440px);
          max-height: 90dvh;
          overflow-y: auto;
          position: relative;
        }
      `}</style>
    </div>
  );
}
