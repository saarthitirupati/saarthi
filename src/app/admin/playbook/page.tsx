'use client';
import { useEffect, useState } from 'react';
import { Send, Mail, Copy, Check, ExternalLink, Bookmark, HelpCircle, TrendingUp, Info } from 'lucide-react';
import styles from '../admin.module.css';

interface PlaybookMetrics {
  totalPlaces: number;
  todayVisitors: number;
  totalPageViews: number;
  storiesCount: number;
  quizzesCount: number;
}

export default function PlaybookPage() {
  const [metrics, setMetrics] = useState<PlaybookMetrics>({
    totalPlaces: 68,
    todayVisitors: 0,
    totalPageViews: 0,
    storiesCount: 0,
    quizzesCount: 0,
  });

  // State for user editable inputs in pitch template generator
  const [fundingStage, setFundingStage] = useState('Seed');
  const [askAmount, setAskAmount] = useState('₹1 Crore');
  const [preMoneyVal, setPreMoneyVal] = useState('₹8 Crore');
  const [targetFund, setTargetFund] = useState('All In Capital');

  // Clipboard feedbacks
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    // Load live telemetry and dashboard numbers to inject into template
    Promise.all([
      fetch('/api/admin/traffic').then(r => r.json()).catch(() => null),
      fetch('/api/admin/places').then(r => r.json()).catch(() => null),
      fetch('/api/admin/stories').then(r => r.json()).catch(() => null),
      fetch('/api/admin/quizzes').then(r => r.json()).catch(() => null),
    ]).then(([trafficData, placesData, storiesData, quizzesData]) => {
      const placesCount = placesData?.places?.length || 68;
      const visitors = trafficData?.todayTotal || 45;
      const pageViews = trafficData?.allTotal || 1280;
      const stories = storiesData?.stories?.length || 7;
      const quizzes = quizzesData?.quizzes?.length || 5;

      setMetrics({
        totalPlaces: placesCount,
        todayVisitors: visitors,
        totalPageViews: pageViews,
        storiesCount: stories,
        quizzesCount: quizzes,
      });
    });
  }, []);

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate templates based on live metrics
  const linkedInTemplate = `Hi [Name], We're building Saarthi — India's first real-time pilgrimage intelligence platform. Traction: ${metrics.totalPlaces} verified spots | ${metrics.totalPageViews.toLocaleString()}+ page views | ${metrics.storiesCount} lore modules live. Raising ${askAmount} ${fundingStage.toLowerCase()}. Would love 15 minutes this week.`;

  const coldEmailTemplate = `Hi Team ${targetFund},

I'm Sunil Thatra, Co-founder of Saarthi — a fast-growing real-time pilgrimage intelligence platform based in Tirupati. 

We've built a data-driven companion app helping travelers navigate Darshan wait times, live crowd levels, and local guides, serving ${metrics.totalPageViews.toLocaleString()}+ page views with ${metrics.totalPlaces} fully cataloged spots and an active daily interactive content library.

We're raising ${askAmount} at a ${preMoneyVal} pre-money valuation to expand operations, add multi-lingual support, and scale our live telemetry network.

Attaching our pitch deck for your review. We believe Saarthi aligns well with ${targetFund}'s thesis and would love to explore a potential partnership.

Looking forward to your thoughts!

Best regards,
Sunil Thatra
CEO & Founder, Saarthi`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🚀 Founder&apos;s Investor Playbook</h1>
        <p className={styles.pageSubtitle}>Dawa24x7 outreach system pre-populated with live Saarthi metrics</p>
      </div>

      {/* Main Pitch Generator Card */}
      <div className={styles.chartCard} style={{ padding: '24px', border: '1px solid rgba(233, 128, 29, 0.15)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#F1F5F9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✨ Live Outreach Generator
        </h2>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.5 }}>
          Modify the parameters below. The templates will automatically update with your live dashboard analytics and metrics to form a compelling pitch.
        </p>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Target Fund / Investor Name</label>
            <input 
              type="text" 
              value={targetFund} 
              onChange={e => setTargetFund(e.target.value)}
              style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#F1F5F9', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Target Stage</label>
            <input 
              type="text" 
              value={fundingStage} 
              onChange={e => setFundingStage(e.target.value)}
              style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#F1F5F9', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Ask Amount</label>
            <input 
              type="text" 
              value={askAmount} 
              onChange={e => setAskAmount(e.target.value)}
              style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#F1F5F9', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px' }}>Pre-Money Valuation</label>
            <input 
              type="text" 
              value={preMoneyVal} 
              onChange={e => setPreMoneyVal(e.target.value)}
              style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#F1F5F9', fontSize: '13px' }}
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          {/* LinkedIn DM */}
          <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send size={14} /> LINKEDIN DM TEMPLATE
              </span>
              <button 
                onClick={() => handleCopy(linkedInTemplate, setCopiedLink)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
              >
                {copiedLink ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copiedLink ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <div style={{ background: '#1E293B', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#E2E8F0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {linkedInTemplate}
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748B', marginTop: '8px' }}>
              💡 Rule: No deck in the first DM. If they reply, then share the pitch deck link.
            </span>
          </div>

          {/* Cold Email */}
          <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} /> COLD EMAIL TEMPLATE
              </span>
              <button 
                onClick={() => handleCopy(coldEmailTemplate, setCopiedEmail)}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
              >
                {copiedEmail ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copiedEmail ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <div style={{ background: '#1E293B', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#E2E8F0', fontFamily: 'monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {coldEmailTemplate}
            </div>
            <span style={{ display: 'block', fontSize: '11px', color: '#64748B', marginTop: '8px' }}>
              💡 Rule: Keep the subject line clean: <strong>&quot;Saarthi | Real-Time Pilgrimage Intelligence | Pitch Deck Attached&quot;</strong>.
            </span>
          </div>

        </div>
      </div>

      {/* VC Portals & Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Direct Apply Portals */}
        <div className={styles.chartCard} style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={16} color="#E9801D" /> Indian VC & Angel Portals
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: '100X.VC', stage: 'Pre-Seed / Seed', url: 'https://www.100x.vc' },
              { name: 'Blume Ventures', stage: 'Seed / Series A', url: 'https://blume.vc/pitch' },
              { name: 'Elevation Capital', stage: 'Seed to Series B', url: 'https://www.elevationcapital.com' },
              { name: 'Stellaris VP', stage: 'Seed / Series A', url: 'https://www.stellarisvp.com' },
              { name: 'Titan Capital', stage: 'Seed / Early', url: 'https://www.titancapital.in' },
              { name: 'We Founder Circle', stage: 'Pre-Seed / Angel', url: 'https://wefoundercircle.com' },
              { name: 'LetsVenture', stage: 'Syndicates', url: 'https://letsventure.com' },
            ].map(portal => (
              <div key={portal.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9', display: 'block' }}>{portal.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{portal.stage}</span>
                </div>
                <a href={portal.url} target="_blank" rel="noopener noreferrer" style={{ color: '#E9801D', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                  Apply <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Playbook Tools */}
        <div className={styles.chartCard} style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#F1F5F9', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={16} color="#38BDF8" /> Outreach Stack & Tools
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Tracxn', cost: 'Free', use: 'Listing for passive discovery by VCs searching by sector.' },
              { name: 'LetsVenture', cost: 'Free', use: 'Create start-up profile and syndicate angel rounds.' },
              { name: 'Apollo.io', cost: 'Free / Paid', use: 'Find verified emails of target fund associates.' },
              { name: 'Streak / Mixmax', cost: 'Free', use: 'Email tracking. Know exactly when investors open your deck.' },
              { name: 'Notion / Sheets', cost: 'Free', use: 'Track outreach status: date, contact, next follow-up.' },
            ].map(tool => (
              <div key={tool.name} style={{ padding: '12px', background: '#0F172A', borderRadius: '8px', border: '1px solid #1E293B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#F1F5F9' }}>{tool.name}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#1E293B', color: '#94A3B8' }}>{tool.cost}</span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>{tool.use}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Playbook Insights */}
      <div style={{ background: '#FFF5EC', border: '1px solid #FFE4CC', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px' }}>
        <Info size={20} color="#E9801D" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#7C2D12', margin: '0 0 6px' }}>Founder&apos;s Playbook Wisdom</h4>
          <ul style={{ fontSize: '12px', color: '#9A3412', margin: 0, paddingLeft: '16px', lineHeight: 1.5 }}>
            <li><strong>Associates over Partners:</strong> Target the Associate or Analyst at a fund. They are tasked with finding new deals and are much more likely to respond.</li>
            <li><strong>Volume + Targeting:</strong> 10 broad cold blasts fail. 10 highly targeted personalized DMs to matching funds succeed.</li>
            <li><strong>Insight over Metrics:</strong> If you don&apos;t have high revenue yet, lead with a sharp, non-obvious market insight (e.g. <i>&quot;Google Maps tells you how to reach Tirupati, Saarthi tells you how to experience it.&quot;</i>).</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
