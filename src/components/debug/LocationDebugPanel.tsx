'use client';

import { useEffect, useState } from 'react';
import { calculateDrivingDistance } from '@/utils/location';
import { findNearestPlaceCandidates } from '@/lib/location';
import { PLACES } from '@/data/places';

interface DebugInfo {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  source?: string;
  nearestName: string;
  nearestDistMeters: number;
  drivingDistKm: number;
  nearestTier: string;
  nearestConfidence: number;
}

/**
 * Hidden developer debug panel.
 * Activate: tap the location pin 5× in quick succession,
 * or press Ctrl+Shift+D in desktop.
 */
export default function LocationDebugPanel({
  userLocation,
  accuracyMeters,
  locationSource,
}: {
  userLocation: { lat: number; lng: number } | null;
  accuracyMeters?: number;
  locationSource?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [debug, setDebug] = useState<DebugInfo | null>(null);

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') setVisible(v => !v);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Recompute whenever location changes
  useEffect(() => {
    if (!userLocation) return;
    const { lat, lng } = userLocation;

    const candidates = findNearestPlaceCandidates({ lat, lng }, PLACES, 50000);
    const nearest = candidates[0];
    if (!nearest) return;

    const { place, distanceMeters } = nearest;
    const isTirumala = place.coordinates.lat >= 13.66;
    const drivingDistKm = calculateDrivingDistance(lat, lng, place.coordinates.lat, place.coordinates.lng, isTirumala);

    setDebug({
      lat,
      lng,
      accuracyMeters,
      source: locationSource,
      nearestName: place.name,
      nearestDistMeters: distanceMeters,
      drivingDistKm,
      nearestTier: (place as any).verification?.tier ?? 'Gold',
      nearestConfidence: (place as any).verification?.confidenceScore ?? 90,
    });
  }, [userLocation, accuracyMeters, locationSource]);

  if (!visible || !debug) return null;

  const accuracyColor = (debug.accuracyMeters ?? 999) <= 20
    ? '#4ade80'
    : (debug.accuracyMeters ?? 999) <= 50
    ? '#facc15'
    : '#f87171';

  return (
    <div style={{
      position: 'fixed',
      bottom: '80px',
      left: '12px',
      zIndex: 9999,
      background: 'rgba(0,0,0,0.88)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '12px 16px',
      color: '#f8fafc',
      fontFamily: 'monospace',
      fontSize: '11px',
      lineHeight: '1.7',
      minWidth: '220px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa' }}>🔧 Saarthi Debug</span>
        <button
          onClick={() => setVisible(false)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
        >✕</button>
      </div>
      <Row label="GPS" value={`${debug.lat.toFixed(6)}, ${debug.lng.toFixed(6)}`} />
      <Row
        label="Accuracy"
        value={debug.accuracyMeters != null ? `±${debug.accuracyMeters} m` : 'unknown'}
        valueColor={accuracyColor}
      />
      <Row label="Source" value={debug.source ?? '—'} />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />
      <Row label="Nearest" value={debug.nearestName} />
      <Row label="Euclidean" value={`${debug.nearestDistMeters} m`} />
      <Row label="Driving est." value={`${debug.drivingDistKm.toFixed(1)} km`} />
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }} />
      <Row label="Tier" value={debug.nearestTier} valueColor="#fbbf24" />
      <Row label="Confidence" value={`${debug.nearestConfidence}%`} valueColor="#4ade80" />
      <div style={{ marginTop: '8px', color: '#64748b', fontSize: '10px' }}>Ctrl+Shift+D to hide</div>
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: valueColor ?? '#f8fafc', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
