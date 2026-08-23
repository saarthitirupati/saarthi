import { DarshanDetail } from '../types/darshan';

export const darshanRegistry: Record<string, DarshanDetail> = {
  "sarva-darshan": {
    id: "sarva-darshan",
    title: "Sarva Darshan",
    teluguTitle: "సర్వ దర్శనం",
    badge: "Free General Queue",
    badgeTelugu: "ఉచిత సాధారణ దర్శనం",
    themeColor: "#D97706",
    accentGradient: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
    cost: "Free (No Prior Booking / Token Required)",
    waitTime: "8 - 14 hours",
    peakHours: "Daily 8:00 AM – 7:00 PM (Highest on Fri, Sat, Sun & Festivals)",
    bestTimeToVisit: "Tuesdays & Wednesdays between 11:00 PM – 4:00 AM (Least rush)",
    entryGate: "Vaikuntam Queue Complex II (VQC-II), Tirumala",
    bookingMode: "Direct Walk-in (No ticket or token needed)",
    description: "Sarva Darshan translates to 'Darshan for All'. It is the revered, completely free queue channel open round the clock to all pilgrims without advance online reservations or offline tokens. Pilgrims are accommodated in 31 sequential holding compartments in VQC-II, equipped with free meals, beverages, and medical amenities.",
    whyWaitTimeExplanation: "Wait time directly correlates to the number of active VQC-II compartments occupied (approx. 45-60 mins per compartment release) and intermittent priority clearances for VIP/Seva slots.",
    
    accessibility: [
      "Wheelchair ramp access is available at designated entry points, with dedicated attendant pathways.",
      "Dedicated infant feeding and resting cabins inside compartments for mothers with infants under 1 year.",
      "Senior citizen priority is strictly managed during non-festival designated morning hours."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Purified RO drinking water points every 10 meters inside holding halls." },
      { type: 'food', available: true, notes: "Free hot Annaprasadam (Sambar rice, Curd rice), hot milk, and tea served round the clock." },
      { type: 'restroom', available: true, notes: "Clean, continuously sanitized restrooms and wash areas attached to each compartment." },
      { type: 'medical', available: true, notes: "24x7 TTD Medical booths with doctors, emergency paramedics, and first-aid kits." },
      { type: 'infant', available: true, notes: "Free warm milk distribution specifically prioritized for babies and infants." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: Traditional Dhoti / Pancha with Angavastram, or Kurta-Pyjama",
        "Women: Saree, Half-Saree, or Chudidar / Salwar Kameez with Dupatta"
      ],
      prohibited: [
        "Shorts, T-Shirts, Jeans, Bermudas, Track Pants",
        "Sleeveless tops, Mini-skirts, Modern western casuals"
      ],
      exceptions: "Children under 10 years are permitted neat casual clothing. Medical footwear permitted up to outer locker bays."
    },
    journeySteps: [
      { 
        step: 1, 
        title: "Report at VQC-II Entry Gate", 
        desc: "Arrive at the main Vaikuntam Queue Complex II arch. Free shoe keeper and locker counters available outside.",
        estimatedTime: "15 - 30 Mins"
      },
      { 
        step: 2, 
        title: "Luggage & Electronic Security Scanning", 
        desc: "Strict biometric and baggage screening. Phones, smartwatches, cameras, and metal objects must be deposited.",
        estimatedTime: "20 - 40 Mins"
      },
      { 
        step: 3, 
        title: "Compartment Seating & Refreshment", 
        desc: "Pilgrims enter numbered compartments. Enjoy continuous free hot meals, drinking water, and spiritual broadcasts.",
        estimatedTime: "6 - 10 Hours"
      },
      { 
        step: 4, 
        title: "Overhead Covered Foot Bridge (VQC to Temple)", 
        desc: "Gates open progressively into the stainless-steel bridge corridor heading into the Anand Nilayam temple perimeter.",
        estimatedTime: "45 - 60 Mins"
      },
      { 
        step: 5, 
        title: "Sanctum Sanctorum (Garbhagriha) Srivari Darshan", 
        desc: "Move through the Jaya-Vijaya dwara into the inner sanctum for the divine darshan of Lord Sri Venkateswara.",
        estimatedTime: "10 - 20 Mins"
      },
      { 
        step: 6, 
        title: "Free Laddu Prasadam Collection", 
        desc: "Collect your complimentary Laddu at the Potu distribution counters using your barcode slip.",
        estimatedTime: "15 Mins"
      }
    ],
    rulesAndRequirements: [
      "No physical ticket or advance reservation is required.",
      "Original Aadhaar card or Government Photo ID is recommended for security verification.",
      "Luggage should be deposited at free TTD luggage counters before entering the main queue.",
      "Footwear must be deposited at free shoe stalls near VQC-II."
    ],
    guidelines: [
      "Carry prescribed prescription medicines inside the queue complex.",
      "Wear traditional ethnic attire from the start as dress inspection is strict at Entry Gate 1.",
      "Follow announcements regarding compartment gate release times."
    ],
    tips: [
      "Best arrival windows are late nights (11:00 PM - 2:00 AM) to minimize daytime waiting.",
      "Keep lightweight warm shawls if queueing during winter or night hours."
    ]
  },

  "special-entry": {
    id: "special-entry",
    title: "₹300 Special Entry Darshan (SED)",
    teluguTitle: "₹300 ప్రత్యేక ప్రవేశ దర్శనం (ఆన్‌లైన్ స్లాట్)",
    badge: "Online Booked Slot",
    badgeTelugu: "ముందస్తు ఆన్‌లైన్ బుకింగ్",
    themeColor: "#4F46E5",
    accentGradient: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #6366F1 100%)",
    cost: "₹300 per pilgrim (Advance Online Booking Only)",
    waitTime: "2 - 4 hours",
    peakHours: "10:00 AM – 4:00 PM slots (High congestion near ATC car parking)",
    bestTimeToVisit: "Early morning slots (9:00 AM) or late evening slots (6:00 PM – 9:00 PM)",
    entryGate: "ATC Car Parking / Supatham Entry Point, Tirumala",
    bookingMode: "Advance Online Reservation via official website (ttdevasthanams.ap.gov.in)",
    description: "Special Entry Darshan (SED / ₹300 Ticket) was introduced to provide an expedited, fixed-slot darshan experience for devotees planning in advance. Pilgrims book a specific 1-hour reporting window on the official TTD portal and experience direct streamlined access into the inner temple corridor.",
    whyWaitTimeExplanation: "Wait time is regulated by allocated slot batches. Delays only occur during auspicious Kainkaryam rituals or VIP protocol merges inside the inner sanctum.",
    
    accessibility: [
      "Bypasses 90% of outer holding warehouses, minimizing standing fatigue significantly.",
      "Wheelchair assistance is supported up to the silver door (Vendi Vakili) upon prior request at ATC gate."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Cold and hot mineral water dispensers stationed throughout the queue corridor." },
      { type: 'food', available: true, notes: "Light snacks and hot beverages provided in holding sheds during peak delays." },
      { type: 'restroom', available: true, notes: "Modern restrooms located at ATC entry and midway through the queue." },
      { type: 'medical', available: true, notes: "First-aid assistance booth right next to the biometric verification desk." },
      { type: 'infant', available: true, notes: "Infants under 1 year permitted along with parents through the designated lane." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: Plain White Dhoti with border / Kurta-Pyjama (Traditional Indian)",
        "Women: Saree, Half-Saree, or Chudidar with Dupatta pinned neatly"
      ],
      prohibited: [
        "Western clothes, Jeans, Shorts, T-Shirts, Capris, Cargos",
        "Western printed graphics or sleeveless tops strictly forbidden"
      ],
      exceptions: "Strict adherence required. Inappropriate attire leads to entry denial at barcode scanning."
    },
    journeySteps: [
      { 
        step: 1, 
        title: "Report at ATC Entry Point", 
        desc: "Arrive 30 minutes before your printed slot time at the ATC Car Parking complex.",
        estimatedTime: "15 Mins"
      },
      { 
        step: 2, 
        title: "Ticket Barcode & ID Scan", 
        desc: "Security scans your printed/digital SED e-ticket and verifies your original Aadhaar/Passport.",
        estimatedTime: "10 - 20 Mins"
      },
      { 
        step: 3, 
        title: "Fast-Track Dedicated Corridor", 
        desc: "Walk along the covered, climate-buffered SED corridor directly bypassing the general VQC warehouses.",
        estimatedTime: "45 - 90 Mins"
      },
      { 
        step: 4, 
        title: "Sanctum Progression (Mahadwaram)", 
        desc: "Enter the grand temple gates into the inner prakaram and proceed directly towards Sri Srivari Garbhagriha.",
        estimatedTime: "20 - 30 Mins"
      },
      { 
        step: 5, 
        title: "Srivari Laddu Prasadam Counter", 
        desc: "Each ₹300 ticket includes 1 free delicious Tirumala Laddu prasadam redeemable at dedicated SED counters.",
        estimatedTime: "10 Mins"
      }
    ],
    rulesAndRequirements: [
      "Physical printout or clear digital copy of the ₹300 SED confirmation with QR code is mandatory.",
      "The exact original Government Photo ID (Aadhaar / Voter ID / Passport) used at the time of booking MUST be presented.",
      "Reporting after the slot closing grace period (usually +45 mins) will lead to ticket invalidation.",
      "1 Complimentary Laddu included per ticket."
    ],
    guidelines: [
      "Do not carry mobile phones or cameras past the ATC luggage locker booths.",
      "Book early: SED monthly quotas typically open in the 3rd or 4th week of the preceding month at 10:00 AM IST."
    ],
    tips: [
      "Plan parking at ATC or near Rambagicha for quickest foot commute to the gate.",
      "Book morning slots (8:00 AM - 10:00 AM) to experience fastest sanctum clearing."
    ]
  },

  "ssd-token": {
    id: "ssd-token",
    title: "SSD Token Darshan",
    teluguTitle: "SSD టోకెన్ దర్శనం (స్లాటెడ్ సర్వదర్శనం)",
    badge: "Time-Slotted Free Darshan",
    badgeTelugu: "ఉచిత సమయ స్లాట్ టోకెన్లు",
    themeColor: "#E11D48",
    accentGradient: "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 50%, #E11D48 100%)",
    cost: "Free (Biometric Aadhaar Token Required)",
    waitTime: "3 - 6 hours (at allotted slot)",
    peakHours: "Tokens issue starts early morning (usually 2:00 AM); quotas often exhaust by 7:00 AM – 11:00 AM",
    bestTimeToVisit: "Reach token counters in Tirupati by 2:00 AM – 4:00 AM to secure a same-day or next-day morning slot",
    entryGate: "Vaikuntam Queue Complex / Designated SSD entry line in Tirumala at allotted time slot",
    bookingMode: "Offline In-Person Biometric Scan at Tirupati Token Counters",
    tokenLocations: [
      {
        name: "Vishnu Nivasam Complex",
        landmark: "Directly opposite Tirupati Main Railway Station (Platform 1 Exit)",
        counterHours: "Opens at 2:00 AM daily (until quota lasts)",
        quotaInfo: "High-capacity counter; fills quickly due to train arrivals"
      },
      {
        name: "Srinivasam Complex",
        landmark: "Opposite Tirupati Central RTC Bus Station, Tirupati",
        counterHours: "Opens at 2:00 AM daily (until quota lasts)",
        quotaInfo: "Primary counter for bus passengers with multi-lane biometric desks"
      },
      {
        name: "Bhudevi Complex",
        landmark: "Alipiri Foot of the Hills (Alipiri Bypass Bus Stop)",
        counterHours: "Opens at 2:00 AM daily (until quota lasts)",
        quotaInfo: "Recommended for private vehicle travelers and footpath pilgrims"
      }
    ],
    description: "Slotted Sarva Darshan (SSD) tokens are free biometric tokens issued in Tirupati to prevent pilgrims from having to wait 12-20 hours in standing holding halls. Devotees receive a token stamped with an exact reporting time slot, allowing them to explore Tirupati or rest before reporting to Tirumala.",
    whyWaitTimeExplanation: "Once you receive an SSD token, you only wait 3-5 hours in Tirumala during your specific allotted reporting window instead of the 10-15+ hours endured in general Sarva Darshan.",
    
    accessibility: [
      "Significantly reduces continuous standing queue time for families and seniors compared to free Sarva Darshan.",
      "Dedicated token counters for senior citizens and differently-abled pilgrims at Srinivasam & Vishnu Nivasam."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Drinking water stations available at all Tirupati token centers and Tirumala queue lines." },
      { type: 'food', available: true, notes: "Free Annaprasadam and breakfast served at Tirupati choultries and inside Tirumala queue." },
      { type: 'restroom', available: true, notes: "Spacious restrooms available at token centers and inside Tirumala compartments." },
      { type: 'medical', available: true, notes: "24/7 first-aid stations operational at Vishnu Nivasam and Srinivasam complexes." },
      { type: 'infant', available: true, notes: "Milk provided for infants at Tirupati waiting bays and inside Tirumala VQC." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: Dhoti, Kurta, Pancha, Pyjama",
        "Women: Saree, Half-Saree, Chudidar with Dupatta"
      ],
      prohibited: [
        "Jeans, T-Shirts, Western casuals, Shorts"
      ],
      exceptions: "Normal casuals are allowed while collecting the token in Tirupati, but STRICT traditional dress is enforced upon entry in Tirumala."
    },
    journeySteps: [
      { 
        step: 1, 
        title: "Collect SSD Token in Tirupati", 
        desc: "Visit Vishnu Nivasam, Srinivasam, or Bhudevi complex early morning. Undergo live photo & Aadhaar biometric scan.",
        estimatedTime: "30 - 90 Mins"
      },
      { 
        step: 2, 
        title: "Rest or Travel up to Tirumala", 
        desc: "Relax in Tirupati or ascend to Tirumala via ghat road or footpath 2-3 hours ahead of your slotted time.",
        estimatedTime: "2 - 4 Hours"
      },
      { 
        step: 3, 
        title: "Report at Designated Entry at Slotted Time", 
        desc: "Report at the specified SSD queue gate at the exact slot printed on your biometric token slip.",
        estimatedTime: "15 Mins"
      },
      { 
        step: 4, 
        title: "Security Scan & Token Barcode Verification", 
        desc: "Biometric authentication matches the fingerprint taken during token collection in Tirupati.",
        estimatedTime: "20 Mins"
      },
      { 
        step: 5, 
        title: "Short Compartment Holding & Srivari Darshan", 
        desc: "Fast-tracked through minimal compartments into the Garbhagriha for the darshan of Lord Venkateswara.",
        estimatedTime: "2.5 - 4 Hours"
      },
      { 
        step: 6, 
        title: "Collect Laddu Prasadam", 
        desc: "Obtain your complimentary Laddu prasadam from the laddu complex counters using your token.",
        estimatedTime: "15 Mins"
      }
    ],
    rulesAndRequirements: [
      "ORIGINAL Aadhaar Card is MANDATORY for every individual (including children above 5 years) for biometric authentication.",
      "Physical presence of each pilgrim is required at the counter — one person cannot collect tokens on behalf of absent family members.",
      "A pilgrim who receives an SSD token cannot take another token within 30 days.",
      "Tokens are issued for same-day and following-day slots depending on daily TTD quota availability."
    ],
    guidelines: [
      "Arrive at the token counters in Tirupati before 3:00 AM as queues form well before opening.",
      "Do not buy tokens from unauthorized touts or middlemen — biometric scanning makes tokens strictly non-transferable."
    ],
    tips: [
      "Bhudevi Complex at Alipiri generally has shorter wait lines than the station-facing Vishnu Nivasam.",
      "Check our live SSD Token Monitor before heading to counters to verify real-time counter status and quota balance."
    ]
  },

  "divya-darshan": {
    id: "divya-darshan",
    title: "Divya Darshan (Footpath Trek)",
    teluguTitle: "దివ్య దర్శనం (నడకదారి భక్తులు)",
    badge: "Footpath Trekking Quota",
    badgeTelugu: "మెట్ల మార్గం టోకెన్",
    themeColor: "#059669",
    accentGradient: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 50%, #059669 100%)",
    cost: "Free (Biometric Trekking Token)",
    waitTime: "4 - 6 hours",
    peakHours: "Srivari Mettu & Alipiri Mettu footpath checkpoints",
    bestTimeToVisit: "Early morning trek starts (4:00 AM – 6:00 AM)",
    entryGate: "Alipiri Mettu / Srivari Mettu Footpath checkposts",
    bookingMode: "Midway Biometric Token along Trekking Footpaths",
    description: "Divya Darshan is reserved exclusively for devout pilgrims who trek on foot up the Seven Hills via either the historic Alipiri Mettu (9 km, ~3,550 steps) or Srivari Mettu (2.1 km, ~2,388 steps) pathways.",
    
    accessibility: [
      "Not recommended for senior citizens with heart or knee ailments due to steep physical incline.",
      "Free luggage transport service conveys pilgrim baggage from Alipiri base directly to Tirumala hilltop."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Filtered water taps provided every 50 steps along the entire climb." },
      { type: 'food', available: true, notes: "Free buttermilk, snacks, and fruits distributed along the route." },
      { type: 'restroom', available: true, notes: "Public toilets and resting gazebos located at regular intervals." },
      { type: 'medical', available: true, notes: "Emergency medical posts with glucose, bandages, and ambulance support." },
      { type: 'infant', available: true, notes: "Baby food and hot milk points available at intermediate stations." }
    ],
    dressCodeRules: {
      allowed: [
        "Traditional or decent comfortable attire suitable for climbing steps.",
        "Men: Dhoti, Kurta, Pancha. Women: Saree, Salwar Kameez."
      ],
      prohibited: [
        "Shorts, sleeveless, offensive or transparent clothing"
      ],
      exceptions: "Comfortable trekking footwear permitted for the climb; must be deposited at Tirumala shoe counters before queue entry."
    },
    journeySteps: [
      { step: 1, title: "Start Trek at Alipiri or Srivari Mettu", desc: "Begin your sacred climb with your baggage deposited at free TTD luggage transit counters.", estimatedTime: "2 - 4 Hours" },
      { step: 2, title: "Biometric Token Issue Checkpoint", desc: "Scan Aadhaar and receive your Divya Darshan token midway along the steps (Galigopuram or 1200th step).", estimatedTime: "15 Mins" },
      { step: 3, title: "Reach Tirumala Hilltop & Refresh", desc: "Collect your deposited luggage at Tirumala, freshen up, and wear traditional dress.", estimatedTime: "1 Hour" },
      { step: 4, title: "Report to Divya Darshan Queue Line", desc: "Enter via the dedicated Divya Darshan holding compartments at VQC.", estimatedTime: "3 - 5 Hours" }
    ],
    guidelines: [
      "Tokens are subject to daily quota limits (typically 10,000 for Alipiri and 5,000 for Srivari Mettu).",
      "Carry Aadhaar card and sufficient drinking water during the climb."
    ],
    tips: [
      "Srivari Mettu is much shorter and steeper (approx. 1.5 - 2 hours) compared to Alipiri (3.5 - 5 hours)."
    ]
  },

  "vip-break": {
    id: "vip-break",
    title: "VIP Break Darshan",
    teluguTitle: "విఐపి బ్రేక్ దర్శనం (శ్రీవాణి ట్రస్ట్)",
    badge: "SRIVANI & Protocol Access",
    badgeTelugu: "శ్రీవాణి ట్రస్ట్ / ప్రోటోకాల్",
    themeColor: "#9333EA",
    accentGradient: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 50%, #9333EA 100%)",
    cost: "SRIVANI Trust: ₹10,000 Donation + ₹500 Darshan Ticket",
    waitTime: "1 - 2.5 hours",
    peakHours: "Morning 6:00 AM – 8:30 AM & Afternoon break slots",
    bestTimeToVisit: "Morning VIP slot following Suprabhata / Tomala Seva",
    entryGate: "Vaikuntam Queue Complex I (VQC-I), Tirumala",
    bookingMode: "Online via TTD Portal (SRIVANI Donation) or Official Protocol Letter",
    description: "VIP Break Darshan provides premium, expedited access to the sanctum. It is accessible either through official government protocol recommendations or through the widely popular SRIVANI Trust donation scheme.",
    
    accessibility: [
      "Shortest physical walking distance and direct queue access.",
      "Full priority assistance for elderly donors and dignitaries."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Air-conditioned premium lounges with continuous mineral water and beverage service." },
      { type: 'restroom', available: true, notes: "Executive clean restrooms located inside VQC-I lounge." },
      { type: 'medical', available: true, notes: "Priority medical attention and on-call medical officers." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: Strictly White Pancha / Dhoti with Angavastram, or Kurta-Pyjama",
        "Women: Strictly Traditional Saree with blouse, or Chudidar with Dupatta"
      ],
      prohibited: [
        "Any western attire, colored denim, t-shirts, modern casuals (Strictly Zero Tolerance)"
      ],
      exceptions: "No exceptions under any circumstances. Dress inspectors verify every devotee."
    },
    journeySteps: [
      { step: 1, title: "Report at VQC-I Lounge", desc: "Report at the designated Vaikuntam Queue Complex I lounge 30 minutes prior to assigned VIP slot.", estimatedTime: "15 Mins" },
      { step: 2, title: "Donation Receipt & Aadhaar Scan", desc: "Verify SRIVANI donation receipt, e-ticket barcode, and original ID.", estimatedTime: "10 Mins" },
      { step: 3, title: "Direct Sanctum Corridor", desc: "Bypass outer holding compartments and enter the temple directly via Mahadwaram.", estimatedTime: "30 - 45 Mins" },
      { step: 4, title: "Near-Sanctum Divya Darshan", desc: "Experience intimate, peaceful darshan from the Kulasekhara Padi / inner perimeter.", estimatedTime: "15 Mins" }
    ],
    guidelines: [
      "Smartphones, smartwatches, and all electronics must be deposited in VIP lounge lockers.",
      "Strict punctuality is enforced; latecomers are not admitted into subsequent VIP batches."
    ],
    tips: [
      "The SRIVANI Trust online quota offers transparent, verified booking without depending on political recommendations."
    ]
  }
};

