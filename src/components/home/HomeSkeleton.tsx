'use client';

import React from 'react';

export function HomeSkeleton() {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', width: '100%', padding: '14px', boxSizing: 'border-box' }}>
      {/* Top Header & Greeting Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingTop: '8px' }}>
        <div>
          <div className="shimmer-wave" style={{ width: '120px', height: '14px', borderRadius: '6px', marginBottom: '6px' }}></div>
          <div className="shimmer-wave" style={{ width: '180px', height: '22px', borderRadius: '8px' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
      </div>

      {/* Layer 1: HomeHero Recommendation Card Skeleton */}
      <div style={{ width: '100%', minHeight: '190px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #ECE9E3', padding: '16px', boxSizing: 'border-box', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div className="shimmer-wave" style={{ width: '100px', height: '18px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ width: '70px', height: '18px', borderRadius: '12px' }}></div>
        </div>
        <div className="shimmer-wave" style={{ width: '85%', height: '20px', borderRadius: '6px', marginBottom: '8px' }}></div>
        <div className="shimmer-wave" style={{ width: '60%', height: '14px', borderRadius: '6px', marginBottom: '16px' }}></div>
        <div className="shimmer-wave" style={{ width: '100%', height: '44px', borderRadius: '14px' }}></div>
      </div>

      {/* Layer 2: QuickChecklist / SSD Token Card Skeleton */}
      <div style={{ width: '100%', minHeight: '140px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #ECE9E3', padding: '14px', boxSizing: 'border-box', marginBottom: '14px' }}>
        <div className="shimmer-wave" style={{ width: '130px', height: '16px', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
          <div className="shimmer-wave" style={{ height: '70px', borderRadius: '12px' }}></div>
        </div>
      </div>

      {/* Layer 3: Primary Services 2x2 Grid Skeleton */}
      <div style={{ marginBottom: '16px' }}>
        <div className="shimmer-wave" style={{ width: '140px', height: '18px', borderRadius: '6px', marginBottom: '10px' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
          <div className="shimmer-wave" style={{ height: '110px', borderRadius: '16px' }}></div>
        </div>
      </div>
    </div>
  );
}
