const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const injectionPoint = `{/* ─── BEST FOR TODAY (Recommendation) ─── */}`;

const newSections = `
      {/* ─── LIVE DARSHAN TIMES MATRIX ─── */}
      {liveStatus && liveStatus.darshans && liveStatus.darshans.length > 0 && (
        <section className={styles.darshanMatrixSection}>
          <div className={styles.sectionModernHeader}>
            <h2 className={styles.sectionModernTitle}>Live Darshan Wait Times</h2>
          </div>
          <div className={styles.darshanMatrixCard}>
            {liveStatus.darshans.map((d, i) => (
              <div key={i} className={styles.darshanRow}>
                <div className={styles.darshanIconBox} style={{ background: d.name.includes('Free') ? '#F0FDF4' : d.name.includes('₹300') ? '#EFF6FF' : d.name.includes('Footpath') ? '#FFF7ED' : '#F8FAFC', color: d.name.includes('Free') ? '#16A34A' : d.name.includes('₹300') ? '#2563EB' : d.name.includes('Footpath') ? '#EA580C' : '#475569' }}>
                  {d.name.includes('Free') ? <Users size={20} /> : d.name.includes('₹300') ? <Ticket size={20} /> : d.name.includes('Footpath') ? <Footprints size={20} /> : <Star size={20} />}
                </div>
                <div className={styles.darshanInfo}>
                  <span className={styles.darshanName}>{d.name}</span>
                  <span className={styles.darshanPeakHours}>{d.peakHours}</span>
                </div>
                <div className={styles.darshanWaitBadge}>
                  {d.waitTime}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── SSD TOKEN GUIDE ─── */}
      {liveStatus && (
        <section className={styles.ssdGuideSection}>
          <div className={styles.sectionModernHeader}>
            <h2 className={styles.sectionModernTitle}>SSD Token Centers</h2>
          </div>
          <div className={styles.ssdGuideCard}>
            <div className={styles.ssdStatusBanner}>
              <div className={styles.ssdStatusLeft}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: liveStatus.ssdTokenStatus === 'issuing' ? '#10B981' : '#EF4444' }} />
                <span className={styles.ssdStatusText}>
                  {liveStatus.ssdTokenStatus === 'issuing' ? 'Currently Issuing' : liveStatus.ssdTokenStatus === 'paused' ? 'Paused' : 'Closed for the day'}
                </span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>{liveStatus.ssdNextTokenTime}</span>
            </div>
            
            {liveStatus.ssdNotice && (
              <p className={styles.ssdNoticeText}>{liveStatus.ssdNotice}</p>
            )}
            
            <span style={{ fontSize: 12, fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: 0.5 }}>Official Counters in Tirupati</span>
            
            <div className={styles.ssdCountersList}>
              {liveStatus.ssdCounters && liveStatus.ssdCounters.map((c, i) => (
                <div key={i} className={styles.ssdCounterItem}>
                  <MapPin size={16} />
                  <div>
                    <div className={styles.ssdCounterName}>{c.name}</div>
                    <div className={styles.ssdCounterDesc}>{c.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      ${injectionPoint}`;

content = content.replace(injectionPoint, newSections);

// Replace "Updated Just Now" with dynamic timestamp
const oldHeader = `<div className={styles.heroActionHeader}>
            <span className={styles.heroActionTag}>LIVE STATUS</span>
            <span className={styles.heroActionTime}>Updated Just Now</span>
          </div>`;
          
const newHeader = `<div className={styles.heroActionHeader}>
            <span className={styles.heroActionTag}>LIVE STATUS</span>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.heroActionTime} style={{ color: '#0F172A', fontWeight: 700 }}>
                Admin Verified: {new Date(liveStatus.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className={styles.updateTimestamp}>Next Update in ~3 Hrs</div>
            </div>
          </div>`;

content = content.replace(oldHeader, newHeader);

fs.writeFileSync('src/app/page.tsx', content);
