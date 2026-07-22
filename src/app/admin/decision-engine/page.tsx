'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Clock, Users, CloudRain, Sun, Heart, TreePine, Landmark, Building, Sparkles } from 'lucide-react';
import styles from './DecisionEngine.module.css';

const IconMap: Record<string, any> = {
  Clock, Users, CloudRain, Sun, Heart, TreePine, Landmark, Building, Sparkles
};

export default function DecisionEngineAdmin() {
  const [data, setData] = useState({ decisionCards: [], experiences: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/decision-engine');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    await fetch(`/api/admin/decision-engine?id=${id}&type=${type}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) return <div className={styles.container}>Loading Decision Engine Controls...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Decision Engine Controls</h1>
          <p className={styles.subtitle}>Manage the dynamic cards and experiences served to the Explore page.</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Contextual Decision Cards</h2>
          <button className={styles.addButton}><Plus size={16} /> Add Card</button>
        </div>
        
        <div className={styles.grid}>
          {data.decisionCards.map((card: any) => {
            const Icon = IconMap[card.icon] || Sparkles;
            return (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <div className={styles.iconWrapper}><Icon size={18} /></div>
                    {card.title}
                  </div>
                  <span className={`${styles.statusToggle} ${!card.enabled ? styles.disabled : ''}`}>
                    {card.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                
                <div className={styles.cardDetails}>
                  <span>Priority: {card.priority}</span>
                  <span>Query Payload:</span>
                  <pre>{JSON.stringify(card.query_params, null, 2)}</pre>
                </div>

                <div className={styles.actions}>
                  <button className={styles.editButton}><Edit2 size={14} /> Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(card.id, 'decision_card')}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Experiences</h2>
          <button className={styles.addButton}><Plus size={16} /> Add Experience</button>
        </div>
        
        <div className={styles.grid}>
          {data.experiences.map((exp: any) => {
            const Icon = IconMap[exp.icon] || Sparkles;
            return (
              <div key={exp.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitle}>
                    <div className={styles.iconWrapper}><Icon size={18} /></div>
                    {exp.title}
                  </div>
                  <span className={`${styles.statusToggle} ${!exp.enabled ? styles.disabled : ''}`}>
                    {exp.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                
                <div className={styles.cardDetails}>
                  <span>Priority: {exp.priority}</span>
                </div>

                <div className={styles.actions}>
                  <button className={styles.editButton}><Edit2 size={14} /> Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(exp.id, 'experience')}><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
