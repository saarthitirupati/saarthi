import Link from 'next/link';
import styles from './PlaceEditor.module.css';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminPlaceEditor({ params }: { params: { id: string } }) {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/places" className={styles.backButton}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.title}>Edit Place</h1>
            <p className={styles.subtitle}>{params.id}</p>
          </div>
        </div>
        <button className={styles.saveButton}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.mainColumn}>
          
          {/* Layer 1: Master Data */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Layer 1: Master Data</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input type="text" className={styles.input} defaultValue="Kapila Theertham" />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <select className={styles.select}>
                  <option>Waterfalls</option>
                  <option>Spiritual</option>
                  <option>Nature</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Base Priority (0-100)</label>
                <input type="number" className={styles.input} defaultValue="85" />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea className={styles.textarea} rows={4} defaultValue="A unique Shiva temple with a sacred waterfall at the foothills."></textarea>
            </div>

            <h3 className={styles.subTitle}>Amenities & Pricing</h3>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Has Parking
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Has Restroom
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Free Entry
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Requires Ticket
              </label>
            </div>
          </section>

          {/* Layer 2: Context Metadata */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Layer 2: Context Metadata</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ideal Min Temp (°C)</label>
                <input type="number" className={styles.input} defaultValue="15" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ideal Max Temp (°C)</label>
                <input type="number" className={styles.input} defaultValue="32" />
              </div>
            </div>

            <h3 className={styles.subTitle}>Recommendation Tags</h3>
            <div className={styles.checkboxGrid}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Weekend Friendly
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Weekday Friendly
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Crowd Escape
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Outdoor
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" defaultChecked /> Family Friendly
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" /> Wheelchair Accessible
              </label>
            </div>
          </section>

        </div>

        <div className={styles.sideColumn}>
          {/* Status Panel */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Publishing</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Verification Status</label>
              <select className={styles.select}>
                <option>VERIFIED</option>
                <option>PENDING</option>
                <option>REJECTED</option>
              </select>
            </div>
          </section>

          {/* Location Panel */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Latitude</label>
              <input type="text" className={styles.input} defaultValue="13.6524" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Longitude</label>
              <input type="text" className={styles.input} defaultValue="79.4215" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
