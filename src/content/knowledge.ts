export interface KnowledgeItem {
  id: string;
  name: string;
  category: 'Free Facilities' | 'Temple Rules' | 'Emergency' | 'Accessibility' | 'Transport';
  importance: 'must-know' | 'highly-recommended' | 'good-to-know';
  tag: string;
  status: string;
  shortDescription: string;
  description: string;
  whyItMatters: string;
  distance: string;
  walkingTime: string;
  image: string;
  location: string;
  coordinates: { lat: number; lng: number };
  tips: string[];
  iconName: string;
  searchAliases: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  searchAliases: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: 'before' | 'during' | 'after';
  localStorageKey: string;
}

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'free-lockers',
    name: 'Free Luggage Lockers',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: 'FREE',
    status: 'Verified',
    shortDescription: 'Store your luggage safely before darshan.',
    description: 'TTD provides free, secure luggage locker facilities at multiple key points in Tirumala. Devotees are issued a physical key and a receipt card. Keep the receipt safe to retrieve your belongings after darshan.',
    whyItMatters: 'Walking uphill and standing in long queue complexes is extremely exhausting when carrying heavy luggage. Depositing bags beforehand ensures a light, fatigue-free darshan.',
    distance: '120 m',
    walkingTime: '2 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: 'Tirumala RTC Bus Stand & GNC Toll Area',
    coordinates: { lat: 13.6823, lng: 79.3514 },
    tips: [
      'All bags are scanned via X-ray before locker allotment.',
      'Do not store cash, jewelry, or electronics in luggage lockers.',
      'Receipt cards are mandatory for luggage retrieval. A fine applies for lost cards.'
    ],
    iconName: 'briefcase',
    searchAliases: ['locker', 'lockers', 'luggage', 'bags', 'baggage', 'store']
  },
  {
    id: 'mobile-deposit',
    name: 'Mobile Deposit Counters',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: 'FREE',
    status: 'Official',
    shortDescription: 'Deposit phones before entering the temple.',
    description: 'Mobile phones, smartwatches, and all other electronic gadgets are strictly banned inside the main temple premises. TTD runs massive, computerized free mobile deposit counters at the Vaikuntam Queue Complex approaches. Your phone will be packed in a barcode-sealed pouch.',
    whyItMatters: 'If security personnel detect a mobile phone in your possession inside the queue complex, you will be turned back, losing your place in the line and Darshan slot.',
    distance: '80 m',
    walkingTime: '1 min walk',
    image: '/assets/temples/bedi-anjaneya.png',
    location: 'Vaikuntam Queue Entrance, Counter Hub',
    coordinates: { lat: 13.6835, lng: 79.3482 },
    tips: [
      'Write down your barcode number or take a photo of the counter receipt.',
      'Power banks and Bluetooth headphones must also be deposited.',
      'Retrieve your phones immediately upon exiting the temple exit gates.'
    ],
    iconName: 'smartphone',
    searchAliases: ['phone', 'mobile', 'cellphone', 'deposit', 'gadget', 'electronic', 'watch']
  },
  {
    id: 'footwear-counters',
    name: 'Footwear Counters',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: 'FREE',
    status: 'Verified',
    shortDescription: 'Free token-based footwear storage.',
    description: 'Walking with footwear is strictly prohibited in the four inner streets surrounding the main temple (Mada Streets). TTD provides free footwear deposit counters at all major entry checkpoints leading towards the temple.',
    whyItMatters: 'Leaving footwear unattended on the roadside often leads to missing shoes. Using the official token counter keeps them secure and easily retrievable.',
    distance: '50 m',
    walkingTime: '1 min walk',
    image: '/assets/temples/pushkarini_ghats.png',
    location: 'Adjacent to VQC Entrance & Pushkarini Road',
    coordinates: { lat: 13.6830, lng: 79.3491 },
    tips: [
      'Counters operate on a simple token-matching card system.',
      'Remember the number of the counter row where you deposited your footwear.',
      'Avoid wearing expensive footwear on the day of Darshan.'
    ],
    iconName: 'footprints',
    searchAliases: ['shoes', 'chappal', 'slippers', 'footwear', 'sandal']
  },
  {
    id: 'annaprasadam',
    name: 'Free Annaprasadam Meals',
    category: 'Free Facilities',
    importance: 'highly-recommended',
    tag: 'FREE',
    status: 'Official',
    shortDescription: 'Free meals for all pilgrims.',
    description: 'The Matrusri Tarigonda Vengamamba Annaprasadam complex is a massive, highly organized dining hall that serves free, hot, and hygienic sanctified vegetarian meals to tens of thousands of devotees daily. Roti, rice, dal, curries, and buttermilk are served continuously.',
    whyItMatters: 'Finding clean, pure-vegetarian food outside can be challenging and expensive on the hilltop. Annaprasadam offers pure, blessed (Prasadam) food with high standards of sanitation.',
    distance: '350 m',
    walkingTime: '5 min walk',
    image: '/assets/temples/bhu_varaha_front.png',
    location: 'North-East of the Srivari Temple, near Pushkarini',
    coordinates: { lat: 13.6841, lng: 79.3498 },
    tips: [
      'No tickets or tokens are needed; anyone can walk in to eat.',
      'Maintain silence inside the dining compartments as it is considered holy service.',
      'Traditional hand-washing stations are available at the entrance and exit.'
    ],
    iconName: 'utensils',
    searchAliases: ['food', 'meals', 'lunch', 'dinner', 'eating', 'veg', 'annaprasadam', 'rice']
  },
  {
    id: 'drinking-water',
    name: 'Drinking Water Points',
    category: 'Free Facilities',
    importance: 'highly-recommended',
    tag: 'FREE',
    status: 'Verified',
    shortDescription: 'Purified cold drinking water points.',
    description: 'Safe, cold, and UV-filtered drinking water dispensaries are positioned throughout the Vaikuntam Queue compartments, path tunnels, and major crossroads across Tirumala.',
    whyItMatters: 'Waiting times inside the queue blocks can stretch between 3 to 12 hours. Having immediate access to clean water prevents dehydration and heat exhaustion.',
    distance: '30 m',
    walkingTime: '0 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: 'Available inside all VQC holding halls and Mada Streets',
    coordinates: { lat: 13.6833, lng: 79.3475 },
    tips: [
      'Water is dispensed in clean steel cups, which are constantly sanitized.',
      'You are allowed to bring empty plastic bottles inside to fill up.',
      'Paper cups are also provided during peak rush hours.'
    ],
    iconName: 'droplets',
    searchAliases: ['water', 'drinking', 'thirsty', 'drink', 'bottle']
  },
  {
    id: 'toilets',
    name: 'Clean Restrooms / Toilets',
    category: 'Free Facilities',
    importance: 'highly-recommended',
    tag: 'FREE',
    status: 'Verified',
    shortDescription: 'Clean public toilets nearby.',
    description: 'Sufficient public toilets and bath complexes are located at short intervals (every 200m) across the Tirumala hilltop town. Dedicated cleaning crews maintain hygiene around the clock.',
    whyItMatters: 'Finding clean restrooms is the biggest anxiety for families with children or elderly parents. Knowing their locations prevents stress.',
    distance: '100 m',
    walkingTime: '1 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: 'Located near cottage clusters and all major bus stands',
    coordinates: { lat: 13.6820, lng: 79.3510 },
    tips: [
      'Restrooms inside the Vaikuntam Queue Complex are located at the end of each block.',
      'Ask the compartment volunteers if you need to access the restroom during wait cycles.',
      'Dedicated wheelchair-accessible toilet booths are marked with placards.'
    ],
    iconName: 'users',
    searchAliases: ['toilet', 'toilets', 'restroom', 'washroom', 'bath', 'bathroom', 'wc']
  },
  {
    id: 'medical-center',
    name: '24/7 Medical Center & Hospital',
    category: 'Emergency',
    importance: 'highly-recommended',
    tag: 'FREE',
    status: 'Official',
    shortDescription: '24/7 emergency medical help.',
    description: 'TTD operates the fully equipped Ashwini Hospital on the hilltop, along with multiple first-aid dispensaries near the temple. General checkups, emergency trauma, and ambulance transfers are provided entirely free.',
    whyItMatters: 'The sudden change in altitude (850m) and exhaustion from climbing footpaths can cause blood pressure drops or leg cramps. Free medical assistance is immediately accessible.',
    distance: '450 m',
    walkingTime: '6 min walk',
    image: '/assets/temples/museum-alipiri.png',
    location: 'Ashwini Hospital, Main Temple Approach Road',
    coordinates: { lat: 13.6811, lng: 79.3525 },
    tips: [
      'Dial 108 or the local TTD helpline for immediate emergency ambulance dispatch.',
      'Basic medicines for fever, cramps, and nausea are distributed free at counters.',
      'A first-aid post is active directly inside the queue hall exit gates.'
    ],
    iconName: 'hospital',
    searchAliases: ['hospital', 'doctor', 'medical', 'medicine', 'sick', 'emergency', 'hurt', 'pain']
  },
  {
    id: 'free-bus',
    name: 'Dharma Ratham Free Buses',
    category: 'Transport',
    importance: 'good-to-know',
    tag: 'FREE',
    status: 'Official',
    shortDescription: 'Travel inside Tirumala for free.',
    description: 'Yellow-colored TTD shuttle buses, known as Dharma Ratham, operate continuously on a loop route around Tirumala. They connect all major cottages, guesthouses, bus stands, and the main temple entrance.',
    whyItMatters: 'Private cars are heavily restricted on the hilltop to control pollution and traffic. The Dharma Ratham loop is the default, cost-free way to transit without exhausting your feet.',
    distance: '150 m',
    walkingTime: '2 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: 'Stops located at GNC, ATC, Bus Stand, and Temple points',
    coordinates: { lat: 13.6828, lng: 79.3508 },
    tips: [
      'Buses arrive every 5 to 10 minutes at the designated yellow pillars.',
      'They can get extremely crowded during peak morning and evening checkouts.',
      'Dharma Ratham buses do not go down to Tirupati; they only loop on the hilltop.'
    ],
    iconName: 'bus',
    searchAliases: ['bus', 'shuttle', 'dharma ratham', 'transport', 'ride', 'travel']
  },
  {
    id: 'dress-code',
    name: 'Temple Dress Code Rules',
    category: 'Temple Rules',
    importance: 'must-know',
    tag: 'RULE',
    status: 'Official',
    shortDescription: 'Mandatory traditional attire guidelines.',
    description: 'Strict traditional dress code rules are enforced at the Vaikuntam Queue gates. Men must wear a Dhoti (with or without Uttareeyam) or Kurta-Pyjama. Women must wear a Saree, Half-saree, or Churidar with a Dupatta.',
    whyItMatters: 'Western attire like jeans, shorts, t-shirts, skirts, or caps are strictly banned. If you arrive in non-traditional clothing, security will bar you from entering.',
    distance: '0 m',
    walkingTime: '0 min walk',
    image: '/assets/temples/varaha_proximity.png',
    location: 'Enforced at all queue entrance gates and checkpoints',
    coordinates: { lat: 13.6831, lng: 79.3479 },
    tips: [
      'Dhotis and Kurtas are sold by vendors near the foothill and hilltop if you need to buy one.',
      'The rules apply to children above 10 years as well.',
      'Ensure your dupatta or upper cloth is properly wrapped before joining security gates.'
    ],
    iconName: 'shirt',
    searchAliases: ['dress', 'clothes', 'dhoti', 'jeans', 'attire', 'rule', 'wear', 'kurta']
  },
  {
    id: 'photo-ban',
    name: 'Photography & Camera Ban',
    category: 'Temple Rules',
    importance: 'must-know',
    tag: 'RULE',
    status: 'Official',
    shortDescription: 'Cameras and recording devices are prohibited.',
    description: 'Carrying cameras, video recorders, audio recorders, or any type of filming equipment inside the temple premises is strictly illegal. Security checkpoints will confiscate unauthorized devices.',
    whyItMatters: 'Violators can face immediate security detention, confiscation of memory cards/devices, and cancellation of their Darshan tickets.',
    distance: '0 m',
    walkingTime: '0 min walk',
    image: '/assets/temples/varaha_swamy_temple.png',
    location: 'Enforced throughout the temple inner complex and queue lines',
    coordinates: { lat: 13.6832, lng: 79.3480 },
    tips: [
      'Leave cameras in your hotel room in Tirupati or lock them in your cottage safe.',
      'If you have a camera on the hill, deposit it at the luggage locker before queue entry.',
      'Selfie sticks and tripods are also strictly banned.'
    ],
    iconName: 'camera',
    searchAliases: ['camera', 'photo', 'video', 'recording', 'shoot', 'photography', 'pictures']
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-mobile',
    question: 'Can I carry a mobile phone inside the Tirumala temple?',
    answer: 'No, mobile phones and electronic devices are strictly prohibited. You must deposit them at the free TTD mobile deposit counters at the VQC entrance before entering the queue line.',
    category: 'Temple Rules',
    searchAliases: ['phone', 'mobile', 'electronic', 'gadget']
  },
  {
    id: 'faq-dress',
    question: 'What is the mandatory dress code for Darshan?',
    answer: 'Traditional wear is compulsory. Men must wear a Dhoti/Lungi with a shirt/kurta or Kurta-Pyjama. Women must wear a Saree, Half-saree, or Churidar with a Dupatta. Jeans, t-shirts, and shorts are not allowed.',
    category: 'Temple Rules',
    searchAliases: ['dress', 'clothes', 'attire', 'jeans']
  },
  {
    id: 'faq-lockers',
    question: 'Are luggage lockers in Tirumala free to use?',
    answer: 'Yes, TTD provides luggage lockers entirely free of charge. You can find them near the Tirumala RTC Bus Stand and GNC toll gate. Bags are scanned and registered with a receipt.',
    category: 'Facilities',
    searchAliases: ['locker', 'lockers', 'luggage', 'bags', 'cost']
  },
  {
    id: 'faq-food',
    question: 'Where can I get free meals in Tirumala?',
    answer: 'Free, unlimited vegetarian meals are served throughout the day at the Matrusri Tarigonda Vengamamba Annaprasadam complex located near the temple. No entry ticket is required.',
    category: 'Facilities',
    searchAliases: ['food', 'meals', 'lunch', 'dinner', 'free']
  },
  {
    id: 'faq-wheelchair',
    question: 'Are wheelchairs available for senior citizens?',
    answer: 'Yes, TTD provides free wheelchair assistance for senior citizens and physically challenged pilgrims at the Vaikuntam entrance. A dedicated fast-track entry lane is also provided.',
    category: 'Facilities',
    searchAliases: ['wheelchair', 'elderly', 'senior citizen', 'handicapped']
  },
  {
    id: 'faq-ghat-road',
    question: 'What are the timings and rules for two-wheelers on the Ghat roads?',
    answer: 'Two-wheelers (bikes/scooters) are strictly prohibited on both ascending and descending ghat roads between 10:00 PM and 6:00 AM. Cars/cabs can travel 24/7. Speed limit intervals (min 28 mins ascending, min 40 mins descending) are enforced via automated tolls.',
    category: 'Travel Help',
    searchAliases: ['ghat', 'bike', 'motorcycle', 'scooter', 'speed', 'timings', 'night']
  },
  {
    id: 'faq-pathways',
    question: 'Can I walk up to Tirumala? What are the walking paths?',
    answer: 'Yes, via two pedestrian pathways: Alipiri Mettu (11 km, ~3,550 steps, open 24/7) and Srivari Mettu (2.1 km, ~2,388 steps, open 6:00 AM to 6:00 PM). Free luggage transfer from bottom to top is provided by TTD.',
    category: 'Travel Help',
    searchAliases: ['walk', 'steps', 'footpath', 'alipiri', 'srivari mettu', 'hiking']
  },
  {
    id: 'faq-emergency-medical',
    question: 'Where can I get medical assistance in Tirumala?',
    answer: 'Free 24/7 medical aid centers are located near the Vaikuntam Queue Complex, Rambagicha Guest House, and Main Temple. For urgent help, call the Tirumala Ambulance at 108 or TTD Helpline at 1800-425-111111.',
    category: 'Emergency',
    searchAliases: ['medical', 'hospital', 'doctor', 'emergency', 'ambulance', 'health']
  }
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'check-dress', text: 'Wear proper traditional dress (Dhoti/Kurta for men, Saree/Churidar for women)', category: 'before', localStorageKey: 'saarthi_chk_dress' },
  { id: 'check-luggage', text: 'Store heavy luggage at the free luggage lockers near the bus stand', category: 'before', localStorageKey: 'saarthi_chk_luggage' },
  { id: 'check-phone', text: 'Deposit mobile phone and electronics at the free mobile counter', category: 'before', localStorageKey: 'saarthi_chk_phone' },
  { id: 'check-shoes', text: 'Leave footwear at the footwear deposit counter', category: 'before', localStorageKey: 'saarthi_chk_shoes' },
  { id: 'check-ticket', text: 'Keep physical printout of Darshan ticket and ID card ready', category: 'before', localStorageKey: 'saarthi_chk_ticket' },
  { id: 'check-water', text: 'Carry a water bottle (fill stations available inside)', category: 'before', localStorageKey: 'saarthi_chk_water' },
  { id: 'check-restroom', text: 'Visit the restroom before entering the VQC queue gate', category: 'before', localStorageKey: 'saarthi_chk_restroom' }
];
