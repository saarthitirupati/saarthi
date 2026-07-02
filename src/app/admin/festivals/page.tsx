'use client';
import { useEffect, useState } from 'react';
import { PlusCircle, Search, Pencil, Trash2, ArrowLeft, Save } from 'lucide-react';
import styles from '../admin.module.css';
import { motion } from 'framer-motion';

export default function AdminFestivals() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  // Form State
  const [editMode, setEditMode] = useState<'create' | 'edit' | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<any>(null);
  const [form, setForm] = useState({
    id: '',
    slug: '',
    name: '',
    description: '',
    festival_type: 'Spiritual',
    date: '',
    gravity_score: 5,
    crowd_level: 'Moderate',
    recommended_time: '',
    dress_code: '',
    parking_status: 'Available',
    visitor_notes: '',
    is_major: true,
    image_url: '',
    status: 'Upcoming'
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/festivals');
      const data = await res.json();
      setFestivals(data.festivals || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (festival: any) => {
    setSelectedFestival(festival);
    // Format date YYYY-MM-DD from database date
    let rawDate = festival.date || '';
    if (rawDate && rawDate.includes('T')) {
      rawDate = rawDate.split('T')[0];
    }
    setForm({
      id: festival.id,
      slug: festival.slug || '',
      name: festival.name,
      description: festival.description || '',
      festival_type: festival.festival_type || 'Spiritual',
      date: rawDate,
      gravity_score: festival.gravity_score || 5,
      crowd_level: festival.crowd_level || 'Moderate',
      recommended_time: festival.recommended_time || '',
      dress_code: festival.dress_code || '',
      parking_status: festival.parking_status || 'Available',
      visitor_notes: festival.visitor_notes || '',
      is_major: festival.is_major !== false,
      image_url: festival.image_url || '',
      status: festival.status || 'Upcoming'
    });
    setEditMode('edit');
  };

  const handleCreate = () => {
    setSelectedFestival(null);
    setForm({
      id: '',
      slug: '',
      name: '',
      description: '',
      festival_type: 'Spiritual',
      date: new Date().toISOString().split('T')[0],
      gravity_score: 5,
      crowd_level: 'Moderate',
      recommended_time: '',
      dress_code: '',
      parking_status: 'Available',
      visitor_notes: '',
      is_major: true,
      image_url: '',
      status: 'Upcoming'
    });
    setEditMode('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this festival?')) return;
    await fetch(`/api/admin/festivals/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      gravity_score: Number(form.gravity_score)
    };

    const url = editMode === 'edit' ? `/api/admin/festivals/${selectedFestival.id}` : '/api/admin/festivals';
    const method = editMode === 'edit' ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setEditMode(null);
      load();
    } else {
      const err = await res.json();
      alert(`Error: ${err.error}`);
    }
  };

  const filtered = festivals.filter(f =>
    f.name.toLowerCase().includes(q.toLowerCase()) ||
    f.festival_type?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      {editMode ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{editMode === 'edit' ? 'Edit Festival' : 'New Festival'}</h1>
              <p className={styles.pageSubtitle}>Calendar events and crowd projections CMS</p>
            </div>
            <button onClick={() => setEditMode(null)} className={styles.btnSecondary}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className={styles.tableCard} style={{ padding: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Festival Name *</label>
                  <input
                    className={styles.formInput}
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Srivari Salakatla Brahmotsavams"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Type / Category *</label>
                  <select
                    className={styles.formInput}
                    value={form.festival_type}
                    onChange={e => setForm({ ...form, festival_type: e.target.value })}
                  >
                    <option value="Spiritual">Spiritual</option>
                    <option value="Temple Festival">Temple Festival</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formInput}
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="The grandest annual celebration of Lord Venkateswara..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Festival Date *</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Event Status *</label>
                  <select
                    className={styles.formInput}
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live / Ongoing</option>
                    <option value="Past">Past</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Gravity Score (1-10 magnitude) *</label>
                  <select
                    className={styles.formInput}
                    value={form.gravity_score}
                    onChange={e => setForm({ ...form, gravity_score: Number(e.target.value) })}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(s => (
                      <option key={s} value={s}>{s} {s >= 8 ? '(High Crowd Impact)' : s >= 5 ? '(Moderate)' : '(Low)'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Crowd Level *</label>
                  <select
                    className={styles.formInput}
                    value={form.crowd_level}
                    onChange={e => setForm({ ...form, crowd_level: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="EXTREME">EXTREME</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Parking Status *</label>
                  <select
                    className={styles.formInput}
                    value={form.parking_status}
                    onChange={e => setForm({ ...form, parking_status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="LIMITED">LIMITED</option>
                    <option value="VERY LIMITED">VERY LIMITED</option>
                    <option value="FULL">FULL</option>
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Recommended Time to Arrive</label>
                  <input
                    className={styles.formInput}
                    value={form.recommended_time}
                    onChange={e => setForm({ ...form, recommended_time: e.target.value })}
                    placeholder="3:00 AM - 11:00 PM"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Dress Code</label>
                  <input
                    className={styles.formInput}
                    value={form.dress_code}
                    onChange={e => setForm({ ...form, dress_code: e.target.value })}
                    placeholder="Traditional (Mandatory)"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Cover Image URL</label>
                  <input
                    className={styles.formInput}
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    placeholder="/assets/festivals/brahmotsavam.jpg"
                  />
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Visitor Notes & Special Tips</label>
                <textarea
                  className={styles.formInput}
                  rows={2}
                  value={form.visitor_notes}
                  onChange={e => setForm({ ...form, visitor_notes: e.target.value })}
                  placeholder="Expect severe blockages on Ghat roads. Book SED tickets months in advance..."
                />
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="isMajor"
                  checked={form.is_major}
                  onChange={e => setForm({ ...form, is_major: e.target.checked })}
                />
                <label htmlFor="isMajor" className={styles.formLabel} style={{ marginBottom: 0 }}>Show as Major / Highlighted Event</label>
              </div>

              <button type="submit" className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} /> Save Festival
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Festivals Center CMS</h1>
              <p className={styles.pageSubtitle}>
                {festivals.length} events listed · {festivals.filter(f => f.status === 'Upcoming').length} upcoming
              </p>
            </div>
            <button onClick={handleCreate} className={styles.btnPrimary}>
              <PlusCircle size={16} /> New Festival
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.filterRow}>
              <div className={styles.searchBar}>
                <Search size={16} color="#4A5568" />
                <input
                  placeholder="Search events by name, type..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 100, textAlign: 'center', color: '#64748B' }}>
                <p>Loading festivals directory...</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Crowd</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(fest => {
                      let dateStr = fest.date || '';
                      if (dateStr && dateStr.includes('T')) dateStr = dateStr.split('T')[0];
                      return (
                        <tr key={fest.id}>
                          <td>
                            <div className={styles.placeThumbCell}>
                              <div
                                className={styles.placeImg}
                                style={{ backgroundImage: `url(${fest.image_url || '/assets/ai/hero_spiritual_sunset.png'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                              />
                              <div>
                                <p className={styles.placeCellName}>{fest.name}</p>
                                <p className={styles.placeCellSub}>{fest.location || 'Tirupati'}</p>
                              </div>
                            </div>
                          </td>
                          <td><span className={`${styles.badge} ${styles.badgeBlue}`}>{fest.festival_type}</span></td>
                          <td>{dateStr}</td>
                          <td>
                            <span className={`${styles.badge} ${fest.crowd_level === 'EXTREME' ? styles.badgeOrange : styles.badgeBlue}`}>
                              {fest.crowd_level} (G: {fest.gravity_score})
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.badge} ${fest.status === 'Live' ? styles.badgeGreen : styles.status === 'Upcoming' ? styles.badgeBlue : styles.badgeOrange}`}>
                              {fest.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <button onClick={() => handleEdit(fest)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Pencil size={14} color="#94A3B8" />
                              </button>
                              <button onClick={() => handleDelete(fest.id)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Trash2 size={14} color="#EF4444" />
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
          </div>
        </motion.div>
      )}
    </div>
  );
}
