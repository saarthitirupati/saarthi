'use client';
import { useEffect, useState } from 'react';
import { PlusCircle, Search, Pencil, Trash2, ArrowLeft, Save } from 'lucide-react';
import styles from '../admin.module.css';
import { motion } from 'framer-motion';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  // Form State
  const [editMode, setEditMode] = useState<'create' | 'edit' | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [form, setForm] = useState({
    id: '',
    question: '',
    difficulty: 'beginner',
    category: 'tirumala',
    image: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    relatedStory: '',
    relatedTemple: '',
    xpReward: 10,
    isActive: true
  });

  const load = async () => {
    setLoading(true);
    try {
      const qRes = await fetch('/api/admin/quizzes');
      const qData = await qRes.json();
      setQuizzes(qData.quizzes || []);

      const pRes = await fetch('/api/admin/places');
      const pData = await pRes.json();
      setPlaces(pData.places || []);

      const sRes = await fetch('/api/admin/stories');
      const sData = await sRes.json();
      setStories(sData.stories || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleEdit = (quiz: any) => {
    setSelectedQuiz(quiz);
    const opts = quiz.options || [];
    setForm({
      id: quiz.id,
      question: quiz.question,
      difficulty: quiz.difficulty || 'beginner',
      category: quiz.category || 'tirumala',
      image: quiz.image || '',
      optionA: opts.find((o: any) => o.id === 'A')?.text || '',
      optionB: opts.find((o: any) => o.id === 'B')?.text || '',
      optionC: opts.find((o: any) => o.id === 'C')?.text || '',
      optionD: opts.find((o: any) => o.id === 'D')?.text || '',
      correctAnswer: quiz.correctAnswer || 'A',
      explanation: quiz.explanation || '',
      relatedStory: quiz.relatedStory || '',
      relatedTemple: quiz.relatedTemple || '',
      xpReward: quiz.xpReward || 10,
      isActive: quiz.isActive !== false
    });
    setEditMode('edit');
  };

  const handleCreate = () => {
    setSelectedQuiz(null);
    setForm({
      id: '',
      question: '',
      difficulty: 'beginner',
      category: 'tirumala',
      image: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
      relatedStory: '',
      relatedTemple: '',
      xpReward: 10,
      isActive: true
    });
    setEditMode('create');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
    load();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      options: [
        { id: 'A', text: form.optionA },
        { id: 'B', text: form.optionB },
        { id: 'C', text: form.optionC },
        { id: 'D', text: form.optionD }
      ],
      xpReward: Number(form.xpReward),
      relatedStory: form.relatedStory || null,
      relatedTemple: form.relatedTemple || null
    };

    const url = editMode === 'edit' ? `/api/admin/quizzes/${selectedQuiz.id}` : '/api/admin/quizzes';
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

  const filtered = quizzes.filter(qz =>
    qz.question.toLowerCase().includes(q.toLowerCase()) ||
    qz.category?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      {editMode ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{editMode === 'edit' ? 'Edit Quiz Question' : 'New Quiz Question'}</h1>
              <p className={styles.pageSubtitle}>Gamified spiritual checkpoints CMS</p>
            </div>
            <button onClick={() => setEditMode(null)} className={styles.btnSecondary}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className={styles.tableCard} style={{ padding: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className={styles.formLabel}>Quiz Question *</label>
                <textarea
                  className={styles.formInput}
                  required
                  rows={2}
                  value={form.question}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                  placeholder="Which of these hills is Hanuman's birth place?"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Difficulty *</label>
                  <select
                    className={styles.formInput}
                    value={form.difficulty}
                    onChange={e => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner (10 XP)</option>
                    <option value="intermediate">Intermediate (20 XP)</option>
                    <option value="expert">Expert (30 XP)</option>
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>Category *</label>
                  <select
                    className={styles.formInput}
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="tirumala">Tirumala</option>
                    <option value="temples">Temples</option>
                    <option value="mythology">Mythology</option>
                    <option value="culture">Andhra Culture</option>
                    <option value="festivals">Festivals</option>
                    <option value="architecture">Architecture</option>
                    <option value="history">History</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: 20, borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <p className={styles.formLabel} style={{ fontWeight: 600, color: '#F1F5F9' }}>Multiple Choice Options</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: 12 }}>Option A *</label>
                    <input
                      className={styles.formInput}
                      required
                      value={form.optionA}
                      onChange={e => setForm({ ...form, optionA: e.target.value })}
                      placeholder="Option A text"
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: 12 }}>Option B *</label>
                    <input
                      className={styles.formInput}
                      required
                      value={form.optionB}
                      onChange={e => setForm({ ...form, optionB: e.target.value })}
                      placeholder="Option B text"
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: 12 }}>Option C *</label>
                    <input
                      className={styles.formInput}
                      required
                      value={form.optionC}
                      onChange={e => setForm({ ...form, optionC: e.target.value })}
                      placeholder="Option C text"
                    />
                  </div>
                  <div>
                    <label className={styles.formLabel} style={{ fontSize: 12 }}>Option D *</label>
                    <input
                      className={styles.formInput}
                      required
                      value={form.optionD}
                      onChange={e => setForm({ ...form, optionD: e.target.value })}
                      placeholder="Option D text"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label className={styles.formLabel}>Correct Answer *</label>
                  <select
                    className={styles.formInput}
                    value={form.correctAnswer}
                    onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={styles.formLabel}>Explanation / Revelation (shown after answering)*</label>
                <textarea
                  className={styles.formInput}
                  required
                  rows={2}
                  value={form.explanation}
                  onChange={e => setForm({ ...form, explanation: e.target.value })}
                  placeholder="Explain why this is correct and add cultural/historical color..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>Related Story (Optional)</label>
                  <select
                    className={styles.formInput}
                    value={form.relatedStory}
                    onChange={e => setForm({ ...form, relatedStory: e.target.value })}
                  >
                    <option value="">None</option>
                    {stories.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className={styles.formLabel}>XP Reward *</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    required
                    value={form.xpReward}
                    onChange={e => setForm({ ...form, xpReward: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Image Banner URL</label>
                  <input
                    className={styles.formInput}
                    value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="/assets/temples/venkateswara.png"
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
                <Save size={16} /> Save Question
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className={styles.topRow}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>Spiritual Quizzes CMS</h1>
              <p className={styles.pageSubtitle}>
                {quizzes.length} questions listed · {quizzes.filter(q => q.isActive).length} published
              </p>
            </div>
            <button onClick={handleCreate} className={styles.btnPrimary}>
              <PlusCircle size={16} /> New Question
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.filterRow}>
              <div className={styles.searchBar}>
                <Search size={16} color="#4A5568" />
                <input
                  placeholder="Search questions by text, category..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 100, textAlign: 'center', color: '#64748B' }}>
                <p>Loading quizzes directory...</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Difficulty</th>
                      <th>Category</th>
                      <th>XP</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(qz => (
                      <tr key={qz.id}>
                        <td>
                          <div style={{ maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <p className={styles.placeCellName} style={{ margin: 0 }}>{qz.question}</p>
                            <p className={styles.placeCellSub} style={{ margin: 0 }}>Ans: Option {qz.correctAnswer}</p>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${qz.difficulty === 'expert' ? styles.badgePurple : qz.difficulty === 'intermediate' ? styles.badgeOrange : styles.badgeBlue}`}>
                            {qz.difficulty}
                          </span>
                        </td>
                        <td>{qz.category}</td>
                        <td>{qz.xpReward} XP</td>
                        <td>
                          <span className={`${styles.badge} ${qz.isActive ? styles.badgeGreen : styles.badgeOrange}`}>
                            {qz.isActive ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => handleEdit(qz)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                              <Pencil size={14} color="#94A3B8" />
                            </button>
                            <button onClick={() => handleDelete(qz.id)} className={styles.recentAction} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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
