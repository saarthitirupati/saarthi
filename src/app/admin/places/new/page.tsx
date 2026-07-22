'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Sparkles, Clock, Compass, Coins, ShieldAlert } from 'lucide-react';
import styles from '../../admin.module.css';
import { motion } from 'framer-motion';

import { PLACE_TYPES, CATEGORIES, INTERESTS_ALL } from '@/constants/categories';

const EMPTY = {
  name:'', category:'Core Temple', placeType:'spiritual' as any, location:'', distanceKms:0,
  durationMins:60, budgetLevel:'medium' as any, entryFeeNum:0, entryFee:'Free',
  interests:[] as string[], openFrom:6, openTo:20, isMustVisit:false,
  description:'', history:'', timings:'', address:'', rating:4.0, reviewCount:0,
  bestTime:'Morning', tags:'' as any, image:'', video: '',
  lat:13.6288, lng:79.4192,
  shortIntro: '', whyVisit: '', openingTime: '6:00 AM', closingTime: '9:00 PM',
  duration: '1-2 hours', travelByRTC: '', travelByCar: '', travelByBike: '',
  approxRTCFare: '', approxCarCost: '', approxBikeCost: '', images: '',
  tipDressCode: '', tipCrowdNote: '', tipFootwearRule: '', tipPhotoRule: '', tipEntryRule: ''
};

export default function AddPlace() {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState('');
  const router = useRouter();

  const set = (field: string, val: any) => setForm(f => ({ ...f, [field]: val }));

  const toggleInterest = (i: string) =>
    set('interests', form.interests.includes(i)
      ? form.interests.filter(x => x !== i)
      : [...form.interests, i]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const body = {
      ...form,
      distanceKms: +form.distanceKms,
      durationMins: +form.durationMins,
      entryFeeNum: +form.entryFeeNum,
      openFrom: +form.openFrom,
      openTo: +form.openTo,
      rating: +form.rating,
      reviewCount: +form.reviewCount,
      coordinates: { lat: +form.lat, lng: +form.lng },
      tags: String(form.tags).split(',').map(t => t.trim()).filter(Boolean),
      images: form.images ? String(form.images).split(',').map(t => t.trim()).filter(Boolean) : [],
      travelEstimates: {},
      practicalInfo: { dressCode: form.tipDressCode || 'Casual', food: 'Nearby', parking: 'Available' },
      visitorTips: {
        dressCode: form.tipDressCode || undefined,
        crowdNote: form.tipCrowdNote || undefined,
        footwearRule: form.tipFootwearRule || undefined,
        photoRule: form.tipPhotoRule || undefined,
        entryRule: form.tipEntryRule || undefined,
      }
    };
    
    const res = await fetch('/api/admin/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    setSaving(false);
    if (res.ok) {
      setToast('✓ Place added! Visible in Explore now.');
      setTimeout(() => { setToast(''); router.push('/admin/places'); }, 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {toast && <div className={styles.successToast}>{toast}</div>}

      <div className={styles.topRow}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Add New Place</h1>
          <p className={styles.pageSubtitle}>Publish a new trusted place guide</p>
        </div>
        <Link href="/admin/places" className={styles.btnSecondary}>
          <ArrowLeft size={15} /> Back
        </Link>
      </div>

      <form onSubmit={submit}>
        {/* Basic Info */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><Sparkles size={16} /> Basic Information</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Name <span className={styles.required}>*</span></label>
              <input className={styles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kapila Theertham" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Location / Area <span className={styles.required}>*</span></label>
              <input className={styles.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Tirupati Town" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Place Type</label>
              <select className={styles.select} value={form.placeType} onChange={e => set('placeType', e.target.value)}>
                {PLACE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Short Intro (2-3 sentences)</label>
              <textarea className={styles.textarea} value={form.shortIntro} onChange={e => set('shortIntro', e.target.value)} placeholder="Explain briefly why this place is important." rows={2} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Description <span className={styles.required}>*</span></label>
              <textarea className={styles.textarea} value={form.description} onChange={e => set('description', e.target.value)} placeholder="What makes this place special?" required rows={3} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Story & History Summary</label>
              <textarea className={styles.textarea} value={form.history} onChange={e => set('history', e.target.value)} placeholder="Historical or cultural legend..." rows={3} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Why Visit (Matters Card)</label>
              <textarea className={styles.textarea} value={form.whyVisit} onChange={e => set('whyVisit', e.target.value)} placeholder="What is the significance or spiritual essence?" rows={2} />
            </div>
          </div>
        </div>

        {/* Timings & Duration */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><Clock size={16} /> Timings & Duration</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Opening Time</label>
              <input className={styles.input} value={form.openingTime} onChange={e => set('openingTime', e.target.value)} placeholder="e.g. 6:00 AM" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Closing Time</label>
              <input className={styles.input} value={form.closingTime} onChange={e => set('closingTime', e.target.value)} placeholder="e.g. 9:00 PM" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Best Time to Visit (Slot)</label>
              <input className={styles.input} value={form.bestTime} onChange={e => set('bestTime', e.target.value)} placeholder="e.g. Morning / Evening" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Average Visit Duration</label>
              <input className={styles.input} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 2 hours" />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><ImageIcon size={16} /> Media Assets</p>
          <div className={styles.formGrid}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Cover Image URL <span className={styles.required}>*</span></label>
              <input className={styles.input} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://... or /assets/places/..." required />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>

            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.label}>Gallery Image URLs (comma-separated)</label>
              <textarea className={styles.textarea} value={form.images} onChange={e => set('images', e.target.value)} rows={2} placeholder="URL1, URL2, URL3" />
            </div>
          </div>
        </div>

        {/* Location & Travel */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><Compass size={16} /> Directions & Travel Options</p>
          <div className={styles.formGrid3} style={{ marginBottom: 15 }}>
            <div className={styles.field}>
              <label className={styles.label}>Latitude</label>
              <input className={styles.input} type="number" step="0.0001" value={form.lat} onChange={e => set('lat', e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Longitude</label>
              <input className={styles.input} type="number" step="0.0001" value={form.lng} onChange={e => set('lng', e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Distance (km)</label>
              <input className={styles.input} type="number" step="0.1" value={form.distanceKms} onChange={e => set('distanceKms', e.target.value)} />
            </div>
          </div>
          <div className={styles.formGrid}>
            <div className={`${styles.field} ${styles.fieldFull}`}><label className={styles.label}>Travel by RTC / Bus</label><textarea className={styles.textarea} value={form.travelByRTC} onChange={e => set('travelByRTC', e.target.value)} rows={2} placeholder="Bus route and frequency..." /></div>
            <div className={`${styles.field} ${styles.fieldFull}`}><label className={styles.label}>Travel by Car</label><textarea className={styles.textarea} value={form.travelByCar} onChange={e => set('travelByCar', e.target.value)} rows={2} placeholder="Driving route and highway guide..." /></div>
            <div className={`${styles.field} ${styles.fieldFull}`}><label className={styles.label}>Travel by Bike</label><textarea className={styles.textarea} value={form.travelByBike} onChange={e => set('travelByBike', e.target.value)} rows={2} placeholder="Bike ride guidelines..." /></div>
          </div>
        </div>

        {/* Fares & Estimates */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><Coins size={16} /> Travel Cost Estimates</p>
          <div className={styles.formGrid}>
            <div className={styles.field}><label className={styles.label}>Entry Fee / Darshan Fee</label><input className={styles.input} value={form.entryFee} onChange={e => set('entryFee', e.target.value)} placeholder="e.g. Free / ₹300" /></div>
            <div className={styles.field}><label className={styles.label}>Approx RTC Bus Fare</label><input className={styles.input} value={form.approxRTCFare} onChange={e => set('approxRTCFare', e.target.value)} placeholder="e.g. ₹65 one-way" /></div>
            <div className={styles.field}><label className={styles.label}>Approx Car Travel Cost</label><input className={styles.input} value={form.approxCarCost} onChange={e => set('approxCarCost', e.target.value)} placeholder="e.g. ₹500 fuel / ₹2000 taxi" /></div>
            <div className={styles.field}><label className={styles.label}>Approx Bike Travel Cost</label><input className={styles.input} value={form.approxBikeCost} onChange={e => set('approxBikeCost', e.target.value)} placeholder="e.g. ₹150 petrol" /></div>
          </div>
        </div>

        {/* Visitor Rules & Tips */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><ShieldAlert size={16} /> Visitor Tips & Guidelines</p>
          <div className={styles.formGrid}>
            <div className={styles.field}><label className={styles.label}>Dress Code</label><input className={styles.input} value={form.tipDressCode} onChange={e => set('tipDressCode', e.target.value)} placeholder="e.g. Traditional wear mandatory" /></div>
            <div className={styles.field}><label className={styles.label}>Crowd Warning Note</label><input className={styles.input} value={form.tipCrowdNote} onChange={e => set('tipCrowdNote', e.target.value)} placeholder="e.g. Heavy rush on weekends" /></div>
            <div className={styles.field}><label className={styles.label}>Footwear Rules</label><input className={styles.input} value={form.tipFootwearRule} onChange={e => set('tipFootwearRule', e.target.value)} placeholder="e.g. Must deposit at gate counters" /></div>
            <div className={styles.field}><label className={styles.label}>Photography Rules</label><input className={styles.input} value={form.tipPhotoRule} onChange={e => set('tipPhotoRule', e.target.value)} placeholder="e.g. Prohibited inside temple" /></div>
            <div className={`${styles.field} ${styles.fieldFull}`}><label className={styles.label}>Entry & Queue Rules</label><input className={styles.input} value={form.tipEntryRule} onChange={e => set('tipEntryRule', e.target.value)} placeholder="e.g. Carry ID card copy" /></div>
          </div>
        </div>

        {/* Interests */}
        <div className={styles.formCard}>
          <p className={styles.formSection}><Sparkles size={16} /> Traveler Interests</p>
          <div className={styles.interestGrid}>
            {INTERESTS_ALL.map(i => (
              <button
                key={i} type="button"
                className={`${styles.interestChip} ${form.interests.includes(i) ? styles.interestChipActive : ''}`}
                onClick={() => toggleInterest(i)}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formActions}>
          <Link href="/admin/places" className={styles.btnSecondary}>Cancel</Link>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            <Save size={15} /> {saving ? 'Publishing…' : 'Publish Place'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
