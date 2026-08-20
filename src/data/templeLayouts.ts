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
    | 'annaprasadam-complex'
    | 'botanical-garden'
    | 'hill-waterfall' 
    | 'dam-reservoir'
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

  'padmavathi': {
    placeId: 'padmavathi',
    titleEn: 'Sri Padmavathi Ammavari Temple (Tiruchanur) Precinct Map',
    titleTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం (తిరుచానూరు) ప్రాంగణ మ్యాప్',
    layoutType: 'grand-temple',
    centerCoordinates: { lat: 13.6068, lng: 79.4475 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 90], [412, 105], [370, 190], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Tiruchanur Temple Parking Bay',
        nameTe: 'తిరుచానూరు ఆలయ పార్కింగ్',
        category: 'parking',
        lat: 13.6060,
        lng: 79.4470,
        svgX: 430,
        svgY: 290,
        descEn: 'TTD vehicle and bus parking area along temple entrance lane.',
        descTe: 'వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Eastern Raja Gopuram Main Entrance',
        nameTe: 'తూర్పు రాజగోపురం ప్రధాన ప్రవేశం',
        category: 'entry',
        lat: 13.6065,
        lng: 79.4473,
        svgX: 270,
        svgY: 275,
        descEn: 'Magnificent 7-tier entrance gopuram and covered queue mandapam.',
        descTe: 'ఏడు అంతస్తుల రాజగోపురం మరియు క్యూ కాంప్లెక్స్.'
      },
      {
        id: 'footwear',
        nameEn: 'Free Footwear & Baggage Counter',
        nameTe: 'ఉచిత పాదరక్షల & లగేజ్ కేంద్రం',
        category: 'footwear',
        lat: 13.6064,
        lng: 79.4468,
        svgX: 145,
        svgY: 255,
        descEn: 'Safe custody token counter for shoes and phones.',
        descTe: 'చెప్పులు భద్రపరిచే కేంద్రం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Balipeetham',
        nameTe: 'ధ్వజస్తంభం & బలిపీఠం',
        category: 'info',
        lat: 13.6067,
        lng: 79.4474,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred golden flag mast facing Mother Padmavathi sanctum.',
        descTe: 'ఆలయ అంతర ప్రాంగణంలోని పవిత్ర ధ్వజస్తంభం.'
      },
      {
        id: 'sundararaja-shrine',
        nameEn: 'Sri Sundararaja Swamy & Krishna Sub-Shrines',
        nameTe: 'శ్రీ సుందరరాజ స్వామి & శ్రీ కృష్ణ సన్నిధి',
        category: 'info',
        lat: 13.6069,
        lng: 79.4470,
        svgX: 150,
        svgY: 130,
        descEn: 'Sub-shrines dedicated to Sri Sundararaja Swamy (Varadaraja) and Sri Krishna within the temple prakaram.',
        descTe: 'ఆలయ ప్రాకారంలోని ఉపాలయాలు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Padmavathi Devi Garbhalayam (Sanctum)',
        nameTe: 'శ్రీ పద్మావతి అమ్మవారి గర్భాలయం',
        category: 'sanctum',
        lat: 13.6070,
        lng: 79.4475,
        svgX: 270,
        svgY: 90,
        descEn: 'Presiding deity of Goddess Lakshmi manifested as Padmavathi, seated in Padmasana on a golden lotus holding two lotuses.',
        descTe: 'స్వర్ణ పద్మాసనారూఢురాలైన పద్మావతి అమ్మవారి దివ్య దర్శనం.'
      },
      {
        id: 'pushkarini',
        nameEn: 'Padma Sarovaram (Holy Lotus Pushkarini)',
        nameTe: 'పద్మ సరోవరం (పవిత్ర కోనేరు)',
        category: 'info',
        lat: 13.6072,
        lng: 79.4482,
        svgX: 412,
        svgY: 105,
        descEn: 'Sacred lake where Goddess Padmavathi emerged on a golden lotus. Devotees take theertha prokshana.',
        descTe: 'అమ్మవారు స్వర్ణ కమలంలో ఉద్భవించిన పవిత్ర పద్మ సరోవరం.'
      },
      {
        id: 'laddu',
        nameEn: 'Kumkum Archana, Turmeric & TTD Laddu Prasadam',
        nameTe: 'కుంకుమార్చన & లడ్డూ ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.6067,
        lng: 79.4478,
        svgX: 370,
        svgY: 190,
        descEn: 'Collect blessed turmeric, kumkum packets, and fresh TTD Tiruchanur laddu prasadam.',
        descTe: 'అమ్మవారి పవిత్ర కుంకుమ మరియు తిరుచానూరు లడ్డూ ప్రసాదం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Tiruchanur Arrival & Parking', titleTe: 'తిరుచానూరు పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the TTD parking bay.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కేంద్రం', distance: '50m', timeMins: 2, descEn: 'Deposit shoes and enter through the 7-tier Raja Gopuram.', descTe: 'చెప్పులు విడిచి రాజగోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Sundararaja Shrine', titleTe: 'ధ్వజస్తంభం & సుందరరాజ స్వామి సన్నిధి', distance: '80m', timeMins: 5, descEn: 'Offer prayers at the flag mast and visit Sri Sundararaja Swamy & Krishna shrines.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు ఉపాలయాల దర్శనం.' },
      { stepNumber: 4, titleEn: 'Sri Padmavathi Devi Moolavirat Darshan', titleTe: 'శ్రీ పద్మావతి అమ్మవారి మూలవిరాట్టు దర్శనం', distance: '100m', timeMins: 20, descEn: 'Receive the divine compassion and prosperity blessings of Mother Padmavathi in the sanctum.', descTe: 'అమ్మవారి దివ్య గర్భాలయ దర్శనం మరియు ఆశీస్సులు.' },
      { stepNumber: 5, titleEn: 'Padma Sarovaram & Prasadam', titleTe: 'పద్మ సరోవరం & ప్రసాదం కౌంటర్', distance: '120m', timeMins: 10, descEn: 'Sprinkle holy theertham from Padma Sarovaram and collect blessed Kumkum & Tiruchanur Laddu.', descTe: 'పద్మ సరోవర తీర్థం మరియు లడ్డూ ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Tiruchanur Temple Information Office', titleTe: 'తిరుచానూరు ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'chandragiri-fort': {
    placeId: 'chandragiri-fort',
    titleEn: 'Chandragiri Fort & Raja Mahal Precinct Map',
    titleTe: 'చంద్రగిరి కోట & రాజమహల్ ప్రాంగణ మ్యాప్',
    layoutType: 'heritage-fort',
    centerCoordinates: { lat: 13.6025, lng: 79.3142 },
    routePath: [[412, 265], [270, 245], [138, 222], [270, 105], [395, 105], [370, 185], [270, 245]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Fort Parking Bay',
        nameTe: 'కోట పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6018,
        lng: 79.3148,
        svgX: 412,
        svgY: 265,
        descEn: 'Parking for cars, tourist buses, and 2-wheelers near the entrance.',
        descTe: 'వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Main Entrance & ASI Ticket Gate',
        nameTe: 'ప్రధాన ప్రవేశ ముఖద్వారం & టికెట్ కౌంటర్',
        category: 'entry',
        lat: 13.6020,
        lng: 79.3145,
        svgX: 270,
        svgY: 245,
        descEn: 'ASI entry ticket counter, security check, and fort gateway.',
        descTe: 'ఏఎస్ఐ టికెట్ కౌంటర్ మరియు ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Museum Cloakroom & Rest Rooms',
        nameTe: 'క్లోక్‌రూమ్ & సదుపాయాల కేంద్రం',
        category: 'footwear',
        lat: 13.6022,
        lng: 79.3140,
        svgX: 138,
        svgY: 222,
        descEn: 'Free footwear deposit and cloakroom outside Raja Mahal.',
        descTe: 'ఉచిత క్లోక్‌రూమ్ మరియు లగేజ్ కేంద్రం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Raja Mahal (3-Storey Palace & Museum)',
        nameTe: 'రాజమహల్ (చారిత్రక రాజభవనం & మ్యూజియం)',
        category: 'sanctum',
        lat: 13.6027,
        lng: 79.3142,
        svgX: 270,
        svgY: 105,
        descEn: 'Indo-Saracenic 3-storey royal palace housing ancient Vijayanagara bronzes, stone sculptures, and arms.',
        descTe: 'విజయనగర సామ్రాజ్య చారిత్రక రాజభవనం మరియు ఏఎస్ఐ మ్యూజియం.'
      },
      {
        id: 'rani-mahal',
        nameEn: 'Rani Mahal (Queen Palace & Gardens)',
        nameTe: 'రాణి మహల్ & రాయల్ తోటలు',
        category: 'info',
        lat: 13.6030,
        lng: 79.3146,
        svgX: 395,
        svgY: 105,
        descEn: 'Queen’s palace featuring elegant vaulted arches and landscaped gardens.',
        descTe: 'రాణి మహల్ మరియు ఆకట్టుకునే రాయల్ ఉద్యానవనం.'
      },
      {
        id: 'sound-light',
        nameEn: 'Sound & Light Show Open Theater',
        nameTe: 'సౌండ్ & లైట్ షో ఓపెన్ థియేటర్',
        category: 'info',
        lat: 13.6024,
        lng: 79.3144,
        svgX: 370,
        svgY: 185,
        descEn: 'Open amphitheater showcasing evening laser, sound & light historical shows.',
        descTe: 'సాయంత్రం వేళ విజయవంతంగా సాగే సౌండ్ & లైట్ షో ప్రదర్శన వేదిక.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Fort Arrival & Parking', titleTe: 'కోట పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the visitor plaza.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'ASI Ticket Counter & Gate', titleTe: 'టికెట్ కౌంటర్ & ప్రవేశం', distance: '30m', timeMins: 2, descEn: 'Buy entry ticket and enter fort grounds.', descTe: 'టికెట్ తీసుకుని కోటలోకి ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Raja Mahal Museum & Royal Artifacts', titleTe: 'రాజమహల్ & మ్యూజియం దర్శనం', distance: '100m', timeMins: 25, descEn: 'Explore the 3-storey palace exhibits.', descTe: 'చారిత్రక రాజభవనం తిలకించండి.' },
      { stepNumber: 4, titleEn: 'Rani Mahal & Evening Sound & Light Show', titleTe: 'రాణి మహల్ & సౌండ్ షో', distance: '120m', timeMins: 30, descEn: 'Visit Rani Mahal and attend the evening show.', descTe: 'రాణి మహల్ మరియు సౌండ్ షో వీక్షించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'ASI Chandragiri Office', titleTe: 'ఏఎస్ఐ చంద్రగిరి సమాచార కేంద్రం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'horsley-hills': {
    placeId: 'horsley-hills',
    titleEn: 'Horsley Hills Precinct & Viewpoint Map',
    titleTe: 'హార్స్‌లీ హిల్స్ ప్రాంగణం & వ్యూపాయింట్ మ్యాప్',
    layoutType: 'hill-waterfall',
    centerCoordinates: { lat: 13.6508, lng: 78.3970 },
    routePath: [[412, 265], [270, 245], [138, 222], [270, 160], [270, 70], [390, 100], [270, 245]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Hilltop Visitor Parking Plaza',
        nameTe: 'హార్స్‌లీ హిల్స్ పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.6500,
        lng: 78.3975,
        svgX: 412,
        svgY: 265,
        descEn: 'Dedicated vehicle parking near APTDC Haritha Resort.',
        descTe: 'హార్స్‌లీ హిల్స్ కొండపై వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Forest Checkpost & Entrance Gate',
        nameTe: 'అటవీ చెక్‌పోస్ట్ & ప్రవేశ ముఖద్వారం',
        category: 'entry',
        lat: 13.6503,
        lng: 78.3972,
        svgX: 270,
        svgY: 245,
        descEn: 'Forest department entry checkpost and toll booth.',
        descTe: 'అటవీ విభాగం చెక్‌పోస్ట్ మరియు ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Visitor Amenities & Restrooms',
        nameTe: 'సందర్శకుల సదుపాయాల కేంద్రం',
        category: 'footwear',
        lat: 13.6505,
        lng: 78.3968,
        svgX: 138,
        svgY: 222,
        descEn: 'Restroom complex, seating gazebos, and snacks kiosk.',
        descTe: 'విశ్రాంతి గదులు మరియు తాగునీటి సదుపాయం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Whispering Winds Viewpoint (4,100 ft)',
        nameTe: 'విస్పరింగ్ విండ్స్ వ్యూపాయింట్ (4,100 అడుగులు)',
        category: 'sanctum',
        lat: 13.6510,
        lng: 78.3970,
        svgX: 270,
        svgY: 160,
        descEn: 'Highest elevation cliff viewpoint with cool mountain breeze and valley panoramas.',
        descTe: 'కొండపై చల్లని గాలితో అలరించే విస్పరింగ్ విండ్స్ వ్యూపాయింట్.'
      },
      {
        id: 'info',
        nameEn: 'Gali Bandalu (Wind Rocks Summit)',
        nameTe: 'గాలి బండలు పనోరమిక్ శిఖరం',
        category: 'info',
        lat: 13.6515,
        lng: 78.3970,
        svgX: 270,
        svgY: 70,
        descEn: 'Massive rocky cliff edge known for high gusty winds and sunset photography.',
        descTe: 'సూర్యాస్తమయ దృశ్యాలకు ప్రసిద్ధి చెందిన గాలి బండలు శిఖరం.'
      },
      {
        id: 'resort',
        nameEn: 'APTDC Haritha Resort & Governor Bungalow',
        nameTe: 'హరిత రిసార్ట్ & చారిత్రక గవర్నర్ బంగ్లా',
        category: 'food',
        lat: 13.6512,
        lng: 78.3980,
        svgX: 390,
        svgY: 100,
        descEn: '150-year-old British era Governor bungalow, restaurant, and swimming pool.',
        descTe: 'చారిత్రక గవర్నర్ బంగ్లా మరియు హరిత హోటల్.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Ghat Road Climb & Hilltop Arrival', titleTe: 'ఘాట్ రోడ్డు ప్రయాణం & కొండపైకి చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Drive up the 9 km scenic eucalyptus ghat road to Horsley Hills summit.', descTe: 'సుందరమైన యూకలిప్టస్ ఘాట్ రోడ్డు గుండా ప్రయాణించండి.' },
      { stepNumber: 2, titleEn: 'Forest Checkpost & Parking', titleTe: 'చెక్‌పోస్ట్ ప్రవేశం & పార్కింగ్', distance: '50m', timeMins: 2, descEn: 'Pass the forest gate and park near APTDC Haritha Resort.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 3, titleEn: 'Whispering Winds & Gali Bandalu Viewpoints', titleTe: 'విస్పరింగ్ విండ్స్ & గాలి బండలు సందర్శన', distance: '150m', timeMins: 30, descEn: 'Walk to the cliff top viewpoints for 360-degree Valley panoramas.', descTe: 'విస్పరింగ్ విండ్స్ మరియు గాలి బండల వ్యూపాయింట్ తిలకించండి.' },
      { stepNumber: 4, titleEn: 'Governor Bungalow & Haritha Dining', titleTe: 'గవర్నర్ బంగ్లా & రిసార్ట్', distance: '100m', timeMins: 20, descEn: 'Visit the heritage bungalow and enjoy fresh refreshments.', descTe: 'చారిత్రక బంగ్లా తిలకించి భోజన సదుపాయం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'APTDC Horsley Hills Resort', titleTe: 'హరిత రిసార్ట్ సమాచార కేంద్రం', number: '08571279744' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'jeeva-lingeshwara-temple': {
    placeId: 'jeeva-lingeshwara-temple',
    titleEn: 'Sri Jeeva Lingeshwara Swamy Temple Precinct Map',
    titleTe: 'శ్రీ జీవ లింగేశ్వర స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.6581, lng: 79.4292 },
    routePath: [[420, 268], [270, 270], [140, 250], [270, 195], [140, 120], [270, 70], [400, 150], [270, 270]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Mangalam Approach Parking Plaza',
        nameTe: 'మంగళం ఆలయ పార్కింగ్',
        category: 'parking',
        lat: 13.6577,
        lng: 79.4288,
        svgX: 420,
        svgY: 268,
        descEn: 'Open vehicle and auto parking area in Mangalam village.',
        descTe: 'వాహనాలు మరియు ఆటోల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Temple Entrance Mukhadwaram',
        nameTe: 'ఆలయ ప్రవేశ ముఖద్వారం',
        category: 'entry',
        lat: 13.6579,
        lng: 79.4290,
        svgX: 270,
        svgY: 270,
        descEn: 'Stone archway and entrance facing the Tirumala hill slopes.',
        descTe: 'ఆలయ ప్రధాన ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.6580,
        lng: 79.4289,
        svgX: 140,
        svgY: 250,
        descEn: 'Shoe custody counter near the courtyard entrance.',
        descTe: 'పాదరక్షలు విడిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Nandi Mandapam',
        nameTe: 'ధ్వజస్తంభం & నంది మండపం',
        category: 'info',
        lat: 13.6581,
        lng: 79.4291,
        svgX: 270,
        svgY: 195,
        descEn: 'Sacred flag mast and stone Nandi bull seated facing the Shiva sanctum.',
        descTe: 'పవిత్ర ధ్వజస్తంభం మరియు నందీశ్వరుని దర్శనం.'
      },
      {
        id: 'navagraha-shrine',
        nameEn: 'Sri Parvathi Ammavaru & Navagraha Sub-Shrines',
        nameTe: 'పార్వతీ అమ్మవారు & నవగ్రహ సన్నిధులు',
        category: 'info',
        lat: 13.6583,
        lng: 79.4289,
        svgX: 140,
        svgY: 120,
        descEn: 'Dedicated shrines for Goddess Parvathi, Lord Ganesha, and Navagrahas for Dosha Parihara.',
        descTe: 'పార్వతీ దేవి మరియు నవగ్రహ ఉపాలయాలు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Jeeva Lingeshwara Swamy Garbhalayam',
        nameTe: 'శ్రీ జీవ లింగేశ్వర స్వామి గర్భాలయం',
        category: 'sanctum',
        lat: 13.6582,
        lng: 79.4292,
        svgX: 270,
        svgY: 70,
        descEn: 'Consecrated living Shiva Lingam revered for granting peace of mind, health, and spiritual upliftment.',
        descTe: 'ప్రశాంత ఆధ్యాత్మిక వాతావరణంలో దర్శనమిచ్చే జీవ లింగేశ్వర స్వామి మూలవిరాట్టు.'
      },
      {
        id: 'laddu',
        nameEn: 'Rudrabhishekam, Bilva Archana & Vibhuti Counter',
        nameTe: 'రుద్రాభిషేకం, బిల్వార్చన & విభూతి ప్రసాదం',
        category: 'laddu',
        lat: 13.6580,
        lng: 79.4294,
        svgX: 400,
        svgY: 150,
        descEn: 'Obtain Rudrabhishekam seva tokens, sacred Bilva leaves, and blessed Vibhuti theertham.',
        descTe: 'రుద్రాభిషేక పూజ టోకెన్లు మరియు పవిత్ర విభూతి ప్రసాదం స్వీకరించే స్థలం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Mangalam Arrival & Parking', titleTe: 'మంగళం చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle along the foothill approach plaza.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Temple Entrance & Footwear', titleTe: 'ప్రవేశం & పాదరక్షల కేంద్రం', distance: '20m', timeMins: 2, descEn: 'Deposit shoes and enter through the stone archway.', descTe: 'చెప్పులు విడిచి గోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Nandi Mandapam', titleTe: 'ధ్వజస్తంభం & నంది నమస్కారం', distance: '30m', timeMins: 5, descEn: 'Bow before the flag mast and take blessings of Nandi.', descTe: 'ధ్వజస్తంభం వద్ద ప్రార్థించండి.' },
      { stepNumber: 4, titleEn: 'Sri Jeeva Lingeshwara Darshan', titleTe: 'శ్రీ జీవ లింగేశ్వర స్వామి దర్శనం', distance: '50m', timeMins: 10, descEn: 'Seek blessings of Lord Shiva in the sanctum.', descTe: 'స్వామివారి దివ్య దర్శనం మరియు ఆశీస్సులు.' },
      { stepNumber: 5, titleEn: 'Navagraha & Vibhuti Prasadam', titleTe: 'నవగ్రహ దర్శనం & విభూతి ప్రసాదం', distance: '30m', timeMins: 5, descEn: 'Perform Navagraha pradakshina and receive holy Vibhuti.', descTe: 'నవగ్రహ పూజ చేసి విభూతి పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Mangalam Temple Desk', titleTe: 'ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'panchamukha-anjaneya-temple': {
    placeId: 'panchamukha-anjaneya-temple',
    titleEn: 'Sri Pancha Mukha Anjaneya Swamy Temple Precinct Map',
    titleTe: 'శ్రీ పంచముఖ ఆంజనేయ స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'city-shrine',
    centerCoordinates: { lat: 13.6311, lng: 79.4149 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 160], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Balaji Nagar Street Parking Area',
        nameTe: 'బాలాజీ నగర్ వీధి పార్కింగ్',
        category: 'parking',
        lat: 13.6308,
        lng: 79.4145,
        svgX: 430,
        svgY: 290,
        descEn: 'Street parking along Balaji Nagar lane for two-wheelers and autos.',
        descTe: 'వాహనాలు మరియు ఆటోల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Temple Entrance Mukhadwaram',
        nameTe: 'ఆలయ ప్రవేశ ముఖద్వారం',
        category: 'entry',
        lat: 13.6310,
        lng: 79.4147,
        svgX: 270,
        svgY: 275,
        descEn: 'Main temple entrance leading into the sacred Hanuman mandapam.',
        descTe: 'ఆలయ ప్రధాన ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.6309,
        lng: 79.4146,
        svgX: 145,
        svgY: 255,
        descEn: 'Designated shoe keeping stand near the entrance gate.',
        descTe: 'పాదరక్షలు విడిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Deepasthambham',
        nameTe: 'ధ్వజస్తంభం & దీపస్తంభం',
        category: 'info',
        lat: 13.6311,
        lng: 79.4148,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred flag mast and brass lamp pillar in the front courtyard.',
        descTe: 'పవిత్ర ధ్వజస్తంభం మరియు దీపారాధన స్తంభం.'
      },
      {
        id: 'sita-rama-shrine',
        nameEn: 'Sri Sita Rama Lakshmana Sub-Shrine',
        nameTe: 'శ్రీ సీతారామ లక్ష్మణ సన్నిధి',
        category: 'info',
        lat: 13.6313,
        lng: 79.4147,
        svgX: 150,
        svgY: 130,
        descEn: 'Revered sanctum of Lord Sri Rama, Sita Devi, and Lakshmana Swamy worshipped with devotion.',
        descTe: 'శ్రీ సీతారామ లక్ష్మణుల పవిత్ర సన్నిధి.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Pancha Mukha Anjaneya Garbhalayam',
        nameTe: 'శ్రీ పంచముఖ ఆంజనేయ స్వామి గర్భాలయం',
        category: 'sanctum',
        lat: 13.6312,
        lng: 79.4149,
        svgX: 270,
        svgY: 85,
        descEn: 'Mighty 5-faced Lord Hanuman idol (Hanuman, Narasimha, Garuda, Varaha, Hayagriva) adorned with Sindhooram and Vadamala.',
        descTe: 'సింధూర అలంకరణ, వడమాలతో దర్శనమిచ్చే పంచముఖ ఆంజనేయ స్వామి మూలవిరాట్టు.'
      },
      {
        id: 'kumkum-prasadam',
        nameEn: 'Sindhooram, Betel Leaf & Prasadam Counter',
        nameTe: 'సింధూరం, తమలపాకుల పూజ & ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.6310,
        lng: 79.4151,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect blessed Sindhooram, holy theertham, sweet laddu, and sanctified Vada prasadam.',
        descTe: 'స్వామివారి దివ్య సింధూరం, తీర్థం మరియు ప్రసాదం స్వీకరించే స్థలం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Balaji Nagar Arrival & Parking', titleTe: 'బాలాజీ నగర్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle along the street parking bay.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Temple Entrance & Footwear', titleTe: 'ప్రవేశం & పాదరక్షల కేంద్రం', distance: '20m', timeMins: 2, descEn: 'Deposit shoes and enter through the temple archway.', descTe: 'చెప్పులు విడిచి ఆలయంలోకి ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Sri Rama Shrine', titleTe: 'ధ్వజస్తంభం & సీతారాముల సన్నిధి', distance: '40m', timeMins: 5, descEn: 'Bow before the flag mast and seek blessings at Sri Rama shrine.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు శ్రీరాముని దర్శనం.' },
      { stepNumber: 4, titleEn: 'Pancha Mukha Anjaneya Darshan', titleTe: 'పంచముఖ ఆంజనేయ స్వామి దర్శనం', distance: '50m', timeMins: 10, descEn: 'Witness the mighty 5-faced Hanuman in the inner sanctum.', descTe: 'స్వామివారి దివ్య దర్శనం మరియు ఆశీస్సులు.' },
      { stepNumber: 5, titleEn: 'Sindhooram & Blessed Prasadam', titleTe: 'సింధూరం & ప్రసాదం స్వీకరణ', distance: '30m', timeMins: 5, descEn: 'Receive blessed Sindhooram and sacred Vada / Laddu prasadam.', descTe: 'సింధూర ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Pancha Mukha Temple Desk', titleTe: 'ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'bonthalamma-temple': {
    placeId: 'bonthalamma-temple',
    titleEn: 'Sri Bonthalamma Talli Alayam Precinct Map',
    titleTe: 'శ్రీ బొంతలమ్మ తల్లి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'city-shrine',
    centerCoordinates: { lat: 13.6459, lng: 79.4404 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 160], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Approach Lane Parking Area',
        nameTe: 'ఆలయ అప్రోచ్ పార్కింగ్',
        category: 'parking',
        lat: 13.6455,
        lng: 79.4400,
        svgX: 430,
        svgY: 290,
        descEn: 'Street and approach lane parking for two-wheelers and cars.',
        descTe: 'ద్విచక్ర వాహనాలు మరియు కార్ల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Temple Entrance Mukhadwaram',
        nameTe: 'ఆలయ ప్రవేశ ముఖద్వారం',
        category: 'entry',
        lat: 13.6457,
        lng: 79.4402,
        svgX: 270,
        svgY: 275,
        descEn: 'Main entrance gate leading into the sacred Gramadevata courtyard.',
        descTe: 'గ్రామదేవత ఆలయ ప్రధాన ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.6458,
        lng: 79.4401,
        svgX: 145,
        svgY: 255,
        descEn: 'Designated shoe keeping stand near the entrance gate.',
        descTe: 'పాదరక్షలు విడిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Trisulam Deepasthambham',
        nameTe: 'ధ్వజస్తంభం & త్రిశూల దీపస్తంభం',
        category: 'info',
        lat: 13.6459,
        lng: 79.4403,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred flag mast, trident (Trisula), and brass lamp pillar in the central courtyard.',
        descTe: 'పవిత్ర ధ్వజస్తంభం, త్రిశూలం మరియు దీపారాధన స్తంభం.'
      },
      {
        id: 'neem-tree',
        nameEn: 'Sacred Neem & Peepal Tree (Vriksha Pradakshina)',
        nameTe: 'పవిత్ర వేప & రావి వృక్ష ప్రదక్షిణ',
        category: 'info',
        lat: 13.6461,
        lng: 79.4402,
        svgX: 150,
        svgY: 130,
        descEn: 'Sacred mother neem tree where women tie turmeric threads and perform pradakshina for good health and fertility.',
        descTe: 'మహిళలు పసుపు దారాలు కట్టి ప్రదక్షిణలు చేసే పవిత్ర వేప చెట్టు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Bonthalamma Talli Moolavirat Garbhalayam',
        nameTe: 'శ్రీ బొంతలమ్మ తల్లి మూలవిరాట్టు గర్భాలయం',
        category: 'sanctum',
        lat: 13.6460,
        lng: 79.4404,
        svgX: 270,
        svgY: 85,
        descEn: 'Consecrated sanctum of protective Mother Goddess Bonthalamma adorned with kumkum, turmeric, and silver kavacham.',
        descTe: 'పసుపు, కుంకుమలతో దివ్యంగా అలంకరించబడిన బొంతలమ్మ తల్లి గర్భగుడి.'
      },
      {
        id: 'kumkum-prasadam',
        nameEn: 'Kumkumarchana, Theertham & Prasadam Counter',
        nameTe: 'కుంకుమార్చన, తీర్థం & ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.6458,
        lng: 79.4406,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect sacred Raksha Kumkum, blessed neem leaves, holy theertham, and sweet pongal prasadam.',
        descTe: 'అమ్మవారి పవిత్ర కుంకుమ, తీర్థం మరియు ప్రసాదం స్వీకరించే స్థలం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Akkarampalle Arrival & Parking', titleTe: 'అక్కరంపల్లె చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle along the approach lane.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Temple Entrance & Footwear', titleTe: 'ప్రవేశం & పాదరక్షల కేంద్రం', distance: '20m', timeMins: 2, descEn: 'Deposit shoes and enter through the temple archway.', descTe: 'చెప్పులు విడిచి ఆలయంలోకి ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Sacred Neem Tree', titleTe: 'ధ్వజస్తంభం & వేప వృక్ష ప్రదక్షిణ', distance: '40m', timeMins: 5, descEn: 'Bow before the flag mast and perform pradakshina around the holy neem tree.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు వృక్ష ప్రదక్షిణ.' },
      { stepNumber: 4, titleEn: 'Sri Bonthalamma Talli Darshan', titleTe: 'శ్రీ బొంతలమ్మ తల్లి దివ్య దర్శనం', distance: '60m', timeMins: 10, descEn: 'Seek blessings of the protective Gramadevata in the sanctum.', descTe: 'అమ్మవారి ఆశీస్సులు పొందండి.' },
      { stepNumber: 5, titleEn: 'Kumkumarchana & Blessed Prasadam', titleTe: 'కుంకుమార్చన & ప్రసాదం', distance: '40m', timeMins: 5, descEn: 'Receive blessed vermillion (Kumkum) and sacred theertham.', descTe: 'రక్షా కుంకుమ మరియు తీర్థం స్వీకరించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Bonthalamma Temple Committee Office', titleTe: 'బొంతలమ్మ ఆలయ కమిటీ కార్యాలయం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'mogili-temple': {
    placeId: 'mogili-temple',
    titleEn: 'Sri Mogileeswara Swamy Temple Precinct Map',
    titleTe: 'శ్రీ మొగిలీశ్వర స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.2081, lng: 78.8950 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 160], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Highway Approach Parking Bay',
        nameTe: 'హైవే పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.2075,
        lng: 78.8945,
        svgX: 430,
        svgY: 290,
        descEn: 'Shaded vehicle and car parking area along the Chennai-Bangalore highway.',
        descTe: 'చెన్నై-బెంగళూరు హైవే వద్ద ఉన్న పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Eastern Raja Gopuram Entrance',
        nameTe: 'తూర్పు రాజగోపురం ప్రవేశం',
        category: 'entry',
        lat: 13.2078,
        lng: 78.8948,
        svgX: 270,
        svgY: 275,
        descEn: 'Ancient stone entrance gateway welcoming devotees.',
        descTe: 'ఆలయ ప్రధాన ప్రవేశ గోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.2079,
        lng: 78.8946,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe custody counter near temple entrance.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Gomukha Nandi Spring',
        nameTe: 'ధ్వజస్తంభం & గోముఖ నంది జలధార',
        category: 'info',
        lat: 13.2080,
        lng: 78.8949,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred Nandi bull idol where cold perennial water constantly trickles from beneath its feet year-round.',
        descTe: 'నంది పాదాల నుండి నిరంతరం ప్రవహించే పవిత్ర జీవ జలధార.'
      },
      {
        id: 'kamakshi-shrine',
        nameEn: 'Sri Kamakshi Ammavari Shrine',
        nameTe: 'శ్రీ కామాక్షి అమ్మవారి సన్నిధి',
        category: 'info',
        lat: 13.2082,
        lng: 78.8947,
        svgX: 150,
        svgY: 130,
        descEn: 'Goddess Kamakshi (Parvathi Devi) sub-shrine in the sacred courtyard.',
        descTe: 'శ్రీ కామాక్షి అమ్మవారి ఉపాలయం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Mogileeswara Swamy Swayambhu Garbhalayam',
        nameTe: 'శ్రీ మొగిలీశ్వర స్వామి స్వయంభూ గర్భాలయం',
        category: 'sanctum',
        lat: 13.2083,
        lng: 78.8950,
        svgX: 270,
        svgY: 85,
        descEn: 'Self-manifested Shiva Lingam discovered beneath ancient Mogili (Kewra) thickets.',
        descTe: 'మొగిలి పొదల్లో వెలసిన స్వయంభూ శివలింగం మరియు పవిత్ర గర్భగుడి.'
      },
      {
        id: 'laddu',
        nameEn: 'Bilva Archana & Vibhuti Theertha Prasadam',
        nameTe: 'బిల్వార్చన & విభూతి ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.2081,
        lng: 78.8953,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect blessed Vibhuti, holy Bilva leaves, and Nandi spring theertham.',
        descTe: 'పవిత్ర విభూతి మరియు నంది తీర్థం స్వీకరించండి.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Mogili Arrival & Parking', titleTe: 'మొగిలి పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle along the highway approach bay.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కేంద్రం', distance: '30m', timeMins: 2, descEn: 'Deposit shoes and enter through the stone gopuram.', descTe: 'చెప్పులు విడిచి గోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Gomukha Nandi Perennial Spring', titleTe: 'గోముఖ నంది పవిత్ర జలధార', distance: '50m', timeMins: 5, descEn: 'Witness the mysterious perennial stream trickling from Nandi\'s feet.', descTe: 'నంది పాదాల నుండి వచ్చే పవిత్ర జలాన్ని దర్శించండి.' },
      { stepNumber: 4, titleEn: 'Sri Mogileeswara Lingam Darshan', titleTe: 'శ్రీ మొగిలీశ్వర స్వామి దర్శనం', distance: '70m', timeMins: 15, descEn: 'Seek blessings of the Swayambhu Shiva Lingam in the sanctum.', descTe: 'స్వామివారి దివ్య దర్శనం మరియు ఆశీస్సులు.' },
      { stepNumber: 5, titleEn: 'Kamakshi Shrine & Vibhuti Prasadam', titleTe: 'అమ్మవారి దర్శనం & ప్రసాదం', distance: '50m', timeMins: 5, descEn: 'Visit Sri Kamakshi Ammavaru and receive holy vibhuti theertham.', descTe: 'కామాక్షి అమ్మవారి దర్శనం మరియు విభూతి ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Mogili Temple Administration Office', titleTe: 'మొగిలి ఆలయ సమాచార విభాగం', number: '08572281540' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'kanipakam': {
    placeId: 'kanipakam',
    titleEn: 'Sri Varasiddhi Vinayaka Swamy Temple (Kanipakam) Precinct Map',
    titleTe: 'శ్రీ వరసిద్ధి వినాయక స్వామి ఆలయం (కాణిపాకం) ప్రాంగణ మ్యాప్',
    layoutType: 'grand-temple',
    centerCoordinates: { lat: 13.2796, lng: 79.0347 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 90], [415, 105], [370, 190], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Devasthanam Visitor Parking Plaza',
        nameTe: 'దేవస్థానం పార్కింగ్ ప్రదేశం',
        category: 'parking',
        lat: 13.2790,
        lng: 79.0340,
        svgX: 430,
        svgY: 290,
        descEn: 'Large multi-level vehicle and tourist bus parking complex.',
        descTe: 'వాహనాలు మరియు బస్సుల పార్కింగ్ సముదాయం.'
      },
      {
        id: 'entry',
        nameEn: 'Raja Gopuram & Covered Queue Entrance',
        nameTe: 'రాజగోపురం & క్యూ కాంప్లెక్స్ ప్రవేశం',
        category: 'entry',
        lat: 13.2793,
        lng: 79.0344,
        svgX: 270,
        svgY: 275,
        descEn: 'Towering Vijayanagara-style entrance gopuram and special darshan queue entry.',
        descTe: 'విజయనగర శైలి రాజగోపురం మరియు దర్శన ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Free Footwear & Baggage Counter',
        nameTe: 'ఉచిత పాదరక్షల కేంద్రం',
        category: 'footwear',
        lat: 13.2792,
        lng: 79.0342,
        svgX: 145,
        svgY: 255,
        descEn: 'Free token custody counter for footwear and electronic items.',
        descTe: 'పాదరక్షలు భద్రపరిచే ఉచిత కౌంటర్.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Mushika (Mouse) Vahanam',
        nameTe: 'ధ్వజస్తంభం & మూషిక వాహనం',
        category: 'info',
        lat: 13.2795,
        lng: 79.0346,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred golden flag mast and Lord Ganesha\'s Mushika vehicle in the inner courtyard.',
        descTe: 'పవిత్ర ధ్వజస్తంభం మరియు మూషిక వాహన దర్శనం.'
      },
      {
        id: 'shiva-shrine',
        nameEn: 'Sri Manikantheswara Swamy & Varadaraja Sub-Shrines',
        nameTe: 'శ్రీ మణికంఠేశ్వర & వరదరాజ స్వామి సన్నిధులు',
        category: 'info',
        lat: 13.2797,
        lng: 79.0343,
        svgX: 150,
        svgY: 130,
        descEn: 'Ancient Chola-era sub-shrines dedicated to Lord Shiva (Manikantheswara) and Lord Vishnu inside temple prakaram.',
        descTe: 'ఆలయ ప్రాకారంలోని ప్రాచీన శివ మరియు విష్ణు ఉపాలయాలు.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Varasiddhi Vinayaka Garbhalayam (Swayambhu Well)',
        nameTe: 'శ్రీ వరసిద్ధి వినాయక స్వామి స్వయంభూ బావి (గర్భాలయం)',
        category: 'sanctum',
        lat: 13.2798,
        lng: 79.0347,
        svgX: 270,
        svgY: 90,
        descEn: 'Self-manifested growing idol of Lord Ganesha in the perennial holy water well. Devotees take sacred well theertham.',
        descTe: 'నిరంతరం నీరు ఊరే పవిత్ర బావిలో స్వయంభూగా వెలసిన వినాయక స్వామి మూలవిరాట్టు.'
      },
      {
        id: 'pushkarini',
        nameEn: 'Bahuda River Holy Pushkarini Tank (Manikarnika)',
        nameTe: 'బాహుదా నది మణికర్ణిక పుష్కరిణి',
        category: 'info',
        lat: 13.2800,
        lng: 79.0352,
        svgX: 415,
        svgY: 105,
        descEn: 'Sacred river water temple tank where pilgrims take a cleansing holy bath before darshan.',
        descTe: 'దర్శనానికి ముందు భక్తులు పవిత్ర స్నానం ఆచరించే పుష్కరిణి.'
      },
      {
        id: 'laddu',
        nameEn: 'Kanipakam Laddu, Coconut & Theertham Counter',
        nameTe: 'కాణిపాకం లడ్డూ & ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.2795,
        lng: 79.0350,
        svgX: 370,
        svgY: 190,
        descEn: 'Famous Kanipakam delicious laddus, unbroken coconut offering return, and sanctum theertham bottles.',
        descTe: 'ప్రసిద్ధ కాణిపాకం లడ్డూ ప్రసాదం మరియు పవిత్ర బావి తీర్థం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Kanipakam Arrival & Parking', titleTe: 'కాణిపాకం పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the Devasthanam parking plaza.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కౌంటర్', distance: '50m', timeMins: 2, descEn: 'Deposit shoes and enter through the grand Raja Gopuram.', descTe: 'చెప్పులు విడిచి రాజగోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Manikantheswara Shrine', titleTe: 'ధ్వజస్తంభం & మణికంఠేశ్వర స్వామి సన్నిధి', distance: '80m', timeMins: 5, descEn: 'Offer prayers at the flag mast and visit the ancient Shiva sub-shrine.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు శివాలయ దర్శనం.' },
      { stepNumber: 4, titleEn: 'Swayambhu Varasiddhi Vinayaka Darshan', titleTe: 'స్వయంభూ వరసిద్ధి వినాయక దర్శనం', distance: '100m', timeMins: 20, descEn: 'Seek blessings of the growing Ganesha in the sacred water well and receive holy theertham.', descTe: 'పవిత్ర బావిలోని వినాయక స్వామి దివ్య దర్శనం.' },
      { stepNumber: 5, titleEn: 'Bahuda Pushkarini & Laddu Prasadam', titleTe: 'పుష్కరిణి తీర్థం & లడ్డూ ప్రసాదం', distance: '120m', timeMins: 10, descEn: 'Visit the holy river tank and collect fresh Kanipakam laddu prasadam.', descTe: 'బాహుదా తీర్థం మరియు లడ్డూ ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Kanipakam Devasthanam Temple Office', titleTe: 'కాణిపాకం దేవస్థానం సమాచార విభాగం', number: '08572281540' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'srivari-padalu-spot': {
    placeId: 'srivari-padalu-spot',
    titleEn: 'Srivari Paadaalu (Narayanagiri Peak) Precinct Map',
    titleTe: 'శ్రీవారి పాదాలు (నారాయణగిరి శిఖరం) ప్రాంగణ మ్యాప్',
    layoutType: 'geo-nature-park',
    centerCoordinates: { lat: 13.6790, lng: 79.3331 },
    routePath: [[430, 290], [270, 275], [145, 255], [150, 130], [270, 90], [380, 160], [270, 275]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Narayanagiri Peak Parking Bay',
        nameTe: 'నారాయణగిరి శిఖర పార్కింగ్',
        category: 'parking',
        lat: 13.6785,
        lng: 79.3325,
        svgX: 430,
        svgY: 290,
        descEn: 'Designated vehicle and taxi parking lot atop Narayanagiri hill road.',
        descTe: 'నారాయణగిరి కొండపై వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Narayanagiri Hilltop Entrance Arch',
        nameTe: 'నారాయణగిరి కొండపై ప్రవేశ ముఖద్వారం',
        category: 'entry',
        lat: 13.6788,
        lng: 79.3328,
        svgX: 270,
        svgY: 275,
        descEn: 'Stone archway and paved stairway leading to the highest point of Tirumala.',
        descTe: 'తిరుమల ఎత్తైన శిఖరానికి వెళ్లే ప్రవేశ మార్గం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.6789,
        lng: 79.3327,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe deposit area before ascending the sacred granite steps.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'panoramic-view',
        nameEn: '360° Seshachalam Hills & Ananda Nilayam Viewpoint',
        nameTe: '360° ఏడుకొండలు & ఆనంద నిలయం వీక్షణ వేదిక',
        category: 'info',
        lat: 13.6791,
        lng: 79.3328,
        svgX: 150,
        svgY: 130,
        descEn: 'Spectacular 360-degree viewpoint overlooking the entire Seshachalam mountain range and the golden Ananda Nilayam.',
        descTe: 'తిరుమల కొండలు మరియు ఆనంద నిలయం వీక్షించే అద్భుత వేదిక.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Padala Mandapam (Sacred Divine Footprints)',
        nameTe: 'శ్రీ పాదాల మండపం (దివ్య శ్రీవారి పాదాలు)',
        category: 'sanctum',
        lat: 13.6793,
        lng: 79.3331,
        svgX: 270,
        svgY: 90,
        descEn: 'Glass-encased rock footprints where Lord Venkateswara first set foot on Earth in the Kali Yuga. Harathi and theertham are offered here.',
        descTe: 'కలియుగంలో శ్రీవారు భూమిపై మొదట అడుగుపెట్టిన పవిత్ర శిలా పాదాలు.'
      },
      {
        id: 'theertham-prasadam',
        nameEn: 'Harathi, Theertham & Kumkum Prasadam Counter',
        nameTe: 'హారతి, తీర్థం & కుంకుమ ప్రసాదం',
        category: 'food',
        lat: 13.6790,
        lng: 79.3335,
        svgX: 380,
        svgY: 160,
        descEn: 'Receive blessed harathi blessings, holy theertham, and sacred akshatas from TTD archakas.',
        descTe: 'పవిత్ర హారతి ఆశీస్సులు మరియు తీర్థ ప్రసాదం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Narayanagiri Peak Arrival & Parking', titleTe: 'నారాయణగిరి శిఖరం చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the Narayanagiri hill parking lot.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Entrance Arch & Footwear Depot', titleTe: 'ప్రవేశ ద్వారం & పాదరక్షల స్టాండ్', distance: '30m', timeMins: 2, descEn: 'Deposit shoes and take the stone steps up the sacred hill.', descTe: 'చెప్పులు విడిచి మెట్లు ఎక్కండి.' },
      { stepNumber: 3, titleEn: '360° Seshachalam Mountain Viewpoint', titleTe: 'ఏడుకొండల అద్భుత వీక్షణ', distance: '50m', timeMins: 5, descEn: 'Enjoy panoramic vistas of the Seven Hills and Tirumala valley.', descTe: 'అందమైన కొండల దృశ్యాలను తిలకించండి.' },
      { stepNumber: 4, titleEn: 'Srivari Divine Footprints Darshan', titleTe: 'శ్రీవారి దివ్య పాదాల దర్శనం', distance: '60m', timeMins: 15, descEn: 'Offer prayers at the sacred glass-protected footprint relic of Lord Balaji.', descTe: 'శ్రీవారి పవిత్ర పాద ముద్రలను దర్శించుకోండి.' },
      { stepNumber: 5, titleEn: 'Harathi & Theertha Prasadam', titleTe: 'హారతి & తీర్థ ప్రసాదం', distance: '40m', timeMins: 5, descEn: 'Receive sacred harathi, theertham, and kumkum blessings.', descTe: 'హారతి మరియు తీర్థం స్వీకరించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Narayanagiri Security Post', titleTe: 'నారాయణగిరి భద్రతా విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'srivari-mettu-path': {
    placeId: 'srivari-mettu-path',
    titleEn: 'Srivari Mettu Footpath Trail Precinct Map',
    titleTe: 'శ్రీవారి మెట్టు నడక మార్గం ప్రాంగణ మ్యాప్',
    layoutType: 'trek-trail',
    centerCoordinates: { lat: 13.6338, lng: 79.3308 },
    routePath: [[430, 290], [270, 275], [145, 245], [270, 200], [270, 135], [270, 65]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Srivari Mettu Base Parking Plaza',
        nameTe: 'శ్రీవారి మెట్టు బేస్ పార్కింగ్',
        category: 'parking',
        lat: 13.6330,
        lng: 79.3300,
        svgX: 430,
        svgY: 290,
        descEn: 'Spacious four-wheeler, two-wheeler parking, and taxi drop stand at trail base.',
        descTe: 'నడక మార్గం వద్ద వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Srivari Mettu Path Entrance Arch (Step 1)',
        nameTe: 'శ్రీవారి మెట్టు ప్రారంభ ద్వారం (మొదటి మెట్టు)',
        category: 'entry',
        lat: 13.6334,
        lng: 79.3305,
        svgX: 270,
        svgY: 275,
        descEn: 'Sacred entrance archway and the 1st step of the 2,388 steps pedestrian trail to Tirumala.',
        descTe: 'తిరుమల 2,388 మెట్ల నడక మార్గం ప్రారంభ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Free TTD Luggage & Footwear Transfer Depot',
        nameTe: 'ఉచిత లగేజ్ & పాదరక్షల రవాణా కేంద్రం',
        category: 'footwear',
        lat: 13.6335,
        lng: 79.3303,
        svgX: 145,
        svgY: 245,
        descEn: 'Free TTD baggage delivery counter that transfers your bags directly to Tirumala hilltop.',
        descTe: 'ఉచిత లగేజ్ కేంద్రం - మీ బ్యాగులను కొండపైకి చేరవేస్తుంది.'
      },
      {
        id: 'token-checkpoint',
        nameEn: 'Divya Darshanam (SSD) Token & Biometric Checkpoint (Step 500)',
        nameTe: 'దివ్య దర్శనం టోకెన్ & బయోమెట్రిక్ కౌంటర్ (500వ మెట్టు)',
        category: 'info',
        lat: 13.6337,
        lng: 79.3308,
        svgX: 270,
        svgY: 200,
        descEn: 'TTD Divya Darshan token issuance & biometric stamping point for walking pilgrims.',
        descTe: 'పాదచారులకు దివ్య దర్శన టోకెన్లు ఇచ్చే కేంద్రం.'
      },
      {
        id: 'rest-mandapam',
        nameEn: 'Midpoint Resting Pavilion & RO Water Stalls (Step 1,200)',
        nameTe: 'మధ్య విశ్రాంతి మండపం & తాగునీటి కేంద్రం (1200వ మెట్టు)',
        category: 'info',
        lat: 13.6342,
        lng: 79.3312,
        svgX: 270,
        svgY: 135,
        descEn: 'Sheltered rest mandapam with free RO drinking water, restrooms, and medical first-aid.',
        descTe: 'విశ్రాంతి మండపం, తాగునీరు మరియు ప్రథమ చికిత్స కేంద్రం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Tirumala Summit Terminal & Srivari Padalu (Step 2,388)',
        nameTe: 'తిరుమల కొండపై ముగింపు & శ్రీవారి పాదాలు (2388వ మెట్టు)',
        category: 'sanctum',
        lat: 13.6348,
        lng: 79.3318,
        svgX: 270,
        svgY: 65,
        descEn: 'Final 2,388th step joining Tirumala ring road, luggage collection center, and Srivari Temple entry.',
        descTe: 'కొండపై నడక మార్గం ముగింపు మరియు లగేజ్ సేకరణ కేంద్రం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Base Arrival & Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at Srivari Mettu base.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Free Luggage Handover', titleTe: 'లగేజ్ కౌంటర్ వద్ద ఇవ్వడం', distance: '50m', timeMins: 3, descEn: 'Deposit heavy bags for free TTD vehicle transfer to Tirumala.', descTe: 'లగేజ్‌ను ఉచిత బస్సు రవాణా కోసం ఇవ్వండి.' },
      { stepNumber: 3, titleEn: 'Entrance & Divya Darshan Token (Step 500)', titleTe: 'ప్రారంభం & టోకెన్ పొందడం', distance: '300m', timeMins: 15, descEn: 'Pass entrance arch and scan biometric at Step 500.', descTe: '500వ మెట్టు వద్ద టోకెన్ బయోమెట్రిక్ చేయించుకోండి.' },
      { stepNumber: 4, titleEn: 'Midway Rest Mandapam (Step 1,200)', titleTe: 'విశ్రాంతి మండపం (1200వ మెట్టు)', distance: '800m', timeMins: 35, descEn: 'Take a short break and refill water bottles.', descTe: 'తాగునీరు తాగి కాసేపు విశ్రాంతి తీసుకోండి.' },
      { stepNumber: 5, titleEn: 'Tirumala Summit Arrival (Step 2,388)', titleTe: 'తిరుమల శిఖరం చేరుకోవడం (2388వ మెట్టు)', distance: '1.0 km', timeMins: 45, descEn: 'Reach Tirumala summit, collect luggage, and proceed to Srivari Temple.', descTe: 'కొండపై లగేజ్ తీసుకుని శ్రీవారి దర్శనానికి వెళ్ళండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Srivari Mettu Toll / Security Post', titleTe: 'శ్రీవారి మెట్టు భద్రతా విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'srinivasa-mangapuram': {
    placeId: 'srinivasa-mangapuram',
    titleEn: 'Sri Kalyana Venkateswara Swamy Temple Precinct Map',
    titleTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.6108, lng: 79.3277 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Temple Visitor Parking Complex',
        nameTe: 'ఆలయ పార్కింగ్ సముదాయం',
        category: 'parking',
        lat: 13.6100,
        lng: 79.3270,
        svgX: 430,
        svgY: 290,
        descEn: 'Spacious four-wheeler and two-wheeler parking opposite the temple gopuram.',
        descTe: 'రాజగోపురం ఎదురుగా ఉన్న వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Eastern Raja Gopuram Main Entrance',
        nameTe: 'తూర్పు రాజగోపురం ప్రధాన ప్రవేశం',
        category: 'entry',
        lat: 13.6105,
        lng: 79.3275,
        svgX: 270,
        svgY: 275,
        descEn: 'Majestic 5-tier ancient Dravidian entrance tower.',
        descTe: 'భవ్యం మరియు పురాతనమైన 5 అంతస్తుల రాజగోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Free Footwear & Baggage Counter',
        nameTe: 'ఉచిత పాదరక్షల భద్రతా కేంద్రం',
        category: 'footwear',
        lat: 13.6106,
        lng: 79.3273,
        svgX: 145,
        svgY: 255,
        descEn: 'Deposit shoes before entering the holy temple prakaram.',
        descTe: 'ఆలయ ప్రాంగణంలోకి ప్రవేశించే ముందు చెప్పులు భద్రపరిచే కౌంటర్.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Balipeetham Flag Mast',
        nameTe: 'ధ్వజస్తంభం & బలిపీఠం',
        category: 'info',
        lat: 13.6107,
        lng: 79.3276,
        svgX: 270,
        svgY: 205,
        descEn: 'Golden flag mast offering sashtanga namaskaram before sanctum darshan.',
        descTe: 'ధ్వజస్తంభానికి సాష్టాంగ నమస్కారం ఆచరించే స్థలం.'
      },
      {
        id: 'padmavathi-shrine',
        nameEn: 'Sri Padmavathi Devi Sub-Shrine',
        nameTe: 'శ్రీ పద్మావతి అమ్మవారి ఉపాలయం',
        category: 'info',
        lat: 13.6109,
        lng: 79.3274,
        svgX: 150,
        svgY: 130,
        descEn: 'Sanctum of Divine Mother Padmavathi in the inner parikrama corridor.',
        descTe: 'ప్రాకార మండపంలో ఉన్న శ్రీ పద్మావతి దేవి సన్నిధి.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Kalyana Venkateswara Swamy Garbhalayam',
        nameTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి మూలవిరాట్టు',
        category: 'sanctum',
        lat: 13.6110,
        lng: 79.3277,
        svgX: 270,
        svgY: 85,
        descEn: 'Presiding deity standing in grand Kalyana posture where Lord Venkateswara stayed after marriage. Devotees receive sacred Kalyana Kankanam.',
        descTe: 'కల్యాణ వైభవ రూపంలో స్వామివారి దర్శనం - కల్యాణ కంకణాల ఆశీస్సులు.'
      },
      {
        id: 'ranganatha-shrine',
        nameEn: 'Sri Ranganatha Swamy Shrine',
        nameTe: 'శ్రీ రంగనాథ స్వామి సన్నిధి',
        category: 'info',
        lat: 13.6109,
        lng: 79.3280,
        svgX: 395,
        svgY: 120,
        descEn: 'Sub-shrine dedicated to Lord Ranganatha in resting posture.',
        descTe: 'శ్రీ రంగనాథ స్వామి వారి ఉపాలయం.'
      },
      {
        id: 'laddu',
        nameEn: 'Kalyana Kankanam & TTD Laddu Prasadam Counter',
        nameTe: 'కల్యాణ కంకణం & లడ్డూ ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.6107,
        lng: 79.3279,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect sacred wedding thread (Kankanam) and fresh TTD laddu prasadam.',
        descTe: 'స్వామివారి కల్యాణ కంకణం మరియు లడ్డూ ప్రసాదం పొందే కౌంటర్.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Arrival & Temple Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle in front of the Raja Gopuram.', descTe: 'రాజగోపురం ఎదురుగా వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కేంద్రం', distance: '50m', timeMins: 2, descEn: 'Deposit shoes and enter through the 5-tier Gopuram.', descTe: 'చెప్పులు విడిచి రాజగోపురం గుండా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Padmavathi Shrine', titleTe: 'ధ్వజస్తంభం & పద్మావతి అమ్మవారి సన్నిధి', distance: '80m', timeMins: 5, descEn: 'Offer prayers at the flag mast and visit Mother Padmavathi shrine.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు అమ్మవారి దర్శనం.' },
      { stepNumber: 4, titleEn: 'Sri Kalyana Venkateswara Swamy Darshan', titleTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి దర్శనం', distance: '100m', timeMins: 15, descEn: 'Receive sanctum darshan of the Lord in divine wedding form and blessed Kalyana Kankanam.', descTe: 'స్వామివారి కల్యాణ వైభవ దర్శనం మరియు కల్యాణ కంకణాలు.' },
      { stepNumber: 5, titleEn: 'Ranganatha Shrine & Laddu Prasadam Counter', titleTe: 'రంగనాథ సన్నిధి & లడ్డూ ప్రసాదం', distance: '120m', timeMins: 5, descEn: 'Visit Sri Ranganatha Swamy and collect fresh TTD laddu prasadam.', descTe: 'శ్రీ రంగనాథ స్వామి దర్శనం మరియు లడ్డూ ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Srinivasa Mangapuram Temple Office', titleTe: 'శ్రీనివాస మంగాపురం ఆలయ విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'appalayagunta-temple': {
    placeId: 'appalayagunta-temple',
    titleEn: 'Sri Prasanna Venkateswara Swamy Temple Precinct Map',
    titleTe: 'శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5373701, lng: 79.4776129 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Appalayagunta Temple Parking',
        nameTe: 'అప్పలాయగుంట పార్కింగ్',
        category: 'parking',
        lat: 13.5368,
        lng: 79.4772,
        svgX: 430,
        svgY: 290,
        descEn: 'Parking area in front of the temple complex.',
        descTe: 'ఆలయం ఎదురుగా ఉన్న పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Raja Gopuram Entrance',
        nameTe: 'రాజగోపురం ప్రవేశం',
        category: 'entry',
        lat: 13.5371,
        lng: 79.4774,
        svgX: 270,
        svgY: 275,
        descEn: 'Ancient Dravidian temple entrance gopuram.',
        descTe: 'ఆలయ ప్రధాన రాజగోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Counter',
        nameTe: 'పాదరక్షల కౌంటర్',
        category: 'footwear',
        lat: 13.5372,
        lng: 79.4773,
        svgX: 145,
        svgY: 255,
        descEn: 'Deposit shoes before entering.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham Flag Mast',
        nameTe: 'ధ్వజస్తంభం',
        category: 'info',
        lat: 13.5373,
        lng: 79.4775,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred temple flag mast in the outer courtyard.',
        descTe: 'ఆలయ ధ్వజస్తంభం.'
      },
      {
        id: 'anjaneya-shrine',
        nameEn: 'Sri Anjaneya Swamy Sub-Shrine (Miraculous Healer)',
        nameTe: 'శ్రీ ఆంజనేయ స్వామి సన్నిధి (వ్యాధి నివారణ)',
        category: 'info',
        lat: 13.5374,
        lng: 79.4774,
        svgX: 150,
        svgY: 130,
        descEn: 'Powerful Hanuman shrine famous for granting relief from chronic diseases and distress.',
        descTe: 'వ్యాధి నివారణ ప్రసిద్ధి చెందిన శ్రీ హనుమాన్ సన్నిధి.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Prasanna Venkateswara Swamy Garbhalayam (Abhaya Hasta)',
        nameTe: 'శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి (అభయ హస్తం)',
        category: 'sanctum',
        lat: 13.5373701,
        lng: 79.4776129,
        svgX: 270,
        svgY: 85,
        descEn: 'Presiding deity in unique Abhaya Hasta (blessing) posture.',
        descTe: 'అభయ హస్త ముద్రలో దర్శనమిచ్చే స్వామివారి మూలవిరాట్టు.'
      },
      {
        id: 'padmavathi-shrine',
        nameEn: 'Sri Padmavathi Ammavari Shrine',
        nameTe: 'శ్రీ పద్మావతి అమ్మవారి సన్నిధి',
        category: 'info',
        lat: 13.5375,
        lng: 79.4778,
        svgX: 395,
        svgY: 120,
        descEn: 'Sub-shrine for Sri Padmavathi Devi.',
        descTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం.'
      },
      {
        id: 'laddu',
        nameEn: 'TTD Prasadam Counter',
        nameTe: 'టీటీడీ ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.5372,
        lng: 79.4777,
        svgX: 395,
        svgY: 160,
        descEn: 'Fresh laddu and pulihora prasadam counter.',
        descTe: 'లడ్డూ మరియు పులిహోర ప్రసాదం కౌంటర్.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Arrival & Temple Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle in front of the temple complex.', descTe: 'ఆలయం ఎదురుగా వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కేంద్రం', distance: '50m', timeMins: 2, descEn: 'Deposit shoes and enter through the ancient Gopuram.', descTe: 'చెప్పులు విడిచి రాజగోపురం గుండా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Anjaneya Shrine', titleTe: 'ధ్వజస్తంభం & ఆంజనేయ స్వామి సన్నిధి', distance: '80m', timeMins: 5, descEn: 'Offer prayers at the flag mast and visit the miraculous Anjaneya Swamy.', descTe: 'ధ్వజస్తంభ నమస్కారం మరియు హనుమాన్ దర్శనం.' },
      { stepNumber: 4, titleEn: 'Sri Prasanna Venkateswara Swamy Darshan', titleTe: 'శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి దర్శనం', distance: '100m', timeMins: 15, descEn: 'Receive sanctum darshan of the Lord in Abhaya Hasta posture.', descTe: 'స్వామివారి దివ్య దర్శనం.' },
      { stepNumber: 5, titleEn: 'Padmavathi Shrine & Prasadam Counter', titleTe: 'పద్మావతి సన్నిధి & ప్రసాదం', distance: '120m', timeMins: 5, descEn: 'Visit Mother Padmavathi and collect TTD prasadam.', descTe: 'అమ్మవారి దర్శనం మరియు ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Appalayagunta Temple Office', titleTe: 'అప్పలాయగుంట ఆలయ విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'sree-padmagiri-subramanya': {
    placeId: 'sree-padmagiri-subramanya',
    titleEn: 'Sri Padmagiri Balagnana Dandayudhapani Swamy Temple Precinct Map',
    titleTe: 'శ్రీ పద్మగిరి బాలజ్ఞాన దండాయుధపాణి స్వామి ఆలయ ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5851949, lng: 79.4314015 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Padmagiri Hill Base Parking',
        nameTe: 'పద్మగిరి కొండ దిగువన పార్కింగ్',
        category: 'parking',
        lat: 13.5846,
        lng: 79.4308,
        svgX: 430,
        svgY: 290,
        descEn: 'Shaded vehicle parking area at the base of Padmagiri hill.',
        descTe: 'కొండ దిగువన ఉన్న వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Hilltop Entrance Raja Gopuram & Steps',
        nameTe: 'కొండపై రాజగోపురం & మెట్ల మార్గం',
        category: 'entry',
        lat: 13.5849,
        lng: 79.4311,
        svgX: 270,
        svgY: 275,
        descEn: 'Sacred entrance archway atop the hill overlooking Thanapalli.',
        descTe: 'కొండపై ఆలయ ప్రధాన ప్రవేశ ద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.5850,
        lng: 79.4309,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe custody counter near temple gateway.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Mayura (Peacock) Vahanam',
        nameTe: 'ధ్వజస్తంభం & మయూర వాహనం',
        category: 'info',
        lat: 13.5851,
        lng: 79.4312,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred flag mast and Lord Murugan\'s divine Peacock vehicle in the courtyard.',
        descTe: 'మయూర వాహన మండపం మరియు పవిత్ర ధ్వజస్తంభం.'
      },
      {
        id: 'shatkona-peetham',
        nameEn: 'Shatkona Yantra Peetham & Navagraha Shrine',
        nameTe: 'షట్కోణ యంత్ర పీఠం & నవగ్రహ సన్నిధి',
        category: 'info',
        lat: 13.5852,
        lng: 79.4310,
        svgX: 150,
        svgY: 130,
        descEn: 'Mystic hexagonal Shatkona Yantra established by Sri Ganapathi Swamy.',
        descTe: 'శ్రీ గణపతి స్వామి స్థాపించిన మహిమాన్విత షట్కోణ యంత్ర పీఠం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Balagnana Dandayudhapani Swamy Garbhalayam',
        nameTe: 'శ్రీ బాలజ్ఞాన దండాయుధపాణి స్వామి గర్భాలయం',
        category: 'sanctum',
        lat: 13.5851949,
        lng: 79.4314015,
        svgX: 270,
        svgY: 85,
        descEn: 'Lord Murugan worshipped in celibate Balagnana Dandayudhapani posture holding the divine Vel/Danda.',
        descTe: 'బాల మురుగన్ (దండాయుధపాణి) దివ్య మూలవిరాట్టు దర్శనం.'
      },
      {
        id: 'laddu',
        nameEn: 'Vibhuti & Panchamrutham Prasadam Counter',
        nameTe: 'విభూతి & పంచామృతం ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.5851,
        lng: 79.4317,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect consecrated Vibhuti and Palani-style holy Panchamrutham prasadam.',
        descTe: 'పవిత్ర విభూతి మరియు పంచామృత ప్రసాదం.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Padmagiri Hill Arrival & Parking', titleTe: 'పద్మగిరి కొండ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the base of the Thanapalli hill.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Hill Steps & Raja Gopuram Entrance', titleTe: 'మెట్లు & రాజగోపురం ప్రవేశం', distance: '40m', timeMins: 3, descEn: 'Ascend the steps, deposit footwear, and enter the sanctum courtyard.', descTe: 'మెట్లు ఎక్కి చెప్పులు విడిచి గోపురం గుండా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Shatkona Yantra Peetham', titleTe: 'ధ్వజస్తంభం & షట్కోణ యంత్రం', distance: '60m', timeMins: 5, descEn: 'Offer prayers at the Peacock vehicle and meditate at the mystical Shatkona Yantra.', descTe: 'మయూర వాహనం మరియు షట్కోణ యంత్రాన్ని దర్శించండి.' },
      { stepNumber: 4, titleEn: 'Sri Balagnana Dandayudhapani Sanctum Darshan', titleTe: 'శ్రీ దండాయుధపాణి స్వామి దర్శనం', distance: '80m', timeMins: 15, descEn: 'Receive the powerful blessings of Lord Subramanya Swamy holding the divine Vel.', descTe: 'స్వామివారి దివ్య దర్శనం మరియు ఆశీస్సులు.' },
      { stepNumber: 5, titleEn: 'Vibhuti & Panchamrutham Prasadam', titleTe: 'విభూతి & పంచామృతం', distance: '60m', timeMins: 5, descEn: 'Collect blessed Vibhuti and holy Panchamrutham.', descTe: 'పవిత్ర విభూతి ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'Padmagiri Temple Information Office', titleTe: 'పద్మగిరి ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'vakula-matha': {
    placeId: 'vakula-matha',
    titleEn: 'Sri Vakula Matha Temple (Perur Banda) Precinct Map',
    titleTe: 'శ్రీ వకుళమాత ఆలయం (పేరూరు బండ) ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5995, lng: 79.3691 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Perur Banda Hill Parking Bay',
        nameTe: 'పేరూరు బండ కొండ పార్కింగ్',
        category: 'parking',
        lat: 13.5990,
        lng: 79.3685,
        svgX: 430,
        svgY: 290,
        descEn: 'Vehicle parking area at the base and summit of Perur hill.',
        descTe: 'కొండ దిగువన మరియు పైభాగంలో ఉన్న పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Hilltop Raja Gopuram Entrance',
        nameTe: 'కొండపై రాజగోపురం ప్రధాన ప్రవేశం',
        category: 'entry',
        lat: 13.5993,
        lng: 79.3688,
        svgX: 270,
        svgY: 275,
        descEn: 'Magnificent entrance gopuram offering panoramic views of Tirupati valley.',
        descTe: 'అందమైన లోయ దృశ్యాలతో కూడిన రాజగోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Custody Stand',
        nameTe: 'పాదరక్షల భద్రతా స్టాండ్',
        category: 'footwear',
        lat: 13.5994,
        lng: 79.3687,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe custody counter near temple gateway.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham Flag Mast',
        nameTe: 'ధ్వజస్తంభం',
        category: 'info',
        lat: 13.5995,
        lng: 79.3690,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred flag mast facing the mother deity.',
        descTe: 'ఆలయ ప్రాంగణంలోని పవిత్ర ధ్వజస్తంభం.'
      },
      {
        id: 'seven-hills-view',
        nameEn: 'Seven Hills & Ananda Nilayam Viewpoint Balcony',
        nameTe: 'ఏడుకొండలు & ఆనంద నిలయం వీక్షణ బాల్కనీ',
        category: 'info',
        lat: 13.5996,
        lng: 79.3688,
        svgX: 150,
        svgY: 130,
        descEn: 'Sacred balcony facing northeast where Mother Vakula gazes lovingly towards Tirumala Seven Hills.',
        descTe: 'వకుళమాత తన కుమారుడైన శ్రీవారిని వీక్షించే దివ్య కోణం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Vakula Matha Garbhalayam (Mother of Lord Venkateswara)',
        nameTe: 'శ్రీ వకుళమాత మూలవిరాట్టు (గర్భాలయం)',
        category: 'sanctum',
        lat: 13.5997,
        lng: 79.3691,
        svgX: 270,
        svgY: 85,
        descEn: 'Presiding deity of Mother Vakula Devi (Yashoda in Dwapara Yuga). Temple bell rings here first before Tirumala Naivedyam.',
        descTe: 'స్వామివారికి మాతృమూర్తి అయిన వకుళమాత దివ్య దర్శనం.'
      },
      {
        id: 'laddu',
        nameEn: 'Kumkum Archana & TTD Sweet Prasadam Counter',
        nameTe: 'కుంకుమార్చన & ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.5995,
        lng: 79.3694,
        svgX: 395,
        svgY: 160,
        descEn: 'Blessed kumkum, sacred yellow thread, and TTD sweet prasadam.',
        descTe: 'అమ్మవారి పవిత్ర కుంకుమ మరియు ప్రసాదాలు.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Perur Hill Arrival & Parking', titleTe: 'పేరూరు కొండ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the Perur Banda hill parking lot.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల స్టాండ్', distance: '40m', timeMins: 2, descEn: 'Deposit shoes and enter the scenic hilltop courtyard.', descTe: 'చెప్పులు విడిచి రాజగోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Seven Hills View Balcony', titleTe: 'ధ్వజస్తంభం & ఏడుకొండల వీక్షణ', distance: '60m', timeMins: 5, descEn: 'Offer prayers at the flag mast and gaze towards Tirumala Seven Hills.', descTe: 'ధ్వజస్తంభ దర్శనం మరియు ఏడుకొండలను తిలకించండి.' },
      { stepNumber: 4, titleEn: 'Sri Vakula Matha Sanctum Darshan', titleTe: 'శ్రీ వకుళమాత దివ్య దర్శనం', distance: '80m', timeMins: 15, descEn: 'Seek the unconditional maternal blessings of Sri Vakula Devi.', descTe: 'శ్రీవారి మాతృమూర్తి ఆశీస్సులు పొందండి.' },
      { stepNumber: 5, titleEn: 'Kumkum Archana & Prasadam', titleTe: 'కుంకుమార్చన & ప్రసాదం', distance: '60m', timeMins: 5, descEn: 'Collect blessed kumkum and sweet prasadam.', descTe: 'పవిత్ర కుంకుమ మరియు ప్రసాదం స్వీకరించండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Vakulamatha Temple Office', titleTe: 'వకుళమాత ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },

  'agastheeshwara': {
    placeId: 'agastheeshwara',
    titleEn: 'Sri Agastheeswara Swamy Temple (Mukkoti) Precinct Map',
    titleTe: 'శ్రీ అగస్త్యేశ్వర స్వామి ఆలయం (ముక్కోటి) ప్రాంగణ మ్యాప్',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.5968, lng: 79.3411 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Mukkoti Riverside Parking Bay',
        nameTe: 'ముక్కోటి నదీతీర పార్కింగ్',
        category: 'parking',
        lat: 13.5962,
        lng: 79.3405,
        svgX: 430,
        svgY: 290,
        descEn: 'Shaded vehicle parking area along the Swarnamukhi river approach.',
        descTe: 'స్వర్ణముఖి నది సమీపంలోని వాహనాల పార్కింగ్ ప్రదేశం.'
      },
      {
        id: 'entry',
        nameEn: 'Eastern Raja Gopuram Main Entrance',
        nameTe: 'తూర్పు రాజగోపురం ప్రధాన ప్రవేశం',
        category: 'entry',
        lat: 13.5965,
        lng: 79.3408,
        svgX: 270,
        svgY: 275,
        descEn: 'Historic stone entrance tower leading into Sage Agastya’s temple courtyard.',
        descTe: 'అగస్త్య మహర్షి స్థాపించిన ప్రాచీన ఆలయ ముఖద్వారం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Stand',
        nameTe: 'పాదరక్షల స్టాండ్',
        category: 'footwear',
        lat: 13.5966,
        lng: 79.3407,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe custody counter near temple entrance.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Nandi Mandapam',
        nameTe: 'ధ్వజస్తంభం & నంది మండపం',
        category: 'info',
        lat: 13.5967,
        lng: 79.3410,
        svgX: 270,
        svgY: 205,
        descEn: 'Sacred stone Nandi facing the Shiva sanctum and golden flag mast.',
        descTe: 'శివుని అభిముఖంగా ఉన్న పవిత్ర నందీశ్వరుడు మరియు ధ్వజస్తంభం.'
      },
      {
        id: 'anandavalli-shrine',
        nameEn: 'Sri Anandavalli Ammavari (Parvathi) Shrine',
        nameTe: 'శ్రీ ఆనందవల్లి అమ్మవారి సన్నిధి',
        category: 'info',
        lat: 13.5969,
        lng: 79.3408,
        svgX: 150,
        svgY: 130,
        descEn: 'South-facing shrine of Divine Mother Parvathi (Sri Anandavalli).',
        descTe: 'పార్వతీ దేవి (ఆనందవల్లి తాయారు) పవిత్ర ఉపాలయం.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Agastheeswara Shiva Lingam Garbhalayam',
        nameTe: 'శ్రీ అగస్త్యేశ్వర స్వామి (శివలింగ గర్భాలయం)',
        category: 'sanctum',
        lat: 13.5970,
        lng: 79.3411,
        svgX: 270,
        svgY: 85,
        descEn: 'Sacred Shiva Lingam consecrated by Sage Agastya, worshipped daily by Lord Venkateswara after his marriage.',
        descTe: 'అగస్త్య మహర్షి ప్రతిష్టించిన శివలింగం - శ్రీవారు నిత్యం పూజించిన పవిత్ర సన్నిధి.'
      },
      {
        id: 'sangamam-ghat',
        nameEn: 'Triveni Sangamam (Three Rivers Confluence Ghats)',
        nameTe: 'త్రివేణి సంగమం (స్వర్ణముఖి, కళ్యాణి, భీమ నదుల సంగమ ఘాట్)',
        category: 'info',
        lat: 13.5969,
        lng: 79.3414,
        svgX: 395,
        svgY: 120,
        descEn: 'Sacred bathing ghat where Swarnamukhi, Kalyani, and Bhima rivers merge.',
        descTe: 'మూడు పవిత్ర నదులు కలిసే పుణ్యస్నాన ఘాట్.'
      },
      {
        id: 'bilva-counter',
        nameEn: 'Bilva Archana & Vibhuti Prasadam Counter',
        nameTe: 'బిల్వార్చన & విభూతి ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.5967,
        lng: 79.3413,
        svgX: 395,
        svgY: 160,
        descEn: 'Collect sacred holy ash (Vibhuti) and consecrated Bilva leaves.',
        descTe: 'పవిత్ర విభూతి మరియు బిల్వ ప్రసాదాలు.'
      }
    ],
    routeSteps: [
      { stepNumber: 1, titleEn: 'Arrival & Riverside Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle along the peaceful Swarnamukhi river road.', descTe: 'నదీతీరంలో వాహనాన్ని పార్క్ చేయండి.' },
      { stepNumber: 2, titleEn: 'Raja Gopuram Entrance & Footwear', titleTe: 'రాజగోపురం & పాదరక్షల కేంద్రం', distance: '50m', timeMins: 2, descEn: 'Leave footwear and enter through the stone gateway.', descTe: 'చెప్పులు విడిచి రాజగోపురం ద్వారా ప్రవేశించండి.' },
      { stepNumber: 3, titleEn: 'Dhwajasthambham & Nandi Namaskaram', titleTe: 'ధ్వజస్తంభం & నందీశ్వర దర్శనం', distance: '80m', timeMins: 5, descEn: 'Seek blessings from Lord Nandi and flag mast.', descTe: 'నందీశ్వరుడిని, ధ్వజస్తంభాన్ని దర్శించండి.' },
      { stepNumber: 4, titleEn: 'Sri Agastheeswara Swamy & Anandavalli Darshan', titleTe: 'అగస్త్యేశ్వర & ఆనందవల్లి దర్శనం', distance: '100m', timeMins: 15, descEn: 'Receive sanctum darshan of Sage Agastya\'s Shiva Lingam and Mother Anandavalli.', descTe: 'పవిత్ర శివలింగం మరియు అమ్మవారి దివ్య దర్శనం.' },
      { stepNumber: 5, titleEn: 'Triveni Sangamam View & Vibhuti Prasadam', titleTe: 'త్రివేణి సంగమం & ప్రసాదం', distance: '120m', timeMins: 10, descEn: 'Visit the 3-river confluence point and collect blessed Vibhuti.', descTe: 'త్రివేణి సంగమ ఘాట్ వీక్షించి విభూతి ప్రసాదం పొందండి.' }
    ],
    emergencyContacts: [
      { titleEn: 'TTD Agastheeswara Temple Information', titleTe: 'అగస్త్యేశ్వర ఆలయ సమాచార విభాగం', number: '08772264555' },
      { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
    ]
  },


  'narayanavanam': {
    placeId: 'narayanavanam',
    titleEn: 'Sri Kalyana Venkateswara Swamy Temple (Divine Wedding Site)',
    titleTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి ఆలయం (నారాయణవనం కల్యాణ వేదిక)',
    layoutType: 'ancient-shrine',
    centerCoordinates: { lat: 13.4184, lng: 79.5828 },
    routePath: [[430, 290], [270, 275], [145, 255], [270, 205], [150, 130], [270, 85], [395, 120], [395, 160], [270, 250]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Narayanavanam Temple Parking',
        nameTe: 'నారాయణవనం పార్కింగ్',
        category: 'parking',
        lat: 13.4178,
        lng: 79.5820,
        svgX: 430,
        svgY: 290,
        descEn: 'Parking area opposite the historic temple gopuram.',
        descTe: 'ఆలయ రాజగోపురం ఎదురుగా ఉన్న పార్కింగ్.'
      },
      {
        id: 'entry',
        nameEn: 'Vijayanagara Raja Gopuram Gateway',
        nameTe: 'విజయనగర రాజగోపురం ప్రవేశం',
        category: 'entry',
        lat: 13.4180,
        lng: 79.5824,
        svgX: 270,
        svgY: 275,
        descEn: 'Towering Vijayanagara style entrance gateway built by King Akasa Raju.',
        descTe: 'ఆకాశరాజు నిర్మించిన చారిత్రక రాజగోపురం.'
      },
      {
        id: 'footwear',
        nameEn: 'Footwear Counter',
        nameTe: 'పాదరక్షల కౌంటర్',
        category: 'footwear',
        lat: 13.4181,
        lng: 79.5822,
        svgX: 145,
        svgY: 255,
        descEn: 'Shoe custody counter.',
        descTe: 'చెప్పులు భద్రపరిచే ప్రదేశం.'
      },
      {
        id: 'dhwajasthambham',
        nameEn: 'Dhwajasthambham & Kalyanotsava Mandapam',
        nameTe: 'ధ్వజస్తంభం & కల్యాణోత్సవ మండపం',
        category: 'info',
        lat: 13.4182,
        lng: 79.5826,
        svgX: 270,
        svgY: 205,
        descEn: 'Grand carved stone mandapam where Lord Venkateswara married Goddess Padmavathi.',
        descTe: 'శ్రీవారి కల్యాణం జరిగిన పవిత్ర కల్యాణ మండపం.'
      },
      {
        id: 'padmavathi-shrine',
        nameEn: 'Sri Padmavathi Devi Mula Sannidhi',
        nameTe: 'శ్రీ పద్మావతి దేవి మూల సన్నిధి',
        category: 'info',
        lat: 13.4185,
        lng: 79.5825,
        svgX: 150,
        svgY: 130,
        descEn: 'Shrine of Goddess Padmavathi at her birthplace/wedding site.',
        descTe: 'అమ్మవారి పవిత్ర సన్నిధి.'
      },
      {
        id: 'sanctum',
        nameEn: 'Sri Kalyana Venkateswara Swamy Garbhalayam',
        nameTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి మూలవిరాట్టు',
        category: 'sanctum',
        lat: 13.4186,
        lng: 79.5828,
        svgX: 270,
        svgY: 85,
        descEn: 'Presiding deity in divine wedding splendour.',
        descTe: 'కల్యాణ వైభవ రూపంలో స్వామివారి గర్భాలయం.'
      },
      {
        id: 'agastheeswara-shrine',
        nameEn: 'Sri Agastheeswara Swamy (Shiva) Sub-Shrine',
        nameTe: 'శ్రీ అగస్త్యేశ్వర స్వామి (శివ) ఆలయం',
        category: 'info',
        lat: 13.4185,
        lng: 79.5831,
        svgX: 395,
        svgY: 120,
        descEn: 'Ancient Shiva temple installed by Sage Agastya within the complex.',
        descTe: 'అగస్త్య మహర్షి ప్రతిష్టించిన శివాలయం.'
      },
      {
        id: 'laddu',
        nameEn: 'TTD Prasadam Counter',
        nameTe: 'ప్రసాదం కౌంటర్',
        category: 'laddu',
        lat: 13.4183,
        lng: 79.5830,
        svgX: 395,
        svgY: 160,
        descEn: 'TTD laddu and temple holy prasadam.',
        descTe: 'స్వామివారి ప్రసాదాల కౌంటర్.'
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

  'srivari-udyanavanam': {
    placeId: 'srivari-udyanavanam',
    titleEn: 'Srivari Udyanavanam (TTD Sacred Gardens)',
    titleTe: 'శ్రీవారి ఉద్యానవనం (టీటీడీ దివ్య తోటలు)',
    layoutType: 'botanical-garden',
    centerCoordinates: { lat: 13.6905, lng: 79.3425 },
    routePath: [[430, 290], [270, 275], [160, 200], [270, 110], [380, 140]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Udyanavanam Visitor Parking Bay',
        nameTe: 'ఉద్యానవనం పార్కింగ్ స్థలం',
        category: 'parking',
        lat: 13.6898,
        lng: 79.3430,
        svgX: 430,
        svgY: 290,
        descEn: 'Shaded vehicle parking area surrounded by flowering trees.',
        descTe: 'వాహనాల పార్కింగ్ ప్రదేశం.'
      },
      {
        id: 'entry',
        nameEn: 'Divya Udyanavanam Floral Welcome Gateway',
        nameTe: 'దివ్య ఉద్యానవనం పుష్ప ముఖద్వారం',
        category: 'entry',
        lat: 13.6901,
        lng: 79.3427,
        svgX: 270,
        svgY: 275,
        descEn: 'Main entrance archway leading into the sacred 460-acre horticulture gardens.',
        descTe: 'పవిత్ర ఉద్యానవన ప్రధాన ప్రవేశ ద్వారం.'
      },
      {
        id: 'topiary-walk',
        nameEn: 'Shankha-Chakra Topiary & Promenade',
        nameTe: 'శంఖ-చక్ర ఆకారాల సుందర మార్గం',
        category: 'info',
        lat: 13.6903,
        lng: 79.3420,
        svgX: 160,
        svgY: 200,
        descEn: 'Ornamental topiary plants shaped as Garuda, Shankha, Chakra, and lotus ponds with fountains.',
        descTe: 'శంఖ చక్రాలు, గరుడ ఆకారాలలో తీర్చిదిద్దిన పచ్చని మొక్కలు.'
      },
      {
        id: 'flower-beds',
        nameEn: 'Sacred Srivari Seva Flower Beds & Tulsi Nursery',
        nameTe: 'శ్రీవారి కైంకర్యాల పూలతోట & తులసి వనం',
        category: 'sanctum',
        lat: 13.6906,
        lng: 79.3425,
        svgX: 270,
        svgY: 110,
        descEn: 'Sacred polyhouses cultivating exclusive roses, jasmines, marigolds, and Krishna Tulasi strictly reserved for Lord Venkateswara’s daily sevas.',
        descTe: 'శ్రీవారి నిత్య పూజలకు, అలంకరణకు ఉపయోగించే ప్రత్యేక పుష్పాల తోట.'
      },
      {
        id: 'garland-pavilion',
        nameEn: 'Thomala Garland Crafting Pavilion (Mala Mandapam)',
        nameTe: 'తోమాల సేవా పూలమాలల తయారీ మండపం',
        category: 'info',
        lat: 13.6908,
        lng: 79.3428,
        svgX: 380,
        svgY: 140,
        descEn: 'Specialized pavilion where master artisans weave massive floral garlands for daily temple Alankarams.',
        descTe: 'శ్రీవారికి సమర్పించే దివ్య తోమాల పూలమాలలను తయారుచేసే కేంద్రం.'
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

  'annaprasadam-complex': {
    placeId: 'annaprasadam-complex',
    titleEn: 'Matrusri Tarigonda Vengamamba Annaprasadam Complex',
    titleTe: 'మాతృశ్రీ తరిగొండ వెంగమాంబ అన్నప్రసాదం భవనం',
    layoutType: 'annaprasadam-complex',
    centerCoordinates: { lat: 13.6841, lng: 79.3498 },
    routePath: [[430, 290], [270, 275], [160, 210], [270, 110], [390, 100], [380, 210]],
    pins: [
      {
        id: 'parking',
        nameEn: 'CRO & Rambag Vehicle Parking',
        nameTe: 'రాంబాగ్‌ / సి.ఆర్.ఓ పార్కింగ్',
        category: 'parking',
        lat: 13.6832,
        lng: 79.3490,
        svgX: 430,
        svgY: 290,
        descEn: 'Central Tirumala parking area near Ring Road and CRO office.',
        descTe: 'రింగ్ రోడ్డు సమీపంలోని వాహనాల పార్కింగ్ స్థలం.'
      },
      {
        id: 'entry',
        nameEn: 'Annaprasadam Complex Main Entrance',
        nameTe: 'అన్నప్రసాదం ప్రధాన ముఖద్వారం',
        category: 'entry',
        lat: 13.6836,
        lng: 79.3495,
        svgX: 270,
        svgY: 275,
        descEn: 'Spacious welcoming entrance foyer and pilgrim queue entrance.',
        descTe: 'భక్తుల ప్రవేశ ముఖద్వారం.'
      },
      {
        id: 'holding-lounge',
        nameEn: 'Devotee Waiting Lounge & Handwash Station',
        nameTe: 'వేచి ఉండే హాల్ & చేతులు కడుగుకునే స్థలం',
        category: 'queue',
        lat: 13.6838,
        lng: 79.3492,
        svgX: 160,
        svgY: 210,
        descEn: 'Air-cooled waiting lounge with display screens and clean stainless steel washbasins.',
        descTe: 'భక్తులు కూర్చునే హాలు మరియు వాష్‌బేసిన్ల సదుపాయం.'
      },
      {
        id: 'dining-halls',
        nameEn: 'Grand Dining Halls (Halls 1–4, 4,000 Capacity)',
        nameTe: 'ప్రధాన భోజన శాలలు (హాల్స్ 1-4, 4,000 సీటింగ్)',
        category: 'food',
        lat: 13.6841,
        lng: 79.3498,
        svgX: 270,
        svgY: 110,
        descEn: 'Four massive hygienic dining halls serving continuous, unlimited hot Mahaprasadam (Rice, Dal, Sambar, Rasam, Chutney & Sweet).',
        descTe: 'స్వామివారి నిత్యాన్నదాన భోజన శాల - ఉచితంగా అపరిమిత భోజనం వడ్డిస్తారు.'
      },
      {
        id: 'mega-kitchen',
        nameEn: 'Automated Steam Mega Kitchen & Potu',
        nameTe: 'అత్యాధునిక ఆటోమేటిక్ స్టీమ్ కిచెన్',
        category: 'info',
        lat: 13.6844,
        lng: 79.3502,
        svgX: 390,
        svgY: 100,
        descEn: 'World-class automated steam boiler kitchen capable of cooking for 200,000 pilgrims per day.',
        descTe: 'రోజుకు 2 లక్షల మందికి పైగా వంట చేసే భారీ అత్యాధునిక వంటశాల.'
      },
      {
        id: 'donor-office',
        nameEn: 'Tarigonda Vengamamba Statue & Srivari Donor Desk',
        nameTe: 'తరిగొండ వెంగమాంబ విగ్రహం & దాతల విభాగం',
        category: 'info',
        lat: 13.6839,
        lng: 79.3505,
        svgX: 380,
        svgY: 210,
        descEn: 'Life-size bronze statue of Saint Vengamamba and Srivari Nitya Annadanam trust donation counter.',
        descTe: 'శ్రీవారి నిత్యాన్నదాన ట్రస్ట్ విరాళాల కౌంటర్.'
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
    centerCoordinates: { lat: 13.6037445, lng: 79.5785729 },
    routePath: [[430, 290], [270, 275], [175, 255], [145, 160], [270, 105]],
    pins: [
      {
        id: 'parking',
        nameEn: 'Approach Parking Area',
        nameTe: 'ఆలయ పార్కింగ్ స్థలం',
        category: 'parking',
        lat: 13.6028,
        lng: 79.5790,
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
        lat: 13.6034,
        lng: 79.5787,
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
        lat: 13.6032,
        lng: 79.5784,
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
        lat: 13.6039,
        lng: 79.5782,
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
        lat: 13.6037445,
        lng: 79.5785729,
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

  // 1. Matrusri Tarigonda Vengamamba Annaprasadam Complex
  if (
    placeId.includes('annaprasadam') || 
    placeId.includes('vengamamba') || 
    nameLower.includes('annaprasadam') || 
    nameLower.includes('annadanam') || 
    nameLower.includes('vengamamba') ||
    nameLower.includes('free meals') ||
    placeId === 'annaprasadam-complex'
  ) {
    const curated = CURATED_LAYOUTS['annaprasadam-complex']!;
    return {
      placeId,
      titleEn: `${name} Precinct Map`,
      titleTe: `${name} ప్రాంగణ మ్యాప్`,
      layoutType: 'annaprasadam-complex',
      centerCoordinates: fallbackCoords || { lat: 13.6841, lng: 79.3498 },
      defaultZoom: 17,
      compassBearingDeg: 0,
      sanctumNameEn: 'Grand Annaprasadam Dining Halls',
      sanctumNameTe: 'ప్రధాన నిత్యాన్నదాన భోజన శాలలు',
      routePath: curated.routePath || [[430, 290], [270, 275], [160, 210], [270, 110], [390, 100], [380, 210]],
      pins: curated.pins as MapPin[],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Ring Road Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at central Tirumala parking near Ring Road.', descTe: 'వాహనాన్ని పార్క్ చేసి అన్నప్రసాదం భవనం వైపు వెళ్ళండి.' },
        { stepNumber: 2, titleEn: 'Main Entrance & Holding Lounge', titleTe: 'ప్రవేశం & వేచి ఉండే హాల్', distance: '40m', timeMins: 2, descEn: 'Enter through the main foyer and proceed into the air-cooled holding hall.', descTe: 'ప్రధాన ద్వారం గుండా వేచి ఉండే హాలులోకి ప్రవేశించండి.' },
        { stepNumber: 3, titleEn: 'Handwash & Grand Dining Hall Seating', titleTe: 'చేతులు కడగడం & భోజన శాల ప్రవేశం', distance: '80m', timeMins: 20, descEn: 'Wash hands at the stainless steel counters and take seat in Halls 1 to 4 for unlimited hot Mahaprasadam.', descTe: 'చేతులు శుభ్రం చేసుకుని భోజన శాలలో కూర్చోండి.' },
        { stepNumber: 4, titleEn: 'Steam Kitchen View & Vengamamba Statue Exit', titleTe: 'స్టీమ్ కిచెన్ & నిష్క్రమణ', distance: '60m', timeMins: 5, descEn: 'View the massive automated cooking plant and exit past Saint Vengamamba statue.', descTe: 'మెగా వంటశాల వీక్షించి వెంగమాంబ విగ్రహం వద్ద నుండి నిష్క్రమించండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'TTD Annaprasadam Office & Helpline', titleTe: 'అన్నప్రసాదం సమాచార విభాగం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // 2. Srivari Udyanavanam / Sacred Horticulture Flower Gardens
  if (
    placeId.includes('udyanavanam') || 
    nameLower.includes('udyanavanam') || 
    nameLower.includes('flower garden') || 
    placeId === 'srivari-udyanavanam'
  ) {
    const curated = CURATED_LAYOUTS['srivari-udyanavanam']!;
    return {
      placeId,
      titleEn: `${name} Precinct Map`,
      titleTe: `${name} ప్రాంగణ మ్యాప్`,
      layoutType: 'botanical-garden',
      centerCoordinates: fallbackCoords || { lat: 13.6905, lng: 79.3425 },
      defaultZoom: 17,
      compassBearingDeg: 0,
      sanctumNameEn: 'Sacred Seva Flower Nursery',
      sanctumNameTe: 'శ్రీవారి పూలతోట & తులసి వనం',
      routePath: curated.routePath || [[430, 290], [270, 275], [160, 200], [270, 110], [380, 140]],
      pins: curated.pins as MapPin[],
      routeSteps: [
        { stepNumber: 1, titleEn: 'Arrival & Shaded Garden Parking', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle at the shaded Udyanavanam visitor lot.', descTe: 'వాహనాన్ని పార్క్ చేసి ఉద్యానవన ప్రవేశ ద్వారం వైపు వెళ్ళండి.' },
        { stepNumber: 2, titleEn: 'Floral Welcome Gate & Topiary Walk', titleTe: 'పుష్ప ద్వారం & తోటలో నడక', distance: '40m', timeMins: 2, descEn: 'Enter through the flower arch and stroll past Shankha-Chakra topiary plants.', descTe: 'శంఖ చక్ర ఆకారాల పచ్చని మొక్కల నడుమ నడవండి.' },
        { stepNumber: 3, titleEn: 'Sacred Flower Beds & Tulsi Polyhouses', titleTe: 'శ్రీవారి పూలతోటల దర్శనం', distance: '80m', timeMins: 15, descEn: 'Marvel at hundreds of varieties of roses, jasmines, and holy Tulasi reserved for Lord Venkateswara.', descTe: 'శ్రీవారి కైంకర్యాలకు ఉపయోగించే పవిత్ర పుష్పాల తోటలను తిలకించండి.' },
        { stepNumber: 4, titleEn: 'Thomala Garland Making Pavilion', titleTe: 'తోమాల పూలమాలల తయారీ కేంద్రం', distance: '70m', timeMins: 10, descEn: 'Watch traditional garland making for daily temple Alankarams.', descTe: 'స్వామివారికి సమర్పించే దివ్య పూలమాలల తయారీని వీక్షించండి.' }
      ],
      emergencyContacts: [
        { titleEn: 'TTD Horticulture & Garden Office', titleTe: 'టీటీడీ ఉద్యానవన సమాచార కేంద్రం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // 3. Swami Pushkarini / Sacred Theertham Tanks
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
  const curatedKey = Object.keys(CURATED_LAYOUTS).find(k => {
    if (k === 'venkateswara') {
      return placeId === 'venkateswara' || placeId === 'tirumala' || placeId === 'tirumala-temple' || placeId === 'tirumala-srivari-temple';
    }
    return k === placeId || placeId === k || (k.includes('-') && (placeId.includes(k) || k.includes(placeId)));
  });
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
      routeSteps: curated.routeSteps || [
        { stepNumber: 1, titleEn: 'Arrival & Parking Bay', titleTe: 'పార్కింగ్ చేరుకోవడం', distance: '0.0 km', timeMins: 0, descEn: 'Park vehicle and proceed to the main entrance.', descTe: 'వాహనాన్ని పార్క్ చేయండి.' },
        { stepNumber: 2, titleEn: 'Entrance & Exploration', titleTe: 'ప్రవేశం & సందర్శన', distance: '50m', timeMins: 2, descEn: 'Walk through the main walkway.', descTe: 'ప్రధాన మార్గం గుండా వెళ్ళండి.' },
        { stepNumber: 3, titleEn: 'Main Landmark & Blessings', titleTe: 'ప్రధాన కేంద్రం & దర్శనం', distance: '120m', timeMins: 10, descEn: 'Visit key highlights and view points.', descTe: 'కీలక ప్రదేశాలను సందర్శించండి.' }
      ],
      emergencyContacts: curated.emergencyContacts || [
        { titleEn: 'Tourism / Information Desk', titleTe: 'సమాచార విభాగం', number: '08772264555' },
        { titleEn: 'Emergency Helpline', titleTe: 'అత్యవసర హెల్ప్‌లైన్', number: '112' }
      ]
    };
  }

  // ── ACCURATE MULTI-CATEGORY ARCHETYPE CLASSIFICATION ──
  let layoutType: TempleLayoutData['layoutType'] = 'city-shrine';

  // 1. Dams, Reservoirs, Large Water Projects
  if (
    placeId.includes('dam') || 
    placeId.includes('reservoir') || 
    nameLower.includes('dam') || 
    nameLower.includes('reservoir') || 
    tags.includes('dam') || 
    tags.includes('reservoir')
  ) {
    layoutType = 'dam-reservoir';
  }
  // 2. Geological Natural Rock Arches & Monoliths (e.g. Silathoranam)
  else if (
    tags.includes('geology') || 
    tags.includes('rock') || 
    nameLower.includes('silathoranam') || 
    nameLower.includes('rock formation') ||
    nameLower.includes('rock arch')
  ) {
    layoutType = 'geo-nature-park';
  }
  // 3. Botanical Gardens & Flower Parks
  else if (
    tags.includes('garden') || 
    tags.includes('horticulture') || 
    nameLower.includes('udyanavanam') || 
    nameLower.includes('flower garden')
  ) {
    layoutType = 'botanical-garden';
  }
  // 4. Shopping, Bazaars, Markets
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
  // 5. Food & Dining
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
  // 6. Museums & Science Centers
  else if (
    category.includes('museum') || 
    tags.includes('science') || 
    nameLower.includes('museum') || 
    nameLower.includes('science centre') || 
    nameLower.includes('planetarium')
  ) {
    layoutType = 'museum-gallery';
  }
  // 7. Cultural & Theme Parks
  else if (
    nameLower.includes('silparamam') || 
    (category.includes('park') && tags.includes('culture'))
  ) {
    layoutType = 'cultural-park';
  }
  // 8. Wildlife & Safari
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
  // 9. Sacred Footpaths & Treks
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
  // 10. Waterfalls, Gorges, Streams
  else if (
    (category.includes('waterfall') || tags.includes('waterfall') || nameLower.includes('waterfall') || nameLower.includes('falls') || nameLower.includes('kona')) &&
    !nameLower.includes('temple') && !category.includes('temple')
  ) {
    layoutType = 'hill-waterfall';
  }
  // 11. Heritage Forts & Palaces
  else if (
    category.includes('fort') || 
    tags.includes('fort') || 
    nameLower.includes('fort') || 
    nameLower.includes('mahal') || 
    nameLower.includes('palace')
  ) {
    layoutType = 'heritage-fort';
  }
  // 12. Spiritual Temples & Shrines
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
    layoutType = category.includes('nature') ? 'hill-waterfall' : 'city-shrine';
  }

  const baseLat = placeObj?.coordinates?.lat || fallbackCoords?.lat || 13.6296;
  const baseLng = placeObj?.coordinates?.lng || fallbackCoords?.lng || 79.4130;

  let generatedPins: MapPin[] = [];
  let generatedRoute: [number, number][] = [];

  if (layoutType === 'dam-reservoir') {
    // 🌊 DAMS, RESERVOIRS & WATER BODIES (Mallimadugu Dam, Kalyani Dam)
    generatedRoute = [[430, 280], [330, 270], [170, 240], [270, 140], [390, 100]];
    generatedPins = [
      { id: 'parking', nameEn: 'Reservoir Viewpoint Parking', nameTe: 'డ్యామ్ పార్కింగ్ స్థలం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 430, svgY: 280, descEn: 'Vehicle parking bay near reservoir viewpoint deck.', descTe: 'డ్యామ్ వ్యూపాయింట్ వద్ద వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Dam Bund Approach Walkway', nameTe: 'డ్యామ్ కట్ట నడక మార్గం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 330, svgY: 270, descEn: 'Paved walkway along the reservoir embankment crest.', descTe: 'డ్యామ్ కట్టపై నడక మార్గం.' },
      { id: 'spillway', nameEn: 'Siphon Spillway & Barrage Gates', nameTe: 'స్పిల్‌వే & నీటి గేట్లు', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 170, svgY: 240, descEn: 'Multi-gate spillway and water discharge channels.', descTe: 'నీటి విడుదల గేట్లు మరియు స్పిల్‌వే నిర్మాణం.' },
      { id: 'sanctum', nameEn: `${name} Water Expanse`, nameTe: `${name} జలాశయం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 140, descEn: 'Scenic reservoir backwaters nestled against Seshachalam hills.', descTe: 'శేషాచలం కొండల నడుమ విస్తరించిన సుందర జలాశయం.' },
      { id: 'viewpoint', nameEn: 'Hill View & Photography Deck', nameTe: 'సూర్యాస్తమయ వ్యూ పాయింట్', category: 'info', lat: baseLat + 0.0004, lng: baseLng + 0.0006, svgX: 390, svgY: 100, descEn: 'Elevated scenic platform for photography and landscape views.', descTe: 'ప్రకృతి అందాలు మరియు కొండల దృశ్యాలను వీక్షించే వేదిక.' }
    ];
  } else if (layoutType === 'geo-nature-park') {
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
    // 🛕 AUTHENTIC CITY / VILLAGE SHRINE - Clean Clockwise Pradakshina
    generatedRoute = [[415, 268], [270, 270], [140, 250], [270, 195], [270, 85], [395, 160], [270, 270]];
    generatedPins = [
      { 
        id: 'parking', 
        nameEn: 'Approach Road & Parking Bay', 
        nameTe: 'పార్కింగ్ ప్రదేశం', 
        category: 'parking', 
        lat: baseLat - 0.0008, 
        lng: baseLng + 0.0006, 
        svgX: 415, 
        svgY: 268, 
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
        svgY: 270, 
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
        svgX: 140, 
        svgY: 250, 
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
        svgY: 195, 
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
    generatedRoute = [[415, 268], [270, 270], [140, 250], [140, 140], [270, 85]];
    generatedPins = [
      { id: 'parking', nameEn: 'Approach Parking Area', nameTe: 'పార్కింగ్ స్థలం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Open parking space for vehicles.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Mukha Mandapam / Gateway', nameTe: 'ముఖ మండపం ద్వారం', category: 'entry', lat: baseLat - 0.0004, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Historical stone entrance gateway under ASI protection.', descTe: 'ఆలయ ప్రవేశ ద్వారం.' },
      { id: 'footwear', nameEn: 'Courtyard Footwear Stand', nameTe: 'పాదరక్షల స్టాండ్', category: 'footwear', lat: baseLat - 0.0006, lng: baseLng - 0.0004, svgX: 140, svgY: 250, descEn: 'Shoe custody counter outside courtyard.', descTe: 'చెప్పులు విడిచే ప్రదేశం.' },
      { id: 'info', nameEn: 'Historical Heritage Inscriptions', nameTe: 'పురావస్తు శాసనాలు', category: 'info', lat: baseLat, lng: baseLng - 0.0006, svgX: 140, svgY: 140, descEn: 'Ancient stone inscriptions and carvings detailing heritage.', descTe: 'రాతి శాసనాలు మరియు చారిత్రక వివరాలు.' },
      { id: 'sanctum', nameEn: `${name} Sanctum`, nameTe: `${name} గర్భాలయం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 85, descEn: 'Sacred inner sanctum sanctorum and deity idol.', descTe: 'ప్రధాన గర్భాలయం మరియు మూలవిరాట్టు.' }
    ];
  } else if (layoutType === 'trek-trail') {
    generatedRoute = [[415, 268], [270, 270], [145, 245], [270, 145], [270, 65]];
    generatedPins = [
      { id: 'parking', nameEn: 'Trailhead Parking Plaza', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Vehicle parking and taxi drop zone.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: `${name} Entrance Gateway`, nameTe: `${name} ప్రారంభ ముఖద్వారం`, category: 'entry', lat: baseLat - 0.0006, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Iconic gateway and starting point of the pedestrian trail.', descTe: 'నడక మార్గ ప్రారంభ ద్వారం.' },
      { id: 'footwear', nameEn: 'Luggage & Footwear Transfer Depot', nameTe: 'లగేజ్ & పాదరక్షల కేంద్రం', category: 'footwear', lat: baseLat - 0.0004, lng: baseLng - 0.0005, svgX: 145, svgY: 245, descEn: 'Free luggage delivery to the hilltop.', descTe: 'ఉచిత లగేజ్ రవాణా కౌంటర్.' },
      { id: 'midpoint', nameEn: 'Sacred Rest Mandapam / Waypoint', nameTe: 'విశ్రాంతి మండపం & తాగునీరు', category: 'info', lat: baseLat + 0.0004, lng: baseLng, svgX: 270, svgY: 145, descEn: 'Sheltered resting mandapam and free RO drinking water.', descTe: 'తాగునీరు మరియు విశ్రాంతి ప్రదేశం.' },
      { id: 'sanctum', nameEn: `${name} Summit Terminal`, nameTe: `${name} కొండపై ముగింపు కేంద్రం`, category: 'sanctum', lat: baseLat + 0.0010, lng: baseLng, svgX: 270, svgY: 65, descEn: 'Tirumala summit arrival and continuation to the temple.', descTe: 'కొండపై నడక మార్గం ముగింపు ప్రదేశం.' }
    ];
  } else if (layoutType === 'shopping-market') {
    generatedRoute = [[415, 268], [270, 270], [170, 200], [270, 120], [380, 160]];
    generatedPins = [
      { id: 'parking', nameEn: 'Street & Bay Parking', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Vehicle and two-wheeler parking along market road.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Market Avenue Entrance', nameTe: 'మార్కెట్ ప్రవేశం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Main entrance archway leading into the shopping lane.', descTe: 'షాపింగ్ వీధి ప్రధాన ముఖద్వారం.' },
      { id: 'textiles', nameEn: 'Textiles & Handlooms Row', nameTe: 'వస్త్ర దుకాణాలు', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 170, svgY: 200, descEn: 'Traditional sarees, fabrics, and clothing stores.', descTe: 'సంప్రదాయ చేనేత మరియు వస్త్ర దుకాణాలు.' },
      { id: 'plaza', nameEn: `${name} Main Bazaar`, nameTe: `${name} ప్రధాన మార్కెట్`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 120, descEn: 'Primary shopping arcades, souvenirs, and handicraft emporiums.', descTe: 'హస్తకళలు, పూజా వస్తువులు మరియు స్మారక చిహ్నాల కేంద్రం.' },
      { id: 'food', nameEn: 'Local Eateries & Refreshments', nameTe: 'స్ట్రీట్ ఫుడ్ & స్నాక్స్', category: 'food', lat: baseLat + 0.0003, lng: baseLng + 0.0006, svgX: 380, svgY: 160, descEn: 'Famous local street food, sweets, and beverages.', descTe: 'రుచికరమైన స్నాక్స్ మరియు పానీయాలు.' }
    ];
  } else if (layoutType === 'dining-restaurant') {
    generatedRoute = [[415, 268], [270, 270], [270, 130], [380, 160]];
    generatedPins = [
      { id: 'parking', nameEn: 'Valet & Customer Parking', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0008, lng: baseLng + 0.0006, svgX: 415, svgY: 268, descEn: 'Dedicated customer car & bike parking.', descTe: 'వినియోగదారుల పార్కింగ్.' },
      { id: 'entry', nameEn: 'Main Entrance & Lobby', nameTe: 'ప్రవేశ ద్వారం', category: 'entry', lat: baseLat - 0.0003, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Welcoming entrance lobby and host desk.', descTe: 'హోటల్ ప్రవేశ ద్వారం.' },
      { id: 'dining', nameEn: `${name} Dining Hall`, nameTe: `${name} డైనింగ్ హాల్`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 130, descEn: 'Spacious AC dining hall and family seating.', descTe: 'కుటుంబ భోజన శాల.' },
      { id: 'counters', nameEn: 'Culinary & Beverage Counter', nameTe: 'రుచికరమైన వంటకాల విభాగం', category: 'food', lat: baseLat + 0.0002, lng: baseLng + 0.0005, svgX: 380, svgY: 160, descEn: 'Live kitchen, desserts, and beverage service.', descTe: 'లైవ్ కిచెన్ మరియు పానీయాలు.' }
    ];
  } else if (layoutType === 'museum-gallery') {
    generatedRoute = [[415, 268], [270, 270], [170, 230], [270, 120], [380, 140]];
    generatedPins = [
      { id: 'parking', nameEn: 'Visitor Parking Plaza', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Parking for cars and tourist buses.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Ticket Desk & Entry Gate', nameTe: 'టికెట్ కౌంటర్ & ప్రవేశం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Ticket checks, cloakroom, and audio guides.', descTe: 'ప్రవేశ ద్వారం మరియు టికెట్ కౌంటర్.' },
      { id: 'orientation', nameEn: 'Orientation & Cloakroom', nameTe: 'క్లోక్‌రూమ్ & గైడ్ విభాగం', category: 'info', lat: baseLat - 0.0002, lng: baseLng - 0.0006, svgX: 170, svgY: 230, descEn: 'Locker custody and introductory information.', descTe: 'లగేజ్ భద్రత మరియు సమాచార విభాగం.' },
      { id: 'gallery', nameEn: `${name} Main Exhibit Gallery`, nameTe: `${name} ప్రధాన ప్రదర్శన శాల`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 120, descEn: 'Core exhibits, historical artifacts, and interactive displays.', descTe: 'చారిత్రక కళాఖండాలు మరియు ప్రదర్శనలు.' },
      { id: 'pavilion', nameEn: 'Interactive Science / Art Pavilion', nameTe: 'ప్రత్యేక పెవిలియన్', category: 'info', lat: baseLat + 0.0004, lng: baseLng + 0.0006, svgX: 380, svgY: 140, descEn: 'Interactive displays, 3D show, and planetarium.', descTe: 'ఇంటరాక్టివ్ ప్రదర్శన శాల.' }
    ];
  } else if (layoutType === 'hill-waterfall') {
    generatedRoute = [[415, 268], [270, 270], [180, 230], [270, 160], [270, 70]];
    generatedPins = [
      { id: 'parking', nameEn: 'Trailhead & Parking Bay', nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Vehicles drop and starting point of the nature trail.', descTe: 'వాహనాల పార్కింగ్ మరియు ట్రయల్ ప్రారంభం.' },
      { id: 'entry', nameEn: 'Entrance Checkpoint & Gateway', nameTe: 'ప్రవేశ ముఖద్వారం', category: 'entry', lat: baseLat - 0.0007, lng: baseLng + 0.0002, svgX: 270, svgY: 270, descEn: 'Entry checkpoint and ticket counter.', descTe: 'ప్రవేశ ద్వారం మరియు టికెట్ కేంద్రం.' },
      { id: 'footwear', nameEn: 'Footwear & Rest Stand', nameTe: 'పాదరక్షల స్టాండ్', category: 'footwear', lat: baseLat - 0.0005, lng: baseLng - 0.0004, svgX: 180, svgY: 230, descEn: 'Rest area and designated footwear stand before the holy pool.', descTe: 'చెప్పులు భద్రపరిచే స్థలం.' },
      { id: 'sanctum', nameEn: `${name} Main Sanctum / Landmark`, nameTe: `${name} ప్రధాన క్షేత్రం`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 160, descEn: 'Primary sacred sanctum and viewing area.', descTe: 'ప్రధాన దర్శన ప్రదేశం.' },
      { id: 'info', nameEn: 'Sacred Waterfall & Kund', nameTe: 'పవిత్ర జలపాతం & కుండం', category: 'info', lat: baseLat + 0.0006, lng: baseLng, svgX: 270, svgY: 70, descEn: 'Sacred mountain waterfall cascading into crystal theertham pool.', descTe: 'పవిత్ర తీర్థం మరియు జలపాతం.' }
    ];
  } else if (layoutType === 'wildlife-safari') {
    generatedRoute = [[415, 268], [270, 270], [210, 240], [140, 180], [270, 130], [395, 100]];
    generatedPins = [
      { id: 'parking', nameEn: 'Visitor Parking Bay', nameTe: 'సందర్శకుల పార్కింగ్', category: 'parking', lat: baseLat - 0.0010, lng: baseLng + 0.0008, svgX: 415, svgY: 268, descEn: 'Shaded 4-wheeler and 2-wheeler parking.', descTe: 'కార్లు మరియు బైకుల పార్కింగ్ ప్రదేశం.' },
      { id: 'entry', nameEn: 'Main Entrance & Tickets', nameTe: 'ప్రధాన ప్రవేశ ద్వారం', category: 'entry', lat: baseLat - 0.0005, lng: baseLng, svgX: 270, svgY: 270, descEn: 'Entry gates, cart bookings, and cloakroom.', descTe: 'ప్రవేశ ద్వారం మరియు బ్యాటరీ కార్ల బుకింగ్.' },
      { id: 'safari-carts', nameEn: 'Battery Vehicle Station', nameTe: 'బ్యాటరీ వాహనాల స్టేషన్', category: 'safari', lat: baseLat - 0.0003, lng: baseLng - 0.0005, svgX: 210, svgY: 240, descEn: 'Eco-friendly battery cart boarding and departure.', descTe: 'బ్యాటరీ వాహనాలు ఎక్కే కేంద్రం.' },
      { id: 'herbivore', nameEn: 'Herbivore & Deer Valley', nameTe: 'శాకాహార జంతువుల ఆవరణ', category: 'safari', lat: baseLat, lng: baseLng - 0.0008, svgX: 140, svgY: 180, descEn: 'Natural woodland reserve for spotted deer and blackbucks.', descTe: 'జింకలు, దుప్పుల సహజ ఆవరణ.' },
      { id: 'aviary', nameEn: 'Walk-Through Aviary Dome', nameTe: 'పక్షుల శాల (ఏవియరీ)', category: 'info', lat: baseLat + 0.0004, lng: baseLng, svgX: 270, svgY: 130, descEn: 'Exotic bird sanctuary and photography deck.', descTe: 'రంగురంగుల పక్షుల కేంద్రం.' },
      { id: 'predator', nameEn: 'Predator & Safari Reserve', nameTe: 'క్రూర జంతువుల సఫారీ', category: 'safari', lat: baseLat + 0.0008, lng: baseLng + 0.0006, svgX: 395, svgY: 100, descEn: 'Open caged safari rides through predator zones.', descTe: 'రక్షిత వాహనాలలో అడవి సఫారీ.' }
    ];
  } else {
    // 10. GRAND TEMPLE
    generatedRoute = [[412, 265], [270, 245], [138, 222], [270, 185], [270, 85], [400, 105], [370, 185], [270, 245]];
    generatedPins = [
      { id: 'parking', nameEn: `${name} Parking Bay`, nameTe: 'పార్కింగ్ ప్రదేశం', category: 'parking', lat: baseLat - 0.0012, lng: baseLng + 0.0008, svgX: 412, svgY: 265, descEn: 'Dedicated vehicle parking and taxi drop zone.', descTe: 'వాహనాల పార్కింగ్ స్థలం.' },
      { id: 'entry', nameEn: 'Raja Gopuram Entrance', nameTe: 'రాజగోపురం ముఖద్వారం', category: 'entry', lat: baseLat - 0.0007, lng: baseLng, svgX: 270, svgY: 245, descEn: 'Main gateway tower facing east.', descTe: 'ఆలయ ప్రధాన ప్రవేశ గోపురం.' },
      { id: 'footwear', nameEn: 'Free Footwear Counter', nameTe: 'ఉచిత పాదరక్షల కౌంటర్', category: 'footwear', lat: baseLat - 0.0006, lng: baseLng - 0.0005, svgX: 138, svgY: 222, descEn: 'Free shoe keeping counter with token safety.', descTe: 'ఉచిత చెప్పుల కౌంటర్.' },
      { id: 'sanctum', nameEn: `${name} Sanctum`, nameTe: `${name} గర్భగుడి`, category: 'sanctum', lat: baseLat, lng: baseLng, svgX: 270, svgY: 85, descEn: 'Sacred inner sanctum sanctorum and presiding deity.', descTe: 'ప్రధాన గర్భాలయం మరియు స్వామి/అమ్మవారి దర్శనం.' },
      { id: 'pushkarini', nameEn: 'Sacred Pushkarini Tank', nameTe: 'పుష్కరిణి తీర్థం', category: 'info', lat: baseLat, lng: baseLng + 0.0008, svgX: 400, svgY: 105, descEn: 'Holy temple water tank for holy water sprinkling.', descTe: 'పవిత్ర ఆలయ పుష్కరిణి.' },
      { id: 'laddu', nameEn: 'Prasadam & Laddu Counter', nameTe: 'ప్రసాదం కౌంటర్', category: 'laddu', lat: baseLat - 0.0004, lng: baseLng + 0.0005, svgX: 370, svgY: 185, descEn: 'Sacred laddu, pulihora, and blessed prasadam counter.', descTe: 'స్వామివారి ప్రసాదం కౌంటర్.' }
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
