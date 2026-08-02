'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Pencil, Trash2, ArrowLeft, Save, BookOpen, ExternalLink } from 'lucide-react';
import styles from '../admin.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  
  // Form State
  const [editMode, setEditMode] = useState<'create' | 'edit' | null>(null);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    subtitle: '',
    snippet: '',
    content: '',
    image: '',
    readTime: '3 min read',
    category: 'mythology',
    keyTakeaway: '',
    relatedTemple: '',
    tags: '',
    isActive: true
  });

  const load = async () => {
    setLoading(true);
    try {
      const sRes = await fetch('/api/admin/stories');
      const sData = await sRes.json();
      setStories(sData.stories || []);

      const pRes = await fetch('/api/admin/places');
      const pData = await pRes.json();
      setPlaces(pData.places || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (story: any) => {
    setSelectedStory(story);
    setForm({
      id: story.id,
      title: story.title,
      slug: story.slug || '',
      subtitle: story.subtitle || '',
      snippet: story.snippet || '',
      content: story.fullText || '',
      image: story.image || '',
      readTime: story.readTime || '3 min read',
      category: story.category || 'mythology',
      keyTakeaway: story.keyTakeaway || '',
      relatedTemple: story.relatedTemple || '',
      tags: (story.tags || []).join(', '),
      isActive: story.isActive !== false
    });
    setEditMode('edit');
  };

  const handleCreate = () => {
    setSelectedStory(null);
    setForm({
      id: '',
      title: '',
      slug: '',
      subtitle: '',
      snippet: '',
      content: '',
      image: '',
      readTime: '3 min read',
      category: 'mythology',
      keyTakeaway: '',
      relatedTemple: '',
      tags: '',
      isActive: true
    });
    setEditMode('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    await fetch(`/api/admin/stories/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      relatedTemple: form.relatedTemple || null
    };

    const url = editMode === 'edit' ? `/api/admin/stories/${selectedStory.id}` : '/api/admin/stories';
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

  const filtered = stories.filter(s =>
    s.title.toLowerCase().includes(q.toLowerCase()) ||
    s.category?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      {editMode ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{editMode === 'edit' ? 'Edit Story' : 'New Story'}</h1>
              <p className={styles.pageSubtitle}>Cinematic spiritual stories catalog</p>
            </div>
            <button onClick={() => setEditMode(null)} className={styles.btnSecondary}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className={styles.tableCard} style={{ padding: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Story Title *</label>
                  <input
                    className={styles.formInput}
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="The Legend of Lord Balaji"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Category *</label>
                  <select
                    className={styles.formInput}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="temple_history">Temple History</option>
                    <option value="mythology">Mythology</option>
                    <option value="spiritual_lesson">Spiritual Lesson</option>
                    <option value="heritage">Tirupati Heritage</option>
                    <option value="hidden_story">Hidden Story</option>
                    <option value="saint">Saint Biography</option>
                    <option value="festival_origin">Festival Origin</option>
                    <option value="architecture">Architecture</option>
                    <option value="unknown_facts">Unknown Facts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Subtitle / Hook</label>
                <input
                  className={styles.formInput}
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="A cinematic journey into the divine descent of Vishnu..."
                />
              </div>

              <div>
                <label className={styles.formLabel}>Snippet (Shown in previews)</label>
                <textarea
                  className={styles.formInput}
                  rows={2}
                  value={form.snippet}
                  onChange={e => setForm({ ...form, snippet: e.target.value })}
                  placeholder="Brief 1-2 sentence description summarizing the story hook..."
                />
              </div>

              <div>
                <label className={styles.formLabel}>Story Content (Markdown or HTML)*</label>
                <textarea
                  className={styles.formInput}
                  required
                  rows={8}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Full text of the story..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Cover Image URL</label>
                  <input
                    className={styles.formInput}
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="/assets/temples/venkateswara.png"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Reading Time</label>
                  <input
                    className={styles.formInput}
                    value={form.readTime}
                    onChange={e => setForm({ ...form, readTime: e.target.value })}
                    placeholder="3 min read"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Related Temple (Optional)</label>
                  <select
                    className={styles.formInput}
                    value={form.relatedTemple}
                    onChange={e => setForm({ ...form, relatedTemple: e.target.value })}
                  >
                    <option value="">None</option>
                    {places.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Tags (comma separated)</label>
                  <input
                    className={styles.formInput}
                    value={form.tags}
                    onChange={e => setForm({ ...form, tags: e.target.value })}
                    placeholder="Vishnu, Miracles, Sacred"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className={styles.formLabel} style={{ marginBottom: 0 }}>Active & Published</label>
              </div>

              <button type="submit" className={styles.btnPrimary} style={{ alignSelf: 'flex-start' }}>
                <Save size={16} /> Save Story
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Spiritual Stories CMS</h1>
              <p className={styles.pageSubtitle}>
                {stories.length} stories listed · {stories.filter(s => s.isActive).length} published
              </p>
            </div>
            <button onClick={handleCreate} className={styles.btnPrimary}>
              <PlusCircle size={16} /> New Story
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.filterRow}>
              <div className={styles.searchBar}>
                <Search size={16} color="#4A5568" />
                <input
                  placeholder="Search stories by title, category..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 100, textAlign: 'center', color: '#64748B' }}>
                <p>Loading stories directory...</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Story</th>
                      <th>Category</th>
                      <th>Read Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(story => (
                      <tr key={story.id}>
                        <td>
                          <div className={styles.placeThumbCell}>
                            <div
                              className={styles.placeImg}
                              style={{ backgroundImage: `url(${story.image || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />
                            <div>
                              <p className={styles.placeCellName}>{story.title}</p>
                              <p className={styles.placeCellSub}>{story.subtitle || 'Spiritual lesson'}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className={`${styles.badge} ${styles.badgeBlue}`}>{story.category}</span></td>
                        <td>{story.readTime}</td>
                        <td>
                          <span className={`${styles.badge} ${story.isActive ? styles.badgeGreen : styles.badgeOrange}`}>
                            {story.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => handleEdit(story)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Pencil size={14} color="#94A3B8" />
                            </button>
                            <button onClick={() => handleDelete(story.id)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={14} color="#EF4444" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
