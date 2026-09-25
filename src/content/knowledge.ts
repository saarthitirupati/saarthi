export interface FeatureHighlight {
  title: string;
  subtitle: string;
  iconName: string;
}

export interface ItemCategorySpec {
  title: string;
  desc: string;
  tag: string;
  iconName: string;
  whyNeeded?: string;
  whereToDeposit?: string;
}

export interface SubLocation {
  name: string;
  walkTime: string;
  distance: string;
  status: 'Open Now' | 'Serving' | 'Crowded' | 'Closing Soon' | 'Closed';
  mapsUrl?: string;
  whyRecommended?: string;
  bestFor?: string;
}

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  description?: string;
  whyThisStep?: string;
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
  highlights?: FeatureHighlight[];
  itemCategories?: ItemCategorySpec[];
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
    name: 'Secure Belongings & Free Lockers',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: '100% FREE TTD',
    status: 'Open 24/7',
    shortDescription: 'Free luggage lockers, mobile phone deposit, and footwear stands.',
    description: 'Deposit heavy backpacks, phones, smartwatches, cameras, and footwear safely before entering the Vaikuntam Queue Complex. TTD provides 100% free, 24/7 guarded locker complexes and instant barcode phone sealing with exit-gate pickup.',
    whyItMatters: 'Temple security strictly bans phones, electronics, bags, and footwear from the sanctum sanctorum. Arriving at the inner queue with these items results in immediate rejection by CISF/TTD security, forcing you to exit and restart your wait from scratch.',
    distance: '120 m',
    walkingTime: '3 min walk',
    image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968161/IMG_6992_cq6gls.jpg',
    location: 'Tirumala Hill: VQC-I/II Gates, PAC-1 to PAC-5 & Padmanabha Nilayam',
    coordinates: { lat: 13.6823, lng: 79.3514 },
    iconName: 'lock',
    searchAliases: [
      'phone', 'mobile', 'cellphone', 'deposit', 'gadget', 'electronic', 'watch',
      'locker', 'lockers', 'luggage', 'bags', 'baggage', 'store', 'secure', 'belongings',
      'aadhaar', 'camera', 'laptop', 'belt', 'footwear', 'shoes', 'chappals'
    ],
    highlights: [
      { title: '100% Free TTD Service', subtitle: 'Zero fee for lockers, bags & phone pouches', iconName: 'lock' },
      { title: 'Aadhaar Required', subtitle: 'Biometric/Barcode verification prevents theft', iconName: 'file-text' },
      { title: 'Exit Gate Pickup', subtitle: 'Collect phone right outside Silver Door exit', iconName: 'smartphone' },
      { title: '24/7 Armed Security', subtitle: 'Round-the-clock guarded PAC storage hubs', iconName: 'clock' }
    ],
    itemCategories: [
      { 
        title: 'Mobile Phones & Smartwatches', 
        desc: 'Sealed in numbered, tamper-evident barcode security pouches at VQC Entrance booths.', 
        tag: 'Instant Sealing', 
        iconName: 'smartphone',
        whereToDeposit: 'VQC-I & VQC-II Entrance Counters (3 min walk)',
        whyNeeded: 'Sanctum metal detectors flag all electronics. Depositing here lets you retrieve your phone right outside the temple exit (near Laddu counters) without walking back to your locker.'
      },
      { 
        title: 'Heavy Luggage, Backpacks & Laptops', 
        desc: 'Stored in free steel lockers at PAC-1 to PAC-5 and Padmanabha Nilayam.', 
        tag: 'Steel Locker & Key', 
        iconName: 'briefcase',
        whereToDeposit: 'PAC-2 Madhava Nilayam or your Pilgrim Hall',
        whyNeeded: 'Queue compartments are packed and narrow; bulky luggage is barred from entering temple corridors and will not fit through inner security turnstiles.'
      },
      { 
        title: 'Footwear & Chappals', 
        desc: 'Free footwear counters with token tags located near temple approach paths.', 
        tag: 'Free Token Stand', 
        iconName: 'footprints',
        whereToDeposit: 'Dedicated stands opposite VQC Entrance',
        whyNeeded: 'Leather and shoes are strictly forbidden inside the sacred complex. Depositing at the designated stand ensures your shoes are waiting at the exact exit gate where you emerge.'
      },
      { 
        title: 'Cameras, Power Banks & Electronic Gadgets', 
        desc: 'Cataloged, X-rayed, and deposited in electronic safety bays at PAC locker halls.', 
        tag: 'Barcode Scanned', 
        iconName: 'camera',
        whereToDeposit: 'PAC Luggage Counters prior to queue entry',
        whyNeeded: 'Lithium battery devices and photography gear are prohibited under strict shrine security laws to preserve temple sanctum sanctity.'
      }
    ],
    subLocations: [
      { 
        name: 'VQC-I & VQC-II Mobile Deposit', 
        walkTime: '3 mins', 
        distance: '90 m', 
        status: 'Open Now',
        bestFor: 'Mobile Phones & Smartwatches Only',
        whyRecommended: 'Right at queue gate entrance. Phone is tagged to your photo/receipt and transferred to the temple exit counter for immediate post-darshan collection.'
      },
      { 
        name: 'Madhava Nilayam (PAC-2 Locker Mega-Hub)', 
        walkTime: '4 mins', 
        distance: '120 m', 
        status: 'Open Now',
        bestFor: 'Heavy Luggage, Backpacks & Family Bags',
        whyRecommended: 'Tirumala’s largest locker facility with 4,000+ free steel lockers, 24/7 CCTV surveillance, and changing/shower rooms nearby.'
      },
      { 
        name: 'Padmanabha Nilayam Deposit Counter', 
        walkTime: '6 mins', 
        distance: '220 m', 
        status: 'Open Now',
        bestFor: 'Pilgrims arriving via Taxi or CRO Office',
        whyRecommended: 'Closest counter to the Central Reception Office (CRO) and cottage allotment counters.'
      },
      { 
        name: 'Yatri Sadan (PAC-1 Free Counter)', 
        walkTime: '7 mins', 
        distance: '300 m', 
        status: 'Open Now',
        bestFor: 'Dormitory Guests & Walking Pilgrims',
        whyRecommended: 'Directly attached to the free pilgrim rest halls and near the Tirupati downhill bus stand.'
      },
      { 
        name: 'Venkatadri Nilayam (PAC-5 Counter)', 
        walkTime: '9 mins', 
        distance: '400 m', 
        status: 'Open Now',
        bestFor: 'Pilgrims visiting Free Annaprasadam',
        whyRecommended: 'Convenient deposit hub if you plan to partake in free meals at Tarigonda Vengamamba before your darshan.'
      }
    ],
    procedureTimeline: [
      { 
        stepNumber: 1, 
        title: 'Carry Physical Aadhaar / Original Photo ID', 
        description: 'Have your physical government ID card ready in your hand.',
        whyThisStep: 'TTD scans the barcode on your physical Aadhaar to generate your deposit token. If your phone is your only ID, you cannot use it once it is deposited!'
      },
      { 
        stepNumber: 2, 
        title: 'Separate Cash & Ticket from Bags', 
        description: 'Keep your darshan ticket, cash, and ID securely in your pockets.',
        whyThisStep: 'Once your bag or locker is locked, you cannot open it until after darshan. You need cash for laddus, holy water bottles, and prasadams inside.'
      },
      { 
        stepNumber: 3, 
        title: 'Deposit Luggage at PAC, Leave Shoes at Stand', 
        description: 'Store heavy bags in free steel lockers; drop shoes at the numbered footwear counter.',
        whyThisStep: 'Entering the queue area with only your clothes, cash, and ID allows you to walk through metal detectors in seconds without friction.'
      },
      { 
        stepNumber: 4, 
        title: 'Seal Phone at VQC Gate & Collect Barcode Token', 
        description: 'Hand over mobile at the VQC entrance counter; staff seal it in a tamper-proof barcode pouch.',
        whyThisStep: 'Your phone is digitally registered and transported to the exit gate kiosk, ensuring zero theft risk and quick collection.'
      },
      { 
        stepNumber: 5, 
        title: 'Collect Within 24 Hours at Exit / Locker Hall', 
        description: 'Show your token at the exit counter for your phone, and at PAC for your luggage.',
        whyThisStep: 'Counters operate 24 hours non-stop. Tokens are verified with your biometric/Aadhaar so nobody else can claim your belongings.'
      }
    ],
    requirements: {
      carry: [
        'Original Physical Aadhaar Card or Passport (Mandatory for locker token)',
        'Darshan Ticket Printout (Physical copy recommended)',
        'Cash / Small Currency Notes (for Laddu Prasadam counters)',
        'Cloth pouch or waist bag for cash & ID (leather prohibited)',
        'Infant milk bottle / doctor-prescribed medications (allowed in queue)'
      ],
      prohibited: [
        'Mobile phones & smartwatches (must be sealed at VQC gate)',
        'Cameras, video equipment, selfie sticks & drones',
        'Laptops, tablets, bluetooth earbuds & power banks',
        'Leather belts, leather wallets, leather pouches & shoe bags',
        'Cigarettes, tobacco, lighters, matchboxes & gutkha',
        'Knives, scissors, blades, or inflammable sprays'
      ],
      mandatoryDoc: 'Physical Aadhaar / Govt Photo ID Required'
    },
    tips: [
      'Tie the locker key band securely around your wrist or sacred thread immediately upon receiving it.',
      'Take a quick photo of the locker token with your companion’s phone before sealing, or memorize the 4-digit locker number.',
      'Never pay anyone for lockers or pouches: TTD provides 100% of these services completely free of cost.',
      'Keep your phone separate from your main luggage bag so you can collect it at the temple exit right after darshan.'
    ]
  },
  {
    id: 'free-meals',
    intentId: 'free-meals',
    name: 'Free Annaprasadam (Sacred Meals)',
    category: 'Free Facilities',
    importance: 'must-know',
    tag: '100% FREE TTD',
    status: 'Serving (8:30 AM – 11:00 PM)',
    shortDescription: 'Hygienic, unlimited, traditional vegetarian meals served free to all pilgrims.',
    description: 'Matrusri Tarigonda Vengamamba Annaprasadam Complex and VQC queue halls serve hot, pure satvik vegetarian meals (steamed rice, sambar, rasam, vegetable curry, chutney, buttermilk) to tens of thousands of pilgrims daily. 100% free of charge with zero tickets or tokens required.',
    whyItMatters: 'Lord Venkateswara temple provides unlimited sacred meals as divine prasad. No pilgrim in Tirumala should remain hungry. No token, Aadhaar, or ticket is needed — walk in directly at meal timings, or receive hot food packets delivered directly to your queue seat inside VQC compartments.',
    distance: '280 m',
    walkingTime: '4 min walk',
    image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968272/Annaprasadam-4-copy_lyo86v.jpg',
    location: 'Matrusri Tarigonda Vengamamba Complex (Near Temple) & VQC Compartments',
    coordinates: { lat: 13.6841, lng: 79.3498 },
    iconName: 'utensils',
    searchAliases: [
      'food', 'meals', 'lunch', 'dinner', 'eating', 'veg', 'annaprasadam', 'rice',
      'eat', 'hungry', 'breakfast', 'canteen', 'milk', 'free meals', 'vengamamba', 'tiffin'
    ],
    highlights: [
      {
        title: '100% Free TTD Service',
        subtitle: 'Zero tokens, zero fees, open to all devotees without discrimination',
        iconName: 'shield-check'
      },
      {
        title: 'Unlimited Satvik Meals',
        subtitle: 'Steamed rice, sambar, rasam, vegetable curry, chutney & buttermilk',
        iconName: 'utensils'
      },
      {
        title: 'Plantain Leaf Tradition',
        subtitle: 'Traditional, hygienic, eco-friendly seating on clean marble dining tables',
        iconName: 'sparkles'
      },
      {
        title: 'Continuous In-Queue Supply',
        subtitle: 'Food packets, buttermilk & infant milk delivered directly in VQC waiting halls',
        iconName: 'clock'
      }
    ],
    itemCategories: [
      {
        title: 'Breakfast (Tiffin)',
        tag: '8:30 AM – 10:30 AM',
        desc: 'Hot rava upma, ven pongal, fresh coconut chutney and sambar served fresh in morning dining sessions.',
        iconName: 'utensils',
        whereToDeposit: 'Matrusri Tarigonda Vengamamba Complex (Ground Floor Dining Halls)',
        whyNeeded: 'Gives pilgrims completing early morning head tonsure or walking the footpath an instant, wholesome breakfast before darshan.'
      },
      {
        title: 'Traditional Lunch Feast',
        tag: '10:30 AM – 4:00 PM',
        desc: 'Full traditional meal served on fresh banana leaf: unlimited steamed rice, flavourful sambar, rasam, freshly cooked vegetable curry, spicy chutney, and digestive buttermilk.',
        iconName: 'utensils',
        whereToDeposit: 'Matrusri Tarigonda Vengamamba Mega Complex (All 4 Multi-floor Dining Halls)',
        whyNeeded: 'Serves up to 4,000 devotees simultaneously every 30 minutes with hygienic hot food cooked in giant automated steam boilers.'
      },
      {
        title: 'Evening & Night Dinner',
        tag: '5:00 PM – 11:00 PM',
        desc: 'Freshly prepared hot dinner with steamed rice, aromatic sambar, rasam, vegetable curry, and cooling curd/buttermilk served until 11:00 PM.',
        iconName: 'clock',
        whereToDeposit: 'Matrusri Tarigonda Vengamamba Mega Complex (Central Dining Halls)',
        whyNeeded: 'Ensures devotees exiting the temple after evening and night darshan have access to hot, hygienic food without searching for hotels.'
      },
      {
        title: 'In-Queue Compartment Food',
        tag: 'Continuous 24/7',
        desc: 'Hot pulihora (tamarind rice), curd rice, sambar bath packets, buttermilk, and warm milk for babies distributed directly inside waiting halls.',
        iconName: 'droplets',
        whereToDeposit: 'Vaikuntam Queue Complexes (VQC-I & VQC-II) All Compartments',
        whyNeeded: 'Devotees waiting 4 to 12 hours inside locked compartments cannot step out, so Srivari Seva volunteers bring food right to their seats.'
      }
    ],
    subLocations: [
      { 
        name: 'Matrusri Tarigonda Vengamamba Complex (Central Facility)', 
        walkTime: '4 mins', 
        distance: '280 m', 
        status: 'Serving',
        bestFor: 'Full sit-down lunch & dinner meals on banana leaf',
        whyRecommended: 'The central mega complex near main temple & Parakamani with 4 giant air-cooled halls seating 4,000+ devotees per batch.'
      },
      { 
        name: 'Vaikuntam Queue Complexes (VQC-I & II)', 
        walkTime: 'Inside Queue', 
        distance: '0 m', 
        status: 'Serving',
        bestFor: 'Devotees waiting inside darshan compartments',
        whyRecommended: 'Continuous free distribution of hot food packets, cold buttermilk, and drinking water directly inside your compartment seat.'
      },
      { 
        name: 'Pilgrim Amenities Complex (PAC-II & PAC-IV)', 
        walkTime: '5 mins', 
        distance: '350 m', 
        status: 'Open Now',
        bestFor: 'Transit pilgrims & dormitory hall residents',
        whyRecommended: 'Dedicated counters providing hot food packets, baby milk, and pure drinking water without needing to walk to the main temple.'
      },
      { 
        name: 'Rambagicha Bus Stand Distribution Counter', 
        walkTime: '3 mins', 
        distance: '200 m', 
        status: 'Open Now',
        bestFor: 'Arriving and departing bus passengers',
        whyRecommended: 'Convenient food distribution stall near Balaji Nagar bus terminus providing hot food packets before or after your journey.'
      }
    ],
    procedureTimeline: [
      { 
        stepNumber: 1, 
        title: 'Walk Directly Into Complex', 
        description: 'No tickets, tokens, biometric scans, or reservations required — open unconditionally to all pilgrims.',
        whyThisStep: 'TTD Annadanam is considered the ultimate sacred duty (Annadanam Param Danam) and is completely unrestricted to all devotees.'
      },
      { 
        stepNumber: 2, 
        title: 'Wash Hands & Leave Footwear Outside', 
        description: 'Convenient water wash-bays and dedicated shoe stands are available at the entrance.',
        whyThisStep: 'Maintains strict hygiene for traditional hand-eating and preserves the sanctified purity of the dining halls.'
      },
      { 
        stepNumber: 3, 
        title: 'Take Seat at Marble Dining Table', 
        description: 'Batches of devotees are guided systematically into spacious dining halls with fresh eco-friendly banana leaves laid out.',
        whyThisStep: 'Systematic batch seating allows the cleaning crew to sanitize the entire hall between batches within minutes.'
      },
      { 
        stepNumber: 4, 
        title: 'Enjoy Unlimited Hot Satvik Meal', 
        description: 'Srivari Seva volunteers serve unlimited steaming rice, traditional sambar, rasam, vegetable curry, chutney, and refreshing buttermilk.',
        whyThisStep: 'Traditional plantain leaf eating enhances natural digestion and aroma while being 100% biodegradable.'
      },
      { 
        stepNumber: 5, 
        title: 'Clean Exit & Leaf Disposal', 
        description: 'Fold your leaf, dispose it in the designated bins, and wash hands at exit bays.',
        whyThisStep: 'Ensures the mega facility remains spotless for the thousands of devotees entering right after you.'
      }
    ],
    requirements: {
      carry: ['Devotional respect & healthy appetite', 'Clean hands'],
      prohibited: ['Wasting food (Take only what you can finish)', 'Footwear inside dining halls', 'Paying any tips or money (100% free)'],
      mandatoryDoc: 'No ID or Ticket Needed'
    },
    tips: [
      'Operating Timings: Breakfast 8:30–10:30 AM | Lunch 10:30 AM–4:00 PM | Dinner 5:00–11:00 PM.',
      'Hygiene Pause: Service pauses between 4:00 PM and 5:00 PM daily for deep cleaning and kitchen preparations.',
      'Inside VQC Queue: You do NOT need to leave the compartment. Srivari Seva volunteers bring food packets and buttermilk to you.',
      'Infant Care: Free warm milk for babies is readily available upon request inside VQC compartments and PAC centers.',
      'Festival Days: Sacred sweet pongal or payasam is served along with meals on auspicious festivals and Brahmotsavams.'
    ]
  },
  {
    id: 'hair-offering',
    intentId: 'hair-offering',
    name: 'Sacred Hair Offering (Kalyanakatta & Mundan)',
    category: 'Hair Offering',
    importance: 'highly-recommended',
    tag: '100% FREE TTD',
    status: 'Open 24/7 (All Day & Night)',
    shortDescription: 'Official 24/7 TTD tonsure centers with free sterilized blades, dedicated halls, and hot bath facilities.',
    description: 'Offering hair (tonsuring / mundan) in Tirumala represents the complete surrender of ego to Lord Venkateswara. TTD operates the central multi-story Main Kalyanakatta opposite the Annadanam Complex 24 hours a day, alongside 9 satellite mini-centers located near major guest houses (Nandakam, SVRH, Rambagicha, and PACs). All hair offering services, sterilized blades, and adjoining hot water baths are 100% free with a strict ban on tipping barbers.',
    whyItMatters: 'Devotees traditionally tonsure their heads prior to entering the Darshan queue. TTD ensures highest hygiene standards with new sealed surgical blades opened in front of you, dedicated separate halls for men and women, and immediate access to free hot-water showers so you can change into clean traditional clothes.',
    distance: '250 m',
    walkingTime: '3 min walk',
    image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968353/painted-sign-board-of-kalyanakatta-balaji-temple-tirupati-andhra-pradesh-F5M0J1_p7hkr5.jpg',
    location: 'Opposite Annadhanam Complex (Main 24/7 Facility) & 9 Rest House Satellite Centers',
    coordinates: { lat: 13.6825, lng: 79.3501 },
    iconName: 'scissors',
    searchAliases: [
      'hair', 'tonsure', 'shaving', 'kalyana katta', 'kalyanakatta', 'barber', 'head shave', 'head', 'blade', 'bath', 'mundan', 'mottai'
    ],
    highlights: [
      {
        title: '100% Free Service & Blades',
        subtitle: 'Sterilized surgical blades and expert barbers provided at zero cost with zero tipping',
        iconName: 'shield-check'
      },
      {
        title: 'Open 24 Hours Non-Stop',
        subtitle: 'Round-the-clock service at Main Kalyanakatta with dedicated men & women halls',
        iconName: 'clock'
      },
      {
        title: '9 Satellite Mini Centers',
        subtitle: 'Convenient satellite centers near Nandakam, SVRH, Rambagicha & PACs to skip crowd',
        iconName: 'map-pin'
      },
      {
        title: 'Free Adjoining Hot Baths',
        subtitle: 'Clean shower complexes with geysers for immediate cleansing before queue entry',
        iconName: 'droplets'
      }
    ],
    itemCategories: [
      {
        title: 'Main 24/7 Kalyanakatta Complex',
        tag: 'Open 24 Hours',
        desc: 'Massive 4-story facility located directly opposite the Annadhanam Complex with hundreds of barbers and separate floors for men, women, and children.',
        iconName: 'scissors',
        whereToDeposit: 'Opposite Matrusri Tarigonda Vengamamba Annadhanam Complex',
        whyNeeded: 'Highest capacity center with continuous movement and dedicated staff, open all night for early morning pilgrims.'
      },
      {
        title: '9 Satellite Mini Kalyanakattas',
        tag: 'Rest House Hubs',
        desc: 'Satellite centers situated near major rest houses including Nandakam Rest House, Sri Venkateswara Rest House (SVRH), Rambagicha, and PAC dormitories.',
        iconName: 'map-pin',
        whereToDeposit: 'Nandakam Rest House, SVRH, Rambagicha Guest House & PAC-1/PAC-2',
        whyNeeded: 'Convenient for families, senior citizens, and cottage guests — avoids long walks across hilltop and has shorter queues in early morning hours.'
      },
      {
        title: 'Free Hot Water Shower Complexes',
        tag: 'Adjoining Halls',
        desc: 'Spacious public bathing halls with hot water geysers and private changing cubicles located immediately inside/adjacent to each tonsure center.',
        iconName: 'droplets',
        whereToDeposit: 'Within Main Kalyanakatta Complex & Adjacent to all Mini Centers',
        whyNeeded: 'Allows devotees to thoroughly rinse off loose hair clippings and change into fresh traditional attire before proceeding to Darshan.'
      },
      {
        title: 'Baby Mundan & Ceremonial Hair Lock',
        tag: 'Custom Tradition',
        desc: 'Specialized gentle tonsuring for infants and children; barbers assist with collecting the ceremonial first lock of hair into a cloth pouch.',
        iconName: 'sparkles',
        whereToDeposit: 'Dedicated Family / Infant Counters at Main Complex & Satellite Hubs',
        whyNeeded: 'Preserves auspicious family traditions where the initial lock of hair is offered separately as per vows.'
      }
    ],
    subLocations: [
      { 
        name: 'Main Kalyanakatta Complex (Central 4-Story Facility)', 
        walkTime: '3 mins', 
        distance: '250 m', 
        status: 'Open Now',
        bestFor: '24/7 tonsure with dedicated multi-floor halls for men, women & infants',
        whyRecommended: 'Located opposite Annadhanam complex; largest mega center with hundreds of barbers working round the clock to ensure fast turnaround.'
      },
      { 
        name: 'Nandakam & SVRH Mini Kalyanakatta', 
        walkTime: '4 mins', 
        distance: '300 m', 
        status: 'Open Now',
        bestFor: 'Pilgrims staying in Nandakam, Panchajanyam, or SVRH rest houses',
        whyRecommended: 'Saves 30+ minutes of walking; ideal for morning tonsure without the large crowd of the central facility.'
      },
      { 
        name: 'Rambagicha & PAC Satellite Centers (PAC-I & II)', 
        walkTime: '3 mins', 
        distance: '200 m', 
        status: 'Open Now',
        bestFor: 'Devotees arriving at Balaji Nagar bus stand or resting in PAC halls',
        whyRecommended: 'Instant tonsure access right after getting off the bus or before checking into dormitory halls.'
      },
      { 
        name: 'Cottage Clusters Mini Kalyanakattas (SNC & ATC Hubs)', 
        walkTime: '6 mins', 
        distance: '450 m', 
        status: 'Open Now',
        bestFor: 'Families & elderly devotees residing in hill cottage zones',
        whyRecommended: 'Quiet, localized centers designed to serve residential cottage sectors with zero commute hassle.'
      }
    ],
    procedureTimeline: [
      { 
        stepNumber: 1, 
        title: 'Collect Free Entry Token & Blade', 
        description: 'Approach the entrance token counter to receive your free entry pass and a new, sealed single-use surgical blade.',
        whyThisStep: 'TTD enforces sealed single-use blades to guarantee 100% surgical hygiene and eliminate cross-contamination.'
      },
      { 
        stepNumber: 2, 
        title: 'Proceed to Designated Hall Floor', 
        description: 'Staff guides pilgrims to separate floors: dedicated sections for men, women, and infants.',
        whyThisStep: 'Ensures absolute privacy, dignity, and comfortable seating arrangements for women and young children.'
      },
      { 
        stepNumber: 3, 
        title: 'Ceremonial First Lock (Optional)', 
        description: 'If performing a child’s first mundan, inform the barber to hand you the ceremonial first lock of hair to collect in your cloth pouch.',
        whyThisStep: 'Honors family customs and sacred vows before the full tonsure is carried out.'
      },
      { 
        stepNumber: 4, 
        title: 'Sacred Hair Tonsure (Strictly No Tips)', 
        description: 'Skilled barbers open the sealed blade in front of you and perform quick, painless tonsure. Tipping is strictly prohibited.',
        whyThisStep: 'Barbers receive official TTD salaries; never offer money or tips to maintain the sanctity of selfless service.'
      },
      { 
        stepNumber: 5, 
        title: 'Hot Water Bath & Traditional Clothes', 
        description: 'Walk directly to the adjoining bath complex, take a hot shower to wash off hair fragments, and change into clean traditional dress.',
        whyThisStep: 'Cleanses the body for divine purity and prepares you comfortably for the Vaikuntam Queue entry.'
      }
    ],
    requirements: {
      carry: ['Spare set of traditional clothes (Dhoti/Saree/Kurta)', 'Bath towel & soap', 'Small cloth pouch (if collecting ceremonial hair lock)'],
      prohibited: ['Tipping barbers (Strictly prohibited by TTD — report any demand)', 'Footwear inside tonsuring halls', 'Soap inside shaving bays (Allowed in shower bathrooms only)'],
      mandatoryDoc: 'Free Entry Token (Issued on arrival at counter)'
    },
    tips: [
      'Cost & Tipping: The tonsure service and sterilized blades are completely free of charge. Never pay tips to barbers.',
      'Facilities: Free hot water and common bathrooms are available nearby for bathing immediately after tonsure.',
      'Clothing: Carry a spare set of traditional clothes to change into after your bath, along with a small pouch to collect your hair if you wish to keep a small lock as per custom.',
      'Timing Strategy: Main Kalyanakatta opposite Annadhanam is open 24 hours. The quietest hours are late night (10 PM - 3 AM) and early afternoon (1 PM - 3 PM).',
      'Satellite Centers: If staying in cottages or rest houses (Nandakam, SVRH, Rambagicha), use the 9 mini satellite centers to skip the main queue.'
    ]
  },
  {
    id: 'accommodation',
    intentId: 'accommodation',
    name: 'Tirumala Accommodation & Cottage Booking',
    category: 'Accommodation',
    importance: 'must-know',
    tag: 'ONLINE & CRO SPOT',
    status: 'Open Daily (Online & CRO)',
    shortDescription: 'Official online portal & CRO spot allotment for budget cottages (₹100/₹500), guest houses, and free PAC halls.',
    description: 'TTD provides rooms, cottages, shared dormitories, and free hall accommodation across the Tirumala hilltop town. Rooms can be booked online through the official TTD booking portal up to 3 months in advance (linked to a confirmed darshan/seva ticket for at least 2 pilgrims, with a 30-day quota limit), or offline via walk-in spot allotment at the Central Reception Office (CRO) near the bus stand with original Aadhaar cards and facial biometric verification. Alternatively, downhill TTD complexes (Srinivasam, Vishnu Nivasam, Madhavam) in Tirupati town and free carpeted PAC halls on the hill provide reliable lodging when hilltop rooms are booked out.',
    whyItMatters: 'Hilltop room demand is immense. Low-cost ₹100 and ₹500 rooms exhaust rapidly. Knowing the online darshan-link rules, the 3:00 AM – 4:00 AM CRO walk-in strategy, and having backup downhill TTD options in Tirupati town prevents families from falling into unauthorized broker traps or being stranded without shelter.',
    distance: '300 m',
    walkingTime: '4 min walk',
    image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968555/maxresdefault_fwmwke.jpg',
    location: 'CRO Office (opposite Bus Stand) & Downhill Tirupati Complexes',
    coordinates: { lat: 13.6819, lng: 79.3512 },
    iconName: 'bed',
    searchAliases: [
      'room', 'rooms', 'sleep', 'stay', 'cro', 'hotel', 'dormitory', 'pac', 'hall',
      'cottage', 'booking', 'accommodation', 'bed', 'rest', 'aadhaar', 'srinivasam', 'vishnu nivasam'
    ],
    highlights: [
      {
        title: 'Online Portal Booking',
        subtitle: 'Up to 3 months advance; requires confirmed Darshan ticket (min 2 pilgrims)',
        iconName: 'shield-check'
      },
      {
        title: 'Budget & Premium Cottages',
        subtitle: 'Official TTD pricing from ₹100 & ₹500 rest houses to ₹1,000–₹3,000+ guest suites',
        iconName: 'bed'
      },
      {
        title: 'Offline CRO Spot Allotment',
        subtitle: 'Walk-in counter near bus stand; queuing by 3–4 AM yields best chance for ₹100 rooms',
        iconName: 'clock'
      },
      {
        title: 'Free PAC Halls & Downhill Hubs',
        subtitle: '24/7 free halls on hill (PAC 1–4) & massive Tirupati hubs (Srinivasam, Vishnu Nivasam)',
        iconName: 'map-pin'
      }
    ],
    itemCategories: [
      {
        title: 'Online Advance Booking (TTD Portal)',
        tag: '3 Months Advance',
        desc: 'Book rooms online via the official TTD website. Requires a valid darshan or seva ticket linked to your mobile for at least 2 pilgrims. Limited to 1 room per Aadhaar profile every 30 days.',
        iconName: 'bed',
        whereToDeposit: 'Official TTD Booking Website / Mobile App (Redeem at ARP Hub)',
        whyNeeded: 'Prevents mass broker hoarding by verifying confirmed darshan pilgrims before reserving rooms on the sacred hill.'
      },
      {
        title: 'Offline CRO Spot Allotment (₹100 & ₹500)',
        tag: '3:00 AM – 4:00 AM Walk-In',
        desc: 'Walk-in room allotment counter located at Central Reception Office (CRO) near Tirumala bus stand. ₹100 budget rooms run out quickly, so arriving early gives you the best chance.',
        iconName: 'clock',
        whereToDeposit: 'Central Reception Office (CRO) Opposite RTC Bus Stand',
        whyNeeded: 'Primary walk-in lifeline for spontaneous pilgrims. Facial recognition and Aadhaar ensure fair spot allotment.'
      },
      {
        title: 'Free Carpeted Dormitories (PAC 1 to 4)',
        tag: '100% Free • 24/7',
        desc: 'Massive, clean carpeted halls at PAC-1, PAC-2, PAC-3, and PAC-4 with free luggage lockers, hot water bathrooms, and 24/7 security on a first-come, first-served basis.',
        iconName: 'sparkles',
        whereToDeposit: 'Pilgrim Amenities Complexes (PAC-1 to PAC-4)',
        whyNeeded: 'Provides safe, cost-free shelter right on the hilltop if all paid rooms and cottages are completely full.'
      },
      {
        title: 'Tirupati Downhill Hubs (Srinivasam & Vishnu Nivasam)',
        tag: 'Downhill Transit Hubs',
        desc: 'Massive TTD accommodation complexes located in Tirupati town right opposite the railway station (Vishnu Nivasam) and central bus stand (Srinivasam & Madhavam).',
        iconName: 'map-pin',
        whereToDeposit: 'Opposite Tirupati Railway Station & Central RTC Bus Stand',
        whyNeeded: 'Thousands of rooms available downhill; direct electric buses connect from the doorstep uphill to Tirumala in 45 minutes.'
      }
    ],
    subLocations: [
      { 
        name: 'Central Reception Office (CRO) - Spot Allotment', 
        walkTime: '4 mins', 
        distance: '300 m', 
        status: 'Open Now',
        bestFor: 'In-person walk-in room allotments on hilltop arrival',
        whyRecommended: 'Official hilltop offline counter; open early morning. Carry original Aadhaar cards for facial biometric scan.'
      },
      { 
        name: 'Already Booked Counters (ARP Hub)', 
        walkTime: '5 mins', 
        distance: '350 m', 
        status: 'Open Now',
        bestFor: 'Devotees with advance online booking confirmation vouchers',
        whyRecommended: 'Fast-track counter to scan online booking QR voucher, deposit caution money, and collect sub-office cottage keys.'
      },
      { 
        name: 'PAC-1, PAC-3 & PAC-4 Free Pilgrim Halls', 
        walkTime: '6 mins', 
        distance: '400 m', 
        status: 'Open Now',
        bestFor: 'Cost-free dormitory stay when paid cottages are sold out',
        whyRecommended: '100% free carpeted halls with 24/7 security, steel luggage lockers, and running hot water bathrooms.'
      },
      { 
        name: 'Tirupati Downhill Complexes (Srinivasam & Vishnu Nivasam)', 
        walkTime: 'Downhill transit', 
        distance: '22 km', 
        status: 'Open Now',
        bestFor: 'Comfortable stay in Tirupati town before heading uphill',
        whyRecommended: 'Srinivasam (opp. RTC Bus Stand), Vishnu Nivasam (opp. Railway Station), and Madhavam Rest House offer spot booking and direct hill buses.'
      }
    ],
    procedureTimeline: [
      { 
        stepNumber: 1, 
        title: 'Check Online Quota or Reach CRO Early', 
        description: 'Book online up to 3 months in advance with your darshan ticket, or arrive at CRO by 3:00 AM – 4:00 AM for offline ₹100/₹500 spot cottages.',
        whyThisStep: 'Budget rooms sell out quickly; planning early ensures your family gets comfortable lodging without stress.'
      },
      { 
        stepNumber: 2, 
        title: 'Carry Original Physical Aadhaar Cards', 
        description: 'Original Aadhaar cards of all staying pilgrims are compulsory. Staff conducts live facial biometric verification.',
        whyThisStep: 'Prevents touts and unauthorized middlemen from hoarding rooms under fake or duplicate identities.'
      },
      { 
        stepNumber: 3, 
        title: 'Pay Room Rent & Refundable Caution Deposit', 
        description: 'Pay the official room tariff plus a standard caution deposit (e.g. ₹500 or ₹1,000) via UPI, card, or cash.',
        whyThisStep: 'Caution deposit protects TTD assets and is promptly refunded to your bank account/card upon checkout.'
      },
      { 
        stepNumber: 4, 
        title: 'Collect Sub-Office Allotment Slip & Keys', 
        description: 'CRO issues an allotment slip directing you to a sub-office (e.g., ATC, SNC, TB, or Rambagicha) where the keys are handed over.',
        whyThisStep: 'Decentralized sub-offices handle cottage inspections and maintenance locally across the hill.'
      },
      { 
        stepNumber: 5, 
        title: 'Rooms Full? Head to Free PAC Halls or Tirupati', 
        description: 'If all paid rooms are exhausted, proceed directly to PAC-1 to PAC-4 free halls on the hill or take a bus to Srinivasam in Tirupati.',
        whyThisStep: 'Guarantees clean, safe, and secure shelter with bathrooms and lockers without paying private hotel surge prices.'
      }
    ],
    requirements: {
      carry: ['Original Physical Aadhaar Cards of all pilgrims', 'Valid Darshan Ticket Printout (for online quota)', 'Refundable Caution Deposit (UPI / Card / Cash)'],
      prohibited: ['Unauthorized brokers / touts (Strictly illegal; book only at official CRO)', 'Holding multiple rooms on single Aadhaar (Max 1 room per 30 days)', 'Cooking inside cottage rooms (Banned for fire safety)'],
      mandatoryDoc: 'Original Aadhaar Card Compulsory (Biometric Facial Scan)'
    },
    tips: [
      'Online Booking Rule: You must have a confirmed Tirumala darshan or seva ticket (for at least 2 pilgrims) linked to your mobile login to book hilltop accommodation.',
      '30-Day Quota Limit: A pilgrim can book only one TTD room every 30 days across all mobile logins and Aadhaar profiles.',
      'CRO Walk-in Strategy: Offline counters open early morning, but ₹100 budget rooms run out rapidly. Queuing by 3:00 AM to 4:00 AM yields the highest chance of securing a budget cottage.',
      'Facial Recognition: All adult pilgrims checking into the room must be present physically at the CRO or sub-office counter for biometric facial verification.',
      'Downhill Fallback: If hilltop cottages are fully occupied, take a Dharma Ratham or APSRTC bus to Tirupati town and stay at Srinivasam, Vishnu Nivasam, or Madhavam rest houses.'
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
    question: 'Where can I get free meals in Tirumala and what are the exact timings?',
    answer: 'Free satvik meals are served at Matrusri Tarigonda Vengamamba Complex: Breakfast (8:30–10:30 AM), Lunch (10:30 AM–4:00 PM), Dinner (5:00–11:00 PM). Free food packets, buttermilk, and milk are also distributed continuously inside VQC queue compartments. Zero tokens or tickets needed.',
    category: 'Facilities',
    searchAliases: ['food', 'meals', 'lunch', 'dinner', 'free', 'annaprasadam', 'eat', 'timings', 'vengamamba']
  },
  {
    id: 'faq-hair',
    question: 'Where is hair offering (Kalyanakatta / Mundan) done and is it free?',
    answer: 'Available 24/7 at Main Kalyanakatta (opp. Annadhanam) and 9 satellite mini-centers near rest houses. 100% free with new sealed blades, trained barbers, and adjoining free hot-water shower baths. Never pay tips to barbers.',
    category: 'Facilities',
    searchAliases: ['hair', 'tonsure', 'kalyana katta', 'kalyanakatta', 'barber', 'shaving', 'blade', 'mundan', 'hot bath']
  },
  {
    id: 'faq-room',
    question: 'How do I book accommodation in Tirumala and what if cottages are sold out?',
    answer: 'Book online up to 3 months in advance via the official TTD portal (requires Darshan ticket, max 1 room/Aadhaar/30 days). Daily offline budget rooms (₹100/₹500) are allotted at CRO counters (queue by 3–4 AM with original Aadhaar). If sold out, free carpeted PAC dormitories (1–4) and downhill Tirupati complexes (Vishnu/Srinivasam) are guaranteed backups.',
    category: 'Facilities',
    searchAliases: ['room', 'rooms', 'cro', 'accommodation', 'dormitory', 'sleep', 'stay', 'aadhaar', 'booking', 'cottage', 'tirupati']
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
