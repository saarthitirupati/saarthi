'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, ArrowRight } from 'lucide-react';
import styles from './SearchIntent.module.css';

export default function SearchIntentAdmin() {
  const [aliases, setAliases] = useState([
    { id: '1', alias: 'phone', mapsTo: 'Mobile Deposit' },
    { id: '2', alias: 'food', mapsTo: 'Annaprasadam' },
    { id: '3', alias: 'locker', mapsTo: 'Luggage Counter' },
    { id: '4', alias: 'shoes', mapsTo: 'Footwear Counter' },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Search Intent Management</h1>
          <p className={styles.subtitle}>Map user search queries to correct destinations.</p>
        </div>
        <button className={styles.addButton}><Plus size={16} /> Add Alias</button>
      </div>

      <div className={styles.section}>
        <div className={styles.searchBar}>
          <Search size={16} color="#64748B" />
          <input type="text" placeholder="Search aliases..." />
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User Types...</th>
              <th></th>
              <th>Maps To...</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {aliases.map((alias) => (
              <tr key={alias.id}>
                <td className={styles.aliasCell}>"{alias.alias}"</td>
                <td className={styles.arrowCell}><ArrowRight size={16} color="#94A3B8" /></td>
                <td className={styles.mapsToCell}>{alias.mapsTo}</td>
                <td className={styles.actionsCell}>
                  <button className={styles.iconButton}><Edit2 size={14} /></button>
                  <button className={`${styles.iconButton} ${styles.danger}`}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
