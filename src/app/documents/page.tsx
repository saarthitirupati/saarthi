'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, AlertTriangle, Fingerprint, FileText, Smartphone, 
  Printer, Shirt, Users, CheckCircle2, Ban
} from 'lucide-react';

export default function RequiredDocumentsPage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Header */}
      <header style={{ 
        padding: '24px 20px', 
        background: '#FFFFFF', 
        borderBottom: '1px solid #F1F5F9',
        position: 'sticky', 
        top: 0, 
        zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => router.push('/')} 
            style={{ 
              background: '#F1F5F9', 
              border: 'none', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} color="#0F172A" />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Required Documents
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
              Critical rules for Darshan entry
            </p>
          </div>
        </div>
      </header>

      <div style={{ padding: '20px' }}>

        {/* 🚨 CRITICAL NOTICE BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
          border: '1px solid rgba(225, 29, 72, 0.2)',
          borderRadius: '24px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(225, 29, 72, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <AlertTriangle size={24} color="#E11D48" strokeWidth={2.5} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#9F1239', margin: 0 }}>
              Critical Checklist Before You Ascend
            </h2>
          </div>
          <ul style={{ 
            paddingLeft: '0', 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            listStyle: 'none'
          }}>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E11D48', marginTop: '7px' }} />
              <div>
                <strong style={{ color: '#BE123C', fontSize: '14px' }}>Original Government ID Card:</strong>
                <p style={{ color: '#9F1239', fontSize: '13px', margin: '2px 0 0 0', lineHeight: 1.5 }}>Aadhaar Card is highly preferred and mandatory for local services.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E11D48', marginTop: '7px' }} />
              <div>
                <strong style={{ color: '#BE123C', fontSize: '14px' }}>Printed Copy of Darshan Ticket:</strong>
                <p style={{ color: '#9F1239', fontSize: '13px', margin: '2px 0 0 0', lineHeight: 1.5 }}>Digital PDFs on smartphones are sometimes rejected at main temple queue entrances; a physical printout is necessary.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E11D48', marginTop: '7px' }} />
              <div>
                <strong style={{ color: '#BE123C', fontSize: '14px' }}>Strict Traditional Dress:</strong>
                <p style={{ color: '#9F1239', fontSize: '13px', margin: '2px 0 0 0', lineHeight: 1.5 }}>Devotees in western clothes will be turned away at security points.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* 🆔 IDENTITY DOCUMENTS */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '4px' }}>
            <FileText size={20} color="#3B82F6" strokeWidth={2.5} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Required Documents Breakdown
            </h2>
          </div>
          
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #F1F5F9',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Primary Identity</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>Original Physical Aadhaar Card for every single family member traveling.</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#3B82F6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Alternative Identity</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>Original Passport (for NRI pilgrims), PAN card, or Voter ID if Aadhaar is missing.</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Printer size={20} color="#8B5CF6" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Ticket Format</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>Strictly Physical Paper Printouts. Ensure barcodes are printed cleanly. Do not rely entirely on your mobile phone screen, as battery drain or network signal drop is common inside the hill complexes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 👗 OFFICIAL DRESS CODE RULES */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '4px' }}>
            <Shirt size={20} color="#F59E0B" strokeWidth={2.5} />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Official Tirumala Dress Code Rules
            </h2>
          </div>
          
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid #F1F5F9',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Users size={20} color="#0F172A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>For Men</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}><strong>Allowed:</strong> White or traditional colored Dhoti (Vesti) with an upper cloth (Uttariyam), or a simple Kurta-Pyjama.</p>
                  <p style={{ fontSize: '14px', color: '#BE123C', margin: '4px 0 0 0', lineHeight: 1.5 }}><strong>Banned:</strong> Western wear, jeans, T-shirts, shorts, tracksuits, or clothing with aggressive graphic prints.</p>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Users size={20} color="#0F172A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>For Women</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}><strong>Allowed:</strong> Traditional Saree, Half-Saree, or a Churidar/Salwar Kameez featuring a proper Dupatta (shawl).</p>
                  <p style={{ fontSize: '14px', color: '#BE123C', margin: '4px 0 0 0', lineHeight: 1.5 }}><strong>Banned:</strong> Jeans, trousers, skirts, sleeveless tops, tight western wear, or transparent clothing.</p>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Users size={20} color="#0F172A" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Children</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.5 }}>Must also be dressed in modest, traditional attire when crossing checking points.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
