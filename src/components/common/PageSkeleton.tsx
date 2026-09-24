'use client';

import React from 'react';

interface PageSkeletonProps {
  type?: 'list' | 'grid' | 'detail' | 'default';
  cardCount?: number;
}

export function PageSkeleton({ type = 'default', cardCount = 4 }: PageSkeletonProps) {
  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', width: '100%', padding: '16px', boxSizing: 'border-box' }}>
      {/* Top Bar Skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="shimmer-wave" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
          <div>
            <div className="shimmer-wave" style={{ width: '130px', height: '18px', borderRadius: '6px', marginBottom: '4px' }}></div>
            <div className="shimmer-wave" style={{ width: '80px', height: '12px', borderRadius: '4px' }}></div>
          </div>
        </div>
        <div className="shimmer-wave" style={{ width: '36px', height: '36px', borderRadius: '10px' }}></div>
      </div>

      {type === 'detail' ? (
        /* Detail Page Skeleton */
        <div>
          <div className="shimmer-wave" style={{ width: '100%', height: '220px', borderRadius: '24px', marginBottom: '16px' }}></div>
          <div className="shimmer-wave" style={{ width: '70%', height: '24px', borderRadius: '8px', marginBottom: '10px' }}></div>
          <div className="shimmer-wave" style={{ width: '40%', height: '14px', borderRadius: '6px', marginBottom: '20px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            <div className="shimmer-wave" style={{ height: '75px', borderRadius: '16px' }}></div>
            <div className="shimmer-wave" style={{ height: '75px', borderRadius: '16px' }}></div>
            <div className="shimmer-wave" style={{ height: '75px', borderRadius: '16px' }}></div>
          </div>
          <div className="shimmer-wave" style={{ width: '100%', height: '120px', borderRadius: '18px', marginBottom: '14px' }}></div>
          <div className="shimmer-wave" style={{ width: '100%', height: '120px', borderRadius: '18px' }}></div>
        </div>
      ) : type === 'grid' ? (
        /* Grid (Explore / Places) Skeleton */
        <div>
          {/* Search bar skeleton */}
          <div className="shimmer-wave" style={{ width: '100%', height: '46px', borderRadius: '14px', marginBottom: '16px' }}></div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', overflowX: 'hidden' }}>
            <div className="shimmer-wave" style={{ width: '80px', height: '32px', borderRadius: '9999px', flexShrink: 0 }}></div>
            <div className="shimmer-wave" style={{ width: '95px', height: '32px', borderRadius: '9999px', flexShrink: 0 }}></div>
            <div className="shimmer-wave" style={{ width: '85px', height: '32px', borderRadius: '9999px', flexShrink: 0 }}></div>
            <div className="shimmer-wave" style={{ width: '100px', height: '32px', borderRadius: '9999px', flexShrink: 0 }}></div>
          </div>
          {/* 2-column Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {Array.from({ length: cardCount }).map((_, idx) => (
              <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #ECE9E3', padding: '10px', boxSizing: 'border-box' }}>
                <div className="shimmer-wave" style={{ width: '100%', height: '110px', borderRadius: '14px', marginBottom: '10px' }}></div>
                <div className="shimmer-wave" style={{ width: '80%', height: '16px', borderRadius: '6px', marginBottom: '6px' }}></div>
                <div className="shimmer-wave" style={{ width: '50%', height: '12px', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div className="shimmer-wave" style={{ width: '100%', height: '28px', borderRadius: '8px' }}></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List / Essentials / Saved Skeleton */
        <div>
          {/* Filter/Tabs bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div className="shimmer-wave" style={{ width: '100px', height: '34px', borderRadius: '10px' }}></div>
            <div className="shimmer-wave" style={{ width: '100px', height: '34px', borderRadius: '10px' }}></div>
          </div>
          {/* List items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: cardCount }).map((_, idx) => (
              <div key={idx} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #ECE9E3', padding: '14px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div className="shimmer-wave" style={{ width: '72px', height: '72px', borderRadius: '14px', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div className="shimmer-wave" style={{ width: '75%', height: '16px', borderRadius: '6px', marginBottom: '8px' }}></div>
                  <div className="shimmer-wave" style={{ width: '50%', height: '12px', borderRadius: '4px', marginBottom: '8px' }}></div>
                  <div className="shimmer-wave" style={{ width: '30%', height: '10px', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PageSkeleton;
