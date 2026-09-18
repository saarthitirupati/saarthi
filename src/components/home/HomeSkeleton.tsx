'use client';

import React from 'react';

export function HomeSkeleton() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', width: '100%', padding: '14px', boxSizing: 'border-box' }} className="animate-pulse">
      {/* Top Header & Greeting Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px' }}>
        <div>
          <div style={{ width: '120px', height: '14px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginBottom: '6px' }}></div>
          <div style={{ width: '180px', height: '22px', backgroundColor: '#CBD5E1', borderRadius: '8px' }}></div>
        </div>
        <div style={{ width: '38px', height: '38px', backgroundColor: '#E2E8F0', borderRadius: '50%' }}></div>
      </div>

      {/* Layer 1: HomeHero Recommendation Card Skeleton */}
      <div style={{ width: '100%', height: '190px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #F1F5F9', padding: '16px', boxSizing: 'border-box', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ width: '100px', height: '18px', backgroundColor: '#E2E8F0', borderRadius: '12px' }}></div>
          <div style={{ width: '70px', height: '18px', backgroundColor: '#E2E8F0', borderRadius: '12px' }}></div>
        </div>
        <div style={{ width: '85%', height: '20px', backgroundColor: '#CBD5E1', borderRadius: '6px', marginBottom: '8px' }}></div>
        <div style={{ width: '60%', height: '14px', backgroundColor: '#E2E8F0', borderRadius: '6px', marginBottom: '16px' }}></div>
        <div style={{ width: '100%', height: '44px', backgroundColor: '#FEF3C7', borderRadius: '14px' }}></div>
      </div>

      {/* Layer 2: QuickChecklist / SSD Token Card Skeleton */}
      <div style={{ width: '100%', height: '140px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F1F5F9', padding: '14px', boxSizing: 'border-box', marginBottom: '14px' }}>
        <div style={{ width: '130px', height: '16px', backgroundColor: '#CBD5E1', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div style={{ height: '70px', backgroundColor: '#F1F5F9', borderRadius: '12px' }}></div>
          <div style={{ height: '70px', backgroundColor: '#F1F5F9', borderRadius: '12px' }}></div>
          <div style={{ height: '70px', backgroundColor: '#F1F5F9', borderRadius: '12px' }}></div>
        </div>
      </div>

      {/* Layer 3: Primary Services 2x2 Grid Skeleton */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ width: '140px', height: '18px', backgroundColor: '#CBD5E1', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ height: '110px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9' }}></div>
          <div style={{ height: '110px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9' }}></div>
          <div style={{ height: '110px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9' }}></div>
          <div style={{ height: '110px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9' }}></div>
        </div>
      </div>
    </div>
  );
}
