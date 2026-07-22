'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import styles from './PlacesList.module.css';
import { Search, Plus, CheckCircle, Clock, Eye, Sparkles, Filter } from 'lucide-react';
import { PLACES } from '@/data/places';
import { Place } from '@/types/place';

export default function AdminPlacesList() {
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch('/api/admin/places');
        if (res.ok) {
          const data = await res.json();
          if (data.places && data.places.length > 0) {
            setPlaces(data.places);
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
    const set = new Set(places.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const query = searchQuery.toLowerCase().trim();
      const nameMatch = !query || place.name.toLowerCase().includes(query) || place.category.toLowerCase().includes(query) || place.location.toLowerCase().includes(query);
      const catMatch = selectedCategory === 'All' || place.category === selectedCategory;
      const pubStatus = place.status || 'Published';
      const statusMatch = selectedStatus === 'All' || pubStatus === selectedStatus || (selectedStatus === 'Verified' && place.verification?.status === 'Verified');
      return nameMatch && catMatch && statusMatch;
    });
  }, [places, searchQuery, selectedCategory, selectedStatus]);

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Master Places Directory (v1.1)</h1>
          <p className={styles.subtitle}>Managing {places.length} Master Template Destinations & Decision Support Data</p>
        </div>
        <Link 
          href="/admin/places/new" 
          style={{ textDecoration: 'none' }}
          className={styles.primaryButton}
        >
          <Plus size={18} /> Add New Place
        </Link>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search places by name, category, or location..." 
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
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <select 
            className={styles.select}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Review">Review</option>
            <option value="Draft">Draft</option>
            <option value="Verified">TTD/Ground Verified</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Place Name & Coordinates</th>
              <th>Category</th>
              <th>Importance</th>
              <th>Status</th>
              <th>One Reason to Visit</th>
              <th className={styles.actions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map(place => {
              const pubStatus = place.status || 'Published';
              const isVerified = place.verification?.status === 'Verified' || place.rating >= 4.6;
              const lat = place.coordinates?.lat || 13.6288;
              const lng = place.coordinates?.lng || 79.4192;
              
              return (
                <tr key={place.id}>
                  <td className={styles.nameCell}>
                    <strong>{place.name}</strong>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      📍 {place.location} • {lat.toFixed(4)}, {lng.toFixed(4)}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#334155' }}>
                      {place.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                      background: place.importanceLevel === 'Iconic' ? '#FEF3C7' : '#E0F2FE',
                      color: place.importanceLevel === 'Iconic' ? '#B45309' : '#0284C7'
                    }}>
                      {place.importanceLevel || (place.isMustVisit ? 'Iconic' : 'Recommended')}
                    </span>
                  </td>
                  <td>
                    {isVerified ? (
                      <span className={styles.badgeSuccess}><CheckCircle size={14}/> {pubStatus}</span>
                    ) : (
                      <span className={styles.badgeWarning}><Clock size={14}/> {pubStatus}</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {place.oneReasonToVisit || place.description}
                  </td>
                  <td className={styles.actionsCell}>
                    <Link href={`/place/${place.id}`} target="_blank" className={styles.editLink} style={{ marginRight: '8px', color: '#0284C7' }}>
                      <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} /> View
                    </Link>
                    <Link href={`/admin/places/${place.id}`} className={styles.editLink} style={{ marginRight: '8px' }}>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(place.id, place.name)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
