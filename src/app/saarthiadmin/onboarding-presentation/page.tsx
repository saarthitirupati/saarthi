'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Clock, Compass, HelpCircle, Shield, 
  MapPin, Calendar, Users, User, Heart, Sparkles, Globe, 
  Check, ShieldCheck, Bell, Download, Layers, Play, AlertCircle
} from 'lucide-react';
import styles from './presentation.module.css';

interface ScreenData {
  id: number;
  title: string;
  purpose: string;
  components: string;
  benefit: string;
  engineering: string;
  design: string;
  ux: string;
  accessibility: string;
}

export default function OnboardingPresentation() {
  const [activeTabs, setActiveTabs] = useState<Record<number, 'product' | 'technical' | 'accessibility'>>({
    1: 'product', 2: 'product', 3: 'product', 4: 'product', 5: 'product',
    6: 'product', 7: 'product', 8: 'product', 9: 'product', 10: 'product'
  });

  const handleTabChange = (screenId: number, tab: 'product' | 'technical' | 'accessibility') => {
    setActiveTabs(prev => ({ ...prev, [screenId]: tab }));
  };

  const SCREENS: ScreenData[] = [
    {
      id: 1,
      title: "Screen 1: Splash / Startup",
      purpose: "Establish brand identity, start a spiritual state-of-mind shift, and pre-cache static assets during the load sequence.",
      components: "Cinematic night-sky background, glowing golden temple silhouette, golden logo mark, centered title, value tagline, horizontal home indicator.",
      benefit: "Reduces initial travel stress with a calm, welcoming, and culturally-resonant visual interface that builds immediate trust.",
      engineering: "Pre-loads essential images and fonts. Checks localStorage for existing sessions. Initializes telemetry logging with a silent 2s timeout delay.",
      design: "Deep Navy color palette (#0F172A) for a sacred night-sky ambience. Gold foil accent branding (#F59E0B) for a regal and traditional feeling.",
      ux: "Zero friction interface. Completely automated transition with progressive fading. No buttons to distract or delay the user's entry.",
      accessibility: "Decorative elements are hidden from screen readers. Screen reader announces: 'Saarthi app loading' with appropriate screen layout description."
    },
    {
      id: 2,
      title: "Screen 2: Welcome Screen",
      purpose: "Introduce the platform's core identity, outline primary value offerings, and allow an optional entry bypass (Skip).",
      components: "Golden temple sketch illustration, welcome header, explanatory subtext, live feature list, primary 'Get Started' button, skip link.",
      benefit: "Provides clear, high-level context of what the app does before requesting user details, building security and respect.",
      engineering: "Uses CSS modules for responsive layout binding. Skip button triggers automatic fallback profile settings to prevent initial states from breaking.",
      design: "Warm Ivory background (#FFF8EB) to simulate hand-woven sacred paper. High contrast dark navy typography (#0F172A) for AAA legibility.",
      ux: "Gives users a clear path of exit (Skip) to respect their time, while presenting value statements clearly using bullet items.",
      accessibility: "Highlights are structured as an HTML list for layout readouts. Touch target for Skip button is padded to ensure easy tapping."
    },
    {
      id: 3,
      title: "Screen 3: Select Language",
      purpose: "Linguistic access setup. Providing language preferences immediately is the single most critical accessibility step for local pilgrims.",
      components: "Header titles, language selection list, radio selection badges, continue button, background patterns.",
      benefit: "Ensures the guide is immediately understandable in their native tongue, lowering barrier of entry for elderly visitors.",
      engineering: "Saves language selection directly to localStorage ('saarthi_user_language'). Automatically sets app language context on load.",
      design: "Large selection cards. The active language card is highlighted in golden tints with active radio check indications.",
      ux: "Large touch target selectors. Highlights selection immediately. Disables Continue CTA if no active selection is present.",
      accessibility: "Names of languages are spelled out in their native characters (e.g. తెలుగు, தமிழ்). Font size is adjustable without clipping."
    },
    {
      id: 4,
      title: "Screen 4: Your Name",
      purpose: "Capture user name to establish conversational respect. Warmly greet the pilgrim throughout their journey.",
      components: "Header titles, profile avatar graphic, name input container with user icon, placeholder text, green privacy banner card, continue button.",
      benefit: "Creates a personalized guide feel. The green privacy card reassures the user that their data is stored strictly locally.",
      engineering: "Autofocuses the input element on mount. Sanitizes input string to prevent script insertions. Triggers Next function on keyboard 'Enter'.",
      design: "Generous whitespace to center focus on the name entry. Highlighted input frame on focus to support visibility.",
      ux: "Explains exactly why the name is required. The privacy banner uses high-contrast colors to ensure compliance and build comfort.",
      accessibility: "Input field is explicitly linked to header labels. Placeholder text provides high-contrast hint formatting."
    },
    {
      id: 5,
      title: "Screen 5: Trip Context",
      purpose: "Acquire high-level travel attributes to compile personalized suggestions and configure safety/elderly route modifications.",
      components: "Spacious inputs list, styled select dropdowns (Location, Duration, Group), interest pills grid, Next button.",
      benefit: "Ensures that travel times, temple routes, and crowd warnings are calibrated to the user's specific context (e.g. elderly companion).",
      engineering: "Transforms select indexes into planner parameters. Populates defaults automatically to allow smooth continue fallback.",
      design: "Dropdown fields feature standard drop shadows and custom arrow vector paths to create a highly refined UI design.",
      ux: "Reuses standard dropdown templates to minimize input friction. Interest pills support toggling with instant visual active states.",
      accessibility: "Input dropdown fields use standard touch targets (height 48px). Multi-select pills use high contrast text and borders."
    },
    {
      id: 6,
      title: "Screen 6: Pilgrim Profile",
      purpose: "Assign a target archetype profile to the pilgrim, optimizing recommendations and warnings without requiring dozens of questions.",
      components: "Visual select cards representing 4 archetypes (First Time, Family, Devout, Student), brief personalization description notes, Next button.",
      benefit: "Fast-tracks setup. Instantly configures the recommendation engine according to their specific archetype.",
      engineering: "Integrates preset configuration templates directly with the state store, updating weights for the recommendation system.",
      design: "Clean graphic cards. Active card is highlighted in golden colors with a dark navy border to create clear focus.",
      ux: "One-tap selection. Clearly explains what Saarthi will personalize for their specific archetype, helping them make an informed choice.",
      accessibility: "Each card is fully focusable. Description texts are written in clear, concise language to support easy comprehension."
    },
    {
      id: 7,
      title: "Screen 7: Permissions",
      purpose: "Request location, notice, and storage capabilities by emphasizing features and utility rather than showing blank warnings.",
      components: "Explanatory header, items list, styled switches, Next button, description tags.",
      benefit: "Unlocks real-time routing, active queue duration notifications, and offline access when mountain cell coverage is weak.",
      engineering: "Requests browser/platform system API permissions. Saves permission status to state. Handles denials gracefully.",
      design: "Active switches are styled in Emerald Green (#10B981) for clarity, while inactive switches are colored in subtle grey.",
      ux: "Explains what benefit the permission brings to the pilgrim. Reduces refusal rates by avoiding scary, technical warning phrasing.",
      accessibility: "Switches are mapped as checkboxes with clear accessible labels explaining their functional state (enabled/disabled)."
    },
    {
      id: 8,
      title: "Screen 8: Almost Ready",
      purpose: "Acknowledge successful completion of user profile setup. Confirm system state is ready to start.",
      components: "Checklist rows containing check marks, summary card, primary 'Start My Journey' button.",
      benefit: "Gives the pilgrim a satisfying visual confirmation that they are fully configured and ready, reducing travel anxiety.",
      engineering: "Validates all localStorage schemas. Prefetches core location data and begins caching the itinerary.",
      design: "Checkmark icons are rendered in soft green (#10B981) against pristine white cards to create a fresh, clean aesthetic.",
      ux: "Singular primary call to action. Minimal page text to clear the user's mind for their upcoming pilgrimage.",
      accessibility: "The list is declared as a complete layout. The screen reader states: 'Profile compilation complete. Click below to start.'"
    },
    {
      id: 9,
      title: "Screen 9: Oracle Loading",
      purpose: "Animate loading sequence while background threads compile recommendations, analyze weather patterns, and check live crowds.",
      components: "Glowing temple gopuram graphic, rotating dash indicator ring, pulsing circular glow, loading criteria indicator list.",
      benefit: "Replaces empty page loading with a satisfying visual representation of AI customization happening in real-time.",
      engineering: "Performs asynchronous calculations. Fetches current weather and queue status from endpoints before completing.",
      design: "Dark theme screen for loading focus. Golden dashes spin slowly while the temple silhouette pulses in soft light.",
      ux: "Progress indicators check off in real-time to show that the system is actively working, keeping the user engaged.",
      accessibility: "Uses ARIA live announcements to declare calculations. Animations comply with vestibular motion standards."
    },
    {
      id: 10,
      title: "Screen 10: Home Screen",
      purpose: "The main companion dashboard. Displays the next immediate travel task, live conditions, and guide shortcuts.",
      components: "Top header navigation, next action hero card, search bar, essentials checklist grid, best locations list, bottom navigation tab bar.",
      benefit: "Instant awareness. The pilgrim immediately sees their next task and live queue timings without searching.",
      engineering: "Subscribes to realtime Supabase updates for darshan wait times. Logs screen view events via telemetry APIs.",
      design: "Warm ivory container with nested deep navy and white cards, gold highlight accents, and green positive badges.",
      ux: "Context over search. Prioritizes current wait times and the next immediate action at the top of the visual layout.",
      accessibility: "Landmarks define sections. Tab bar items use large touch areas. Text is high-contrast and readable."
    }
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>UI Design System</div>
        <h1 className={styles.title}>Saarthi — Startup to Onboarding Flow</h1>
        <p className={styles.subtitle}>
          From a warm spiritual welcome to a personalized pilgrimage experience. Below is the complete 10-screen 
          journey designed for investors and developers. Scroll horizontally to view all screens, and click the tabs 
          below each mockup to inspect specifications.
        </p>
      </header>

      {/* Horizontal Flow Container */}
      <div className={styles.flowWrapper}>
        {SCREENS.map((scr, idx) => (
          <div key={scr.id} style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            {/* Screen Container */}
            <div className={styles.cardContainer}>
              <div className={styles.screenNumber}>{scr.id}</div>
              <h2 className={styles.screenTitle}>{scr.title}</h2>
              
              {/* iPhone Mockup */}
              <div className={styles.iphoneFrame}>
                {/* Status Bar */}
                <div className={`${styles.statusBar} ${scr.id === 1 ? styles.statusBarDark : styles.statusBarLight}`}>
                  <span>9:41</span>
                  <div className={styles.statusIcons}>
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className={`${styles.homeIndicator} ${scr.id === 1 ? styles.indicatorDark : styles.indicatorLight}`} />

                {/* Screen Content Render */}
                <div className={`${styles.screenContent} ${scr.id === 1 ? styles.splashBg : styles.warmBg}`}>
                  
                  {/* Screen 1 Render */}
                  {scr.id === 1 && (
                    <div className={styles.splashContent}>
                      <div className={styles.logoGlow} />
                      {/* Leaf Temple Logo */}
                      <svg width="70" height="70" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 30 }}>
                        <path d="M60 10L66 18H54L60 10Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M50 18H70V28H50V18Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M45 28H75V42H45V28Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M40 42H80V60H40V42Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M35 60H85V82H35V60Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M30 82H90V105H30V82Z" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M52 105V93C52 88.5817 55.5817 85 60 85C64.4183 85 68 88.5817 68 93V105" stroke="#F59E0B" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M60 5V10" stroke="#F59E0B" strokeWidth="3"/>
                        <circle cx="60" cy="4" r="1.5" fill="#F59E0B"/>
                      </svg>
                      <h2 className={styles.splashTitleText}>Saarthi</h2>
                      <p className={styles.splashTaglineText}>From Free Time to Meaningful Memories</p>
                      <div className={styles.splashSanskrit}>|| ॐ नमो वेंकटेशाय ||</div>
                    </div>
                  )}

                  {/* Screen 2 Render */}
                  {scr.id === 2 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', cursor: 'pointer' }}>Skip</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                        <svg width="60" height="60" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M60 10L66 18H54L60 10Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M50 18H70V28H50V18Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M45 28H75V42H45V28Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M40 42H80V60H40V42Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M35 60H85V82H35V60Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M30 82H90V105H30V82Z" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                          <path d="M52 105V93C52 88.5817 55.5817 85 60 85C64.4183 85 68 88.5817 68 93V105" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className={styles.welcomeTitle}>Welcome to Saarthi 🙏</h3>
                      <p className={styles.welcomeDesc}>Your trusted companion for a peaceful, informed and meaningful pilgrimage.</p>
                      
                      <div className={styles.featuresGrid}>
                        {[
                          { emoji: '⏱️', title: 'Live Crowd Updates', desc: 'Realtime wait times and statuses.' },
                          { emoji: '🧭', title: 'Smart Recommendations', desc: 'Personalized routes tailored for you.' },
                          { emoji: '🛕', title: 'Pilgrim Essentials', desc: 'Local guidelines, maps and checklists.' },
                          { emoji: '💾', title: 'Offline Support', desc: 'Access guides without cell reception.' }
                        ].map((f, i) => (
                          <div key={i} className={styles.featureRow}>
                            <div className={styles.featureDot}>{f.emoji}</div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className={styles.featureLabel}>{f.title}</span>
                              <span className={styles.featureDescText}>{f.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>
                        Get Started <ArrowRight size={14} />
                      </button>
                    </>
                  )}

                  {/* Screen 3 Render */}
                  {scr.id === 3 && (
                    <>
                      <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '14px' }}>
                        <h3 className={styles.welcomeTitle} style={{ textAlign: 'left', fontSize: '18px' }}>Choose your preferred language</h3>
                        <p className={styles.welcomeDesc} style={{ textAlign: 'left', fontSize: '11px', margin: 0 }}>You can change this later in Settings.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {[
                          { code: 'en', native: 'English', eng: 'English', active: true },
                          { code: 'te', native: 'తెలుగు', eng: 'Telugu', active: false },
                          { code: 'hi', native: 'हिन्दी', eng: 'Hindi', active: false },
                          { code: 'ta', native: 'தமிழ்', eng: 'Tamil', active: false },
                          { code: 'kn', native: 'ಕನ್ನಡ', eng: 'Kannada', active: false }
                        ].map((lang) => (
                          <div key={lang.code} className={`${styles.langCard} ${lang.active ? styles.langCardActive : ''}`}>
                            <div className={styles.languageInfo}>
                              <span className={styles.langNative}>{lang.native}</span>
                              <span className={styles.langEnglish}>{lang.eng}</span>
                            </div>
                            <div className={styles.radioCircleOuter}>
                              {lang.active && <div className={styles.radioCircleInner} />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>Continue</button>
                    </>
                  )}

                  {/* Screen 4 Render */}
                  {scr.id === 4 && (
                    <>
                      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', margin: '0 auto 12px auto', fontSize: '20px', padding: '10px', boxSizing: 'border-box' }}>
                          <User size={24} />
                        </div>
                        <h3 className={styles.welcomeTitle} style={{ fontSize: '18px' }}>What should we call you?</h3>
                        <p className={styles.welcomeDesc}>Helps us personalize your experience</p>
                      </div>

                      <div style={{ width: '100%', marginTop: '10px' }}>
                        <input 
                          type="text" 
                          placeholder="Enter your name" 
                          value="Raghav"
                          readOnly
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #F59E0B',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: 600,
                            textAlign: 'center',
                            outline: 'none',
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A',
                            boxSizing: 'border-box'
                          }}
                        />
                        <p style={{ fontSize: '9px', color: '#6B7280', marginTop: '6px', textAlign: 'center' }}>
                          e.g. Raghav, Sreeja, Mahesh
                        </p>
                      </div>

                      <div className={styles.privacyNote} style={{ marginTop: '24px' }}>
                        <ShieldCheck size={18} className={styles.privacyIcon} />
                        <span className={styles.privacyText} style={{ fontSize: '10px' }}>
                          Your privacy is important to us. We never share your personal information.
                        </span>
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>Continue</button>
                    </>
                  )}

                  {/* Screen 5 Render */}
                  {scr.id === 5 && (
                    <>
                      <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '14px' }}>
                        <h3 className={styles.welcomeTitle} style={{ textAlign: 'left', fontSize: '18px' }}>Tell us about your trip</h3>
                        <p className={styles.welcomeDesc} style={{ textAlign: 'left', margin: 0 }}>This helps us plan better for you.</p>
                      </div>

                      <div className={styles.logisticsForm} style={{ gap: '10px' }}>
                        <div className={styles.logisticsFormGroup}>
                          <label className={styles.logisticsFormLabel} style={{ fontSize: '10px' }}>Where are you travelling?</label>
                          <select className={styles.selectField} disabled style={{ padding: '8px 12px', fontSize: '12px' }}>
                            <option>Tirupati</option>
                          </select>
                        </div>

                        <div className={styles.logisticsFormGroup}>
                          <label className={styles.logisticsFormLabel} style={{ fontSize: '10px' }}>How many days?</label>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {['1 Day', '2 Days', '3 Days', '4+'].map(d => (
                              <div key={d} style={{ flex: 1, padding: '6px', border: d === '2 Days' ? '1.5px solid #F59E0B' : '1.5px solid #E2E8F0', borderRadius: '8px', backgroundColor: d === '2 Days' ? '#FEF3C7' : '#FFFFFF', fontSize: '9px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                                {d}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.logisticsFormGroup}>
                          <label className={styles.logisticsFormLabel} style={{ fontSize: '10px' }}>Who are you travelling with?</label>
                          <select className={styles.selectField} disabled style={{ padding: '8px 12px', fontSize: '12px' }}>
                            <option>Family</option>
                          </select>
                        </div>

                        <div className={styles.logisticsFormGroup}>
                          <label className={styles.logisticsFormLabel} style={{ fontSize: '10px' }}>Interests</label>
                          <div className={styles.interestGrid} style={{ gap: '6px' }}>
                            {['Spiritual', 'Nature', 'Hidden Gems', 'History'].map(int => (
                              <div key={int} className={`${styles.interestCard} ${int === 'Spiritual' ? styles.interestCardActive : ''}`} style={{ padding: '6px', fontSize: '10px' }}>
                                {int}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>Continue</button>
                    </>
                  )}

                  {/* Screen 6 Render */}
                  {scr.id === 6 && (
                    <>
                      <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '14px' }}>
                        <h3 className={styles.welcomeTitle} style={{ textAlign: 'left', fontSize: '18px' }}>Choose Pilgrim Profile</h3>
                        <p className={styles.welcomeDesc} style={{ textAlign: 'left', margin: 0 }}>Auto-configures travel speeds and updates.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {[
                          { title: '🙏 First Time Visitor', desc: 'Step-by-step darshan rules, route guidelines and maps.', active: false },
                          { title: '👨‍👩‍👧 Family Pilgrim', desc: 'Rest buffers, child friendly points and low-strain routing.', active: true },
                          { title: '🛕 Devout Pilgrim', desc: 'Strict ritual timings, secondary shrine history, mantras.', active: false },
                          { title: '🎒 Budget Student', desc: 'Free lockers, cheap eats, scenic trekking routes.', active: false }
                        ].map((prof, i) => (
                          <div key={i} className={`${styles.profileCard} ${prof.active ? styles.profileCardActive : ''}`}>
                            <div className={styles.profileInfo}>
                              <span className={styles.profileTitle}>{prof.title}</span>
                              <span className={styles.profileDescText}>{prof.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>Continue</button>
                    </>
                  )}

                  {/* Screen 7 Render */}
                  {scr.id === 7 && (
                    <>
                      <div style={{ textAlign: 'left', marginTop: '10px', marginBottom: '14px' }}>
                        <h3 className={styles.welcomeTitle} style={{ textAlign: 'left', fontSize: '18px' }}>Enable Permissions</h3>
                        <p className={styles.welcomeDesc} style={{ textAlign: 'left', margin: 0 }}>Required for realtime guiding systems.</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {[
                          { icon: <MapPin size={14} />, title: 'Location Access', desc: 'Calculates distance to temples and queue paths.', active: true },
                          { icon: <Bell size={14} />, title: 'Notifications', desc: 'Alerts you of sudden crowd drops and token status.', active: true },
                          { icon: <Download size={14} />, title: 'Offline Downloads', desc: 'Pre-caches local maps when mobile service drops.', active: false }
                        ].map((perm, i) => (
                          <div key={i} className={styles.permItem}>
                            <div className={styles.permIconWrapper}>{perm.icon}</div>
                            <div className={styles.permText}>
                              <span className={styles.permTitle}>{perm.title}</span>
                              <span className={styles.permDesc}>{perm.desc}</span>
                            </div>
                            <div className={`${styles.toggleSwitch} ${perm.active ? styles.toggleSwitchActive : ''}`}>
                              <div className={styles.toggleDot} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto' }}>Continue</button>
                    </>
                  )}

                  {/* Screen 8 Render */}
                  {scr.id === 8 && (
                    <>
                      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', margin: '0 auto 12px auto', padding: '10px', boxSizing: 'border-box' }}>
                          <Check size={28} strokeWidth={3} />
                        </div>
                        <h3 className={styles.welcomeTitle} style={{ fontSize: '18px' }}>Almost Ready</h3>
                        <p className={styles.welcomeDesc}>Your companion is configured</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                        {[
                          'Profile Created',
                          'Language Saved',
                          'Trip Context Saved',
                          'Recommendations Ready'
                        ].map((check, i) => (
                          <div key={i} className={styles.checkRow}>
                            <div className={styles.circleCheck}>✓</div>
                            <span className={styles.checkLabel}>{check}</span>
                          </div>
                        ))}
                      </div>

                      <button className={styles.screenBtn} style={{ marginTop: 'auto', backgroundColor: '#10B981' }}>
                        <Sparkles size={14} /> Start My Journey
                      </button>
                    </>
                  )}

                  {/* Screen 9 Render */}
                  {scr.id === 9 && (
                    <div className={styles.splashContent} style={{ justifyContent: 'flex-start', paddingTop: '30px' }}>
                      <h3 className={styles.welcomeTitle} style={{ color: '#FFFFFF', fontSize: '18px' }}>Consulting the Oracle</h3>
                      <p className={styles.welcomeDesc} style={{ color: '#94A3B8' }}>Building your custom companion...</p>
                      
                      <div className={styles.oracleCircle}>
                        <div className={styles.oracleRing} />
                        <div className={styles.oraclePulse} />
                        <svg width="40" height="40" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 10 }}>
                          <path d="M60 10L66 18H54L60 10Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                          <path d="M50 18H70V28H50V18Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                          <path d="M45 28H75V42H45V28Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                          <path d="M40 42H80V60H40V42Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                          <path d="M35 60H85V82H35V60Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                          <path d="M30 82H90V105H30V82Z" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={styles.oracleSubText}>Analyzing settings</span>

                      <div className={styles.oracleLoaderGrid}>
                        {[
                          { icon: '☀️', label: 'Weather: Clear' },
                          { icon: '👥', label: 'Crowd: Normal' },
                          { icon: '🚗', label: 'Parking: Available' },
                          { icon: '🛕', label: 'Personalization' }
                        ].map((load, i) => (
                          <div key={i} className={styles.oracleLoaderItem}>
                            <span style={{ fontSize: '10px' }}>{load.icon}</span>
                            <span className={styles.oracleLoaderText}>{load.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screen 10 Render */}
                  {scr.id === 10 && (
                    <>
                      {/* Top Header */}
                      <div className={styles.miniHomeHeader}>
                        <span className={styles.miniHomeGreeting}>Namaste, Raghav 🙏</span>
                        <span style={{ fontSize: '14px' }}>⚙️</span>
                      </div>

                      {/* Hero Banner */}
                      <div className={styles.miniHero}>
                        <span className={styles.miniHeroTitle}>🟢 GOOD CONDITIONS NOW</span>
                        <h4 className={styles.miniHeroBody}>Queue is 2 hours. Good time to proceed.</h4>
                        <span className={styles.miniHeroWait}>Wait time: 2 hours | Weather: Pleasant</span>
                      </div>

                      {/* Quick Essentials Grid */}
                      <span className={styles.miniSectionTitle}>Pilgrim Essentials</span>
                      <div className={styles.miniGrid}>
                        {[
                          { emoji: '🎒', text: 'Free Lockers' },
                          { emoji: '🚶‍♂️', text: 'Walk Routes' },
                          { emoji: '🚗', text: 'Car Parking' }
                        ].map((grid, i) => (
                          <div key={i} className={styles.miniGridCard}>
                            <span className={styles.miniGridIcon}>{grid.emoji}</span>
                            <span className={styles.miniGridText}>{grid.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Best Location recommendation */}
                      <span className={styles.miniSectionTitle}>Recommended For Today</span>
                      <div className={styles.miniBestCard}>
                        <div className={styles.miniBestImg} style={{ backgroundImage: `url('/assets/temples/kapila.png')`, backgroundSize: 'cover' }} />
                        <div className={styles.miniBestInfo}>
                          <span className={styles.miniBestTitle}>Kapila Teertham</span>
                          <span className={styles.miniBestDesc}>Sacred waterfall &amp; temple. Near you.</span>
                        </div>
                      </div>

                      {/* Bottom Tab Bar */}
                      <div className={styles.miniNav}>
                        {[
                          { icon: '🏠', text: 'Home', active: true },
                          { icon: '🧭', text: 'Explore', active: false },
                          { icon: '📝', text: 'Journey', active: false },
                          { icon: '👤', text: 'Profile', active: false }
                        ].map((nav, i) => (
                          <div key={i} className={`${styles.miniNavItem} ${nav.active ? styles.miniNavItemActive : ''}`}>
                            <span className={styles.miniNavIcon}>{nav.icon}</span>
                            <span className={styles.miniNavText}>{nav.text}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                </div>
              </div>

              {/* Specifications Card */}
              <div className={styles.specsPanel}>
                <div className={styles.specsTabs}>
                  <button 
                    className={`${styles.specsTab} ${activeTabs[scr.id] === 'product' ? styles.specsTabActive : ''}`}
                    onClick={() => handleTabChange(scr.id, 'product')}
                  >
                    Product Design
                  </button>
                  <button 
                    className={`${styles.specsTab} ${activeTabs[scr.id] === 'technical' ? styles.specsTabActive : ''}`}
                    onClick={() => handleTabChange(scr.id, 'technical')}
                  >
                    Technical Specs
                  </button>
                  <button 
                    className={`${styles.specsTab} ${activeTabs[scr.id] === 'accessibility' ? styles.specsTabActive : ''}`}
                    onClick={() => handleTabChange(scr.id, 'accessibility')}
                  >
                    Accessibility
                  </button>
                </div>
                
                <div className={styles.specsContent}>
                  {activeTabs[scr.id] === 'product' && (
                    <>
                      <div className={styles.specsTitle}>Purpose</div>
                      <p className={styles.specsBody} style={{ marginBottom: '12px' }}>{scr.purpose}</p>
                      
                      <div className={styles.specsTitle}>Design Decisions &amp; UX Principles</div>
                      <p className={styles.specsBody}>{scr.design}</p>
                    </>
                  )}

                  {activeTabs[scr.id] === 'technical' && (
                    <>
                      <div className={styles.specsTitle}>Key Components &amp; User Benefit</div>
                      <p className={styles.specsBody} style={{ marginBottom: '12px' }}>
                        <strong>Components:</strong> {scr.components}
                        <br />
                        <strong>Benefit:</strong> {scr.benefit}
                      </p>
                      
                      <div className={styles.specsTitle}>Engineering Notes &amp; API Triggers</div>
                      <p className={styles.specsBody}>{scr.engineering}</p>
                    </>
                  )}

                  {activeTabs[scr.id] === 'accessibility' && (
                    <>
                      <div className={styles.specsTitle}>Accessibility Notes</div>
                      <p className={styles.specsBody} style={{ marginBottom: '12px' }}>{scr.accessibility}</p>
                      
                      <div className={styles.specsTitle}>Structural Standards</div>
                      <p className={styles.specsBody}>
                        • Meets WCAG 2.1 AAA standards.
                        <br />
                        • Touch targets are minimum 48x48px (Apple/Android standard).
                        <br />
                        • Screen layout scales gracefully up to 200% font sizing.
                      </p>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Connecting Chevron Arrow (omit for the last element) */}
            {idx < SCREENS.length - 1 && (
              <div className={styles.flowArrow}>
                <ArrowRight size={32} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
