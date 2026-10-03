'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, Sparkles, Target, Compass, Heart, ShieldCheck, 
  MapPin, Award, CheckCircle2, Mail, Globe, Users, ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const PASSPORT_PHOTO_URL = 'https://res.cloudinary.com/kniegqlj/image/upload/v1791044338/passportsize_f7dyq3.jpg';

const TEXTS = {
  en: {
    back: 'Back to Home',
    title: 'About Saarthi',
    subtitle: 'From Free Time to Meaningful Memories',
    tagline: 'Your Trusted Divine Companion for Tirupati & Tirumala',
    
    // Founder Section
    meetFounder: 'Meet the Founder',
    founderName: 'Sunil Thatra',
    founderRole: 'Founder & Lead Creator, Saarthi',
    founderBio1: 'Saarthi was founded by Sunil Thatra with a singular mission: to make travel and pilgrimage in Tirupati simpler, smarter, and profoundly meaningful for millions of devotees.',
    founderBio2: 'From the initial vision and technology stack to product design, algorithm architecture, and ground verification, Sunil led the end-to-end creation of Saarthi. Built out of deep personal reverence and local understanding of the Seshachalam region, Saarthi solves real pilgrim pain points like live wait-time estimation, token counter tracking, and offline precinct navigation.',
    
    // Mission & Vision
    missionTitle: 'Our Mission',
    missionDesc: 'To eliminate anxiety for pilgrims visiting Tirupati and Tirumala through real-time guidance, transparent queue telemetry, and offline-first technology.',
    visionTitle: 'Our Vision',
    visionDesc: 'To become the gold standard digital companion for sacred pilgrimages across India, seamlessly connecting ancient heritage with modern intelligence.',

    // Why Saarthi
    whyTitle: 'Why Saarthi Exists',
    whySubtitle: 'Solving the Core Challenges of Tirupati Pilgrims',
    points: [
      {
        title: '100% Verified Ground Data',
        desc: 'Over 93+ key landmarks, temples, and precinct gates mapped with exact GPS coordinates and audited integrity.'
      },
      {
        title: 'Real-Time Queue Telemetry',
        desc: 'Instant updates on Sarva Darshan wait times, SSD token counter status, and Alipiri / Srivari Mettu footpath conditions.'
      },
      {
        title: 'Offline-First Precinct Maps',
        desc: 'Seamlessly works atop Tirumala hill even when mobile networks fail or signal is jammed in dense queue compartments.'
      },
      {
        title: 'Respect for Tradition',
        desc: 'Strict adherence to TTD Agama Sastra rules, dress codes, ritual timings, and authentic Sthala Puranas.'
      }
    ],

    // Story
    storyTitle: 'Our Story',
    storyP1: 'Navigating the sacred hills of Tirumala can be overwhelming. Millions of pilgrims travel long distances only to face complex queues, uncertain token availability, and network drops.',
    storyP2: 'Saarthi was built from the ground up to serve as a digital "Charioteer" (సారథి) — guiding pilgrims before they arrive, during their trek up the hills, and throughout their sacred darshan journey.',

    // Contact Footer
    contactTitle: 'Get in Touch',
    contactDesc: 'Have feedback or suggestions to improve the pilgrim experience?',
    emailUs: 'Email Team Saarthi'
  },
  te: {
    back: 'హోమ్‌కు తిరిగి వెళ్ళండి',
    title: 'సారథి గురించి',
    subtitle: 'మీ యాత్రను సులభం, సురక్షితం మరియు అర్ధవంతం చేసే దివ్య డిజిటల్ సహచరి',
    tagline: 'తిరుమల మరియు తిరుపతి భక్తుల విశ్వసనీయ సహాయకుడు',

    // Founder Section
    meetFounder: 'వ్యవస్థాపకుని పరిచయం',
    founderName: 'సునీల్ తాత్రా',
    founderRole: 'వ్యవస్థాపకుడు & లీడ్ క్రియేటర్, సారథి',
    founderBio1: 'తిరుపతి మరియు తిరుమల యాత్ర చేసే కోట్లాది మంది భక్తులకు మార్గదర్శనం సరళంగా, స్మార్ట్‌గా మరియు ఆధ్యాత్మికంగా మార్చాలనే గొప్ప ఆలోచనతో సునీల్ తాత్రా గారు "సారథి" ని ప్రారంభించారు.',
    founderBio2: 'ప్రారంభ ఆలోచన, సాంకేతిక నిర్మాణం, డిజైన్, ఆల్గారిథమ్స్ మరియు ప్రదేశాల పరిశీలన అంతా సునీల్ స్వయంగా నిర్వహించారు. తిరుమల కొండపై రద్దీ, ఉచిత SSD టోకెన్లు, ఆఫ్‌లైన్ ఆలయ మ్యాప్‌లు మరియు ఘాట్ రోడ్ నిబంధనలను భక్తులకు సులభంగా అందించడమే సారథి లక్ష్యం.',

    // Mission & Vision
    missionTitle: 'మా లక్ష్యం (Mission)',
    missionDesc: 'ప్రత్యక్ష సమయ దర్శన అప్‌డేట్‌లు, ఉచిత టోకెన్ వివరాలు మరియు ఆఫ్‌లైన్ మ్యాప్‌ల ద్వారా తిరుమల-తిరుపతి యాత్రికుల ఇబ్బందులను తొలగించడం.',
    visionTitle: 'మా దృష్టి (Vision)',
    visionDesc: 'భారతదేశంలోని ప్రముఖ పుణ్యక్షేత్రాలకు ఆధునిక సాంకేతికతతో కూడిన అత్యుత్తమ డిజిటల్ యాత్రా సహచరిగా నిలవడం.',

    // Why Saarthi
    whyTitle: 'సారథి ప్రత్యేకతలు',
    whySubtitle: 'భక్తుల అవసరాలకు తగిన పరిష్కారాలు',
    points: [
      {
        title: '100% పరిశీలించిన స్థానిక సమాచారం',
        desc: '93కి పైగా పవిత్ర ఆలయాలు, దర్శన కేంద్రాలు మరియు సదుపాయాల కచ్చితమైన GPS మ్యాపింగ్.'
      },
      {
        title: 'ప్రత్యక్ష రద్దీ & దర్శన సమయాలు',
        desc: 'సర్వ దర్శనం నిరీక్షణ సమయం, SSD ఉచిత టోకెన్ కౌంటర్ల స్థితి మరియు అలిపిరి/శ్రీవారి మెట్టు సమాచారం.'
      },
      {
        title: 'ఆఫ్‌లైన్ ఆలయ మ్యాప్‌లు',
        desc: 'తిరుమల కొండపై నెట్‌వర్క్ లేకపోయినా 100% సజావుగా పనిచేసే మ్యాప్‌లు.'
      },
      {
        title: 'ఆలయ సంప్రదాయాల గౌరవం',
        desc: 'TTD నిబంధనలు, దుస్తుల నియమావళి, పూజా సమయాలు మరియు స్థల పురాణాల కచ్చితమైన సమర్పణ.'
      }
    ],

    // Story
    storyTitle: 'సారథి ప్రయాణం',
    storyP1: 'తిరుమల శేషాచల కొండలలో యాత్ర చేసేటప్పుడు సరైన సమాచారం లేక భక్తులు తీవ్ర ఇబ్బందులు ఎదుర్కొంటారు.',
    storyP2: 'భక్తులకు ఒక నిజమైన "సారథి"లా మార్గదర్శనం చేస్తూ — యాత్ర ప్రారంభం నుండి దర్శనం పూర్తయ్యే వరకు ప్రతి అడుగులో తోడుగా ఉండటానికి ఈ అప్లికేషన్ రూపొందించబడింది.',

    // Contact Footer
    contactTitle: 'మమ్మల్ని సంప్రదించండి',
    contactDesc: 'మీ సూచనలు మరియు అభిప్రాయాలను పంచుకోండి:',
    emailUs: 'సారథి టీమ్‌కు ఇమెయిల్ చేయండి'
  }
};

export default function AboutPage() {
  const lang = useLanguage();
  const t = TEXTS[lang];

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* ── HEADER ── */}
      <header style={{ 
        padding: '18px 20px', 
        background: '#FFFFFF', 
        borderBottom: '1px solid #ECE9E3',
        position: 'sticky', 
        top: 0, 
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link 
              href="/" 
              style={{ 
                background: '#F0FDF4', 
                border: '1px solid #BBF7D0', 
                borderRadius: '50%', 
                width: '38px', 
                height: '38px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={19} color="#0F5132" />
            </Link>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F5132', margin: 0, letterSpacing: '-0.01em', fontFamily: 'Georgia, serif' }}>
                {t.title}
              </h1>
              <p style={{ fontSize: '11.5px', color: '#C89B3C', margin: '1px 0 0 0', fontWeight: 700 }}>
                {t.subtitle}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF9C3', border: '1px solid #FDE047', padding: '4px 10px', borderRadius: '20px' }}>
            <Sparkles size={13} color="#CA8A04" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#854D0E' }}>Official Guide</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* HERO BANNER CARD */}
        <div style={{
          background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
          borderRadius: '28px',
          padding: '32px 24px',
          color: '#FFFFFF',
          boxShadow: '0 12px 32px -4px rgba(15, 81, 50, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#FDE047', 
              backgroundColor: 'rgba(253, 224, 71, 0.15)', 
              border: '1px solid rgba(253, 224, 71, 0.3)', 
              padding: '4px 12px', 
              borderRadius: '20px',
              marginBottom: '14px'
            }}>
              <Compass size={13} />
              <span>Saarthi • Your Tirumala Companion</span>
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 5vw, 34px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              {t.tagline}
            </h2>
            <p style={{ fontSize: '14px', color: '#D1FAE5', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
              &quot;From Free Time to Meaningful Memories&quot; — Built with deep reverence, precision engineering, and local expertise for pilgrims visiting Sri Venkateswara Swamy in Tirupati and Tirumala.
            </p>
          </div>
        </div>

        {/* ── MEET THE FOUNDER SECTION ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #ECE9E3',
          boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEF9C3', border: '1px solid #FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={16} color="#CA8A04" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t.meetFounder}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {/* Founder Photo */}
              <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '24px', overflow: 'hidden', border: '3px solid #C89B3C', boxShadow: '0 8px 20px rgba(200, 155, 60, 0.25)', flexShrink: 0 }}>
                <Image 
                  src={PASSPORT_PHOTO_URL} 
                  alt="Sunil Thatra - Founder of Saarthi"
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>

              <div>
                <h4 style={{ fontSize: '22px', fontWeight: 900, color: '#0F5132', margin: '0 0 4px 0', fontFamily: 'Georgia, serif' }}>
                  {t.founderName}
                </h4>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#C89B3C', margin: '0 0 8px 0' }}>
                  {t.founderRole}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '12px' }}>Product Vision</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '12px' }}>Technology & Code</span>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '12px' }}>Ground Data Audit</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155', lineHeight: 1.65 }}>
              <p style={{ margin: 0 }}>{t.founderBio1}</p>
              <p style={{ margin: 0 }}>{t.founderBio2}</p>
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Mission */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #ECE9E3',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Target size={20} color="#0F5132" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.missionTitle}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              {t.missionDesc}
            </p>
          </div>

          {/* Vision */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid #ECE9E3',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFFBEB', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sparkles size={20} color="#CA8A04" />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
              {t.visionTitle}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
              {t.visionDesc}
            </p>
          </div>

        </div>

        {/* ── WHY SAARTHI EXISTS ── */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #ECE9E3',
          boxShadow: '0 6px 20px -4px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
              {t.whyTitle}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0, fontWeight: 500 }}>
              {t.whySubtitle}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {t.points.map((pt, idx) => (
              <div key={idx} style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={16} color="#0F5132" />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {pt.title}
                  </h4>
                </div>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section style={{
          backgroundColor: '#FFFDF7',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1px solid #FDE68A',
          boxShadow: '0 6px 20px -4px rgba(200, 155, 60, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Heart size={18} color="#D97706" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#78350F', margin: 0 }}>
              {t.storyTitle}
            </h3>
          </div>
          <div style={{ fontSize: '13.5px', color: '#854D0E', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>{t.storyP1}</p>
            <p style={{ margin: 0 }}>{t.storyP2}</p>
          </div>
        </section>

        {/* ── CONTACT & FOOTER ── */}
        <footer style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #ECE9E3',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {t.contactTitle}
          </h4>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            {t.contactDesc}
          </p>
          <a 
            href="mailto:teamsaarthiguide9@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0F5132',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(15, 81, 50, 0.2)'
            }}
          >
            <Mail size={15} />
            <span>{t.emailUs} (teamsaarthiguide9@gmail.com)</span>
          </a>
        </footer>

      </main>
    </div>
  );
}
