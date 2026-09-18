'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, Search, X, Check, Compass, Building, Map, Sparkles, ChevronDown } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import { detectCoordinates, resolveLocationName, PRESET_LOCATIONS, type LocationOption } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';

export { PRESET_LOCATIONS, type LocationOption };

export interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocationName?: string;
  onSelectLocation?: (name: string, coords: { lat: number; lng: number }) => void;
}

export function LocationPickerModal({
  isOpen,
  onClose,
  selectedLocationName,
  onSelectLocation
}: LocationPickerModalProps) {
  const lang = useLanguage();
  const { setUserLocation, setLocationName, setLocationPermission, locationName } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'local' | 'planning'>('all');
  const [isLocating, setIsLocating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeName = selectedLocationName || locationName || 'Tirupati';

  const filteredLocations = useMemo(() => {
    return PRESET_LOCATIONS.filter((loc) => {
      // Tab filter
      if (activeTab === 'local' && loc.category === 'planning-city') return false;
      if (activeTab === 'planning' && loc.category !== 'planning-city') return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        loc.nameEn.toLowerCase().includes(q) ||
        loc.nameTe.toLowerCase().includes(q) ||
        loc.shortName.toLowerCase().includes(q) ||
        loc.subtextEn.toLowerCase().includes(q) ||
        loc.subtextTe.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeTab]);

  const handleSelectLocation = (loc: LocationOption) => {
    setUserLocation(loc.coords, 'manual');
    setLocationName(loc.shortName);
    setLocationPermission('granted');
    if (typeof window !== 'undefined') {
      localStorage.setItem('saarthi_user_region', loc.shortName);
    }
    if (onSelectLocation) {
      onSelectLocation(loc.shortName, loc.coords);
    }
    onClose();
  };

  const handleAutoDetectGPS = () => {
    setIsLocating(true);
    setStatusMessage(lang === 'te' ? 'జీపీఎస్ సిగ్నల్ శోధిస్తోంది...' : 'Acquiring high-accuracy GPS...');
    
    detectCoordinates(
      (coords, source) => {
        setIsLocating(false);
        setUserLocation(coords, source || 'gps');
        setLocationPermission('granted');
        
        const resolvedName = resolveLocationName(coords.lat, coords.lng);
        setLocationName(resolvedName);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('saarthi_user_region', resolvedName);
        }
        if (onSelectLocation) {
          onSelectLocation(resolvedName, coords);
        }
        onClose();
      },
      () => {
        setIsLocating(false);
        setStatusMessage(lang === 'te' ? 'జీపీఎస్ అనుమతించబడలేదు. దయచేసి క్రింద ఉన్న నగరాన్ని ఎంచుకోండి.' : 'GPS unavailable. Please select your city below.');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 20px 14px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#FEF3C7', border: '1px solid #FDE68A',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MapPin size={18} color="#B45309" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                {lang === 'te' ? 'మీ ప్రారంభ ప్రాంతాన్ని ఎంచుకోండి' : 'Choose Your Starting Location'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                {lang === 'te' ? 'సరియైన దూరం & మార్గ సమయం కోసం' : 'For accurate route times & recommendations'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              transition: 'background 0.2s'
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          
          {/* GPS Auto-Detect CTA Button */}
          <button
            onClick={handleAutoDetectGPS}
            disabled={isLocating}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: isLocating ? '#F0FDF4' : 'linear-gradient(135deg, #ECFDF5 0%, #E6FBF0 100%)',
              border: '1.5px solid #10B981',
              color: '#065F46',
              fontWeight: 800,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              marginBottom: '14px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
              transition: 'all 0.2s'
            }}
          >
            <Navigation size={17} className={isLocating ? 'animate-spin' : ''} style={{ color: '#059669' }} />
            <span>
              {isLocating 
                ? (lang === 'te' ? 'జీపీఎస్ సిగ్నల్ శోధిస్తోంది...' : 'Acquiring Live GPS...')
                : (lang === 'te' ? 'లైవ్ GPS లొకేషన్ ఉపయోగించు' : 'Use Current Live GPS Location')}
            </span>
          </button>

          {statusMessage && (
            <p style={{ fontSize: '12px', color: '#D97706', margin: '-6px 0 12px 0', textAlign: 'center', fontWeight: 600 }}>
              {statusMessage}
            </p>
          )}

          {/* Not on GPS Hint Card */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '10px 12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Sparkles size={16} color="#B45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
              {lang === 'te' 
                ? 'మీరు ప్రస్తుతం తిరుపతిలో లేకపోతే, ఇంటి నుండి ప్లాన్ చేయడానికి మీ ప్రారంభ నగరాన్ని ఎంచుకోండి.'
                : 'Not in Tirupati right now? Pick your starting city to calculate exact highway travel times and trip itineraries.'}
            </p>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#F1F5F9',
            borderRadius: '14px',
            padding: '8px 12px',
            marginBottom: '12px'
          }}>
            <Search size={16} color="#64748B" />
            <input 
              type="text"
              placeholder={lang === 'te' ? 'నగరం లేదా క్షేత్రం శోధించండి...' : 'Search city, station, or temple...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#0F172A',
                fontWeight: 600
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tab Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '2px' }}>
            {[
              { id: 'all', labelEn: 'All Places', labelTe: 'అన్ని ప్రాంతాలు' },
              { id: 'local', labelEn: 'Tirupati & Hills', labelTe: 'తిరుపతి & కొండపై' },
              { id: 'planning', labelEn: 'From Other Cities', labelTe: 'ఇతర నగరాల నుండి' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  border: activeTab === tab.id ? '1px solid #B45309' : '1px solid #E2E8F0',
                  background: activeTab === tab.id ? '#FEF3C7' : '#FFFFFF',
                  color: activeTab === tab.id ? '#92400E' : '#64748B',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                {lang === 'te' ? tab.labelTe : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Location List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredLocations.map((loc) => {
              const isSelected = activeName.toLowerCase() === loc.shortName.toLowerCase();
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelectLocation(loc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid #0F5132' : '1px solid #E2E8F0',
                    background: isSelected ? '#F0FDF4' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.15s, border 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: isSelected ? '#DCFCE7' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MapPin size={15} color={isSelected ? '#15803D' : '#64748B'} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {lang === 'te' ? loc.nameTe : loc.nameEn}
                      </p>
                      <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                        {lang === 'te' ? loc.subtextTe : loc.subtextEn}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: '#0F5132', color: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Check size={13} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredLocations.length === 0 && (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748B' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>
                  {lang === 'te' ? 'ఫలితాలు కనుగొనబడలేదు' : 'No locations found matching your search.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Drop-in Location Pill Button matching exact warm amber UI:
 * [📍 Location ⌄]
 */
export interface LocationPillProps {
  locationName: string;
  onClick: () => void;
  isGpsActive?: boolean;
  style?: React.CSSProperties;
}

/**
 * Drop-in Location Pill Button matching exact warm amber / emerald UI:
 * [📍 Location ⌄]
 */
export function LocationPill({
  locationName,
  onClick,
  isGpsActive = false,
  style
}: LocationPillProps) {
  const lang = useLanguage();
  
  // Look up Telugu name if language is set to Telugu
  const matchedLoc = PRESET_LOCATIONS.find(l => l.shortName.toLowerCase() === (locationName || 'Tirupati').toLowerCase());
  const displayName = lang === 'te' && matchedLoc ? matchedLoc.shortName : (locationName || 'Tirupati');

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Current starting location: ${displayName}. Click to change starting location.`}
      title={lang === 'te' ? 'ప్రారంభ ప్రాంతాన్ని మార్చండి' : 'Change Starting Location'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: isGpsActive ? '#ECFDF5' : '#FEF3C7',
        border: `1px solid ${isGpsActive ? '#A7F3D0' : '#FDE68A'}`,
        color: isGpsActive ? '#065F46' : '#92400E',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '11.5px',
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: isGpsActive 
          ? '0 1px 3px rgba(16, 185, 129, 0.12)' 
          : '0 1px 3px rgba(180, 83, 9, 0.08)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        flexShrink: 1,
        minWidth: '50px',
        overflow: 'hidden',
        transition: 'transform 0.16s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.16s, box-shadow 0.16s',
        outline: 'none',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.backgroundColor = isGpsActive ? '#D1FAE5' : '#FDE68A';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.backgroundColor = isGpsActive ? '#ECFDF5' : '#FEF3C7';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.96)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'none';
      }}
    >
      <MapPin size={12} color={isGpsActive ? '#059669' : '#B45309'} strokeWidth={2.2} style={{ flexShrink: 0 }} />
      <span style={{ 
        color: isGpsActive ? '#065F46' : '#92400E', 
        letterSpacing: '-0.01em', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        maxWidth: '110px'
      }}>
        {displayName}
      </span>
      <ChevronDown size={11} color={isGpsActive ? '#059669' : '#B45309'} strokeWidth={2.5} style={{ flexShrink: 0, opacity: 0.85 }} />
    </button>
  );
}
