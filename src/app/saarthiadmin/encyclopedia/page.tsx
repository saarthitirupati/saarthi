'use client';
import { useEffect, useState } from 'react';
import { PlusCircle, Search, Pencil, Trash2, ArrowLeft, Save } from 'lucide-react';
import styles from '../admin.module.css';
import { motion } from 'framer-motion';

export default function AdminEncyclopedia() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  // Form State
  const [editMode, setEditMode] = useState<'create' | 'edit' | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [form, setForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'deity',
    keywords: '',
    content: '',
    summary: '',
    coverImage: '',
    referencesJson: '[]',
    isActive: true
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/encyclopedia');
      const data = await res.json();
      setArticles(data.encyclopedia || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (art: any) => {
    setSelectedArticle(art);
    setForm({
      id: art.id,
      title: art.title,
      slug: art.slug || '',
      category: art.category || 'deity',
      keywords: (art.keywords || []).join(', '),
      content: art.content || '',
      summary: art.summary || '',
      coverImage: art.coverImage || '',
      referencesJson: JSON.stringify(art.references || [], null, 2),
      isActive: art.isActive !== false
    });
    setEditMode('edit');
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setForm({
      id: '',
      title: '',
      slug: '',
      category: 'deity',
      keywords: '',
      content: '',
      summary: '',
      coverImage: '',
      referencesJson: '[\n  {\n    "title": "TTD Official Site",\n    "url": "https://www.tirumala.org"\n  }\n]',
      isActive: true
    });
    setEditMode('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    await fetch(`/api/admin/encyclopedia/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let refs = [];
    try {
      refs = JSON.parse(form.referencesJson);
    } catch (err) {
      alert('Invalid JSON in References. Please correct it.');
      return;
    }

    const payload = {
      ...form,
      keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
      references: refs
    };

    const url = editMode === 'edit' ? `/api/admin/encyclopedia/${selectedArticle.id}` : '/api/admin/encyclopedia';
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

  const filtered = articles.filter(art =>
    art.title.toLowerCase().includes(q.toLowerCase()) ||
    art.category?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      {editMode ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{editMode === 'edit' ? 'Edit Encyclopedia Article' : 'New Encyclopedia Article'}</h1>
              <p className={styles.pageSubtitle}>Historical facts & glossary CMS</p>
            </div>
            <button onClick={() => setEditMode(null)} className={styles.btnSecondary}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className={styles.tableCard} style={{ padding: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Article Title *</label>
                  <input
                    className={styles.formInput}
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Tirupati Laddu (Srivari Laddu)"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Category *</label>
                  <select
                    className={styles.formInput}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="deity">Deity / God</option>
                    <option value="prasadam">Prasadam / Food</option>
                    <option value="ritual">Ritual / Pooja</option>
                    <option value="architecture">Architecture / Spot</option>
                    <option value="geography">Geography / Hills</option>
                    <option value="culture">Culture / Music</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Summary / Meta Description</label>
                <input
                  className={styles.formInput}
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  placeholder="A brief 1-sentence synopsis of the article..."
                />
              </div>

              <div>
                <label className={styles.formLabel}>Content (Markdown / HTML)*</label>
                <textarea
                  className={styles.formInput}
                  required
                  rows={8}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Full detailed historical/spiritual explanations..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Search Keywords (comma separated) *</label>
                  <input
                    className={styles.formInput}
                    required
                    value={form.keywords}
                    onChange={e => setForm({ ...form, keywords: e.target.value })}
                    placeholder="laddu, prasadam, sweet, potu"
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Cover Image URL</label>
                  <input
                    className={styles.formInput}
                    value={form.coverImage}
                    onChange={e => setForm({ ...form, coverImage: e.target.value })}
                    placeholder="/assets/temples/venkateswara.png"
                  />
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>References (JSON Array)*</label>
                <textarea
                  className={styles.formInput}
                  required
                  rows={4}
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                  value={form.referencesJson}
                  onChange={e => setForm({ ...form, referencesJson: e.target.value })}
                  placeholder="[]"
                />
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
                <Save size={16} /> Save Article
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Temple Encyclopedia CMS</h1>
              <p className={styles.pageSubtitle}>
                {articles.length} articles listed · {articles.filter(a => a.isActive).length} published
              </p>
            </div>
            <button onClick={handleCreate} className={styles.btnPrimary}>
              <PlusCircle size={16} /> New Article
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.filterRow}>
              <div className={styles.searchBar}>
                <Search size={16} color="#4A5568" />
                <input
                  placeholder="Search articles by title, category..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 100, textAlign: 'center', color: '#64748B' }}>
                <p>Loading encyclopedia directory...</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Category</th>
                      <th>Keywords</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(art => (
                      <tr key={art.id}>
                        <td>
                          <div className={styles.placeThumbCell}>
                            <div
                              className={styles.placeImg}
                              style={{ backgroundImage: `url(${art.coverImage || 'https://images.unsplash.com/photo-1514222134-b57cbf8ce673?auto=format&fit=crop&q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />
                            <div>
                              <p className={styles.placeCellName}>{art.title}</p>
                              <p className={styles.placeCellSub}>{art.summary || 'Glossary description'}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className={`${styles.badge} ${styles.badgeBlue}`}>{art.category}</span></td>
                        <td>
                          <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {(art.keywords || []).join(', ')}
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${art.isActive ? styles.badgeGreen : styles.badgeOrange}`}>
                            {art.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => handleEdit(art)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Pencil size={14} color="#94A3B8" />
                            </button>
                            <button onClick={() => handleDelete(art.id)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
