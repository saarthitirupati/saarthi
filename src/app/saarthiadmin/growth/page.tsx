'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  X
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

export default function GrowthHubDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<GrowthMetrics | null>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
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

  const loadData = useCallback((silent = false) => {
    if (!silent) setIsRefreshing(true);
    fetch('/api/admin/growth', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCampaigns(data.campaigns || []);
          setMetrics(data.metrics || null);
          setRecentScans(data.recentScans || []);
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
      // Live polling every 12 seconds
      interval = setInterval(() => {
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto', color: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '28px',
        backgroundColor: '#1E293B',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Radio size={12} className="animate-pulse" />
              LIVE REAL-TIME ENGINE
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Last sync: {lastUpdated}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp color="#10B981" size={32} />
            Growth Hub &amp; Live Acquisition Analytics
          </h1>
          <p style={{ margin: '6px 0 0 0', color: '#94A3B8', fontSize: '14px' }}>
            Live physical QR acquisition tracking across Tirupati taxis, hotels, APSRTC buses, and temple kiosks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => loadData(false)}
            disabled={isRefreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '13px',
              padding: '11px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        {/* Card 1: Total Real Scans */}
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>
            <span>TOTAL PHYSICAL SCANS</span>
            <QrCode size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', margin: '10px 0 4px 0', letterSpacing: '-0.5px' }}>
            {totalScansVal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>▲ 100% Real Database Ground Scans</span>
          </div>
        </div>

        {/* Card 2: Today's Scans */}
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(56, 189, 248, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0284C7, #38BDF8)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>
            <span>SCANS RECORDED TODAY</span>
            <TrendingUp size={18} color="#38BDF8" />
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#38BDF8', margin: '10px 0 4px 0', letterSpacing: '-0.5px' }}>
            +{todayScansVal.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>
            Real-time scans since midnight
          </div>
        </div>

        {/* Card 3: Top Channel */}
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #D97706, #F59E0B)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>
            <span>TOP PERFORMER</span>
            <Bus size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '10px 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {metrics?.topCampaign ? metrics.topCampaign.name : 'APSRTC Fleet'}
          </div>
          <div style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 700 }}>
            {metrics?.topCampaign ? `${metrics.topCampaign.scans.toLocaleString()} total scans` : 'Active'}
          </div>
        </div>

        {/* Card 4: Active Campaigns */}
        <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>
            <span>ACTIVE CAMPAIGN QR</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#FFFFFF', margin: '10px 0 4px 0' }}>
            {metrics ? metrics.activeCampaigns : campaigns.length} <span style={{ fontSize: '16px', color: '#64748B', fontWeight: 500 }}>/ {metrics?.totalCampaigns || campaigns.length}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
            Active physical locations
          </div>
        </div>

      </div>

      {/* Main Grid: Campaigns Table + Recent Live Scan Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Left Column: Campaigns & Locations */}
        <div>
          {/* Filter Tabs & Search Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            
            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'All Channels' },
                { id: 'apsrtc', label: 'APSRTC Buses' },
                { id: 'hotel', label: 'Hotels' },
                { id: 'taxi', label: 'Taxis & Cabs' },
                { id: 'temple', label: 'Temples' },
                { id: 'railway', label: 'Railway' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: selectedCategory === tab.id ? '#10B981' : '#1E293B',
                    color: selectedCategory === tab.id ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '8px 12px 8px 34px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Campaigns Table Container */}
          <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#94A3B8', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 18px' }}>Campaign &amp; Location</th>
                  <th style={{ padding: '14px 18px' }}>Slug URL</th>
                  <th style={{ padding: '14px 18px' }}>Destination</th>
                  <th style={{ padding: '14px 18px' }}>Real Scans</th>
                  <th style={{ padding: '14px 18px' }}>Status</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>QR Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
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

                    return (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        
                        {/* Name & Location */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>
                              <CategoryIcon size={18} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{c.name}</div>
                              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{c.location}</div>
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td style={{ padding: '14px 18px' }}>
                          <Link href={`/qr/${c.slug}`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: '#38BDF8', textDecoration: 'none' }}>
                            <span>/qr/{c.slug}</span>
                            <ExternalLink size={11} />
                          </Link>
                        </td>

                        {/* Destination */}
                        <td style={{ padding: '14px 18px' }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <input
                                type="text"
                                value={editDestination}
                                onChange={(e) => setEditDestination(e.target.value)}
                                style={{ backgroundColor: '#0F172A', border: '1px solid #10B981', color: '#FFF', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', width: '120px' }}
                              />
                              <button onClick={() => handleSaveDestination(c.id)} style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#64748B', color: '#FFF', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>✕</button>
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
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '14px' }}>
                            {cScans.toLocaleString()}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <div style={{ width: '45px', height: '4px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${pctOfTotal}%`, height: '100%', backgroundColor: '#10B981' }} />
                            </div>
                            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{pctOfTotal}%</span>
                          </div>
                          {cToday > 0 && (
                            <div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700 }}>+{cToday} today</div>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 18px' }}>
                          <button
                            onClick={() => handleToggleStatus(c.id, c.status)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '20px',
                              fontSize: '11px',
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
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button
                            onClick={() => setPreviewCampaign(c)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              color: '#F8FAFC',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
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

        {/* Right Column: Live Scan Feed & Device Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Device Distribution Card */}
          <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} color="#38BDF8" />
                Device Breakdown
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Live Scans</span>
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
          <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#10B981" className="animate-pulse" />
                Live Scan Activity
              </span>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Real-Time</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {recentScans.length === 0 ? (
                <div style={{ padding: '20px 0', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
                  Awaiting live scans from field...
                </div>
              ) : (
                recentScans.slice(0, 15).map((scan, i) => (
                  <div key={scan.id || i} style={{ padding: '10px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Modal: Create Campaign */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', maxWidth: '480px', width: '100%', padding: '28px', color: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Create Physical Campaign QR</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>CAMPAIGN NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APSRTC Bus Stickers Fleet #2"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })}
                  style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>SLUG (/qr/slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="apsrtc-fleet"
                    value={newCampaign.slug}
                    onChange={(e) => setNewCampaign({ ...newCampaign, slug: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>CHANNEL CATEGORY</label>
                  <select
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '14px' }}
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
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>PHYSICAL LOCATION</label>
                <input
                  type="text"
                  placeholder="e.g. Tirupati Central Bus Station"
                  value={newCampaign.location}
                  onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>DYNAMIC DESTINATION PATH</label>
                <input
                  type="text"
                  required
                  placeholder="/darshan or /explore"
                  value={newCampaign.destination}
                  onChange={(e) => setNewCampaign({ ...newCampaign, destination: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: 'transparent', color: '#94A3B8', border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: '14px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Create Campaign QR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: QR Preview & Download */}
      {previewCampaign && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ maxWidth: '440px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setPreviewCampaign(null)}
              style={{ position: 'absolute', right: '-12px', top: '-12px', backgroundColor: '#334155', color: '#FFF', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
            >
              <X size={18} />
            </button>
            <QRGenerator slug={previewCampaign.slug} name={previewCampaign.name} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
