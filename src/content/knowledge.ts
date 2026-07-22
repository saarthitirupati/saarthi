export interface SubLocation {
  name: string;
  walkTime: string;
  distance: string;
  status: 'Open Now' | 'Serving' | 'Crowded' | 'Closing Soon' | 'Closed';
  mapsUrl?: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description?: string;
}

export interface RequirementsSpec {
  carry: string[];
  prohibited: string[];
  mandatoryDoc?: string;
}

export interface KnowledgeItem {
  id: string;
  intentId?: 'secure-belongings' | 'free-meals' | 'hair-offering' | 'accommodation' | 'shopping' | 'emergency';
  name: string;
  category: 'Free Facilities' | 'Temple Rules' | 'Emergency' | 'Accessibility' | 'Transport' | 'Accommodation' | 'Shopping' | 'Hair Offering';
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
  subLocations?: SubLocation[];
  procedureTimeline?: ProcedureStep[];
  requirements?: RequirementsSpec;
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
    id: 'secure-belongings',
    intentId: 'secure-belongings',
    name: 'Secure My Belongings',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: 'FREE',
    status: 'Open Now',
    shortDescription: 'Free luggage lockers, mobile phone deposit, and electronics storage.',
    description: 'Store your heavy bags, mobile phones, cameras, and leather items safely before entering the Vaikuntam Queue Complex. Free TTD counters are available at 6 major transit points.',
    whyItMatters: 'Mobiles and heavy bags are strictly prohibited inside the main temple. Depositing them at authorized counters before queue entry avoids being turned back by security.',
    distance: '120 m',
    walkingTime: '4 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: '6 Nearby Counters (Madhava Nilayam, PAC-1 to PAC-5, VQC Entrance)',
    coordinates: { lat: 13.6823, lng: 79.3514 },
    iconName: 'lock',
    searchAliases: [
      'phone', 'mobile', 'cellphone', 'deposit', 'gadget', 'electronic', 'watch',
      'locker', 'lockers', 'luggage', 'bags', 'baggage', 'store', 'secure', 'belongings',
      'aadhaar', 'camera', 'laptop', 'belt', 'footwear', 'shoes'
    ],
    subLocations: [
      { name: 'Madhava Nilayam (PAC-2 Locker Hub)', walkTime: '4 mins', distance: '120 m', status: 'Open Now' },
      { name: 'Padmanabha Nilayam Deposit Counter', walkTime: '6 mins', distance: '220 m', status: 'Open Now' },
      { name: 'Yatri Sadan (PAC-1 Free Counter)', walkTime: '7 mins', distance: '300 m', status: 'Open Now' },
      { name: 'Yatri Sadan 3 (PAC-3 Lockers)', walkTime: '8 mins', distance: '350 m', status: 'Open Now' },
      { name: 'Venkatadri Nilayam (PAC-5 Counter)', walkTime: '9 mins', distance: '400 m', status: 'Open Now' },
      { name: 'VQC-I & VQC-II Mobile Deposit', walkTime: '3 mins', distance: '90 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Carry Aadhaar & Original Photo ID', description: 'Mandatory for receipt issuance and bag scanning.' },
      { stepNumber: 2, title: 'Visit Nearest PAC Counter', description: 'Follow green signs to the locker or mobile deposit hall.' },
      { stepNumber: 3, title: 'Submit Luggage / Mobile', description: 'Electronics are sealed in barcode pouches. Bags pass X-ray.' },
      { stepNumber: 4, title: 'Receive Locker Token / Receipt', description: 'Keep barcode token safe in your wallet or pocket.' },
      { stepNumber: 5, title: 'Collect Within 24 Hours', description: 'Present barcode token at retrieval counter post-Darshan.' }
    ],
    requirements: {
      carry: ['Aadhaar Card', 'Luggage Bags', 'Mobile Phones'],
      prohibited: ['Cash & Gold in Lockers', 'Inflammable items'],
      mandatoryDoc: 'Aadhaar Card Required'
    },
    tips: [
      'Take a photo of your locker token or receipt on your companion’s phone as backup.',
      'Mobile deposit counters near VQC-I provide instant barcode pouch sealing.',
      'Lockers are 100% free of charge under TTD management.'
    ]
  },
  {
    id: 'free-meals',
    intentId: 'free-meals',
    name: 'Eat Free (Annaprasadam)',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: 'FREE',
    status: 'Open (11 AM Onwards)',
    shortDescription: 'Free, hygienic, hot sanctified vegetarian meals for all pilgrims.',
    description: 'The Matrusri Tarigonda Vengamamba Annaprasadam complex serves continuous, hot, sanctified vegetarian meals (rice, dal, sambar, chutney, buttermilk, roti) to tens of thousands of devotees daily.',
    whyItMatters: 'Finding pure, sanitary food is effortless and free. No ticket or registration is required — walk in anytime.',
    distance: '350 m',
    walkingTime: '5 min walk',
    image: '/assets/temples/bhu_varaha_front.png',
    location: 'Vengamamba Complex & Venkatadri Nilayam Halls',
    coordinates: { lat: 13.6841, lng: 79.3498 },
    iconName: 'utensils',
    searchAliases: [
      'food', 'meals', 'lunch', 'dinner', 'eating', 'veg', 'annaprasadam', 'rice',
      'eat', 'hungry', 'breakfast', 'canteen', 'milk', 'free meals'
    ],
    subLocations: [
      { name: 'Matrusri Tarigonda Vengamamba Complex', walkTime: '5 mins', distance: '350 m', status: 'Open Now' },
      { name: 'Venkatadri Nilayam Dining Hall', walkTime: '8 mins', distance: '500 m', status: 'Open Now' },
      { name: 'Panchajanyam Milk Distribution Post', walkTime: '3 mins', distance: '150 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Walk Into Dining Hall', description: 'No registration, token, or ticket required.' },
      { stepNumber: 2, title: 'Join Queue Line', description: 'Orderly seating compartments with clean banana leaf / steel thali.' },
      { stepNumber: 3, title: 'Receive Hot Meal', description: 'Unlimited hot rice, sambar, rasam, curries & buttermilk served.' },
      { stepNumber: 4, title: 'Milk / Tea Distribution', description: 'Free hot milk available for kids and elderly near queue halls.' }
    ],
    requirements: {
      carry: ['Pure Intent', 'Clean hands'],
      prohibited: ['Wastage of food', 'Footwear inside dining halls'],
      mandatoryDoc: 'No ID or Ticket Needed'
    },
    tips: [
      'Continuous service from 11:00 AM to 11:00 PM daily.',
      'Special milk distribution points operate inside queue halls for infants.',
      'Maintain quiet decorum in dining halls out of respect for sacred food.'
    ]
  },
  {
    id: 'hair-offering',
    intentId: 'hair-offering',
    name: 'Hair Offering (Tonsure)',
    category: 'Hair Offering',
    importance: 'highly-recommended',
    tag: 'FREE',
    status: 'Open 24/7',
    shortDescription: 'Sacred hair tonsure facility (Kalyana Katta).',
    description: 'Offering hair is a sacred tradition in Tirumala representing surrender of ego. TTD runs the massive 4-story Kalyana Katta complex with 500+ trained barbers working around the clock under hygienic conditions.',
    whyItMatters: 'Tonsure is performed prior to Darshan. Free sanitized blades and warm water baths are provided.',
    distance: '250 m',
    walkingTime: '3 min walk',
    image: '/assets/temples/pushkarini_ghats.png',
    location: 'Main Kalyana Katta Complex & PAC Mini Counters',
    coordinates: { lat: 13.6825, lng: 79.3501 },
    iconName: 'scissors',
    searchAliases: [
      'hair', 'tonsure', 'shaving', 'kalyana katta', 'barber', 'head shave', 'head', 'blade', 'bath'
    ],
    subLocations: [
      { name: 'Main Kalyana Katta Complex (4 Floors)', walkTime: '3 mins', distance: '250 m', status: 'Open Now' },
      { name: 'PAC-1 Mini Kalyana Katta', walkTime: '6 mins', distance: '380 m', status: 'Open Now' },
      { name: 'PAC-2 Mini Kalyana Katta', walkTime: '4 mins', distance: '200 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Visit Counter', description: 'Collect your free token and single-use antiseptic blade.' },
      { stepNumber: 2, title: 'Receive Blade', description: 'Each barber opens a new sealed blade in front of you.' },
      { stepNumber: 3, title: 'Hair Offering (Tonsure)', description: 'Quick, painless shaving by experienced TTD barbers.' },
      { stepNumber: 4, title: 'Shower & Bathroom', description: 'Proceed to hot water bathrooms in the same building.' },
      { stepNumber: 5, title: 'Wear Fresh Traditional Clothes', description: 'Change into clean dhoti/saree before Darshan.' }
    ],
    requirements: {
      carry: ['Towel', 'Fresh Traditional Clothes', 'Soap'],
      prohibited: ['Tipping barbers (Strictly prohibited by TTD)'],
      mandatoryDoc: 'Free Entry (Token at Counter)'
    },
    tips: [
      'No fees or tips should be paid to barbers. It is completely free.',
      'Sealed single-use blades are mandatory for hygiene.',
      'Mini Kalyana Katta counters at PAC-1 & PAC-2 have shorter wait times during peak morning hours.'
    ]
  },
  {
    id: 'accommodation',
    intentId: 'accommodation',
    name: 'Accommodation',
    category: 'Accommodation',
    importance: 'must-know',
    tag: 'CRO HUB',
    status: 'Check Availability',
    shortDescription: 'Spot allotment offices, dormitories, and PAC free halls.',
    description: 'TTD provides rooms, cottages, shared dormitories, and free hall accommodation across Tirumala hilltop town. Central Reception Office (CRO) handles all spot allotments.',
    whyItMatters: 'Whether you booked online or need a room on arrival, knowing where to report saves hours of wandering with family.',
    distance: '300 m',
    walkingTime: '4 min walk',
    image: '/assets/nature/udyanavanam.png',
    location: 'CRO Office (opposite Bus Stand) & PAC Halls',
    coordinates: { lat: 13.6819, lng: 79.3512 },
    iconName: 'bed',
    searchAliases: [
      'room', 'rooms', 'sleep', 'stay', 'cro', 'hotel', 'dormitory', 'pac', 'hall',
      'cottage', 'booking', 'accommodation', 'bed', 'rest', 'aadhaar'
    ],
    subLocations: [
      { name: 'Central Reception Office (CRO) - Spot Allotment', walkTime: '4 mins', distance: '300 m', status: 'Open Now' },
      { name: 'Already Booked Counters (ARP Hub)', walkTime: '5 mins', distance: '350 m', status: 'Open Now' },
      { name: 'PAC-1 Free Dormitory Hall', walkTime: '6 mins', distance: '400 m', status: 'Open Now' },
      { name: 'PAC-3 & PAC-4 Free Pilgrim Halls', walkTime: '7 mins', distance: '450 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Carry Aadhaar Card of All Pilgrims', description: 'Original Aadhaar verification is compulsory.' },
      { stepNumber: 2, title: 'Visit CRO Office / Online Counter', description: 'Join spot counter queue or scan online QR voucher.' },
      { stepNumber: 3, title: 'Check Availability & Pay Caution Deposit', description: 'Cautious refund processed upon room checkout.' },
      { stepNumber: 4, title: 'Receive Sub-office Allotment Slip', description: 'Proceed directly to designated cottage cluster.' },
      { stepNumber: 5, title: 'No Rooms Available? Head to PAC Halls', description: 'Free carpeted PAC halls with lockers and hot baths available 24/7.' }
    ],
    requirements: {
      carry: ['Original Aadhaar Cards', 'Online Booking Slip (if booked)'],
      prohibited: ['Unregistered third-party brokers'],
      mandatoryDoc: 'Aadhaar Card Mandatory'
    },
    tips: [
      'Spot allotment opens daily at CRO. Arrive early morning for best availability.',
      'If rooms are full, PAC-1, PAC-3, and PAC-4 offer free, secure hall stay with clean restrooms.',
      'Do not pay money to private agents. All official TTD allotments are handled at CRO.'
    ]
  },
  {
    id: 'shopping',
    intentId: 'shopping',
    name: 'Official Shopping',
    category: 'Shopping',
    importance: 'good-to-know',
    tag: 'OFFICIAL TTD',
    status: 'Open 8 AM - 9 PM',
    shortDescription: 'Official TTD publication, photo, souvenir, and Puja item stores.',
    description: 'Purchase authentic Srivari Laddu Prasadam, devotional books, framed deity photos, copper puja items, and Panchagavya products from authorized TTD sales counters.',
    whyItMatters: 'Guarantees official TTD pricing, authentic blessed items, and high quality without price gouging.',
    distance: '200 m',
    walkingTime: '3 min walk',
    image: '/assets/temples/bedi-anjaneya.png',
    location: 'Main Temple Surroundings, PAC Outlets & Cottage Counters',
    coordinates: { lat: 13.6830, lng: 79.3495 },
    iconName: 'shopping-bag',
    searchAliases: [
      'shop', 'shopping', 'books', 'photo', 'photos', 'prasadam', 'laddu', 'puja',
      'souvenir', 'calender', 'picture', 'incense', 'camphor'
    ],
    subLocations: [
      { name: 'TTD Sales Emporium (Near Temple)', walkTime: '3 mins', distance: '200 m', status: 'Open Now' },
      { name: 'Additional Laddu Counters (VQC Exit)', walkTime: '2 mins', distance: '120 m', status: 'Open Now' },
      { name: 'PAC-1 Book & Photo Store', walkTime: '5 mins', distance: '320 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Select Official Counter', description: 'Look for green TTD Official Emblem signboards.' },
      { stepNumber: 2, title: 'Choose Products', description: 'Srivari Laddus, books, copper dollars, photo frames.' },
      { stepNumber: 3, title: 'Digital / Cash Payment', description: 'UPI & card payments accepted at all official stores.' }
    ],
    requirements: {
      carry: ['UPI / Cash / Card', 'Cloth carry bag'],
      prohibited: ['Plastic bags (Tirumala is plastic-free zone)'],
      mandatoryDoc: 'No ID Required'
    },
    tips: [
      'Tirumala is a strict plastic-free zone; carry reusable cloth bags.',
      'Extra Srivari Laddus can be bought at additional counters near the exit gates.'
    ]
  },
  {
    id: 'emergency',
    intentId: 'emergency',
    name: 'Emergency Help',
    category: 'Emergency',
    importance: 'must-know',
    tag: '24/7 HELP',
    status: 'Active 24/7',
    shortDescription: 'Police helpdesk, Ashwini Hospital, Lost & Found, and Fire support.',
    description: 'Instant 24/7 emergency response across Tirumala. Fully equipped Ashwini Hospital, police stations, lost child assistance, and medical triage.',
    whyItMatters: 'Immediate assistance for sudden illnesses, lost family members, or security concerns.',
    distance: '300 m',
    walkingTime: '4 min walk',
    image: '/assets/temples/museum-alipiri.png',
    location: 'Ashwini Hospital, Tirumala Police Station & VQC Posts',
    coordinates: { lat: 13.6811, lng: 79.3525 },
    iconName: 'shield-alert',
    searchAliases: [
      'emergency', 'help', 'police', 'doctor', 'hospital', 'medical', 'ambulance',
      'lost', 'found', 'child', 'stolen', 'accident', '108', 'sos', 'pain', 'sick'
    ],
    subLocations: [
      { name: 'Ashwini Hospital (24/7 Free Emergency)', walkTime: '5 mins', distance: '400 m', status: 'Open Now' },
      { name: 'Tirumala Police Station & Helpdesk', walkTime: '4 mins', distance: '300 m', status: 'Open Now' },
      { name: 'Lost & Found / Child Wristband Booth', walkTime: '2 mins', distance: '150 m', status: 'Open Now' }
    ],
    procedureTimeline: [
      { stepNumber: 1, title: 'Press Direct Call CTA or Dial 108', description: 'Direct emergency helpline dispatch.' },
      { stepNumber: 2, title: 'Locate Nearest Vigilance / Police Post', description: 'Uniformed TTD vigilance staff present every 100 meters.' },
      { stepNumber: 3, title: 'Free Medical Ambulance Transport', description: 'Rapid ambulance transport to Ashwini Hospital.' }
    ],
    requirements: {
      carry: ['Location / Landmark reference'],
      prohibited: ['False alarms'],
      mandatoryDoc: 'Immediate Service - No Papers Needed'
    },
    tips: [
      'Call 108 for Medical Emergencies or 0877-2277777 for TTD Vigilance.',
      'Get child identification bands at entry counters to prevent lost children in crowds.'
    ]
  },
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
    searchAliases: ['phone', 'mobile', 'electronic', 'gadget', 'cellphone']
  },
  {
    id: 'faq-dress',
    question: 'What is the mandatory dress code for Darshan?',
    answer: 'Traditional wear is compulsory. Men must wear a Dhoti/Lungi with a shirt/kurta or Kurta-Pyjama. Women must wear a Saree, Half-saree, or Churidar with a Dupatta. Jeans, t-shirts, and shorts are not allowed.',
    category: 'Temple Rules',
    searchAliases: ['dress', 'clothes', 'attire', 'jeans', 'dhoti', 'shirt']
  },
  {
    id: 'faq-lockers',
    question: 'Are luggage lockers in Tirumala free to use?',
    answer: 'Yes, TTD provides luggage lockers entirely free of charge. You can find them near the Tirumala RTC Bus Stand, Madhava Nilayam, and GNC toll gate. Bags are scanned and registered with a receipt.',
    category: 'Facilities',
    searchAliases: ['locker', 'lockers', 'luggage', 'bags', 'cost', 'store', 'free']
  },
  {
    id: 'faq-food',
    question: 'Where can I get free meals in Tirumala?',
    answer: 'Free, unlimited vegetarian meals are served throughout the day at the Matrusri Tarigonda Vengamamba Annaprasadam complex located near the temple. No entry ticket or registration is required.',
    category: 'Facilities',
    searchAliases: ['food', 'meals', 'lunch', 'dinner', 'free', 'annaprasadam', 'eat']
  },
  {
    id: 'faq-hair',
    question: 'Where is hair offering (Kalyana Katta) done and is it free?',
    answer: 'Hair offering is done at the main 4-story Kalyana Katta complex and mini PAC counters. It is 100% free; TTD provides free single-use blades and barbers. No tips should be paid.',
    category: 'Facilities',
    searchAliases: ['hair', 'tonsure', 'kalyana katta', 'barber', 'shaving', 'blade']
  },
  {
    id: 'faq-room',
    question: 'How do I get a room or dormitory on arrival in Tirumala?',
    answer: 'Visit the Central Reception Office (CRO) near the bus stand for spot room allotments with original Aadhaar cards. If rooms are sold out, free carpeted dormitories and halls with hot baths are available at PAC-1, PAC-3, and PAC-4.',
    category: 'Facilities',
    searchAliases: ['room', 'rooms', 'cro', 'accommodation', 'dormitory', 'sleep', 'stay', 'aadhaar']
  },
  {
    id: 'faq-wheelchair',
    question: 'Are wheelchairs available for senior citizens?',
    answer: 'Yes, TTD provides free wheelchair assistance for senior citizens and physically challenged pilgrims at the Vaikuntam entrance. A dedicated fast-track entry lane is also provided.',
    category: 'Facilities',
    searchAliases: ['wheelchair', 'elderly', 'senior citizen', 'handicapped']
  },
  {
    id: 'faq-emergency-medical',
    question: 'Where can I get medical assistance in Tirumala?',
    answer: 'Free 24/7 medical aid centers are located near the Vaikuntam Queue Complex, Rambagicha Guest House, and Main Temple. For urgent help, call the Tirumala Ambulance at 108 or TTD Helpline at 1800-425-111111.',
    category: 'Emergency',
    searchAliases: ['medical', 'hospital', 'doctor', 'emergency', 'ambulance', 'health', 'police']
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
