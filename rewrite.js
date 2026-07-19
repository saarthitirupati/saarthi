const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const splitMarker = 'if (!mounted) return null;';
const startIndex = content.indexOf(splitMarker);

if (startIndex === -1) {
  console.log('Split marker not found');
  process.exit(1);
}

const before = content.substring(0, startIndex + splitMarker.length);

const newJsx = `

  const formattedTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  return (
    <div className={styles.page}>
      
      {/* ─── TOP HEADER ─── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoIcon}>
            <Landmark size={20} />
          </div>
          <div className={styles.headerTitles}>
            <span className={styles.headerTitle}>Saarthi</span>
            <span className={styles.headerSubtitle}>Your guide in Tirupati</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.bellIcon}>
            <Bell size={20} />
            <span className={styles.bellBadge}></span>
          </div>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className={styles.profilePic} onClick={() => router.push('/saved')} />
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <div className={styles.heroSection}>
        <div className={styles.heroTimeBadge}>
          {formattedTime} &bull; {formattedDate}
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroGreeting}>Good Afternoon, {userName || 'Sunil'}! 👋</h1>
          <p className={styles.heroSub}>Here's what's happening in Tirupati</p>
          
          <div className={styles.heroWeather}>
            <div className={styles.tempRow}>
              <span className={styles.temp}>38&deg;C</span>
              <div className={styles.weatherIcon}>
                <Sun size={20} color="#F59E0B" fill="#F59E0B" />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#F59E0B', marginTop: 2 }}>Sunny</span>
              </div>
            </div>
            <span className={styles.feelsLike}>Feels like 40&deg;C</span>
          </div>
        </div>
        
        <img src="https://images.unsplash.com/photo-1623594191490-671c6dc001bc?q=80&w=600&auto=format&fit=crop" className={styles.heroImage} alt="Temple" />
      </div>

      {/* ─── LIVE METRICS SCROLL ─── */}
      <div className={styles.metricsScroll}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <Users size={16} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Darshan Wait Time</span>
            <span className={styles.metricValue + ' ' + styles.green}>{liveStatus?.waitTime || '2 - 3 hrs'}</span>
            <span className={styles.metricSub}>Tirumala</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#F3E8FF', color: '#9333EA' }}>
            <Users size={16} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Crowd Status</span>
            <span className={styles.metricValue + ' ' + styles.purple}>Moderate</span>
            <span className={styles.metricSub}>Tirumala</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <Car size={16} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Traffic</span>
            <span className={styles.metricValue + ' ' + styles.blue}>Smooth</span>
            <span className={styles.metricSub}>in City</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ background: '#FFEDD5', color: '#EA580C' }}>
            <CloudLightning size={16} />
          </div>
          <div className={styles.metricInfo}>
            <span className={styles.metricLabel}>Rain Alert</span>
            <span className={styles.metricValue + ' ' + styles.orange}>4 PM</span>
            <span className={styles.metricSub}>Today</span>
          </div>
        </div>
      </div>

      {/* ─── BEST DECISION RIGHT NOW ─── */}
      <div className={styles.decisionContainer}>
        <div className={styles.decisionHeader}>
          <Sparkles size={12} fill="#065F46" /> BEST DECISION RIGHT NOW
        </div>
        <h2 className={styles.decisionTitle}>Have lunch before visiting Kapila Teertham 🌳</h2>
        
        <div className={styles.decisionBody}>
          <div className={styles.decisionPoints}>
            <div className={styles.decisionPoint}>
              <Footprints size={14} color="#64748B" /> 4 min walk from your location
            </div>
            <div className={styles.decisionPoint}>
              <Leaf size={14} color="#64748B" /> Cool & shaded area
            </div>
            <div className={styles.decisionPoint}>
              <Clock size={14} color="#64748B" /> Perfect time: Now — 2 PM
            </div>
            <div className={styles.decisionPoint}>
              <Users size={14} color="#64748B" /> Low crowd right now
            </div>
          </div>
          <div className={styles.decisionRight}>
            <div className={styles.decisionImageWrap}>
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop" className={styles.decisionImg} alt="Restaurant" />
              <div className={styles.decisionImageBadge}>Open &bull; Low Crowd</div>
            </div>
            <button className={styles.decisionBtn}>
              View Details &amp; Go <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS ─── */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>What would you like to do?</h3>
        <span className={styles.seeAll}>See all <ChevronRight size={14} /></span>
      </div>
      <div className={styles.quickActions}>
        <div className={styles.actionItem} onClick={() => router.push('/explore?q=Temple')}>
          <div className={styles.actionIconBox} style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Landmark size={24} />
          </div>
          <span className={styles.actionLabel}>Visit Temple</span>
        </div>
        <div className={styles.actionItem} onClick={() => router.push('/explore?q=Food')}>
          <div className={styles.actionIconBox} style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <Footprints size={24} />
          </div>
          <span className={styles.actionLabel}>Eat / Food</span>
        </div>
        <div className={styles.actionItem} onClick={() => router.push('/explore?q=Nature')}>
          <div className={styles.actionIconBox} style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <Waves size={24} />
          </div>
          <span className={styles.actionLabel}>Explore Nature</span>
        </div>
        <div className={styles.actionItem} onClick={() => router.push('/explore?q=Shopping')}>
          <div className={styles.actionIconBox} style={{ background: '#F3E8FF', color: '#9333EA' }}>
            <Footprints size={24} />
          </div>
          <span className={styles.actionLabel}>Shopping</span>
        </div>
        <div className={styles.actionItem} onClick={() => router.push('/explore?q=Events')}>
          <div className={styles.actionIconBox} style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <CalendarDays size={24} />
          </div>
          <span className={styles.actionLabel}>Events</span>
        </div>
        <div className={styles.actionItem} onClick={() => router.push('/essentials')}>
          <div className={styles.actionIconBox} style={{ background: '#F1F5F9', color: '#3B82F6' }}>
            <Sparkles size={24} />
          </div>
          <span className={styles.actionLabel}>Essentials</span>
        </div>
      </div>

      {/* ─── NEARBY RECOMMENDATIONS ─── */}
      <h3 className={styles.sectionTitle} style={{ padding: '0 20px', marginBottom: 4 }}>Nearby Recommendations for You</h3>
      <div className={styles.nearbySubtitle}>
        <MapPin size={12} /> Near: Alipiri Road 
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: '#0F172A', fontWeight: 600 }}>
          <Compass size={12} /> View map
        </span>
      </div>
      
      <div className={styles.nearbyScroll}>
        <div className={styles.nearbyCard}>
          <div className={styles.nearbyImgWrap}>
            <img src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=400&auto=format&fit=crop" className={styles.nearbyImg} alt="Kapila Teertham" />
            <div className={styles.nearbyBadge} style={{ background: '#16A34A' }}>Popular Now</div>
          </div>
          <div className={styles.nearbyInfo}>
            <h4 className={styles.nearbyTitle}>Kapila Teertham 🌳</h4>
            <div className={styles.nearbyDist}>8 min &bull; 2.1 km</div>
            <div className={styles.nearbyDesc}>Waterfall, Temple, Scenic</div>
            <div className={styles.nearbyBottom}>
              <span className={styles.nearbyRating}><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.6 (1.2k)</span>
              <div className={styles.bookmarkBtn}><Footprints size={14} /></div>
            </div>
          </div>
        </div>

        <div className={styles.nearbyCard}>
          <div className={styles.nearbyImgWrap}>
            <img src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=400&auto=format&fit=crop" className={styles.nearbyImg} alt="Museum" />
            <div className={styles.nearbyBadge} style={{ background: '#3B82F6' }}>Low Crowd</div>
          </div>
          <div className={styles.nearbyInfo}>
            <h4 className={styles.nearbyTitle}>Sri Venkateswara Museum</h4>
            <div className={styles.nearbyDist}>5 min &bull; 1.4 km</div>
            <div className={styles.nearbyDesc}>History, Culture, Exhibits</div>
            <div className={styles.nearbyBottom}>
              <span className={styles.nearbyRating}><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.4 (856)</span>
              <div className={styles.bookmarkBtn}><Footprints size={14} /></div>
            </div>
          </div>
        </div>

        <div className={styles.nearbyCard}>
          <div className={styles.nearbyImgWrap}>
            <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400&auto=format&fit=crop" className={styles.nearbyImg} alt="Park" />
            <div className={styles.nearbyBadge} style={{ background: '#EA580C' }}>Good for Family</div>
          </div>
          <div className={styles.nearbyInfo}>
            <h4 className={styles.nearbyTitle}>Silathoranam Park</h4>
            <div className={styles.nearbyDist}>6 min &bull; 1.8 km</div>
            <div className={styles.nearbyDesc}>Garden, Kids Play Area</div>
            <div className={styles.nearbyBottom}>
              <span className={styles.nearbyRating}><Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.3 (932)</span>
              <div className={styles.bookmarkBtn}><Footprints size={14} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LIVE UPDATES BOTTOM ─── */}
      <div className={styles.liveUpdatesSection}>
        <div className={styles.liveUpdatesHeader}>
          <div className={styles.liveUpdatesTitle}>
            Live Updates <span className={styles.liveBadge}>&bull; Live</span>
          </div>
          <div className={styles.liveTimestamp}>Updated just now <Compass size={12} /></div>
        </div>
        
        <div className={styles.liveUpdatesScroll}>
          <div className={styles.liveUpdateCard}>
            <div className={styles.luHeader}>
              <div className={styles.luIcon}><Landmark size={14} /></div>
              <span className={styles.luTitle}>Tirumala Darshan</span>
            </div>
            <div className={styles.luValue}>{liveStatus?.waitTime || '2-3 hrs'}</div>
            <div className={styles.luDesc}>Lines moving smoothly</div>
          </div>
          
          <div className={styles.liveUpdateCard}>
            <div className={styles.luHeader}>
              <div className={styles.luIcon}><Car size={14} /></div>
              <span className={styles.luTitle}>Alipiri Road</span>
            </div>
            <div className={styles.luValue}>Smooth Traffic</div>
            <div className={styles.luDesc}>No major jams</div>
          </div>

          <div className={styles.liveUpdateCard}>
            <div className={styles.luHeader}>
              <div className={styles.luIcon}><Car size={14} /></div>
              <span className={styles.luTitle}>APSRTC Buses</span>
            </div>
            <div className={styles.luValue}>Regular services</div>
            <div className={styles.luDesc}>operating</div>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM NAVIGATION ─── */}
      <div className={styles.bottomNav}>
        <Link href="/" className={styles.navItem + ' ' + styles.active}>
          <Landmark size={22} />
          <span className={styles.navLabel}>Home</span>
        </Link>
        <Link href="/explore" className={styles.navItem}>
          <MapPin size={22} />
          <span className={styles.navLabel}>Places</span>
        </Link>
        
        <div className={styles.fabContainer}>
          <div className={styles.fabBtn}>
            <Sparkles size={28} />
          </div>
          <span className={styles.fabLabel}>Ask Saarthi</span>
        </div>

        <Link href="/events" className={styles.navItem}>
          <CalendarDays size={22} />
          <span className={styles.navLabel}>Events</span>
        </Link>
        <Link href="/saved" className={styles.navItem}>
          <User size={22} />
          <span className={styles.navLabel}>Profile</span>
        </Link>
      </div>

    </div>
  );
}
`;

fs.writeFileSync('src/app/page.tsx', before + newJsx);
console.log('Successfully updated page.tsx');
