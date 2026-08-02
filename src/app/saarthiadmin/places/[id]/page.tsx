'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './PlaceEditor.module.css';
import { ArrowLeft, Save, MapPin, Image as ImageIcon, Sparkles, Check, Clock, Eye, Trash2, Plus } from 'lucide-react';
import { PLACE_TYPES, CATEGORIES } from '@/constants/categories';
import { PLACES } from '@/data/places';

export default function AdminPlaceEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  
  // Form State
  const [form, setForm] = useState<any>({
    id: '',
    name: '',
    category: 'Spiritual',
    placeType: 'spiritual',
    location: '',
    address: '',
    distanceKms: 0,
    durationMins: 60,
    lat: 13.6288,
    lng: 79.4192,
    image: '',
    images: [] as string[],
    openingTime: '6:00 AM',
    closingTime: '9:00 PM',
    timings: '',
    entryFee: 'Free',
    entryFeeNum: 0,
    description: '',
    history: '',
    shortIntro: '',
    whyVisit: '',
    oneReasonToVisit: '',
    isMustVisit: false,
    isHiddenGem: false,
    verificationStatus: 'Verified',
    tags: '',
    practicalInfo: { dressCode: 'Casual', food: 'Nearby', parking: 'Available', lockers: 'Available' }
  });

  useEffect(() => {
    async function loadPlace() {
      try {
        const res = await fetch(`/api/admin/places/${id}`);
        let p = null;
        if (res.ok) {
          const data = await res.json();
          p = data.place;
        } else {
          // Fallback to static data if not in DB (FastAPI returns 404)
          const staticPlace = PLACES.find((place: any) => place.id === id);
          if (staticPlace) p = staticPlace;
        }

        if (p) {
          setForm({
            id: p.id || id,
            name: p.name || '',
            category: p.category || 'Spiritual',
            placeType: p.placeType || 'spiritual',
            location: p.location || '',
            address: p.address || '',
            distanceKms: p.distanceKms || 0,
            durationMins: p.durationMins || 60,
            lat: p.coordinates?.lat || 13.6288,
            lng: p.coordinates?.lng || 79.4192,
            image: p.image || '',
            images: Array.isArray(p.images) ? p.images : (p.images ? String(p.images).split(',') : []),
            openingTime: p.openingTime || '6:00 AM',
            closingTime: p.closingTime || '9:00 PM',
            timings: p.timings || '',
            entryFee: p.entryFee || 'Free',
            entryFeeNum: p.entryFeeNum || 0,
            description: p.description || '',
            history: p.history || '',
            shortIntro: p.shortIntro || '',
            whyVisit: p.whyVisit || '',
            oneReasonToVisit: p.oneReasonToVisit || p.shortIntro || '',
            isMustVisit: !!p.isMustVisit,
            isHiddenGem: !!p.isHiddenGem,
            verificationStatus: p.verification?.status || (p.rating >= 4.5 ? 'Verified' : 'Pending'),
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
            practicalInfo: p.practicalInfo || { dressCode: 'Casual', food: 'Nearby', parking: 'Available', lockers: 'Available' }
          });
        }
      } catch (err) {
        console.error('Failed to load place:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlace();
  }, [id]);

  const set = (field: string, val: any) => setForm((f: any) => ({ ...f, [field]: val }));

  const handleAddGalleryImage = () => {
    const url = prompt('Enter Image URL:');
    if (url && url.trim()) {
      setForm((f: any) => ({ ...f, images: [...f.images, url.trim()] }));
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setForm((f: any) => ({
      ...f,
      images: f.images.filter((_: any, idx: number) => idx !== index)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        distanceKms: Number(form.distanceKms),
        durationMins: Number(form.durationMins),
        entryFeeNum: Number(form.entryFeeNum),
        coordinates: { lat: Number(form.lat), lng: Number(form.lng) },
        tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags,
        verification: { status: form.verificationStatus }
      };

      const res = await fetch(`/api/admin/places/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setToast('✓ Place updated successfully!');
        setTimeout(() => setToast(''), 3500);
        router.refresh();
      } else {
        alert('Failed to save place updates');
      }
    } catch (err: any) {
      alert(`Error saving place: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading place editor...</div>;
  }

  return (
    <div className={styles.editorContainer}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#16A34A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          fontWeight: 700,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          zIndex: 9999
        }}>
          {toast}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/saarthiadmin/places" className={styles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.title}>Edit Place: {form.name}</h1>
            <p className={styles.subtitle}>ID: {form.id}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={`/place/${form.id}`} target="_blank" className={styles.backButton} style={{ width: 'auto', padding: '0 16px', textDecoration: 'none', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            <Eye size={16} /> Live View
          </Link>
          <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          {/* Section 1: Basic Information */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Place Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.name} 
                onChange={(e) => set('name', e.target.value)} 
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select} value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Place Type</label>
                <select className={styles.select} value={form.placeType} onChange={(e) => set('placeType', e.target.value)}>
                  {PLACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Location / Region</label>
                <input type="text" className={styles.input} value={form.location} onChange={(e) => set('location', e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Distance from Tirupati Center (km)</label>
                <input type="number" step="0.1" className={styles.input} value={form.distanceKms} onChange={(e) => set('distanceKms', e.target.value)} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Short Intro / Teaser</label>
              <input type="text" className={styles.input} value={form.shortIntro} onChange={(e) => set('shortIntro', e.target.value)} placeholder="Brief one-line summary" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>History & Legends</label>
              <textarea className={styles.textarea} rows={3} value={form.history} onChange={(e) => set('history', e.target.value)} />
            </div>
          </section>

          {/* Section 2: Media & Photo Management */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} color="#2563EB" /> Media & Photos
            </h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Cover Photo URL</label>
              <input 
                type="text" 
                className={styles.input} 
                value={form.image} 
                onChange={(e) => set('image', e.target.value)}
                placeholder="/assets/temples/kapila-theertham.png or https://..." 
              />
            </div>

            {/* Cover Photo Preview */}
            {form.image && (
              <div style={{ marginBottom: '20px' }}>
                <span className={styles.label} style={{ marginBottom: '6px', display: 'block' }}>Cover Photo Preview</span>
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '12px',
                  backgroundImage: `url(${form.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid #E2E8F0'
                }} />
              </div>
            )}

            {/* Gallery Photos */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label className={styles.label} style={{ margin: 0 }}>Gallery Photos ({form.images.length})</label>
                <button 
                  type="button"
                  onClick={handleAddGalleryImage} 
                  style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Gallery Photo
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                {form.images.map((imgUrl: string, idx: number) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0', height: '100px' }}>
                    <div style={{ width: '100%', height: '100%', backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <button 
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220, 38, 38, 0.85)', color: '#FFF', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Timings & Entry */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Timings & Entry</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Opening Time</label>
                <input type="text" className={styles.input} value={form.openingTime} onChange={(e) => set('openingTime', e.target.value)} placeholder="e.g. 6:00 AM" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Closing Time</label>
                <input type="text" className={styles.input} value={form.closingTime} onChange={(e) => set('closingTime', e.target.value)} placeholder="e.g. 9:00 PM" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Entry Fee Text</label>
                <input type="text" className={styles.input} value={form.entryFee} onChange={(e) => set('entryFee', e.target.value)} placeholder="Free / ₹300 Special Entry" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Entry Fee Amount (₹)</label>
                <input type="number" className={styles.input} value={form.entryFeeNum} onChange={(e) => set('entryFeeNum', e.target.value)} />
              </div>
            </div>
          </section>
        </div>

        <div className={styles.sideColumn}>
          {/* Sidebar Section 1: Coordinates Management */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#D97706" /> Coordinates
            </h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Latitude</label>
              <input 
                type="number" 
                step="0.000001" 
                className={styles.input} 
                value={form.lat} 
                onChange={(e) => set('lat', e.target.value)} 
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Longitude</label>
              <input 
                type="number" 
                step="0.000001" 
                className={styles.input} 
                value={form.lng} 
                onChange={(e) => set('lng', e.target.value)} 
              />
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${form.lat},${form.lng}`} 
              target="_blank" 
              rel="noreferrer"
              style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
            >
              📍 Test Coordinates on Google Maps &rarr;
            </a>
          </section>

          {/* Sidebar Section 2: Publishing & Status */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Publishing Status</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Verification Status</label>
              <select className={styles.select} value={form.verificationStatus} onChange={(e) => set('verificationStatus', e.target.value)}>
                <option value="Verified">Verified (Ground Checked)</option>
                <option value="Pending">Pending Review</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={form.isMustVisit} 
                  onChange={(e) => set('isMustVisit', e.target.checked)} 
                /> 
                ⭐ Mark as Must-Visit
              </label>

              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={form.isHiddenGem} 
                  onChange={(e) => set('isHiddenGem', e.target.checked)} 
                /> 
                💎 Mark as Hidden Gem
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
