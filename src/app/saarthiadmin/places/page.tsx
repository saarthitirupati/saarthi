'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './PlacesList.module.css';
import { 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  Eye, 
  MapPin, 
  Edit2, 
  Trash2, 
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import { PLACES } from '@/data/places';
import { Place } from '@/types/place';

export default function AdminPlacesList() {
  // Deduplicate by ID upfront — prevents Alipiri Mettu/Footpath duplication between static + DB data
  const dedup = (arr: Place[]) => {
    const seen = new Set<string>();
    return arr.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
  };

  const [places, setPlaces] = useState<Place[]>(dedup(PLACES));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const adminToken = typeof window !== 'undefined' ? (localStorage.getItem('saarthi_admin_token') || 'saarthi_admin_token_2026') : 'saarthi_admin_token_2026';
        const res = await fetch('/api/admin/places', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          },
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          if (data.places && data.places.length > 0) {
            // Merge DB over static, deduplicate by ID — DB record wins
            const dbMap = new Map(data.places.map((p: Place) => [p.id, p]));
            const merged = [...PLACES.map(p => dbMap.get(p.id) || p), ...data.places.filter((p: Place) => !PLACES.find(s => s.id === p.id))];
            setPlaces(dedup(merged));
          }
        }
      } catch (e) {
        console.error('Failed to fetch admin places:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(places.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [places]);

  // Normalize status to Title Case (handles PUBLISHED from DB)
  const normalizeStatus = (s?: string) => {
    if (!s) return 'Published';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = !query || 
        place.name.toLowerCase().includes(query) || 
        (place.category || '').toLowerCase().includes(query) || 
        place.location.toLowerCase().includes(query) ||
        (place.nameTe || '').includes(query);
      const catMatch = selectedCategory === 'All' || place.category === selectedCategory;
      const pubStatus = normalizeStatus(place.status);
      const statusMatch = selectedStatus === 'All' || pubStatus === selectedStatus || (selectedStatus === 'Verified' && place.verification?.status === 'Verified');
      return nameMatch && catMatch && statusMatch;
    });
  }, [places, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => {
    const total = places.length;
    const published = places.filter(p => normalizeStatus(p.status) === 'Published' || p.verification?.status === 'Verified').length;
    const iconic = places.filter(p => p.importanceLevel === 'Iconic' || p.isMustVisit).length;
    return { total, published, iconic, filtered: filteredPlaces.length };
  }, [places, filteredPlaces]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/places/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlaces(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete place');
      }
    } catch (e: any) {
      alert(`Error deleting place: ${e.message}`);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Places Directory &amp; Editor</h1>
          <p className={styles.subtitle}>
            Managing {places.length} sacred Tirupati &amp; Tirumala shrines, precinct maps &amp; Master Template attributes
          </p>
        </div>
        <Link 
          href="/saarthiadmin/places/new" 
          className={styles.primaryButton}
        >
          <Plus size={18} />
          <span>Add New Place</span>
        </Link>
      </div>

      {/* ── Metric Summary Bar ── */}
      <div className={styles.summaryBar}>
        <div className={styles.summaryPill}>
          <span>Total Shrines:</span>
          <span className={styles.summaryNum}>{stats.total}</span>
        </div>
        <div className={styles.summaryPill} style={{ borderColor: '#BBF7D0', color: '#166534' }}>
          <CheckCircle size={13} color="#16A34A" />
          <span>Published:</span>
          <span className={styles.summaryNum}>{stats.published}</span>
        </div>
        <div className={styles.summaryPill} style={{ borderColor: '#FDE68A', color: '#B45309' }}>
          <Star size={13} color="#D97706" />
          <span>Iconic Spots:</span>
          <span className={styles.summaryNum}>{stats.iconic}</span>
        </div>
        <div className={styles.summaryPill}>
          <span>Showing:</span>
          <span className={styles.summaryNum}>{stats.filtered}</span>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by shrine name, Telugu, category, or hill..." 
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select 
            className={styles.select}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select 
            className={styles.select}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by operational status"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Review">Review</option>
            <option value="Draft">Draft</option>
            <option value="Verified">TTD/Ground Verified</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '40px 20px', textAlign: 'center', margin: '20px 0' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>No shrines found</div>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
            No destinations matched your search query "{searchQuery}" in category "{selectedCategory}".
          </p>
          <button
            onClick={resetFilters}
            style={{ backgroundColor: '#0F5132', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Desktop Table View (>= 768px) ── */}
      {filteredPlaces.length > 0 && (
        <div className={styles.desktopTableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Place &amp; Coordinates</th>
                <th>Category</th>
                <th>Importance</th>
                <th>Status</th>
                <th>Reason to Visit</th>
                <th className={styles.actions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlaces.map(place => {
                const pubStatus = normalizeStatus(place.status);
                const isVerified = place.verification?.status === 'Verified' || (place.rating && place.rating >= 4.6);
                const lat = place.coordinates?.lat || 13.6288;
                const lng = place.coordinates?.lng || 79.4192;
                const isIconic = place.importanceLevel === 'Iconic' || place.isMustVisit;
                
                return (
                  <tr key={place.id}>
                    <td className={styles.nameCell}>
                      <strong>{place.name}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} color="#64748B" /> {place.location} • {lat.toFixed(4)}, {lng.toFixed(4)}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '11.5px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#334155', whiteSpace: 'nowrap' }}>
                        {place.category || 'Shrine'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                        background: isIconic ? '#FEF3C7' : '#E0F2FE',
                        color: isIconic ? '#B45309' : '#0284C7',
                        whiteSpace: 'nowrap'
                      }}>
                        {place.importanceLevel || (isIconic ? 'Iconic' : 'Recommended')}
                      </span>
                    </td>
                    <td>
                      {isVerified ? (
                        <span className={styles.badgeSuccess}><CheckCircle size={12}/> {pubStatus}</span>
                      ) : (
                        <span className={styles.badgeWarning}><Clock size={12}/> {pubStatus}</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: '#475569', maxWidth: '260px' }}>
                      <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                        {place.oneReasonToVisit || place.description}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Link href={`/place/${place.id}`} target="_blank" className={styles.viewLink} title="View public page">
                          <Eye size={12} />
                          <span>View</span>
                        </Link>
                        <Link href={`/saarthiadmin/places/${place.id}`} className={styles.editLink} title="Edit place attributes">
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </Link>
                        <button 
                          onClick={() => handleDelete(place.id, place.name)}
                          className={styles.deleteBtn}
                          title="Delete place"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Mobile Responsive Card View (Samsung Galaxy Screens < 768px) ── */}
      {filteredPlaces.length > 0 && (
        <div className={styles.mobileCardList}>
          {filteredPlaces.map(place => {
            const pubStatus = normalizeStatus(place.status);
            const isVerified = place.verification?.status === 'Verified' || (place.rating && place.rating >= 4.6);
            const lat = place.coordinates?.lat || 13.6288;
            const lng = place.coordinates?.lng || 79.4192;
            const isIconic = place.importanceLevel === 'Iconic' || place.isMustVisit;

            return (
              <div key={place.id} className={styles.mobileCard}>
                <div className={styles.mobileCardTop}>
                  <div style={{ minWidth: 0 }}>
                    <div className={styles.mobileCardTitle}>{place.name}</div>
                    <div className={styles.mobileLocationRow} style={{ marginTop: '2px' }}>
                      <MapPin size={11} color="#64748B" />
                      <span>{place.location} • {lat.toFixed(4)}, {lng.toFixed(4)}</span>
                    </div>
                  </div>

                  {isVerified ? (
                    <span className={styles.badgeSuccess}><CheckCircle size={11} /> {pubStatus}</span>
                  ) : (
                    <span className={styles.badgeWarning}><Clock size={11} /> {pubStatus}</span>
                  )}
                </div>

                <div className={styles.mobilePillsRow}>
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 7px', borderRadius: '5px', background: '#F1F5F9', color: '#334155' }}>
                    {place.category || 'Shrine'}
                  </span>
                  <span style={{ 
                    fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '5px',
                    background: isIconic ? '#FEF3C7' : '#E0F2FE',
                    color: isIconic ? '#B45309' : '#0284C7'
                  }}>
                    {place.importanceLevel || (isIconic ? 'Iconic' : 'Recommended')}
                  </span>
                </div>

                {(place.oneReasonToVisit || place.description) && (
                  <div className={styles.mobileReasonText}>
                    {place.oneReasonToVisit || place.description}
                  </div>
                )}

                <div className={styles.mobileActionsBar}>
                  <Link href={`/place/${place.id}`} target="_blank" className={`${styles.mobileBtn} ${styles.mobileBtnView}`}>
                    <Eye size={13} />
                    <span>View</span>
                  </Link>

                  <Link href={`/saarthiadmin/places/${place.id}`} className={`${styles.mobileBtn} ${styles.mobileBtnEdit}`}>
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </Link>

                  <button 
                    onClick={() => handleDelete(place.id, place.name)}
                    className={`${styles.mobileBtn} ${styles.mobileBtnDelete}`}
                    title="Delete place"
                    aria-label={`Delete ${place.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
