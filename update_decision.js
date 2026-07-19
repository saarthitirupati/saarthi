const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const targetStart = '{/* ─── BEST DECISION RIGHT NOW ─── */}';
const targetEnd = '{/* ─── QUICK ACTIONS ─── */}';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
  console.log('Target blocks not found');
  process.exit(1);
}

const newJsx = `{/* ─── BEST DECISION RIGHT NOW ─── */}
      {bestForToday && (
        <div className={styles.decisionContainer}>
          <div className={styles.decisionHeader}>
            <Sparkles size={12} fill="#065F46" /> BEST DECISION RIGHT NOW
          </div>
          <h2 className={styles.decisionTitle}>
            {bestForToday.place.placeType === 'food' ? 'Have a meal at ' : 'Visit '}{bestForToday.place.name}
          </h2>
          
          <div className={styles.decisionBody}>
            <div className={styles.decisionPoints}>
              <div className={styles.decisionPoint}>
                <Footprints size={14} color="#64748B" /> {bestForToday.place.distanceKms <= 2 ? Math.round(bestForToday.place.distanceKms * 12) + ' min walk' : bestForToday.place.distanceKms + ' km'} from your location
              </div>
              {bestForToday.reasons[0] && (
                <div className={styles.decisionPoint}>
                  <Leaf size={14} color="#64748B" /> {bestForToday.reasons[0].replace(/^[\\p{Emoji_Presentation}\\s]+/gu, '')}
                </div>
              )}
              <div className={styles.decisionPoint}>
                <Clock size={14} color="#64748B" /> {bestForToday.shouldVisitVerdict}
              </div>
              {bestForToday.reasons[1] && (
                <div className={styles.decisionPoint}>
                  <Users size={14} color="#64748B" /> {bestForToday.reasons[1].replace(/^[\\p{Emoji_Presentation}\\s]+/gu, '')}
                </div>
              )}
            </div>
            <div className={styles.decisionRight}>
              <div className={styles.decisionImageWrap}>
                <img 
                  src={bestForToday.place.images && bestForToday.place.images[0] ? urlForImage(bestForToday.place.images[0]).url() : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop'} 
                  className={styles.decisionImg} 
                  alt={bestForToday.place.name} 
                />
                <div className={styles.decisionImageBadge}>{bestForToday.shouldVisitNow ? 'Open' : 'Wait'} &bull; {liveStatus?.crowdLevel === 'low' ? 'Low Crowd' : 'Moderate'}</div>
              </div>
              <button className={styles.decisionBtn} onClick={() => router.push(\`/explore/\${bestForToday.place.id}\`)}>
                View Details &amp; Go <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      `;

const finalContent = content.substring(0, startIndex) + newJsx + content.substring(endIndex);

fs.writeFileSync('src/app/page.tsx', finalContent);
console.log('Successfully updated Best Decision block');
