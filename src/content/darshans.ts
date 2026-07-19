import { DarshanDetail } from '../types/darshan';

export const darshanRegistry: Record<string, DarshanDetail> = {
  "sarva-darshan": {
    id: "sarva-darshan",
    title: "Sarva Darshan",
    cost: "Free (No Token Required)",
    waitTime: "10 hours",
    description: "Sarva Darshan translates literally to 'Darshan for all'. This is the completely free queue channel open to any and all pilgrims visiting the shrine without prior online registrations. Pilgrims pass through the Vaikuntam Queue Complex II warehouses sequentially.",
    
    accessibility: [
      "Wheelchair assistance is available at specialized entry points, but not continuously throughout the main VQC compartments.",
      "Dedicated waiting areas for parents with infants (below 1 year) are occasionally activated based on crowd dynamics."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Continuous safe drinking water supply inside compartments." },
      { type: 'food', available: true, notes: "Free meals (Annaprasadam) and milk/coffee served at fixed intervals, but do not rely on it as a guaranteed immediate meal." },
      { type: 'restroom', available: true, notes: "Basic restrooms attached to each waiting warehouse." },
      { type: 'medical', available: true, notes: "Emergency medical counters available outside the main VQC blocks." },
      { type: 'infant', available: true, notes: "Milk provided for infants during long holding periods." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: Dhoti, Kurta, Pyjama",
        "Women: Saree, Half-Saree, Chudidar with Dupatta"
      ],
      prohibited: [
        "Shorts, T-Shirts, Jeans, Trackpants",
        "Sleeveless tops, Western wear"
      ],
      exceptions: "Medical exceptions for specialized footwear require prior clearance."
    },
    journeySteps: [
      { step: 1, title: "Entry at VQC-II", desc: "Report at the massive Vaikuntam Queue Complex II outside the main temple zone." },
      { step: 2, title: "Security & Scanning", desc: "Deposit all electronics and undergo strict physical screening." },
      { step: 3, title: "Compartment Holding", desc: "Wait inside locked halls. This is where you will spend 80% of your time." },
      { step: 4, title: "Bridge & Sanctum", desc: "Cross the bridge into the main temple, moving rapidly toward the Garbhagriha." }
    ],

    guidelines: [
      "Electronic devices, smart watches, and footwear are barred beyond the central holding complex gates."
    ],
    tips: [
      "Try to enter the compartments late at night or early hours of weekdays to optimize your moving pace."
    ]
  },
  "special-entry": {
    id: "special-entry",
    title: "Special Entry Darshan (Rs. 300)",
    cost: "Rs. 300 per person",
    waitTime: "2-3 hours",
    description: "The Special Entry Darshan (SED) was introduced to provide a quicker darshan experience for pilgrims. Tickets must be booked online well in advance through the official TTD portal, as quotas fill up rapidly.",
    
    accessibility: [
      "Separate queues can sometimes be arranged for senior citizens and the physically challenged at a specific time slot (usually afternoon)."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Drinking water stations along the ATC queue line." },
      { type: 'restroom', available: true, notes: "Available before scanning and occasionally inside." },
      { type: 'medical', available: true, notes: "Medical assistance on standby near the ATC entrance." }
    ],
    dressCodeRules: {
      allowed: [
        "Men: White Dhoti/Kurta",
        "Women: Saree, Chudidar with Dupatta"
      ],
      prohibited: [
        "Jeans, T-shirts, strictly enforced at scanning."
      ],
      exceptions: "Children under 12 have slightly relaxed rules, but traditional wear is still recommended."
    },
    journeySteps: [
      { step: 1, title: "ATC Car Parking", desc: "Report at the Special Entry gate near the ATC Car Parking area 30 mins before your slot." },
      { step: 2, title: "Ticket Verification", desc: "Scan your printed ticket and show matching original ID." },
      { step: 3, title: "Queue Merge", desc: "The line eventually merges with the main darshan flow near the inner temple." },
      { step: 4, title: "Darshan", desc: "Quick progression through the sanctum." }
    ],

    guidelines: [
      "Must carry the original ID proof used during the ticket booking."
    ],
    tips: [
      "Book your tickets exactly when the quota opens (usually 2-3 months in advance)."
    ]
  },
  "divya-darshan": {
    id: "divya-darshan",
    title: "Divya Darshan (Footpath)",
    cost: "Free (Token Required)",
    waitTime: "4-6 hours",
    description: "Divya Darshan is reserved exclusively for pilgrims who trek to Tirumala on foot either via the Alipiri Mettu or Srivari Mettu pathways. Biometric tokens are issued along the trekking routes.",
    
    accessibility: [
      "Not recommended for elderly or those with medical conditions due to the strenuous physical climb."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Water available all along the trekking routes." },
      { type: 'food', available: true, notes: "Stalls sell food along Alipiri; Srivari Mettu has fewer options." },
      { type: 'restroom', available: true, notes: "Public toilets located at intervals on the steps." },
      { type: 'medical', available: true, notes: "First aid centers and emergency ambulances located at strategic points on the trek." }
    ],
    dressCodeRules: {
      allowed: [
        "Comfortable ethnic wear suitable for trekking.",
        "Men: Dhoti, Kurta. Women: Saree, Salwar."
      ],
      prohibited: [
        "Shorts, offensive attire."
      ],
      exceptions: "Sports shoes are permitted for the trek, but must be deposited before entering the temple queue."
    },
    journeySteps: [
      { step: 1, title: "Start Trek", desc: "Begin at Alipiri (9km) or Srivari Mettu (2.1km)." },
      { step: 2, title: "Biometric Token", desc: "Scan your Aadhar and take a photo midway to receive your Divya Darshan token." },
      { step: 3, title: "Reach Tirumala", desc: "Deposit luggage and rest before reporting to the VQC complex." },
      { step: 4, title: "Darshan Entry", desc: "Enter via the designated Divya Darshan queue lines." }
    ],

    guidelines: [
      "Tokens are issued subject to availability and daily quotas."
    ],
    tips: [
      "Srivari Mettu is shorter and takes less time to climb compared to Alipiri."
    ]
  },
  "vip-break": {
    id: "vip-break",
    title: "VIP Break Darshan",
    cost: "Varies (SRIVANI Trust: Rs. 10,000 + Rs. 500)",
    waitTime: "1-2 hours",
    description: "VIP Break Darshan provides the fastest access to the deity. It is available through recommendation letters or by making a qualifying donation to the SRIVANI Trust.",
    
    accessibility: [
      "Easiest physical access with the least amount of waiting and crowding."
    ],
    facilities: [
      { type: 'water', available: true, notes: "Premium waiting areas have access to water." },
      { type: 'restroom', available: true, notes: "Clean, accessible restrooms available." }
    ],
    dressCodeRules: {
      allowed: [
        "Strictly Men: White Pancha, Dhoti or Kurta-Pyjama.",
        "Strictly Women: Saree with blouse, Punjabi Dress with Dupatta."
      ],
      prohibited: [
        "Any Western wear. Absolutely no exceptions."
      ],
      exceptions: "None."
    },
    journeySteps: [
      { step: 1, title: "VQC-I Reporting", desc: "Report to Vaikuntam Queue Complex I at the exact time assigned." },
      { step: 2, title: "ID & Receipt Verification", desc: "Show your donation receipt and matching Aadhar card." },
      { step: 3, title: "Direct Entry", desc: "Bypass standard holding compartments and walk directly to the temple." },
      { step: 4, title: "Extended Darshan", desc: "Experience a slightly longer, less crowded view of the deity." }
    ],

    guidelines: [
      "Photography and electronic gadgets are strictly prohibited."
    ],
    tips: [
      "The SRIVANI Trust route is the most reliable way to secure VIP darshan without political recommendations."
    ]
  }
};
