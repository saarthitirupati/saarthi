export interface MapPin {
  id: string;
  nameEn: string;
  nameTe: string;
  category: 'sanctum' | 'queue' | 'laddu' | 'footwear' | 'food' | 'parking' | 'medical' | 'safari' | 'entry' | 'info';
  lat: number;
  lng: number;
  svgX: number; // 0..540
  svgY: number; // 0..340
  descEn: string;
  descTe: string;
  tipEn?: string;
  tipTe?: string;
}

export interface RouteStep {
  stepNumber: number;
  titleEn: string;
  titleTe: string;
  distance: string;
  timeMins: number;
  descEn: string;
  descTe: string;
}

export interface TempleLayoutData {
  placeId: string;
  titleEn: string;
  titleTe: string;
  layoutType: 'ancient-shrine' | 'grand-temple' | 'hill-waterfall' | 'wildlife-safari' | 'heritage-fort' | 'trek-trail' | 'general';
  centerCoordinates: { lat: number; lng: number };
  defaultZoom: number;
  compassBearingDeg: number;
  sanctumNameEn: string;
  sanctumNameTe: string;
  routePath: [number, number][]; // [x, y] coordinates in SVG viewBox 0..540 x 0..340
  pins: MapPin[];
  routeSteps: RouteStep[];
  emergencyContacts: {
    titleEn: string;
    titleTe: string;
    number: string;
  }[];
}

export interface PlaceInputContext {
  id: string;
  name?: string;
  category?: string;
  placeType?: string;
  tags?: string[];
  location?: string;
  coordinates?: { lat: number; lng: number };
}

// ── SPECIAL HIGH-PRIORITY CURATED LAYOUTS ──
export const CURATED_LAYOUTS: Record<string, Partial<TempleLayoutData>> = {
  'venkateswara': {
    placeId: 'venkateswara',
    titleEn: 'Tirumala Srivari Temple Precinct & Queue Map',
    titleTe: 'తిరుమల శ్రీవారి ఆలయ ప్రాంగణం & క్యూ మార్గం',
    layoutType: 'grand-temple',
    centerCoordinates: { lat: 13.6833, lng: 79.3473 },
    routePath: [[80, 290], [140, 250], [110, 150], [170, 90], [270, 110], [380, 180], [450, 100]],
    pins: [
      {
        id: 'sanctum',
        nameEn: 'Ananda Nilayam Sanctum',
        nameTe: 'ఆనంద నిలయం (గర్భాలయం)',
        category: 'sanctum',
        lat: 13.6833,
        lng: 79.3473,
        svgX: 270,
        svgY: 110,
        descEn: 'Sacred gold-plated vimana tower and presiding deity idol.',
        descTe: 'స్వర్ణమయ ఆనంద నిలయ గోపురం మరియు మూలవిరాట్టు.',
        tipEn: 'Silence strictly maintained inside sanctum.',
        tipTe: 'గర్భగుడి లోపల సంపూర్ణ నిశ్శబ్దం పాటించాలి.'
      },
      {
        id: 'vaikuntam-1',
        nameEn: 'Vaikuntam Queue Complex 1 (SED ₹300)',
        nameTe: 'వైకుంఠం క్యూ కాంప్లెక్స్ 1 (₹300 దర్శనం)',
        category: 'queue',
        lat: 13.6830,
        lng: 79.3458,
        svgX: 110,
        svgY: 150,
        descEn: 'Special Entry Darshan (SED ₹300) and VIP line entry.',
        descTe: 'ప్రత్యేక ప్రవేశ దర్శనం (₹300) మరియు ప్రముఖుల క్యూ మార్గం.',
        tipEn: 'Carry printed SED token & original Aadhaar card.',
        tipTe: 'ఆధార్ కార్డు మరియు టికెట్ తప్పనిసరి.'
      },
      {
        id: 'vaikuntam-2',
        nameEn: 'Vaikuntam Queue Complex 2 (Free SSD)',
        nameTe: 'వైకుంఠం క్యూ కాంప్లెక్స్ 2 (ఉచిత సర్వదర్శనం)',
        category: 'queue',
        lat: 13.6838,
        lng: 79.3455,
        svgX: 170,
        svgY: 90,
        descEn: 'Slotted Sarva Darshan (SSD) and free Sarvadarshanam entry line.',
        descTe: 'ఉచిత సర్వదర్శనం మరియు టైమ్ స్లాట్ టోకెన్ల క్యూ మార్గం.',
        tipEn: 'Free milk, water & hot snacks served inside.',
        tipTe: 'క్యూ లైన్ లో ఉచిత పాలు, తాగునీరు, అల్పాహారం లభిస్తాయి.'
      },
      {
        id: 'laddu-complex',
        nameEn: 'Potu & Laddu Distribution Counters',
        nameTe: 'లడ్డూ ప్రసాదం పంపిణీ కౌంటర్లు',
        category: 'laddu',
        lat: 13.6826,
        lng: 79.3482,
        svgX: 380,
        svgY: 190,
        descEn: '40+ automated counters for collecting and buying Tirupati Laddus.',
        descTe: 'తిరుమల లడ్డూ ప్రసాదం పంపిణీ కౌంటర్లు.',
        tipEn: 'Keep UPI / cash and darshan receipt ready.',
        tipTe: 'దర్శనం రసీదు చూపించి లడ్డూలు తీసుకోండి.'
      },
      {
        id: 'footwear-depot',
        nameEn: 'Free Footwear & Baggage Counter',
        nameTe: 'ఉచిత పాదరక్షల & లగేజ్ కేంద్రం',
        category: 'footwear',
        lat: 13.6819,
        lng: 79.3468,
        svgX: 140,
        svgY: 260,
        descEn: 'Free barcode custody counter for shoes and electronic devices.',
        descTe: 'చెప్పులు, బ్యాగులు భద్రపరిచే ఉచిత కౌంటర్.',
        tipEn: 'Collect your barcode token before queue entry.',
        tipTe: 'బార్ కోడ్ రసీదును జాగ్రత్తగా ఉంచుకోండి.'
      },
      {
        id: 'annaprasadam',
        nameEn: 'Tarigonda Vengamamba Annaprasadam',
        nameTe: 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాదం',
        category: 'food',
        lat: 13.6852,
        lng: 79.3462,
        svgX: 450,
        svgY: 100,
        descEn: 'Free unlimited satvik meals served continuously 9 AM - 11 PM.',
        descTe: 'నిత్యాన్నదాన భవనం - ఉచిత స్వామివారి భోజన ప్రసాదం.',
        tipEn: 'No token required. Direct seating.',
        tipTe: 'టోకెన్ అవసరం లేదు, నేరుగా వెళ్ళవచ్చు.'
      }
    ]
  },

  'kapila-theertham': {
    placeId: 'kapila-theertham',
    titleEn: 'Sri Kapileswara Swamy Temple & Waterfall',
    titleTe: 'శ్రీ కపిలేశ్వర స్వామి ఆలయం & జలపాతం',
    layoutType: 'hill-waterfall',
    centerCoordinates: { lat: 13.6548, lng: 79.4215 },
    routePath: [[420, 290], [270, 280], [180, 240], [270, 160], [270, 70]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Approach Road Parking Bay',
        nameTe: 'పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6536,
        lng: 79.4205,
        svgX: 420,
        svgY: 290,
        descEn: 'Vehicle parking opposite the temple garden entrance.',
        descTe: 'ఆలయం సమీపంలో వాహనాల పార్కింగ్.'
      },
      {
        id: 'entrance',
        nameEn: 'Temple Entrance Arch & Gate',
        nameTe: 'ఆలయ ప్రధాన ముఖద్వారం',
        category: 'entry',
        lat: 13.6542,
        lng: 79.4210,
        svgX: 270,
        svgY: 280,
        descEn: 'Main gateway at the foothills of Tirumala.',
        descTe: 'తిరుమల కొండల పాదాల వద్ద ప్రధాన ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Counter',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.6540,
        lng: 79.4208,
        svgX: 180,
        svgY: 240,
        descEn: 'Free custody stand for shoes.',
        descTe: 'ఉచిత చెప్పుల కౌంటర్.'
      },
      {
        id: 'sanctum',
        nameEn: 'Lord Kapileswara Shiva Sanctum',
        nameTe: 'శ్రీ కపిలేశ్వర స్వామి గర్భాలయం',
        category: 'sanctum',
        lat: 13.6548,
        lng: 79.4215,
        svgX: 270,
        svgY: 160,
        descEn: 'Ancient self-manifested Shiva Lingam consecrated by Sage Kapila Maharshi.',
        descTe: 'కపిల మహర్షి తపస్సు చేసిన స్వయంభువు శివలింగం.'
      },
      {
        id: 'waterfall',
        nameEn: 'Sacred Waterfall Cascade & Holy Kund',
        nameTe: 'కపిల తీర్థం జలపాతం & కుండం',
        category: 'info',
        lat: 13.6554,
        lng: 79.4218,
        svgX: 270,
        svgY: 70,
        descEn: 'Sacred mountain waterfall cascading from Tirumala hills directly into the temple theertham pool.',
        descTe: 'తిరుమల కొండల నుండి ఆలయ పుష్కరిణిలోకి ప్రవహించే పవిత్ర జలపాతం.'
      }
    ]
  },

  'padmavathi': {
    placeId: 'padmavathi',
    titleEn: 'Sri Padmavathi Ammavari Temple (Tiruchanur)',
    titleTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం (తిరుచానూరు)',
    layoutType: 'grand-temple',
    centerCoordinates: { lat: 13.6156, lng: 79.4526 },
    routePath: [[430, 290], [270, 275], [170, 260], [170, 130], [270, 110], [380, 110], [370, 210]],
    pins: [
      {
        id: 'parking',
        nameEn: 'TTD Parking Area',
        nameTe: 'టీటీడీ పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6142,
        lng: 79.4508,
        svgX: 430,
        svgY: 290,
        descEn: 'Ample car and bus parking near bypass road.',
        descTe: 'కార్లు మరియు బస్సుల కోసం విశాలమైన పార్కింగ్ ప్రదేశం.'
      },
      {
        id: 'gopuram',
        nameEn: 'Raja Gopuram Entrance',
        nameTe: 'రాజగోపురం ముఖద్వారం',
        category: 'entry',
        lat: 13.6152,
        lng: 79.4518,
        svgX: 270,
        svgY: 275,
        descEn: 'Main eastern entrance tower.',
        descTe: 'ఆలయ ప్రధాన ప్రవేశ గోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Free Footwear Counter',
        nameTe: 'ఉచిత పాదరక్షల కౌంటర్',
        category: 'footwear',
        lat: 13.6150,
        lng: 79.4515,
        svgX: 170,
        svgY: 260,
        descEn: 'Free custody counter for shoes.',
        descTe: 'ఉచిత చెప్పుల కౌంటర్.'
      },
      {
        id: 'sanctum',
        nameEn: 'Goddess Padmavathi Sanctum',
        nameTe: 'శ్రీ పద్మావతి అమ్మవారి గర్భగుడి',
        category: 'sanctum',
        lat: 13.6156,
        lng: 79.4526,
        svgX: 270,
        svgY: 110,
        descEn: 'Sacred sanctum of Sri Padmavathi Devi (Alamelu Manga).',
        descTe: 'అలివేలు మంగా పద్మావతి అమ్మవారి ప్రధాన గర్భాలయం.'
      },
      {
        id: 'padma-sarovaram',
        nameEn: 'Padma Sarovaram Lotus Pond',
        nameTe: 'పద్మ సరోవరం పుష్కరిణి',
        category: 'info',
        lat: 13.6148,
        lng: 79.4532,
        svgX: 380,
        svgY: 110,
        descEn: 'Holy lotus pond where Goddess Padmavathi manifested on a golden lotus.',
        descTe: 'అమ్మవారు అవతరించిన పవిత్ర పద్మ పుష్కరిణి.'
      },
      {
        id: 'prasadam',
        nameEn: 'Amma Laddu & Kumkum Counter',
        nameTe: 'అమ్మవారి లడ్డూ & కుంకుమ కౌంటర్',
        category: 'laddu',
        lat: 13.6159,
        lng: 79.4522,
        svgX: 370,
        svgY: 210,
        descEn: 'Famous Tiruchanur Laddus and blessed kumkum.',
        descTe: 'తిరుచానూరు ప్రసిద్ధ లడ్డూ మరియు ప్రసాదాలు.'
      }
    ]
  },

  'gudimallam-temple': {
    placeId: 'gudimallam-temple',
    titleEn: 'Sri Parasurameswara Swamy Temple (Gudimallam)',
    titleTe: 'శ్రీ పరశురామేశ్వర స్వామి ఆలయం (గుడిమల్లం)',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5694, lng: 79.5781 },
    routePath: [[430, 290], [180, 275], [270, 230], [130, 160], [270, 110]],
    pins: [
      {
        id: 'sanctum',
        nameEn: 'Trimurti Parasurameswara Sanctum',
        nameTe: 'త్రిమూర్తి పరశురామేశ్వర గర్భాలయం',
        category: 'sanctum',
        lat: 13.5694,
        lng: 79.5781,
        svgX: 270,
        svgY: 110,
        descEn: 'World\'s oldest naturalistic Shiva Lingam (3rd Century BCE) carved on single stone with Brahma, Vishnu, and Shiva on a dwarf Yaksha.',
        descTe: 'క్రీ.పూ 3వ శతాబ్దపు ప్రపంచంలోనే అత్యంత పురాతన సహజసిద్ధ శివలింగం.'
      },
      {
        id: 'entrance',
        nameEn: 'Mukha Mandapam & ASI Gate',
        nameTe: 'ముఖ మండపం & ఏఎస్ఐ గేట్',
        category: 'entry',
        lat: 13.5691,
        lng: 79.5783,
        svgX: 270,
        svgY: 230,
        descEn: 'Historical stone entrance gateway under ASI protection.',
        descTe: 'పురావస్తు శాఖ సంరక్షణలోని చారిత్రక ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.5689,
        lng: 79.5780,
        svgX: 180,
        svgY: 275,
        descEn: 'Designated shoe deposit stand outside courtyard.',
        descTe: 'ఆలయ ప్రవేశానికి ముందు చెప్పులు విడిచే స్థలం.'
      },
      {
        id: 'asi-info',
        nameEn: 'ASI Inscription Pillar',
        nameTe: 'పురావస్తు శాసనాల స్తంభం',
        category: 'info',
        lat: 13.5696,
        lng: 79.5778,
        svgX: 130,
        svgY: 160,
        descEn: 'Ancient Chola, Pallava, and Vijayanagara inscriptions detailing temple history.',
        descTe: 'చోళ, పల్లవ మరియు విజయనగర రాజుల కాలం నాటి పురాతన శిలా శాసనాలు.'
      },
      {
        id: 'parking',
        nameEn: 'Approach Parking Area',
        nameTe: 'ఆలయ పార్కింగ్ స్థలం',
        category: 'parking',
        lat: 13.5685,
        lng: 79.5786,
        svgX: 430,
        svgY: 290,
        descEn: 'Shaded open parking space for cars, cabs, and two-wheelers.',
        descTe: 'కార్లు మరియు బైకుల కోసం ఉచిత పార్కింగ్ ప్రదేశం.'
      }
    ]
  },

  'alipiri-mettu': {
    placeId: 'alipiri-mettu',
    titleEn: 'Garuda Statue & Alipiri Footpath Trail Map',
    titleTe: 'గరుడ విగ్రహం & అలిపిరి నడక మార్గం మ్యాప్',
    layoutType: 'trek-trail',
    centerCoordinates: { lat: 13.647051, lng: 79.405856 },
    routePath: [[430, 290], [270, 280], [170, 240], [270, 160], [270, 70]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Alipiri Base Parking & Taxi Bay',
        nameTe: 'అలిపిరి బేస్ పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6465,
        lng: 79.4065,
        svgX: 430,
        svgY: 290,
        descEn: 'Multi-level car and two-wheeler parking plaza at the foot of Tirumala.',
        descTe: 'కార్లు మరియు బైకుల కోసం విస్తారమైన పార్కింగ్ ప్రదేశం.'
      },
      {
        id: 'garuda-statue',
        nameEn: 'Garuda Statue & Padala Mandapam',
        nameTe: 'గరుడ విగ్రహం & పాదాల మండపం',
        category: 'sanctum',
        lat: 13.6470,
        lng: 79.4058,
        svgX: 270,
        svgY: 280,
        descEn: 'Iconic massive statue of Lord Garuda and Padala Mandapam marking the start of the 3,550 sacred steps.',
        descTe: 'అలిపిరి సర్కిల్ వద్ద ఉన్న మహా గరుడ విగ్రహం మరియు పాదాల మండపం.'
      },
      {
        id: 'luggage-counter',
        nameEn: 'Free Luggage & Footwear Transfer Counter',
        nameTe: 'ఉచిత లగేజ్ & పాదరక్షల రవాణా కేంద్రం',
        category: 'footwear',
        lat: 13.6475,
        lng: 79.4052,
        svgX: 170,
        svgY: 240,
        descEn: 'TTD counter that safely transports luggage and footwear to Tirumala hilltop free of charge.',
        descTe: 'కొండపైకి బ్యాగులు, చెప్పులను ఉచితంగా చేరవేసే టీటీడీ కౌంటర్.'
      },
      {
        id: 'galigopuram',
        nameEn: 'Galigopuram (Step 2,000)',
        nameTe: 'గాలిగోపురం (2,000వ మెట్టు)',
        category: 'info',
        lat: 13.6600,
        lng: 79.3800,
        svgX: 270,
        svgY: 160,
        descEn: 'Historic midway tower offering panoramic views of Tirupati town and free Divya Darshan token scan.',
        descTe: 'మధ్యలో ఉన్న చారిత్రక గాలిగోపురం మరియు దివ్య దర్శన స్కానింగ్ పాయింట్.'
      },
      {
        id: 'hilltop-gateway',
        nameEn: 'Tirumala Hilltop Gateway (Step 3,550)',
        nameTe: 'తిరుమల కొండ ప్రవేశ ద్వారం (3,550వ మెట్టు)',
        category: 'entry',
        lat: 13.6800,
        lng: 79.3500,
        svgX: 270,
        svgY: 70,
        descEn: 'Culmination of the 9 km footpath trek arriving directly at GNC tollgate in Tirumala.',
        descTe: 'నడక మార్గం ముగింపు - తిరుమల శ్రీవారి క్షేత్రంలోకి ప్రవేశం.'
      }
    ]
  }
};

/**
 * PONYTAIL DYNAMIC PRECINCT BLUEPRINT ENGINE:
 * Automatically computes authentic vector layout, themed backdrop, pin coordinates,
 * and seamless sequential walking route for all 63 places based on place metadata!
 */
export function getTempleLayout(placeInput: string | PlaceInputContext, fallbackCoords?: { lat: number; lng: number }): TempleLayoutData {
  let placeId = typeof placeInput === 'string' ? placeInput : (placeInput?.id || '');
  placeId = placeId.toLowerCase().trim();

  // If a full place context object was passed, extract rich metadata
  const placeObj = typeof placeInput === 'object' ? placeInput : null;
  const name = placeObj?.name || placeId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const category = (placeObj?.category || '').toLowerCase();
  const placeType = (placeObj?.placeType || '').toLowerCase();
  const tags = (placeObj?.tags || []).map(t => t.toLowerCase());
  const nameLower = name.toLowerCase();

  // Check curated layouts by exact ID or substring match
  const curatedKey = Object.keys(CURATED_LAYOUTS).find(k => k === placeId || placeId.includes(k) || k.includes(placeId) || nameLower.includes(k.replace('-', ' ')));
  if (curatedKey && CURATED_LAYOUTS[curatedKey]) {
    const curated = CURATED_LAYOUTS[curatedKey];
    return {
      placeId,
      titleEn: curated.titleEn || `${name} Precinct Map`,
      titleTe: curated.titleTe || `${name} ప్రాంగణ మ్యాప్`,
      layoutType: curated.layoutType || 'grand-temple',
      centerCoordinates: curated.centerCoordinates || fallbackCoords || { lat: 13.6833, lng: 79.3473 },
      defaultZoom: curated.defaultZoom || 17,
      compassBearingDeg: curated.compassBearingDeg || 0,
      sanctumNameEn: curated.sanctumNameEn || `${name} Sanctum`,
      sanctumNameTe: curated.sanctumNameTe || `${name} గర్భాలయం`,
      routePath: curated.routePath || [[430, 290], [270, 275], [170, 260], [170, 130], [270, 110], [380, 110], [370, 210]],
      pins: (curated.pins as MapPin[]) || [],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Parking Bay', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and proceed to entrance.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
        { stepNumber: 2, titleEn: 'Footwear & Security Check', titleTe: 'పాదరక్షలు & భద్రతా తనిఖీ', distance: '60m', timeMins: 2, descEn: 'Deposit shoes and enter gates.', descTe: 'చెప్పులు విడిచి ప్రవేశించండి.' },
        { stepNumber: 3, titleEn: 'Main Sanctum / Landmark', titleTe: 'ప్రధాన దర్శనం / సందర్శనం', distance: '150m', timeMins: 15, descEn: 'Follow designated pathway.', descTe: 'మార్గం గుండా వెళ్ళండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'Temple / Tourism Helpline', titleTe: 'సమాచార విభాగం', number: '08772264555' },
        { titleEn: 'Emergency Police / Ambulance', titleTe: 'పోలీస్ / అంబులెన్స్', number: '112' }
      ]
    };
  }

  // ── ACCURATE HIERARCHICAL ARCHETYPE CLASSIFICATION ──
  let layoutType: TempleLayoutData['layoutType'] = 'grand-temple';

  // 1. Kapila Theertham special check (Hill Waterfall & Shiva Sanctum)
  if (placeId.includes('kapila') || nameLower.includes('kapila')) {
    layoutType = 'hill-waterfall';
  } else if (category.includes('footstep') || category.includes('footpath') || tags.includes('footsteps') || tags.includes('trekking') || nameLower.includes('garuda statue') || nameLower.includes('mettu') && !nameLower.includes('temple')) {
    layoutType = 'trek-trail';
  } else if (
    placeType === 'spiritual' ||
    category.includes('temple') || 
    category.includes('shrine') || 
    nameLower.includes('temple') || 
    nameLower.includes('mandapam') || 
    nameLower.includes('gopuram') || 
    nameLower.includes('swamy') || 
    nameLower.includes('sanctum') || 
    nameLower.includes('devasthanam') ||
    tags.includes('shiva') || 
    tags.includes('vishnu') || 
    tags.includes('temple')
  ) {
    if (nameLower.includes('mandapam') || tags.includes('ancient') || tags.includes('village') || tags.includes('archaeological') || category.includes('historical')) {
      layoutType = 'ancient-shrine';
    } else {
      layoutType = 'grand-temple';
    }
  } else if (placeId === 'sv-zoo-park' || category.includes('zoo') || tags.includes('zoo') || tags.includes('safari') || tags.includes('wildlife') || tags.includes('park')) {
    layoutType = 'wildlife-safari';
  } else if (category.includes('fort') || tags.includes('fort') || nameLower.includes('fort') || nameLower.includes('mahal') || nameLower.includes('palace')) {
    layoutType = 'heritage-fort';
  } else if (category.includes('waterfall') || tags.includes('waterfall') || nameLower.includes('waterfall') || nameLower.includes('falls') || nameLower.includes('kona') || nameLower.includes('dam') || nameLower.includes('theertham')) {
    layoutType = 'hill-waterfall';
  } else {
    layoutType = 'grand-temple';
  }

  const baseLat = placeObj?.coordinates?.lat || fallbackCoords?.lat || 13.6288;
  const baseLng = placeObj?.coordinates?.lng || fallbackCoords?.lng || 79.4192;

  // Generate tailored pins and sequential non-intersecting route for each layout type
  let generatedPins: MapPin[] = [];
  let generatedRoute: [number, number][] = [];

  if (layoutType === 'trek-trail') {
    generatedRoute = [[430, 290], [270, 280], [170, 230], [270, 160], [270, 70]];
    generatedPins = [
      { id: 'parking', nameEn: 'Trailhead Parking Plaza', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Vehicle parking and taxi drop zone.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: `${name} Entrance Gateway`, nameTe: `${name} ప్రారంభ ముఖద్వారం`, category: 'entry', lat: baseLat - 0.0006, lng: baseLng, svgX: 270, svgY: 280, descEn: 'Iconic gateway and starting point of the pedestrian trail.', descTe: 'నడక మార్గ ప్రారంభ ద్వారం.' },
      { id: 'footwear', nameEn: 'Luggage & Footwear Transfer Depot', nameTe: 'లగేజ్ & పాదరక్షల కేంద్రం', category: 'footwear', lat: baseLat - 0.0004, lng: baseLng - 0.0005, svgX: 170, svgY: 230, descEn: 'Free luggage delivery to the hilltop.', descTe: 'ఉచిత లగేజ్ రవాణా కౌంటర్.' },
      { id: 'info', nameEn: 'Midway Shelter & Token Scan', nameTe: 'విశ్రాంతి షెడ్ & స్కానింగ్ కేంద్రం', category: 'info', lat: baseLat + 0.0004, lng: baseLng, svgX: 270, svgY: 160, descEn: 'Sheltered resting mandapam, drinking water, and ticket scan.', descTe: 'తాగునీరు మరియు విశ్రాంతి షెడ్.' },
      { id: 'sanctum', nameEn: 'Hilltop Summit Destination', nameTe: 'కొండపై ముగింపు కేంద్రం', category: 'sanctum', lat: baseLat + 0.0010, lng: baseLng, svgX: 270, svgY: 70, descEn: 'Culmination of the scenic walking trail.', descTe: 'నడక మార్గం ముగింపు ప్రదేశం.' }
    ];
  } else if (layoutType === 'ancient-shrine') {
    generatedRoute = [[430, 290], [180, 275], [270, 230], [130, 160], [270, 110]];
    generatedPins = [
      { id: 'parking', nameEn: 'Approach Parking Area', nameTe: 'పార్కింగ్ స్థలం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Open parking space for vehicles.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'footwear', nameEn: 'Courtyard Footwear Stand', nameTe: 'పాదరక్షల స్టాండ్', category: 'footwear', lat: baseLat - 0.0006, lng: baseLng - 0.0004, svgX: 180, svgY: 275, descEn: 'Shoe custody counter outside courtyard.', descTe: 'చెప్పులు విడిచే ప్రదేశం.' },
      { id: 'entry', nameEn: 'Mukha Mandapam / Gateway', nameTe: 'ముఖ మండపం ద్వారం', category: 'entry', lat: baseLat - 0.0004, lng: baseLng, svgX: 270, svgY: 230, descEn: 'Historical stone entrance gateway.', descTe: 'ఆలయ ప్రవేశ ద్వారం.' },
      { id: 'info', nameEn: 'Historical Heritage Inscriptions', nameTe: 'పురావస్తు శాసనాలు', category: 'info', lat: baseLat, lng: baseLng - 0.0006, svgX: 130, svgY: 160, descEn: 'Ancient stone inscriptions and carvings detailing heritage.', descTe: 'రాతి శాసనాలు మరియు చారిత్రక వివరాలు.' },
      { id: 'sanctum', nameEn: `${name} Sanctum`, nameTe: `${name} గర్భాలయం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 110, descEn: 'Sacred inner sanctum sanctorum and deity idol.', descTe: 'ప్రధాన గర్భాలయం మరియు మూలవిరాట్టు.' }
    ];
  } else if (layoutType === 'hill-waterfall') {
    generatedRoute = [[420, 290], [270, 280], [180, 230], [270, 160], [270, 70]];
    generatedPins = [
      { id: 'parking', nameEn: 'Trailhead & Parking Bay', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 420, svgY: 290, descEn: 'Vehicles drop and starting point of the nature trail.', descTe: 'వాహనాల పార్కింగ్ మరియు ట్రయల్ ప్రారంభం.' },
      { id: 'entry', nameEn: 'Entrance Checkpoint & Gateway', nameTe: 'ప్రవేశ ముఖద్వారం', category: 'entry', lat: baseLat - 0.0007, lng: baseLng + 0.0002, svgX: 270, svgY: 280, descEn: 'Entry checkpoint and ticket counter.', descTe: 'ప్రవేశ ద్వారం మరియు టికెట్ కేంద్రం.' },
      { id: 'footwear', nameEn: 'Footwear & Rest Stand', nameTe: 'పాదరక్షల స్టాండ్', category: 'footwear', lat: baseLat - 0.0005, lng: baseLng - 0.0004, svgX: 180, svgY: 230, descEn: 'Rest area and designated footwear stand before the holy pool.', descTe: 'చెప్పులు భద్రపరిచే స్థలం.' },
      { id: 'sanctum', nameEn: `${name} Main Sanctum / Landmark`, nameTe: `${name} ప్రధాన క్షేత్రం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 160, descEn: 'Primary sacred sanctum and viewing area.', descTe: 'ప్రధాన దర్శన ప్రదేశం.' },
      { id: 'info', nameEn: 'Sacred Waterfall & Kund', nameTe: 'పవిత్ర జలపాతం & కుండం', category: 'info', lat: baseLat + 0.0006, lng: baseLng, svgX: 270, svgY: 70, descEn: 'Sacred mountain waterfall cascading into crystal theertham pool.', descTe: 'పవిత్ర తీర్థం మరియు జలపాతం.' }
    ];
  } else if (layoutType === 'wildlife-safari') {
    generatedRoute = [[420, 300], [270, 290], [210, 250], [140, 180], [270, 140], [400, 100]];
    generatedPins = [
      { id: 'parking', nameEn: 'Visitor Parking Bay', nameTe: 'సందర్శకుల పార్కింగ్', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 420, svgY: 300, descEn: 'Shaded 4-wheeler and 2-wheeler parking.', descTe: 'కార్లు మరియు బైకుల పార్కింగ్ ప్రదేశం.' },
      { id: 'entry', nameEn: 'Main Entrance & Tickets', nameTe: 'ప్రధాన ప్రవేశ ద్వారం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 290, descEn: 'Entry gates, cart bookings, and cloakroom.', descTe: 'ప్రవేశ ద్వారం మరియు బ్యాటరీ కార్ల బుకింగ్.' },
      { id: 'safari-carts', nameEn: 'Battery Vehicle Station', nameTe: 'బ్యాటరీ వాహనాల స్టేషన్', category: 'safari', lat: baseLat - 0.0003, lng: baseLng - 0.0005, svgX: 210, svgY: 250, descEn: 'Eco-friendly battery cart boarding and departure.', descTe: 'బ్యాటరీ వాహనాలు ఎక్కే కేంద్రం.' },
      { id: 'herbivore', nameEn: 'Herbivore & Deer Valley', nameTe: 'శాకాహార జంతువుల ఆవరణ', category: 'safari', lat: baseLat, lng: baseLng - 0.0008, svgX: 140, svgY: 180, descEn: 'Natural woodland reserve for spotted deer and blackbucks.', descTe: 'జింకలు, దుప్పుల సహజ ఆవరణ.' },
      { id: 'aviary', nameEn: 'Walk-Through Aviary Dome', nameTe: 'పక్షుల శాల (ఏవియరీ)', category: 'info', lat: baseLat + 0.0004, lng: baseLng, svgX: 270, svgY: 140, descEn: 'Exotic bird sanctuary and photography deck.', descTe: 'రంగురంగుల పక్షుల కేంద్రం.' },
      { id: 'predator', nameEn: 'Predator & Safari Reserve', nameTe: 'క్రూర జంతువుల సఫారీ', category: 'safari', lat: baseLat + 0.0008, lng: baseLng + 0.0006, svgX: 400, svgY: 100, descEn: 'Open caged safari rides through predator zones.', descTe: 'రక్షిత వాహనాలలో అడవి సఫారీ.' }
    ];
  } else {
    // 5. GRAND TEMPLE: Clean Clockwise Pradakshina Route (NO CRISS-CROSS)
    // Flow: Parking -> Entrance -> Footwear -> Corridor Walkway -> Sanctum -> Pushkarini -> Prasadam Exit
    generatedRoute = [[430, 290], [270, 275], [170, 260], [170, 130], [270, 110], [380, 110], [370, 210]];
    generatedPins = [
      { id: 'parking', nameEn: `${name} Parking Bay`, nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Dedicated vehicle parking and taxi drop zone.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Raja Gopuram Entrance', nameTe: 'రాజగోపురం ముఖద్వారం', category: 'entry', lat: baseLat - 0.0007, lng: baseLng, svgX: 270, svgY: 275, descEn: 'Main gateway tower facing east.', descTe: 'ఆలయ ప్రధాన ప్రవేశ గోపురం.' },
      { id: 'footwear', nameEn: 'Free Footwear Counter', nameTe: 'ఉచిత పాదరక్షల కౌంటర్', category: 'footwear', lat: baseLat - 0.0006, lng: baseLng - 0.0005, svgX: 170, svgY: 260, descEn: 'Free shoe keeping counter with token safety.', descTe: 'ఉచిత చెప్పుల కౌంటర్.' },
      { id: 'sanctum', nameEn: `${name} Sanctum`, nameTe: `${name} గర్భగుడి`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 110, descEn: 'Sacred inner sanctum sanctorum and presiding deity.', descTe: 'ప్రధాన గర్భాలయం మరియు స్వామి/అమ్మవారి దర్శనం.' },
      { id: 'pushkarini', nameEn: 'Sacred Pushkarini Tank', nameTe: 'పుష్కరిణి తీర్థం', category: 'info', lat: baseLat, lng: baseLng + 0.0008, svgX: 380, svgY: 110, descEn: 'Holy temple water tank for holy water sprinkling.', descTe: 'పవిత్ర ఆలయ పుష్కరిణి.' },
      { id: 'laddu', nameEn: 'Prasadam & Laddu Counter', nameTe: 'ప్రసాదం కౌంటర్', category: 'laddu', lat: baseLat - 0.0004, lng: baseLng + 0.0005, svgX: 370, svgY: 210, descEn: 'Sacred laddu, pulihora, and blessed prasadam counter.', descTe: 'స్వామివారి ప్రసాదం కౌంటర్.' }
    ];
  }

  return {
    placeId,
    titleEn: `${name} Precinct Map`,
    titleTe: `${name} ప్రాంగణ మ్యాప్`,
    layoutType,
    centerCoordinates: { lat: baseLat, lng: baseLng },
    defaultZoom: 17,
    compassBearingDeg: 0,
    sanctumNameEn: `${name} Main Landmark`,
    sanctumNameTe: `${name} ప్రధాన ప్రదేశం`,
    routePath: generatedRoute,
    pins: generatedPins,
    routeSteps: [
      { stepNumber: 1, titleEn: 'Arrival & Parking Bay', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and walk towards the main entrance.', descTe: 'వాహనాన్ని పార్కింగ్ చేసి ప్రవేశ ద్వారం వైపు రండి.' },
      { stepNumber: 2, titleEn: 'Footwear & Entry Clearance', titleTe: 'పాదరక్షలు & భద్రతా తనిఖీ', distance: '60m', timeMins: 2, descEn: 'Leave shoes at the counter and proceed.', descTe: 'చెప్పులు విడిచి ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: `Main ${layoutType === 'trek-trail' ? 'Footpath Staircase' : layoutType === 'hill-waterfall' ? 'Waterfall Walkway' : layoutType === 'wildlife-safari' ? 'Safari & Aviary Tour' : 'Sanctum Darshan'}`, titleTe: 'ప్రధాన దర్శనం / సందర్శనం', distance: '140m', timeMins: 15, descEn: 'Follow the designated pathway.', descTe: 'నిర్దేశిత మార్గం గుండా వెళ్ళండి.' },
      { stepNumber: 4, titleEn: 'Prasadam / Exit Corridor', titleTe: 'ప్రసాదం / నిష్క్రమణ', distance: '200m', timeMins: 5, descEn: 'Complete visit and exit through the pathway.', descTe: 'సందర్శన పూర్తి చేసుకుని నిష్క్రమించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Tourism / Pilgrim Helpline', titleTe: 'సమాచార హెల్ప్‌లైన్', number: '08772264555' },
      { titleEn: 'Emergency Police / Ambulance', titleTe: 'పోలీస్ / అంబులెన్స్', number: '112' }
    ]
  };
}
