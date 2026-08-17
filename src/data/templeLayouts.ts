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
  layoutType: 
    | 'ancient-shrine' 
    | 'city-shrine'
    | 'grand-temple' 
    | 'sacred-pushkarini'
    | 'hill-waterfall' 
    | 'wildlife-safari' 
    | 'heritage-fort' 
    | 'trek-trail' 
    | 'geo-nature-park'
    | 'shopping-market'
    | 'dining-restaurant'
    | 'museum-gallery'
    | 'cultural-park'
    | 'general';
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
        descTe: 'స్వర్ణమయ ఆనంద నిలయ గోపురం మరియు మూలవిరాట్టు.'
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
        descTe: 'ప్రత్యేక ప్రవేశ దర్శనం (₹300) మరియు ప్రముఖుల క్యూ మార్గం.'
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
        descTe: 'ఉచిత సర్వదర్శనం మరియు టైమ్ స్లాట్ టోకెన్ల క్యూ మార్గం.'
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
        descTe: 'తిరుమల లడ్డూ ప్రసాదం పంపిణీ కౌంటర్లు.'
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
        descTe: 'చెప్పులు, బ్యాగులు భద్రపరిచే ఉచిత కౌంటర్.'
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
        descTe: 'నిత్యాన్నదాన భవనం - ఉచిత స్వామివారి భోజన ప్రసాదం.'
      }
    ]
  },

  'silathoranam': {
    placeId: 'silathoranam',
    titleEn: 'Silathoranam Natural Geological Arch & Park',
    titleTe: 'శిలాతోరణం సహజ శిలా వంపు & ఉద్యానవనం',
    layoutType: 'geo-nature-park',
    centerCoordinates: { lat: 13.6914, lng: 79.3412 },
    routePath: [[430, 290], [270, 275], [160, 190], [270, 100], [380, 140]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Silathoranam Visitor Parking Bay',
        nameTe: 'శిలాతోరణం పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6908,
        lng: 79.3418,
        svgX: 430,
        svgY: 290,
        descEn: 'Dedicated vehicle parking area with shaded trees.',
        descTe: 'వాహనాల పార్కింగ్ ప్రదేశం.'
      },
      {
        id: 'entry',
        nameEn: 'Geological Park Welcome Gateway',
        nameTe: 'ఉద్యానవనం ప్రధాన ప్రవేశ ద్వారం',
        category: 'entry',
        lat: 13.6910,
        lng: 79.3415,
        svgX: 270,
        svgY: 275,
        descEn: 'Entrance to the national geological monument park.',
        descTe: 'జాతీయ భూగర్భ స్మారక ఉద్యానవన ప్రవేశం.'
      },
      {
        id: 'garden-path',
        nameEn: 'Landscaped Botanical Garden Promenade',
        nameTe: 'సుందర వృక్ష ఉద్యానవన మార్గం',
        category: 'info',
        lat: 13.6912,
        lng: 79.3410,
        svgX: 160,
        svgY: 190,
        descEn: 'Paved garden path surrounded by lush Seshachalam endemic flora.',
        descTe: 'శేషాచలం అరుదైన వృక్ష జాతులతో కూడిన అందమైన నడక దారి.'
      },
      {
        id: 'sanctum',
        nameEn: 'Silathoranam Natural Rock Arch (2.5B Yrs Old)',
        nameTe: 'శిలాతోరణం సహజ శిలా వంపు (250 కోట్ల సంవత్సరాల పురాతనం)',
        category: 'sanctum',
        lat: 13.6915,
        lng: 79.3412,
        svgX: 270,
        svgY: 100,
        descEn: 'World-famous 2.5 billion year old natural pre-Cambrian geological rock arch formation spanning 25 feet across.',
        descTe: 'ప్రపంచ ప్రసిద్ధ సహజసిద్ధ రాతి తోరణం - 250 కోట్ల సంవత్సరాల పురాతన అద్భుతం.'
      },
      {
        id: 'viewing-deck',
        nameEn: 'ASI Geological Viewing Deck & Photo Point',
        nameTe: 'వీక్షణ వేదిక & ఫోటో పాయింట్',
        category: 'info',
        lat: 13.6917,
        lng: 79.3414,
        svgX: 380,
        svgY: 140,
        descEn: 'Railed viewing platform for photography and viewing the geological strata.',
        descTe: 'శిలాతోరణాన్ని తిలకించేందుకు మరియు ఫోటోలు తీసుకునేందుకు వీక్షణ వేదిక.'
      }
    ]
  },

  'swami-pushkarini': {
    placeId: 'swami-pushkarini',
    titleEn: 'Swami Pushkarini Holy Lake & Stepped Ghats',
    titleTe: 'స్వామి పుష్కరిణి పవిత్ర తీర్థం & ఘాట్లు',
    layoutType: 'sacred-pushkarini',
    centerCoordinates: { lat: 13.6837, lng: 79.3480 },
    routePath: [[430, 290], [270, 275], [160, 240], [270, 140], [150, 85], [390, 160]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Central Tirumala Parking Bay',
        nameTe: 'తిరుమల సెంట్రల్ పార్కింగ్',
        category: 'parking',
        lat: 13.6828,
        lng: 79.3475,
        svgX: 430,
        svgY: 290,
        descEn: 'Designated vehicle parking near CRO and Bata Gangamma square.',
        descTe: 'సి.ఆర్.ఓ సమీపంలోని వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Swami Pushkarini Main Entrance',
        nameTe: 'పుష్కరిణి ప్రధాన ప్రవేశ ద్వారం',
        category: 'entry',
        lat: 13.6832,
        lng: 79.3478,
        svgX: 270,
        svgY: 275,
        descEn: 'Main gateway leading into the sacred Pushkarini parikrama promenade.',
        descTe: 'పుష్కరిణి ఘాట్ల వైపు వెళ్ళే ప్రధాన ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear & Changing Room Stand',
        nameTe: 'పాదరక్షలు & డ్రెస్సింగ్ రూమ్స్',
        category: 'footwear',
        lat: 13.6833,
        lng: 79.3474,
        svgX: 160,
        svgY: 240,
        descEn: 'Free footwear custody counter and separate changing rooms for pilgrims.',
        descTe: 'చెప్పులు విడిచే స్థలం మరియు దుస్తులు మార్చుకునే గదులు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Swami Pushkarini Holy Stepped Tank',
        nameTe: 'స్వామి పుష్కరిణి పవిత్ర తీర్థం (కోనేరు)',
        category: 'sanctum',
        lat: 13.6837,
        lng: 79.3480,
        svgX: 270,
        svgY: 140,
        descEn: 'Sacred 1.5-acre holy water lake brought from Vaikuntam by Garuda. Taking a holy dip or prokshana here cleanses sins before Srivari Darshan.',
        descTe: 'శ్రీవారి దర్శనానికి ముందు పుణ్యస్నానం ఆచరించే పవిత్ర దివ్య తీర్థం.'
      },
      {
        id: 'varahaswamy',
        nameEn: 'Sri Bhu Varaha Swamy Temple (North Bank)',
        nameTe: 'శ్రీ భూ వరాహ స్వామి ఆలయం',
        category: 'info',
        lat: 13.6841,
        lng: 79.3476,
        svgX: 150,
        svgY: 85,
        descEn: 'Ancient temple on the northwest bank of Pushkarini. By tradition, pilgrims visit Varahaswamy first.',
        descTe: 'పుష్కరిణి ఒడ్డున ఉన్న ఆది వరాహ స్వామి ఆలయం.'
      },
      {
        id: 'temple-way',
        nameEn: 'Pathway to Sri Vari Temple Mahadwaram',
        nameTe: 'శ్రీవారి ప్రధాన ఆలయ మార్గం',
        category: 'info',
        lat: 13.6835,
        lng: 79.3485,
        svgX: 390,
        svgY: 160,
        descEn: 'Covered stone walkway connecting directly to the main entrance of Tirumala Temple.',
        descTe: 'శ్రీవారి ప్రధాన ఆలయం మహాద్వారం వైపు వెళ్ళే మార్గం.'
      }
    ]
  },

  'srivari-museum': {
    placeId: 'srivari-museum',
    titleEn: 'Srivari Museum & TTD ₹125 Cr Modernization Project',
    titleTe: 'శ్రీవారి మ్యూజియం & టీటీడీ ఆధునీకరణ ప్రాజెక్ట్',
    layoutType: 'museum-gallery',
    centerCoordinates: { lat: 13.6840, lng: 79.3433 },
    routePath: [[430, 290], [270, 275], [170, 220], [270, 120], [380, 140]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Central CRO Visitor Parking',
        nameTe: 'సి.ఆర్.ఓ సెంట్రల్ పార్కింగ్',
        category: 'parking',
        lat: 13.6835,
        lng: 79.3430,
        svgX: 430,
        svgY: 290,
        descEn: 'Central Tirumala vehicle parking directly opposite the CRO office square.',
        descTe: 'సి.ఆర్.ఓ కార్యాలయం ఎదురుగా ఉన్న వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Museum Welcome Arch & CRO Plaza',
        nameTe: 'మ్యూజియం ప్రవేశ ద్వారం & ప్లాజా',
        category: 'entry',
        lat: 13.6838,
        lng: 79.3432,
        svgX: 270,
        svgY: 275,
        descEn: 'Main gateway facing the CRO office circle in central Tirumala.',
        descTe: 'తిరుమల సి.ఆర్.ఓ కూడలి వద్ద ప్రధాన ప్రవేశం.'
      },
      {
        id: 'project-desk',
        nameEn: 'TTD ₹125 Cr Modernization Project Info',
        nameTe: 'టీటీడీ ₹125 కోట్ల ఆధునీకరణ సమాచార బోర్డు',
        category: 'info',
        lat: 13.6839,
        lng: 79.3431,
        svgX: 170,
        svgY: 220,
        descEn: 'Project briefing on the upcoming 3D spiritual digital museum in collaboration with TCS.',
        descTe: 'టీసీఎస్ సహకారంతో నిర్మిస్తున్న అత్యాధునిక 3D డిజిటల్ మ్యూజియం వివరాలు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Srivari Museum Complex (Under Active Reconstruction)',
        nameTe: 'శ్రీవారి మ్యూజియం కాంప్లెక్స్ (నిర్మాణ పనులలో ఉంది)',
        category: 'sanctum',
        lat: 13.6840,
        lng: 79.3433,
        svgX: 270,
        svgY: 120,
        descEn: 'The historic museum building currently undergoing comprehensive structural redevelopment and digital exhibition setup.',
        descTe: 'ప్రస్తుతం పునర్నిర్మాణంలో ఉన్న ప్రధాన మ్యూజియం భవనం.'
      },
      {
        id: 'future-gallery',
        nameEn: 'Future 3D Immersive Spiritual Gallery Wing',
        nameTe: 'నూతన 3D డిజిటల్ ఆధ్యాత్మిక ప్రదర్శన విభాగం',
        category: 'info',
        lat: 13.6842,
        lng: 79.3435,
        svgX: 380,
        svgY: 140,
        descEn: 'Upcoming state-of-the-art immersive halls showcasing Venkateswara Vaibhavam and sacred temple artifacts.',
        descTe: 'శ్రీవారి వైభవాన్ని కళ్ళకు కట్టే నూతన డిజిటల్ గ్యాలరీ.'
      }
    ]
  },

  'alipiri-padhala-mandapam': {
    placeId: 'alipiri-padhala-mandapam',
    titleEn: 'Alipiri Padhala Mandapam & Rajagopuram',
    titleTe: 'అలిపిరి పాదాల మండపం & రాజగోపురం',
    layoutType: 'trek-trail',
    centerCoordinates: { lat: 13.6542, lng: 79.4005 },
    routePath: [[430, 290], [270, 275], [170, 230], [270, 160], [270, 70]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Alipiri Base Parking Plaza',
        nameTe: 'అలిపిరి పార్కింగ్ కాంప్లెక్స్',
        category: 'parking',
        lat: 13.6535,
        lng: 79.4000,
        svgX: 430,
        svgY: 290,
        descEn: 'Multi-level vehicle & two-wheeler parking opposite Garuda Circle.',
        descTe: 'గరుడ సర్కిల్ వద్ద విశాలమైన వాహనాల పార్కింగ్.'
      },
      {
        id: 'entrance',
        nameEn: 'Alipiri Raja Gopuram Gateway',
        nameTe: 'అలిపిరి రాజగోపురం ముఖద్వారం',
        category: 'entry',
        lat: 13.6540,
        lng: 79.4003,
        svgX: 270,
        svgY: 275,
        descEn: 'Historic 7-tier gateway welcoming all pilgrims to the sacred hills.',
        descTe: 'తిరుమల కొండల ప్రారంభంలోని పవిత్ర సప్తవర్ణ రాజగోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Free Luggage & Footwear Transfer',
        nameTe: 'ఉచిత లగేజ్ & పాదరక్షల రవాణా కౌంటర్',
        category: 'footwear',
        lat: 13.6542,
        lng: 79.3998,
        svgX: 170,
        svgY: 230,
        descEn: 'TTD free luggage transfer depot — deposit bags at Alipiri and collect at Tirumala summit.',
        descTe: 'టీటీడీ ఉచిత లగేజ్ రవాణా కేంద్రం - తిరుమలలో ఉచితంగా అందుకోవచ్చు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Vari Padhala Mandapam (Holy Padukas)',
        nameTe: 'శ్రీవారి పాదాల మండపం (దివ్య పాదుకలు)',
        category: 'sanctum',
        lat: 13.6545,
        lng: 79.4005,
        svgX: 270,
        svgY: 160,
        descEn: 'Sacred stone footprints of Lord Venkateswara where pilgrims touch their heads to the holy silver Padukas.',
        descTe: 'శ్రీనివాసుని పవిత్ర పాదముద్రలు - భక్తులు తలపై పాదుకలను ఉంచుకుని ఆశీస్సులు పొందుతారు.'
      },
      {
        id: 'footpath',
        nameEn: '3,550-Step Tirumala Footpath Trailhead',
        nameTe: '3,550 మెట్ల నడక మార్గం ప్రారంభం',
        category: 'info',
        lat: 13.6548,
        lng: 79.4008,
        svgX: 270,
        svgY: 70,
        descEn: 'Starting waypoint for the sacred 9 km trek to Galigopuram and Tirumala.',
        descTe: 'గాలిగోపురం మరియు తిరుమలకు వెళ్ళే 9 కి.మీ పవిత్ర నడక దారి.'
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

  'gudimallam-temple': {
    placeId: 'gudimallam-temple',
    titleEn: 'Sri Parasurameswara Swamy Temple (Gudimallam)',
    titleTe: 'శ్రీ పరశురామేశ్వర స్వామి ఆలయం (గుడిమల్లం)',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5694, lng: 79.5781 },
    routePath: [[430, 290], [270, 275], [175, 255], [145, 160], [270, 105]],
    pins: [
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
      },
      {
        id: 'entrance',
        nameEn: 'Mukha Mandapam & ASI Gate',
        nameTe: 'ముఖ మండపం & ఏఎస్ఐ గేట్',
        category: 'entry',
        lat: 13.5691,
        lng: 79.5783,
        svgX: 270,
        svgY: 275,
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
        svgX: 175,
        svgY: 255,
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
        svgX: 145,
        svgY: 160,
        descEn: 'Ancient Chola, Pallava, and Vijayanagara inscriptions detailing temple history.',
        descTe: 'చోళ, పల్లవ మరియు విజయనగర రాజుల కాలం నాటి పురాతన శిలా శాసనాలు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Trimurti Parasurameswara Sanctum',
        nameTe: 'త్రిమూర్తి పరశురామేశ్వర గర్భాలయం',
        category: 'sanctum',
        lat: 13.5694,
        lng: 79.5781,
        svgX: 270,
        svgY: 105,
        descEn: 'World\'s oldest naturalistic Shiva Lingam (3rd Century BCE) carved on single stone with Brahma, Vishnu, and Shiva on a dwarf Yaksha.',
        descTe: 'క్రీ.పూ 3వ శతాబ్దపు ప్రపంచంలోనే అత్యంత పురాతన సహజసిద్ధ శివలింగం.'
      }
    ]
  },

  'gandhi-road': {
    placeId: 'gandhi-road',
    titleEn: 'Gandhi Road Shopping & Bazaars',
    titleTe: 'గాంధీ రోడ్ షాపింగ్ & మార్కెట్ వీధి',
    layoutType: 'shopping-market',
    centerCoordinates: { lat: 13.6291, lng: 79.4175 },
    routePath: [[430, 290], [270, 280], [170, 200], [270, 120], [380, 160]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Street & Junction Parking Bay',
        nameTe: 'పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6285,
        lng: 79.4180,
        svgX: 430,
        svgY: 290,
        descEn: 'Two-wheeler and designated side road parking.',
        descTe: 'బైకులు మరియు వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Gandhi Road Market Entrance',
        nameTe: 'గాంధీ రోడ్ ప్రవేశం',
        category: 'entry',
        lat: 13.6288,
        lng: 79.4176,
        svgX: 270,
        svgY: 280,
        descEn: 'Main shopping avenue starting from central railway station junction.',
        descTe: 'రైల్వే స్టేషన్ సమీపంలోని ప్రధాన షాపింగ్ వీధి.'
      },
      {
        id: 'textiles',
        nameEn: 'Handlooms, Sarees & Textiles Row',
        nameTe: 'చేనేత చీరలు & వస్త్ర విక్రయ కేంద్రాలు',
        category: 'info',
        lat: 13.6292,
        lng: 79.4170,
        svgX: 170,
        svgY: 200,
        descEn: 'Famous traditional silk sarees, dhotis, and ethnic clothing emporiums.',
        descTe: 'ప్రసిద్ధ చేనేత పట్టు చీరలు మరియు సంప్రదాయ వస్త్ర దుకాణాలు.'
      },
      {
        id: 'plaza',
        nameEn: 'Main Shopping Arcades & Handicrafts',
        nameTe: 'ప్రధాన షాపింగ్ కాంప్లెక్స్ & హస్తకళలు',
        category: 'sanctum',
        lat: 13.6295,
        lng: 79.4175,
        svgX: 270,
        svgY: 120,
        descEn: 'Spiritual souvenirs, wooden toys, brass idols, and local artifacts.',
        descTe: 'పూజా వస్తువులు, కొండపల్లి బొమ్మలు మరియు ఇత్తడి విగ్రహాల కేంద్రం.'
      },
      {
        id: 'street-food',
        nameEn: 'Famous Tirupati Street Food & Snacks',
        nameTe: 'స్ట్రీట్ ఫుడ్ & తిరుపతి స్నాక్స్',
        category: 'food',
        lat: 13.6293,
        lng: 79.4182,
        svgX: 380,
        svgY: 160,
        descEn: 'Hot dosas, filter coffee, sweets, and local savory delicacies.',
        descTe: 'రుచికరమైన దోసెలు, ఫిల్టర్ కాఫీ మరియు స్వీట్ల కేంద్రం.'
      }
    ]
  }
};

const GRAND_PUSHKARINI_TEMPLE_IDS = [
  'venkateswara',
  'padmavathi',
  'govindaraja',
  'srikalahasti',
  'kanipakam',
  'srinivasa-mangapuram',
  'varahaswamy',
  'iskcon-tirupati'
];

/**
 * PONYTAIL DYNAMIC PRECINCT BLUEPRINT ENGINE:
 * Automatically computes authentic vector layout, themed backdrop, pin coordinates,
 * and seamless sequential walking route for all 63 places based on place metadata!
 */
export function getTempleLayout(placeInput: string | PlaceInputContext, fallbackCoords?: { lat: number; lng: number }): TempleLayoutData {
  let placeId = typeof placeInput === 'string' ? placeInput : (placeInput?.id || '');
  placeId = placeId.toLowerCase().trim();

  // Extract metadata
  const placeObj = typeof placeInput === 'object' ? placeInput : null;
  const name = placeObj?.name || placeId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const category = (placeObj?.category || '').toLowerCase();
  const placeType = (placeObj?.placeType || '').toLowerCase();
  const tags = (placeObj?.tags || []).map(t => t.toLowerCase());
  const nameLower = name.toLowerCase();

  // 1. Swami Pushkarini / Sacred Theertham Tanks
  if (
    placeId.includes('pushkarini') || 
    nameLower.includes('pushkarini') || 
    placeId.includes('koneer') || 
    nameLower.includes('koneeru') ||
    placeId === 'swami-pushkarini'
  ) {
    const curated = CURATED_LAYOUTS['swami-pushkarini']!;
    return {
      placeId,
      titleEn: `${name} Precinct Map`,
      titleTe: `${name} ప్రాంగణ మ్యాప్`,
      layoutType: 'sacred-pushkarini',
      centerCoordinates: fallbackCoords || { lat: 13.6837, lng: 79.3480 },
      defaultZoom: 17,
      compassBearingDeg: 0,
      sanctumNameEn: 'Swami Pushkarini Holy Tank',
      sanctumNameTe: 'స్వామి పుష్కరిణి పవిత్ర తీర్థం',
      routePath: curated.routePath || [[430, 290], [270, 275], [160, 240], [270, 140], [150, 85], [390, 160]],
      pins: curated.pins as MapPin[],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Central Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at central Tirumala parking near CRO.', descTe: 'వాహనాన్ని పార్క్ చేసి పుష్కరిణి వైపు వెళ్ళండి.' },
        { stepNumber: 2, titleEn: 'Footwear Deposit & Stepped Ghats', titleTe: 'పాదరక్షల కేంద్రం & ఘాట్ ప్రవేశం', distance: '40m', timeMins: 2, descEn: 'Leave footwear and proceed to the sacred stepped lake.', descTe: 'చెప్పులు విడిచి పవిత్ర ఘాట్ల వద్దకు వెళ్ళండి.' },
        { stepNumber: 3, titleEn: 'Holy Dip / Prokshana & Varahaswamy Darshan', titleTe: 'పుణ్యస్నానం & వరాహస్వామి దర్శనం', distance: '80m', timeMins: 15, descEn: 'Take sacred holy water dip/sprinkling and seek blessings at Sri Varahaswamy Temple.', descTe: 'పుష్కరిణి తీర్థం చల్లుకుని వరాహస్వామి వారిని దర్శించుకోండి.' },
        { stepNumber: 4, titleEn: 'Pathway to Srivari Mahadwaram', titleTe: 'శ్రీవారి ప్రధాన ఆలయ మార్గం', distance: '100m', timeMins: 5, descEn: 'Proceed along the covered stone corridor to Sri Venkateswara Temple entrance.', descTe: 'శ్రీవారి ఆలయ ప్రవేశం వైపు వెళ్ళండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'TTD Central Vigilance & Temple Security', titleTe: 'టీటీడీ భద్రతా విభాగం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // 2. Silathoranam / Geological Heritage Park
  if (placeId.includes('silathoranam') || nameLower.includes('silathoranam') || nameLower.includes('sila thoranam')) {
    const curated = CURATED_LAYOUTS['silathoranam']!;
    return {
      placeId,
      titleEn: `${name} Precinct Map`,
      titleTe: `${name} ప్రాంగణ మ్యాప్`,
      layoutType: 'geo-nature-park',
      centerCoordinates: fallbackCoords || { lat: 13.6914, lng: 79.3412 },
      defaultZoom: 17,
      compassBearingDeg: 0,
      sanctumNameEn: 'Silathoranam Natural Rock Arch',
      sanctumNameTe: 'శిలాతోరణం సహజ శిలా వంపు',
      routePath: curated.routePath || [[430, 290], [270, 275], [160, 190], [270, 100], [380, 140]],
      pins: curated.pins as MapPin[],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Shaded Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and proceed to the geological park gate.', descTe: 'వాహనాన్ని పార్క్ చేసి పార్క్ గేటు వైపు వెళ్ళండి.' },
        { stepNumber: 2, titleEn: 'Botanical Garden Promenade Walk', titleTe: 'ఉద్యానవనంలో నడక', distance: '80m', timeMins: 3, descEn: 'Walk through the lush paved botanical pathway.', descTe: 'పచ్చని చెట్ల నడుమ సుందర మార్గంలో నడవండి.' },
        { stepNumber: 3, titleEn: 'Silathoranam Natural Rock Arch & Viewing Deck', titleTe: 'శిలాతోరణం దర్శనం & వీక్షణ వేదిక', distance: '120m', timeMins: 15, descEn: 'Marvel at the 2.5B-year-old natural pre-Cambrian arch and capture photos.', descTe: '250 కోట్ల సంవత్సరాల పురాతన సహజ రాతి తోరణాన్ని తిలకించండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'Tirumala Tourism & Garden Office', titleTe: 'తిరుమల సమాచార కేంద్రం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // 2. Alipiri / Padhala Mandapam check
  if (
    placeId.includes('padhala') || 
    placeId.includes('padala') || 
    nameLower.includes('padhala') || 
    nameLower.includes('padala') || 
    (nameLower.includes('alipiri') && (nameLower.includes('mandapam') || nameLower.includes('mettu') || nameLower.includes('gopuram') || nameLower.includes('statue')))
  ) {
    const curated = CURATED_LAYOUTS['alipiri-padhala-mandapam']!;
    return {
      placeId,
      titleEn: `${name} Precinct Map`,
      titleTe: `${name} ప్రాంగణ మ్యాప్`,
      layoutType: 'trek-trail',
      centerCoordinates: fallbackCoords || { lat: 13.6542, lng: 79.4005 },
      defaultZoom: 17,
      compassBearingDeg: 0,
      sanctumNameEn: 'Sri Vari Padhala Mandapam',
      sanctumNameTe: 'శ్రీవారి పాదాల మండపం',
      routePath: curated.routePath || [[430, 290], [270, 275], [170, 230], [270, 160], [270, 70]],
      pins: curated.pins as MapPin[],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Alipiri Base Arrival & Parking', titleTe: 'అలిపిరి పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at Alipiri base plaza.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
        { stepNumber: 2, titleEn: 'Raja Gopuram & Footwear/Luggage Depot', titleTe: 'రాజగోపురం & లగేజ్ కౌంటర్', distance: '50m', timeMins: 2, descEn: 'Deposit luggage for free TTD uphill transfer.', descTe: 'టీటీడీ ఉచిత లగేజ్ కేంద్రంలో బ్యాగులు ఇవ్వండి.' },
        { stepNumber: 3, titleEn: 'Padhala Mandapam Holy Padukas', titleTe: 'శ్రీవారి పాదాల దర్శనం', distance: '100m', timeMins: 5, descEn: 'Receive blessings of the divine Padukas.', descTe: 'దివ్య పాదుకల దర్శనం మరియు ఆశీస్సులు.' },
        { stepNumber: 4, titleEn: 'Tirumala 3,550 Steps Trailhead', titleTe: 'నడక మార్గం ప్రారంభం', distance: '120m', timeMins: 10, descEn: 'Begin the traditional trek to Tirumala.', descTe: 'తిరుమల నడక మార్గం ప్రారంభించండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'TTD Alipiri Tollgate / Footpath Office', titleTe: 'అలిపిరి సమాచార కేంద్రం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // Check other curated layouts
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
      routePath: curated.routePath || [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]],
      pins: (curated.pins as MapPin[]) || [],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Parking Bay', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and proceed to the main entrance.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
        { stepNumber: 2, titleEn: 'Entrance & Exploration', titleTe: 'ప్రవేశం & సందర్శన', distance: '50m', timeMins: 2, descEn: 'Walk through the main walkway.', descTe: 'ప్రధాన మార్గం గుండా వెళ్ళండి.' },
        { stepNumber: 3, titleEn: 'Main Landmark & Blessings', titleTe: 'ప్రధాన కేంద్రం & దర్శనం', distance: '120m', timeMins: 10, descEn: 'Visit key highlights and view points.', descTe: 'కీలక ప్రదేశాలను సందర్శించండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'Tourism / Information Desk', titleTe: 'సమాచార విభాగం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // ── ACCURATE MULTI-CATEGORY ARCHETYPE CLASSIFICATION ──
  let layoutType: TempleLayoutData['layoutType'] = 'city-shrine';

  // 1. Geological & Botanical Nature Parks (Silathoranam, Udyanavanam)
  if (
    category.includes('nature') || 
    tags.includes('geology') || 
    tags.includes('rock') || 
    tags.includes('garden') || 
    nameLower.includes('silathoranam') || 
    nameLower.includes('udyanavanam') || 
    nameLower.includes('rock formation')
  ) {
    layoutType = 'geo-nature-park';
  }
  // 2. Shopping, Bazaars, Markets
  else if (
    category.includes('shopping') || 
    tags.includes('shopping') || 
    tags.includes('clothing') || 
    tags.includes('textiles') ||
    nameLower.includes('shopping') || 
    nameLower.includes('bazaar') || 
    nameLower.includes('market') || 
    nameLower.includes('gandhi road')
  ) {
    layoutType = 'shopping-market';
  }
  // 3. Food & Dining
  else if (
    category.includes('food') || 
    category.includes('dining') || 
    placeType === 'food' || 
    nameLower.includes('restaurant') || 
    nameLower.includes('hotel') || 
    nameLower.includes('mess')
  ) {
    layoutType = 'dining-restaurant';
  }
  // 4. Museums & Science Centers
  else if (
    category.includes('museum') || 
    tags.includes('science') || 
    nameLower.includes('museum') || 
    nameLower.includes('science centre') || 
    nameLower.includes('planetarium')
  ) {
    layoutType = 'museum-gallery';
  }
  // 5. Cultural & Theme Parks
  else if (
    nameLower.includes('silparamam') || 
    (category.includes('park') && tags.includes('culture'))
  ) {
    layoutType = 'cultural-park';
  }
  // 6. Wildlife & Safari
  else if (
    placeId === 'sv-zoo-park' || 
    category.includes('zoo') || 
    tags.includes('zoo') || 
    tags.includes('safari') || 
    tags.includes('wildlife') || 
    nameLower.includes('zoo') || 
    nameLower.includes('deer park')
  ) {
    layoutType = 'wildlife-safari';
  }
  // 7. Sacred Footpaths & Treks
  else if (
    category.includes('footstep') || 
    category.includes('footpath') || 
    tags.includes('footsteps') || 
    tags.includes('trekking') || 
    nameLower.includes('garuda statue') || 
    nameLower.includes('mettu')
  ) {
    layoutType = 'trek-trail';
  }
  // 8. Waterfalls, Rivers, Dams, Theerthams
  else if (
    (category.includes('waterfall') || tags.includes('waterfall') || nameLower.includes('waterfall') || nameLower.includes('falls') || nameLower.includes('kona') || nameLower.includes('dam')) &&
    !nameLower.includes('temple') && !category.includes('temple')
  ) {
    layoutType = 'hill-waterfall';
  }
  // 9. Heritage Forts & Palaces
  else if (
    category.includes('fort') || 
    tags.includes('fort') || 
    nameLower.includes('fort') || 
    nameLower.includes('mahal') || 
    nameLower.includes('palace')
  ) {
    layoutType = 'heritage-fort';
  }
  // 10. Spiritual Temples & Shrines
  else if (
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
    tags.includes('goddess') ||
    tags.includes('grama devata')
  ) {
    const isGrandPushkariniTemple = GRAND_PUSHKARINI_TEMPLE_IDS.some(id => placeId.includes(id) || nameLower.includes(id));
    if (isGrandPushkariniTemple) {
      layoutType = 'grand-temple';
    } else if (tags.includes('ancient') || tags.includes('archaeological') || category.includes('historical')) {
      layoutType = 'ancient-shrine';
    } else {
      layoutType = 'city-shrine';
    }
  } else {
    layoutType = 'geo-nature-park';
  }

  const baseLat = placeObj?.coordinates?.lat || fallbackCoords?.lat || 13.6296;
  const baseLng = placeObj?.coordinates?.lng || fallbackCoords?.lng || 79.4130;

  let generatedPins: MapPin[] = [];
  let generatedRoute: [number, number][] = [];

  if (layoutType === 'geo-nature-park') {
    // 🌿 GEOLOGICAL & NATURE BOTANICAL PARK (Silathoranam, Udyanavanam)
    generatedRoute = [[430, 290], [270, 275], [160, 190], [270, 100], [380, 140]];
    generatedPins = [
      { id: 'parking', nameEn: 'Visitor Parking Bay', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Shaded vehicle and bus parking area.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Nature Park Entrance Gateway', nameTe: 'ఉద్యానవన ప్రవేశ ద్వారం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 275, descEn: 'Main park gate and visitor pathway.', descTe: 'ఉద్యానవనం ప్రధాన ప్రవేశం.' },
      { id: 'garden-path', nameEn: 'Botanical Garden Walkway', nameTe: 'వృక్ష ఉద్యానవన నడక దారి', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 160, svgY: 190, descEn: 'Paved tree-lined garden promenade.', descTe: 'పచ్చని పూల మొక్కలు, చెట్లతో కూడిన నడక మార్గం.' },
      { id: 'sanctum', nameEn: `${name} Landmark Arch / Garden`, nameTe: `${name} సహజ అద్భుతం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 100, descEn: 'Primary geological formation, rock arch, and natural attraction.', descTe: 'ప్రధాన సహజ రాతి నిర్మాణం మరియు ఆకర్షణ.' },
      { id: 'viewing-deck', nameEn: 'Scenic Viewing Deck & Photo Point', nameTe: 'వీక్షణ వేదిక & ఫోటో పాయింట్', category: 'info', lat: baseLat + 0.0004, lng: baseLng + 0.0006, svgX: 380, svgY: 140, descEn: 'Elevated scenic platform for photography and landscape views.', descTe: 'అందమైన ప్రకృతి దృశ్యాలను తిలకించేందుకు వేదిక.' }
    ];
  } else if (layoutType === 'city-shrine') {
    // 🛕 AUTHENTIC CITY / VILLAGE SHRINE
    generatedRoute = [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]];
    generatedPins = [
      { 
        id: 'parking', 
        nameEn: 'Approach Road & Parking Bay', 
        nameTe: 'పార్కింగ్ ప్రదేశం', 
        category: 'parking', 
        lat: baseLat - 0.0008, 
        lng: baseLng + 0.0006, 
        svgX: 430, 
        svgY: 290, 
        descEn: 'Designated vehicle and two-wheeler parking near temple street.', 
        descTe: 'ఆలయ వీధి సమీపంలోని వాహనాల పార్కింగ్ స్థలం.' 
      },
      { 
        id: 'entry', 
        nameEn: 'Temple Gateway & Gopuram', 
        nameTe: 'ఆలయ ప్రధాన ముఖద్వారం', 
        category: 'entry', 
        lat: baseLat - 0.0004, 
        lng: baseLng, 
        svgX: 270, 
        svgY: 275, 
        descEn: 'Main gateway and decorative arch welcoming devotees.', 
        descTe: 'ఆలయ ప్రధాన ప్రవేశ గోపురం.' 
      },
      { 
        id: 'footwear', 
        nameEn: 'Footwear Stand', 
        nameTe: 'పాదరక్షల స్టాండ్', 
        category: 'footwear', 
        lat: baseLat - 0.0003, 
        lng: baseLng - 0.0004, 
        svgX: 145, 
        svgY: 255, 
        descEn: 'Designated shoe stand before stepping onto sacred courtyard.', 
        descTe: 'ఆలయ ప్రాంగణంలోకి ప్రవేశించే ముందు చెప్పులు విడిచే స్థలం.' 
      },
      { 
        id: 'dhwajasthambham', 
        nameEn: 'Dhwajasthambham & Deepasthambham', 
        nameTe: 'ధ్వజస్తంభం & దీప స్తంభం', 
        category: 'info', 
        lat: baseLat - 0.0002, 
        lng: baseLng, 
        svgX: 270, 
        svgY: 205, 
        descEn: 'Sacred flag mast and traditional brass lamp pillar in the courtyard.', 
        descTe: 'ఆలయ ప్రాంగణంలోని పవిత్ర ధ్వజస్తంభం.' 
      },
      { 
        id: 'sanctum', 
        nameEn: `${name} Garbhalayam (Sanctum)`, 
        nameTe: `${name} ప్రధాన గర్భాలయం`, 
        category: 'sanctum', 
        lat: baseLat, 
        lng: baseLng, 
        svgX: 270, 
        svgY: 85, 
        descEn: 'Sacred inner sanctum sanctorum and consecrated presiding deity idol.', 
        descTe: 'మూలవిరాట్టు దర్శనం మరియు పవిత్ర గర్భగుడి.' 
      },
      { 
        id: 'kumkum-prasadam', 
        nameEn: 'Theertham, Kumkum & Prasadam Counter', 
        nameTe: 'తీర్థం, కుంకుమ & ప్రసాదం కౌంటర్', 
        category: 'laddu', 
        lat: baseLat - 0.0002, 
        lng: baseLng + 0.0005, 
        svgX: 395, 
        svgY: 160, 
        descEn: 'Receive blessed kumkum, holy theertham, and sacred prasadam.', 
        descTe: 'అమ్మవారి పవిత్ర కుంకుమ, తీర్థం మరియు ప్రసాదం స్వీకరించే స్థలం.' 
      }
    ];
  } else if (layoutType === 'ancient-shrine') {
    // 🏛️ ANCIENT SHRINE (Gudimallam, Appalayagunta)
    generatedRoute = [[430, 290], [270, 275], [175, 255], [145, 160], [270, 105]];
    generatedPins = [
      { id: 'parking', nameEn: 'Approach Parking Area', nameTe: 'పార్కింగ్ స్థలం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Open parking space for vehicles.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Mukha Mandapam / Gateway', nameTe: 'ముఖ మండపం ద్వారం', category: 'entry', lat: baseLat - 0.0004, lng: baseLng, svgX: 270, svgY: 275, descEn: 'Historical stone entrance gateway under ASI protection.', descTe: 'ఆలయ ప్రవేశ ద్వారం.' },
      { id: 'footwear', nameEn: 'Courtyard Footwear Stand', nameTe: 'పాదరక్షల స్టాండ్', category: 'footwear', lat: baseLat - 0.0006, lng: baseLng - 0.0004, svgX: 175, svgY: 255, descEn: 'Shoe custody counter outside courtyard.', descTe: 'చెప్పులు విడిచే ప్రదేశం.' },
      { id: 'info', nameEn: 'Historical Heritage Inscriptions', nameTe: 'పురావస్తు శాసనాలు', category: 'info', lat: baseLat, lng: baseLng - 0.0006, svgX: 145, svgY: 160, descEn: 'Ancient stone inscriptions and carvings detailing heritage.', descTe: 'రాతి శాసనాలు మరియు చారిత్రక వివరాలు.' },
      { id: 'sanctum', nameEn: `${name} Sanctum`, nameTe: `${name} గర్భాలయం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 105, descEn: 'Sacred inner sanctum sanctorum and deity idol.', descTe: 'ప్రధాన గర్భాలయం మరియు మూలవిరాట్టు.' }
    ];
  } else if (layoutType === 'trek-trail') {
    generatedRoute = [[430, 290], [270, 275], [170, 230], [270, 160], [270, 70]];
    generatedPins = [
      { id: 'parking', nameEn: 'Trailhead Parking Plaza', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Vehicle parking and taxi drop zone.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: `${name} Entrance Gateway`, nameTe: `${name} ప్రారంభ ముఖద్వారం`, category: 'entry', lat: baseLat - 0.0006, lng: baseLng, svgX: 270, svgY: 275, descEn: 'Iconic gateway and starting point of the pedestrian trail.', descTe: 'నడక మార్గ ప్రారంభ ద్వారం.' },
      { id: 'footwear', nameEn: 'Luggage & Footwear Transfer Depot', nameTe: 'లగేజ్ & పాదరక్షల కేంద్రం', category: 'footwear', lat: baseLat - 0.0004, lng: baseLng - 0.0005, svgX: 170, svgY: 230, descEn: 'Free luggage delivery to the hilltop.', descTe: 'ఉచిత లగేజ్ రవాణా కౌంటర్.' },
      { id: 'sanctum', nameEn: 'Sacred Waypoint / Mandapam', nameTe: 'పవిత్ర మండపం', category: 'sanctum', lat: baseLat + 0.0004, lng: baseLng, svgX: 270, svgY: 160, descEn: 'Sheltered resting mandapam and deity darshan.', descTe: 'తాగునీరు మరియు దర్శనం.' },
      { id: 'info', nameEn: 'Hilltop Summit Trailhead', nameTe: 'కొండపై ముగింపు కేంద్రం', category: 'info', lat: baseLat + 0.0010, lng: baseLng, svgX: 270, svgY: 70, descEn: 'Continuation of the scenic walking trail.', descTe: 'నడక మార్గం ముగింపు ప్రదేశం.' }
    ];
  } else if (layoutType === 'shopping-market') {
    generatedRoute = [[430, 290], [270, 280], [170, 200], [270, 120], [380, 160]];
    generatedPins = [
      { id: 'parking', nameEn: 'Street & Bay Parking', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Vehicle and two-wheeler parking along market road.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Market Avenue Entrance', nameTe: 'మార్కెట్ ప్రవేశం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 280, descEn: 'Main entrance archway leading into the shopping lane.', descTe: 'షాపింగ్ వీధి ప్రధాన ముఖద్వారం.' },
      { id: 'textiles', nameEn: 'Textiles & Handlooms Row', nameTe: 'వస్త్ర దుకాణాలు', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 170, svgY: 200, descEn: 'Traditional sarees, fabrics, and clothing stores.', descTe: 'సంప్రదాయ చేనేత మరియు వస్త్ర దుకాణాలు.' },
      { id: 'plaza', nameEn: `${name} Main Bazaar`, nameTe: `${name} ప్రధాన మార్కెట్`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 120, descEn: 'Primary shopping arcades, souvenirs, and handicraft emporiums.', descTe: 'హస్తకళలు, పూజా వస్తువులు మరియు స్మారక చిహ్నాల కేంద్రం.' },
      { id: 'food', nameEn: 'Local Eateries & Refreshments', nameTe: 'స్ట్రీట్ ఫుడ్ & స్నాక్స్', category: 'food', lat: baseLat + 0.0003, lng: baseLng + 0.0006, svgX: 380, svgY: 160, descEn: 'Famous local street food, sweets, and beverages.', descTe: 'రుచికరమైన స్నాక్స్ మరియు పానీయాలు.' }
    ];
  } else if (layoutType === 'dining-restaurant') {
    generatedRoute = [[430, 290], [270, 280], [270, 130], [380, 160]];
    generatedPins = [
      { id: 'parking', nameEn: 'Valet & Customer Parking', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0008, lng: baseLng + 0.0006, svgX: 430, svgY: 290, descEn: 'Dedicated customer car & bike parking.', descTe: 'వినియోగదారుల పార్కింగ్.' },
      { id: 'entry', nameEn: 'Main Entrance & Lobby', nameTe: 'ప్రవేశ ద్వారం', category: 'entry', lat: baseLat - 0.0003, lng: baseLng, svgX: 270, svgY: 280, descEn: 'Welcoming entrance lobby and host desk.', descTe: 'హోటల్ ప్రవేశ ద్వారం.' },
      { id: 'dining', nameEn: `${name} Dining Hall`, nameTe: `${name} డైనింగ్ హాల్`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 130, descEn: 'Spacious AC dining hall and family seating.', descTe: 'కుటుంబ భోజన శాల.' },
      { id: 'counters', nameEn: 'Culinary & Beverage Counter', nameTe: 'రుచికరమైన వంటకాల విభాగం', category: 'food', lat: baseLat + 0.0002, lng: baseLng + 0.0005, svgX: 380, svgY: 160, descEn: 'Live kitchen, desserts, and beverage service.', descTe: 'లైవ్ కిచెన్ మరియు పానీయాలు.' }
    ];
  } else if (layoutType === 'museum-gallery') {
    generatedRoute = [[430, 290], [270, 280], [170, 230], [270, 120], [380, 140]];
    generatedPins = [
      { id: 'parking', nameEn: 'Visitor Parking Plaza', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 290, descEn: 'Parking for cars and tourist buses.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Ticket Desk & Entry Gate', nameTe: 'టికెట్ కౌంటర్ & ప్రవేశం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 280, descEn: 'Ticket checks, cloakroom, and audio guides.', descTe: 'ప్రవేశ ద్వారం మరియు టికెట్ కౌంటర్.' },
      { id: 'orientation', nameEn: 'Orientation & Cloakroom', nameTe: 'క్లోక్‌రూమ్ & గైడ్ విభాగం', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 170, svgY: 230, descEn: 'Locker custody and introductory information.', descTe: 'లగేజ్ భద్రత మరియు సమాచార విభాగం.' },
      { id: 'gallery', nameEn: `${name} Main Exhibit Gallery`, nameTe: `${name} ప్రధాన ప్రదర్శన శాల`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 120, descEn: 'Core exhibits, historical artifacts, and interactive displays.', descTe: 'చారిత్రక కళాఖండాలు మరియు ప్రదర్శనలు.' },
      { id: 'pavilion', nameEn: 'Interactive Science / Art Pavilion', nameTe: 'ప్రత్యేక పెవిలియన్', category: 'info', lat: baseLat + 0.0004, lng: baseLng + 0.0006, svgX: 380, svgY: 140, descEn: 'Interactive displays, 3D show, and planetarium.', descTe: 'ఇంటరాక్టివ్ ప్రదర్శన శాల.' }
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
    // 10. GRAND TEMPLE
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
    sanctumNameEn: `${name} Center`,
    sanctumNameTe: `${name} ప్రధాన ప్రదేశం`,
    routePath: generatedRoute,
    pins: generatedPins,
    routeSteps: [
      { stepNumber: 1, titleEn: 'Arrival & Parking Bay', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and proceed to the main entrance.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Entrance & Exploration', titleTe: 'ప్రవేశం & సందర్శన', distance: '50m', timeMins: 2, descEn: 'Walk through the main walkway.', descTe: 'ప్రధాన మార్గం గుండా వెళ్ళండి.' },
      { stepNumber: 3, titleEn: 'Main Landmark & Blessings', titleTe: 'ప్రధాన కేంద్రం & దర్శనం', distance: '120m', timeMins: 10, descEn: 'Visit key highlights and view points.', descTe: 'కీలక ప్రదేశాలను సందర్శించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Tourism / Information Desk', titleTe: 'సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  };
}
