'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Database, MapPin, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', padding: '20px 16px 60px', fontFamily: 'var(--font-body, sans-serif)', color: '#0F172A' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              color: '#0F172A',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Privacy Policy</h1>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Last updated: August 2026</p>
          </div>
        </div>

        {/* Introduction Card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShieldCheck size={24} color="#0F5132" />
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#0F5132' }}>Our Commitment to Pilgrim Privacy</h2>
          </div>
          <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
            Saarthi Guide (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Pilgrim Companion application is designed with privacy-first principles to provide helpful, real-time guidance for pilgrims visiting Tirupati, Tirumala, and surrounding sacred shrines.
          </p>
        </div>

        {/* Section 1: Information Collection */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Database size={20} color="#D97706" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>1. Information We Collect</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', lineHeight: '1.55', color: '#334155' }}>
            <div>
              <strong style={{ color: '#0F172A' }}>a. Location Data (Optional):</strong>
              <p style={{ margin: '4px 0 0' }}>
                With your explicit permission, Saarthi accesses your device&apos;s GPS location strictly to calculate real-time driving distances and walking times to nearby temples, lockers, and pilgrim amenities. Your precise location is processed locally on your device and is never stored on or transmitted to external servers.
              </p>
            </div>
            <div>
              <strong style={{ color: '#0F172A' }}>b. Local Preferences & Storage:</strong>
              <p style={{ margin: '4px 0 0' }}>
                Saved places, itinerary checklists, and language preferences (English / Telugu) are stored locally on your device via browser LocalStorage.
              </p>
            </div>
            <div>
              <strong style={{ color: '#0F172A' }}>c. No Personal Information Sale:</strong>
              <p style={{ margin: '4px 0 0' }}>
                We do not collect names, phone numbers, email addresses, or government ID numbers. We do not sell, rent, or monetize any user data.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: How We Use Information */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Lock size={20} color="#0F5132" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>2. How Information is Used</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6', color: '#334155' }}>
            <li>To display verified temple timings, wait times, and crowd advisories.</li>
            <li>To guide devotees to nearby free amenities (lockers, tonsure, Annaprasadam).</li>
            <li>To deliver critical live alerts regarding weather, ghat roads, or temple crowd surges.</li>
          </ul>
        </div>

        {/* Section 3: Third-Party Services & Map Links */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <MapPin size={20} color="#2563EB" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>3. Third-Party Navigation & Links</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: 0 }}>
            When you choose to navigate to a temple or service, the app may open Google Maps or external transport services. Please refer to the privacy policies of respective external map providers for their data practices.
          </p>
        </div>

        {/* Section 4: Contact */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Mail size={20} color="#0F172A" />
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>4. Contact & Developer Support</h3>
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#334155', margin: '0 0 10px' }}>
            For privacy inquiries, questions, or corrections regarding temple information, contact:
          </p>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F5132' }}>
            support@saarthiguide.in
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
            ← Back to Saarthi Home
          </Link>
        </div>
      </div>
    </div>
  );
}
