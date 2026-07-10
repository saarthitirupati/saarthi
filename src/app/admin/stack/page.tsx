'use client';
import { useState, useEffect } from 'react';
import { Cpu, DollarSign, ShieldAlert, CheckCircle2, AlertCircle, ArrowUpRight, Plus, Trash2, Edit2, Play } from 'lucide-react';
import styles from '../admin.module.css';

interface StackItem {
  id: string;
  layer: string;
  tool: string;
  cost: number;
  status: 'active' | 'inactive';
  url: string;
  notes: string;
}

export default function StartupStackPage() {
  const [items, setItems] = useState<StackItem[]>([
    { id: '1', layer: 'Frontend & Hosting', tool: 'Next.js + Vercel', cost: 0, status: 'active', url: 'https://vercel.com', notes: 'Serverless SSR pages, globally cached CDN.' },
    { id: '2', layer: 'Database & Auth', tool: 'Supabase (PostgreSQL)', cost: 0, status: 'active', url: 'https://supabase.com', notes: 'Handles user data, auth, real-time live darshan sync.' },
    { id: '3', layer: 'Content Management', tool: 'Sanity CMS', cost: 0, status: 'active', url: 'https://sanity.io', notes: 'Manages mythology stories, guides, and cultural media.' },
    { id: '4', layer: 'AI Coding & Speed', tool: 'Claude / Cursor / Gemini', cost: 20, status: 'active', url: 'https://cursor.com', notes: 'Forces dev multiplier, writes clean code, manages migrations.' },
    { id: '5', layer: 'Payments & Billing', tool: 'Stripe', cost: 0, status: 'active', url: 'https://stripe.com', notes: 'Set up for VIP travel planner booking and premium upgrades.' },
    { id: '6', layer: 'Double-entry Accounting', tool: 'Wave Apps', cost: 0, status: 'active', url: 'https://waveapps.com', notes: 'Manages bookkeeping, invoices, and zero-fee transactions.' },
  ]);

  // Form states for adding custom tool
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLayer, setNewLayer] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newCost, setNewCost] = useState('0');
  const [newNotes, setNewNotes] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Interactive Checklist states from localStorage
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    vercel: false,
    supabase: false,
    sanity: false,
    tracxn: false,
    letsventure: false,
    wave: false,
    apollo: false,
    hubspot: false,
    telemetry: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saarthi_stack_checklist');
      if (saved) {
        try { setChecklist(JSON.parse(saved)); } catch {}
      }
    }
  }, []);

  const toggleCheckItem = (key: string) => {
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_stack_checklist', JSON.stringify(updated));
    }
  };

  const totalCost = items.reduce((acc, curr) => acc + (curr.status === 'active' ? curr.cost : 0), 0);

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool || !newLayer) return;

    const newItem: StackItem = {
      id: Date.now().toString(),
      layer: newLayer,
      tool: newTool,
      cost: parseFloat(newCost) || 0,
      status: 'active',
      url: newUrl || '#',
      notes: newNotes,
    };

    setItems([...items, newItem]);
    setShowAddForm(false);
    setNewLayer('');
    setNewTool('');
    setNewCost('0');
    setNewNotes('');
    setNewUrl('');
  };

  const handleDeleteTool = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleStatus = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' } : item));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🛠️ Startup Stack & Cost Controller</h1>
        <p className={styles.pageSubtitle}>Maintain high velocity and zero runway burn using the $20/month 2026 stack</p>
      </div>

      {/* Hero Cost Card */}
      <div className={styles.statsRow}>
        <div className={styles.statCard} style={{ flex: 1, minWidth: '280px', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
          <p className={styles.statLabel}>MONTHLY RUNWAY BURN</p>
          <p className={styles.statValue} style={{ fontSize: '32px', color: '#2DD4BF' }}>${totalCost.toFixed(2)} <span style={{ fontSize: '14px', color: '#94A3B8' }}>/ month</span></p>
          <div className={styles.statDelta} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} color="#10B981" />
            {totalCost <= 20 ? 'Optimal Efficiency Mode active' : 'Nearing threshold - audit stack'}
          </div>
        </div>

        <div className={styles.statCard} style={{ flex: 2, minWidth: '280px' }}>
          <p className={styles.statLabel}>BURN LEVEL METRIC</p>
          <div style={{ width: '100%', height: '8px', background: '#1E293B', borderRadius: '4px', marginTop: '16px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${Math.min((totalCost / 50) * 100, 100)}%`,
              height: '100%',
              background: totalCost <= 20 ? '#2DD4BF' : totalCost <= 40 ? '#F59E0B' : '#EF4444',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <p style={{ fontSize: '11px', color: '#64748B', marginTop: '10px', margin: 0 }}>
            {totalCost <= 20 ? 'Excellent. You are leveraging serverless free tiers correctly.' : 'Warning: Tool creep detected. Audit stack to increase capital efficiency.'}
          </p>
        </div>
      </div>

      {/* Tech Stack Controller */}
      <div className={styles.chartCard} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#F1F5F9', margin: 0 }}>
              🚀 Live Stack Directory
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>Manage active developer tools, APIs, and monthly subscriptions</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={styles.btnSecondary}
            style={{ padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
          >
            <Plus size={14} /> Add Custom Tool
          </button>
        </div>

        {/* Add custom tool form */}
        {showAddForm && (
          <form onSubmit={handleAddTool} style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#F1F5F9', margin: 0 }}>Add New Stack Subscription</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="Layer (e.g. Hosting, Analytics)" 
                value={newLayer} 
                onChange={e => setNewLayer(e.target.value)}
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#F1F5F9', fontSize: '12px' }}
                required
              />
              <input 
                type="text" 
                placeholder="Tool Name (e.g. Hotjar, PostHog)" 
                value={newTool} 
                onChange={e => setNewTool(e.target.value)}
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#F1F5F9', fontSize: '12px' }}
                required
              />
              <input 
                type="number" 
                placeholder="Monthly Cost ($)" 
                value={newCost} 
                onChange={e => setNewCost(e.target.value)}
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#F1F5F9', fontSize: '12px' }}
              />
              <input 
                type="text" 
                placeholder="Reference URL (https://...)" 
                value={newUrl} 
                onChange={e => setNewUrl(e.target.value)}
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#F1F5F9', fontSize: '12px' }}
              />
            </div>
            <textarea 
              placeholder="Description of tool usage in Saarthi..." 
              value={newNotes} 
              onChange={e => setNewNotes(e.target.value)}
              rows={2}
              style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#F1F5F9', fontSize: '12px', resize: 'none', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className={styles.btnSecondary} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>Cancel</button>
              <button type="submit" className={styles.btnPrimary} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px' }}>Save Tool</button>
            </div>
          </form>
        )}

        {/* Stack Grid Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: item.status === 'active' ? '#0F172A' : 'rgba(15, 23, 42, 0.3)', borderRadius: '12px', border: `1px solid ${item.status === 'active' ? '#1E293B' : 'transparent'}`, flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', letterSpacing: '0.4px' }}>{item.layer}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: item.status === 'active' ? '#F1F5F9' : '#64748B', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {item.tool}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#94A3B8' }}><ArrowUpRight size={12} /></a>
                </span>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '4px 0 0', lineHeight: 1.4 }}>{item.notes}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>EST. COST</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: item.status === 'active' ? '#F1F5F9' : '#64748B' }}>
                    {item.cost === 0 ? 'Free Tier' : `$${item.cost}/mo`}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={() => toggleStatus(item.id)}
                    style={{
                      background: item.status === 'active' ? '#1E293B' : '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: item.status === 'active' ? '#2DD4BF' : '#64748B',
                      cursor: 'pointer',
                      fontWeight: 700
                    }}
                  >
                    {item.status === 'active' ? 'Active' : 'Disabled'}
                  </button>

                  <button 
                    onClick={() => handleDeleteTool(item.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px', padding: '6px', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Checklist & Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Startup Launch Checklist */}
        <div className={styles.chartCard} style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="#E9801D" /> Launch Readiness Checklist
          </h3>
          <p style={{ fontSize: '11.5px', color: '#94A3B8', marginBottom: '16px' }}>Verify operational setup to complete your launch checklist.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { key: 'vercel', label: 'Connect code repository to Vercel global CDN' },
              { key: 'supabase', label: 'Initialize Supabase production tables & schemas' },
              { key: 'sanity', label: 'Configure Sanity content schema & build Studio' },
              { key: 'tracxn', label: 'Register Saarthi profile on Tracxn.com' },
              { key: 'letsventure', label: 'Create active LetsVenture fund-raising listing' },
              { key: 'wave', label: 'Initialize Wave Accounting system' },
              { key: 'apollo', label: 'Build target investor list inside Apollo.io' },
              { key: 'hubspot', label: 'Connect CRM to capture leads & track DMs' },
              { key: 'telemetry', label: 'Verify active telemetry logging' },
            ].map(item => (
              <div 
                key={item.key} 
                onClick={() => toggleCheckItem(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  background: checklist[item.key] ? 'rgba(45, 212, 191, 0.05)' : '#0F172A',
                  border: `1px solid ${checklist[item.key] ? '#2DD4BF' : '#1E293B'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: `1px solid ${checklist[item.key] ? '#2DD4BF' : '#475569'}`,
                  background: checklist[item.key] ? '#2DD4BF' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0F172A',
                  fontSize: '11px',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {checklist[item.key] ? '✓' : ''}
                </div>
                <span style={{ fontSize: '12px', color: checklist[item.key] ? '#F1F5F9' : '#94A3B8', textDecoration: checklist[item.key] ? 'line-through' : 'none' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack Rules & Wisdom */}
        <div className={styles.chartCard} style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={16} color="#2DD4BF" /> Capital Efficiency Principles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#F1F5F9', display: 'block' }}>Postgres is Migration Resistant</strong>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Using Supabase allows you to write standard PostgreSQL. If scale demands migration, your database can be moved anywhere without vendor lock-in.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#F1F5F9', display: 'block' }}>Delay AWS / GCP Complexity</strong>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Avoid complex Kubernetes architectures or costly hosting configurations on day one. Start on Vercel & Supabase, and grow into raw cloud setups only when scale mandates it.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '12.5px', color: '#F1F5F9', display: 'block' }}>Monthly Stack Auditing</strong>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Every $20/month SaaS fee erodes runway. Conduct monthly tool audits to identify overlapping features and prune subscriptions that do not directly drive shipment or revenue.
                </span>
              </div>
            </div>

            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', display: 'flex', gap: '8px' }}>
              <ShieldAlert size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '11px', color: '#FCA5A5', margin: 0, lineHeight: 1.4 }}>
                <strong>Avoid Feature Over-Engineering:</strong> Build only what users actively utilize today. Leverage pre-built auth (Supabase Auth) and billing portals (Stripe Customer Portal) to ship features faster.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
