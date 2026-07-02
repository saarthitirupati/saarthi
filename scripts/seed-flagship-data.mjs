import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join('=').trim();
    }
  });
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("No DATABASE_URL found in .env.local");
  process.exit(1);
}

const db = new Client({ connectionString });

const FLAGSHIP_UPDATES = {
  'venkateswara': {
    deity: 'Lord Venkateswara (Balaji)',
    deityType: 'Swayambhu (Self-Manifested)',
    architecture: 'Classical Dravidian architecture featuring towering gopurams, pillared mandapams, and the golden Ananda Nilayam vimana over the sanctum sanctorum.',
    importance: 'The pre-eminent spiritual center of India, regarded as the earthly home of Lord Vishnu (Kali Yuga Vaikuntha).',
    builtBy: 'Patronized over centuries by Pallavas, Cholas, Pandyas, and the Vijayanagara Empire.',
    breakTimings: [{ from: '12:00', to: '13:00' }, { from: '18:00', to: '19:00' }],
    rituals: {
      daily: ['Suprabhatam (Waking ritual)', 'Thomala Seva (Garland ritual)', 'Archana (Name chanting)', 'Kalyanotsavam (Divine marriage)', 'Ekanta Seva (Sleeping ritual)'],
      weekly: ['Visesha Pooja (Monday)', 'Sahasra Kalasabhishekam (Wednesday)', 'Abhishekam (Friday)'],
      annual: ['Srivari Brahmotsavams (Sep/Oct)', 'Vaikunta Ekadasi (Dec/Jan)', 'Rathasapthami (Feb)'],
      sevas: ['Vasanthotsavam', 'Arjitha Brahmotsavam', 'Sahasra Deepalankara Seva']
    },
    facilities: {
      locker: 'Free TTD lockers at various centers in Tirumala.',
      toilets: 'Clean public restrooms available throughout the queue lines.',
      drinkingWater: 'Free purified drinking water (Jaladhara) counters.',
      wheelchair: 'Free wheelchair service and dedicated entry for senior citizens/differently-abled.',
      parking: 'Large parking zones at Alipiri (foot of hills) and multiple zones in Tirumala.',
      food: 'Free unlimited vegetarian Annaprasadam at the massive Tarigonda Vengamamba Hall.'
    }
  },
  'govindaraja': {
    deity: 'Lord Govindaraja Swamy (Lord Vishnu in reclining posture)',
    deityType: 'Pratishtha (Consecrated)',
    architecture: 'Grand Dravidian architecture with a spectacular 7-story outer Gopuram, fine stone-cut friezes, and expansive inner courtyards.',
    importance: 'The main temple of Tirupati town, serving as the focal point for traditional city festivals.',
    builtBy: 'Consecrated by the great Vaishnava saint Ramanujacharya in 1130 AD.',
    breakTimings: [{ from: '13:00', to: '16:00' }],
    rituals: {
      daily: ['Suprabhatam', 'Thomala Seva', 'Archana', 'Nivedana', 'Ekanta Seva'],
      weekly: ['Abhishekam (Friday)'],
      annual: ['Govindaraja Swamy Brahmotsavams (May/June)']
    },
    facilities: {
      locker: 'Available near the temple entrance.',
      toilets: 'Restrooms available inside the temple outer complex.',
      drinkingWater: 'Water filters placed inside the courtyards.',
      wheelchair: 'Ramps provided at major thresholds; wheelchairs available on request.',
      parking: 'Limited street parking; TTD Municipal Parking available nearby.',
      food: 'Prasadam counters selling laddus, pulihora, and vada.'
    }
  },
  'kapila-theertham': {
    deity: 'Lord Kapileswara Swamy (Lord Shiva)',
    deityType: 'Swayambhu Linga (Self-Manifested)',
    architecture: 'Ancient rock-cut cave temple style set dramatically at the foot of Seshachalam hills, where the Kapiladhar waterfall descends into a sacred pushkarini.',
    importance: 'The only major temple dedicated to Lord Shiva in the Tirupati region. Taking a dip in the holy pond is believed to cleanse all sins.',
    builtBy: 'Constructed by Pallava Kings, later enhanced by Chola and Vijayanagara rulers.',
    breakTimings: [{ from: '12:30', to: '15:30' }],
    rituals: {
      daily: ['Abhishekam (Water, milk, honey)', 'Archana', 'Maha Mangala Aarti'],
      weekly: ['Pradosha Pooja (Bi-weekly)'],
      annual: ['Maha Shivaratri (Feb/March)', 'Kartika Deepam (Nov/Dec)']
    },
    facilities: {
      locker: 'Not available; visitors must take care of belongings.',
      toilets: 'Restrooms available near the entrance.',
      drinkingWater: 'Available near the administrative office.',
      wheelchair: 'Limited accessibility due to numerous stone steps leading to the pond.',
      parking: 'Dedicated parking ground in front of the temple.',
      food: 'Local snack vendors and hotels outside the temple gates.'
    }
  },
  'iskcon-tirupati': {
    deity: 'Sri Sri Radha Govinda (Lord Krishna & Radha Devi)',
    deityType: 'Pratishtha (Consecrated)',
    architecture: 'Stunning modern temple with lotus-themed pillars, a prominent golden dome, detailed relief panels depicting Krishna-leela, and dynamic water fountains.',
    importance: 'A vibrant spiritual hub offering daily lectures, spiritual discourses, and vegetarian relief programs (Govinda Food).',
    builtBy: 'Inaugurated by the International Society for Krishna Consciousness (ISKCON) in 2007.',
    breakTimings: [{ from: '13:00', to: '16:15' }],
    rituals: {
      daily: ['Mangala Aarti (4:30 AM)', 'Sringar Aarti (7:30 AM)', 'Sandhya Aarti (7:00 PM)', 'Bhagavad Gita Discourse (Evening)'],
      annual: ['Sri Krishna Janmashtami', 'Ratha Yatra (Chariot Festival)']
    },
    facilities: {
      locker: 'Free cloakroom facility available.',
      toilets: 'Highly clean, modern restrooms.',
      drinkingWater: 'Purified RO drinking water stations.',
      wheelchair: 'Full wheelchair accessibility with custom ramps and lifts.',
      parking: 'Spacious, secure parking lot inside the temple campus.',
      food: 'Govinda Restaurant serving high-quality, pure lacto-vegetarian meals.'
    }
  },
  'padmavathi': {
    deity: 'Goddess Padmavathi Devi (Alamelu Manga)',
    deityType: 'Pratishtha (Consecrated)',
    architecture: 'Traditional Dravidian temple with golden vimanas, a vast sacred pushkarini (Padma Sarovaram), and highly decorated pillared halls.',
    importance: 'The temple of Lord Venkateswaras divine consort. Tradition holds that pilgrims should worship Goddess Padmavathi first before visiting the Lord in Tirumala.',
    builtBy: 'Historically patronized by Thondaman Kings, Pallavas, and Vijayanagara kings.',
    breakTimings: [{ from: '13:00', to: '16:00' }],
    rituals: {
      daily: ['Suprabhatam', 'Thomala Seva', 'Archana', 'Kalyanotsavam', 'Kumkumarchana'],
      weekly: ['Abhishekam (Friday)'],
      annual: ['Kartheeka Brahmotsavams (Gajavahana, Chakra Snanam)']
    },
    facilities: {
      locker: 'TTD operated cloakrooms near the entrance.',
      toilets: 'Restrooms available inside the queue complexes.',
      drinkingWater: 'Free drinking water counters.',
      wheelchair: 'Wheelchairs and helper assistance available.',
      parking: 'Huge open TTD parking lot near the temple gate.',
      food: 'Free Annaprasadam canteens and sweet prasadam stalls.'
    }
  },
  'chandragiri-fort': {
    deity: 'None (Historical Monument)',
    deityType: 'N/A',
    architecture: 'Indo-Saracenic royal architecture. The Raja Mahal and Rani Mahal palaces are notable for being built entirely without timber, using only stone, brick, and lime mortar.',
    importance: 'The final capital of the Vijayanagara Empire. Historically significant as the location where the British negotiated the purchase of land for Madras (Chennai).',
    builtBy: 'Yadava Kings in the 11th century, highly fortified by Vijayanagara rulers.',
    breakTimings: [],
    rituals: {
      daily: ['Sound & Light Show (Telugu & English in the evening)']
    },
    facilities: {
      locker: 'Not available.',
      toilets: 'Restrooms located inside the archaeological park.',
      drinkingWater: 'RO drinking water fountains.',
      wheelchair: 'Ground levels and gardens are accessible; upper floors of Raja Mahal are accessible only via steep stairs.',
      parking: 'Huge secure parking space outside the fort gates.',
      food: 'Local canteens serving water, ice creams, and light snacks.'
    }
  }
};

const STORIES_SEED = [
  {
    title: 'The Divine Descent of Venkateswara',
    slug: 'divine-descent-of-venkateswara',
    category: 'mythology',
    cover_image: '/assets/ai/hero_spiritual_sunset.png',
    reading_time: 4,
    content: 'Long ago in Satya Yuga, Sage Bhrigu went to test the patience of the Hindu Trinity. After visiting Lord Shiva and Lord Brahma, he arrived at Vaikuntha and kicked Lord Vishnu on the chest in a fit of rage. Instead of getting angry, Vishnu gently massaged Bhrigus foot. However, Goddess Lakshmi felt humiliated by Bhrigus actions and left Vaikuntha to settle on Earth at Karavirapura (Kolhapur). Lord Vishnu, unable to bear the separation, descended to Earth and began living in a cave on Seshachalam hills in search of her. Over time, he married Princess Padmavathi, the daughter of Akasa Raja, and chose to remain on these holy hills forever as Venkateswara to protect and bless mankind in Kali Yuga.',
    keyTakeaway: 'Love and humility are the greatest virtues, capable of capturing the divine.',
    relatedTemple: 'venkateswara',
    tags: ['Vishnu', 'Laxmi', 'Tirumala', 'Origin'],
    isActive: true
  },
  {
    title: 'How Kapila Theertham got its Name',
    slug: 'how-kapila-theertham-got-its-name',
    category: 'temple_history',
    cover_image: '/assets/nature/kapila-theertham.png',
    reading_time: 3,
    content: 'Deep in the Treta Yuga, the great sage Kapila Muni came to these hills to perform intense penance dedicated to Lord Shiva. Extremely pleased by Kapilas deep devotion, Lord Shiva and Goddess Parvati appeared before him, emerging from the rocky cleft of the mountains. They blessed the sage and manifested a sacred Shiva Linga at the site. At that very moment, a celestial waterfall cascaded down from the Seshachalam forest directly onto the Linga, creating a beautiful emerald pool. The temple was subsequently built around the cave, and both the waterfall (Kapiladhara) and the pushkarini (Kapila Theertham) continue to bear the name of the great sage.',
    keyTakeaway: 'Pure devotion invites divine presence even in the most remote and challenging places.',
    relatedTemple: 'kapila-theertham',
    tags: ['Shiva', 'Waterfall', 'Sage Kapila', 'History'],
    isActive: true
  },
  {
    title: 'The Miracle of Anjanadri Hills',
    slug: 'miracle-of-anjanadri-hills',
    category: 'mythology',
    cover_image: '/assets/nature/srivari-mettu.png',
    reading_time: 3,
    content: 'According to the Brahmanda Purana, Seshachalam contains seven holy hills, one of which is Anjanadri. Centuries ago, a devout woman named Anjana Devi was sad because she did not have any children. On the advice of Sage Matanga, she climbed these hills and performed rigorous penance for several years near the Akasaganga waterfall. Impressed by her determination, the Wind God Vayu blessed her with a holy fruit. Upon consuming it, she conceived and gave birth to Hanuman, the supreme devotee of Lord Rama. Since Hanuman (Anjaneya) was born here, the hill is named Anjanadri, and it remains a place of immense spiritual power.',
    keyTakeaway: 'Faith, patience, and devotion can fulfill the deepest desires of the soul.',
    relatedTemple: 'japali-hanuman',
    tags: ['Hanuman', 'Anjana Devi', 'Birthplace', 'Tirumala'],
    isActive: true
  }
];

const QUIZZES_SEED = [
  {
    question: 'Who consecrated the main deity and established the daily rituals at Sri Govindaraja Swamy Temple?',
    difficulty: 'intermediate',
    category: 'history',
    image: '/assets/temples/govindaraja.png',
    options: [
      { id: 'A', text: 'Emperor Krishnadevaraya' },
      { id: 'B', text: 'Saint Ramanujacharya' },
      { id: 'C', text: 'Adi Shankaracharya' },
      { id: 'D', text: 'Sage Kapila' }
    ],
    correctAnswer: 'B',
    explanation: 'Saint Ramanujacharya consecrated the temple in 1130 AD to house the deity of Govindaraja Swamy safely.',
    relatedTemple: 'govindaraja',
    xpReward: 20
  },
  {
    question: 'Which of the following temples in Tirupati is dedicated to Lord Shiva?',
    difficulty: 'beginner',
    category: 'temples',
    image: '/assets/nature/kapila-theertham.png',
    options: [
      { id: 'A', text: 'Sri Padmavathi Ammavari Temple' },
      { id: 'B', text: 'Sri Govindaraja Swamy Temple' },
      { id: 'C', text: 'Kapila Theertham Temple' },
      { id: 'D', text: 'Sri Venkateswara Temple' }
    ],
    correctAnswer: 'C',
    explanation: 'Kapila Theertham, situated at the foot of Seshachalam hills, is the only major Shiva temple in Tirupati.',
    relatedTemple: 'kapila-theertham',
    xpReward: 10
  },
  {
    question: 'The Raja Mahal palace at Chandragiri Fort is built without using which material?',
    difficulty: 'expert',
    category: 'architecture',
    image: '/assets/temples/chandragiri-fort.png',
    options: [
      { id: 'A', text: 'Stone' },
      { id: 'B', text: 'Timber (Wood)' },
      { id: 'C', text: 'Lime Mortar' },
      { id: 'D', text: 'Brick' }
    ],
    correctAnswer: 'B',
    explanation: 'The palaces of Chandragiri Fort are architectural wonders built entirely without wood/timber, using only brick, stone, and lime mortar.',
    relatedTemple: 'chandragiri-fort',
    xpReward: 30
  }
];

const ENCYCLOPEDIA_SEED = [
  {
    title: 'Tirupati Laddu (Srivari Laddu)',
    slug: 'tirupati-laddu-prasadam',
    category: 'prasadam',
    keywords: ['laddu', 'prasadam', 'ttd laddu', 'sweet', 'potu'],
    content: 'The Tirupati Laddu is the world-famous sweet prasadam offered to Lord Venkateswara at the Tirumala Temple. Its history dates back over 300 years, with the first recorded distribution in 1715. The laddus are prepared in a highly sacred temple kitchen called the Potu by hereditary priests known as Gamekaras. The ingredients include gram flour, pure cow ghee, sugar, cashews, raisins, cardamom, and edible camphor (pacha karpooram). The recipe is strictly guarded under a patent and GI (Geographical Indication) tag to protect its unique flavor, which devotees believe is due to the grace of the Lord.',
    summary: 'The sacred, 300-year-old sweet prasadam of Tirumala Temple, protected by a GI tag.',
    coverImage: '/assets/ai/hero_food.png',
    references: [{ title: 'TTD Official Prasadam Guide', url: 'https://www.tirumala.org' }]
  },
  {
    title: 'Srivari Potu (Temple Kitchen)',
    slug: 'srivari-potu-temple-kitchen',
    category: 'architecture',
    keywords: ['potu', 'kitchen', 'cooking', 'laddu preparation', 'fire'],
    content: 'The Potu is the giant, highly secured kitchen of the Tirumala temple. It is situated in the inner corridor of the temple. The kitchen uses traditional clay firewood stoves (Chulhas) and prepares lakhs of laddus, along with other prasadams like Pulihora, Pongal, and curd rice daily. Only clean-shaven, orthodox Vaishnava priests who undergo traditional purification rituals are allowed inside to cook. The fire in the Potu is said to have never gone out for centuries, symbolizing continuous devotion.',
    summary: 'The highly sacred inner kitchen of Tirumala Temple where prasadams are prepared.',
    coverImage: '/assets/temples/venkateswara.png'
  }
];

async function seed() {
  try {
    await db.connect();
    console.log("Connected to Supabase PostgreSQL for seeding flagship content...");

    // 1. Update places table (flagship details)
    console.log("Seeding flagship details in 'places' table...");
    for (const [id, details] of Object.entries(FLAGSHIP_UPDATES)) {
      const query = `
        UPDATE places 
        SET 
          deity = $1,
          "deityType" = $2,
          architecture = $3,
          importance = $4,
          "builtBy" = $5,
          "breakTimings" = $6,
          rituals = $7,
          facilities = $8
        WHERE id = $9
      `;
      const values = [
        details.deity,
        details.deityType,
        details.architecture,
        details.importance,
        details.builtBy,
        JSON.stringify(details.breakTimings),
        JSON.stringify(details.rituals),
        JSON.stringify(details.facilities),
        id
      ];
      const res = await db.query(query, values);
      console.log(`Updated place "${id}" details. Rows affected: ${res.rowCount}`);
    }

    // 2. Seed stories
    console.log("Seeding 'stories'...");
    for (const story of STORIES_SEED) {
      const query = `
        INSERT INTO stories (
          id, title, slug, category, image, "readTime", "fullText", "keyTakeaway", "relatedTemple", tags, "isActive"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          "readTime" = EXCLUDED."readTime",
          "fullText" = EXCLUDED."fullText",
          "keyTakeaway" = EXCLUDED."keyTakeaway",
          "relatedTemple" = EXCLUDED."relatedTemple",
          tags = EXCLUDED.tags,
          "isActive" = EXCLUDED."isActive"
      `;
      const values = [
        story.slug, // Use slug as id
        story.title,
        story.slug,
        story.category,
        story.cover_image,
        `${story.reading_time} min read`,
        story.content,
        story.keyTakeaway,
        story.relatedTemple,
        story.tags,
        story.isActive
      ];
      await db.query(query, values);
    }
    console.log("Stories seeding complete.");

    // 3. Seed quizzes
    console.log("Seeding 'quizzes'...");
    for (const quiz of QUIZZES_SEED) {
      // Find matching relatedStory UUID if any
      let storyId = null;
      if (quiz.relatedTemple) {
        // If there's a story related to this temple, let's link it
        const storyRes = await db.query(`SELECT id FROM stories WHERE "relatedTemple" = $1 LIMIT 1`, [quiz.relatedTemple]);
        if (storyRes.rows.length > 0) {
          storyId = storyRes.rows[0].id;
        }
      }

      const query = `
        INSERT INTO quizzes (
          question, difficulty, category, image, options, "correctAnswer", explanation, "relatedStory", "relatedTemple", "xpReward"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
      `;
      const values = [
        quiz.question,
        quiz.difficulty,
        quiz.category,
        quiz.image,
        JSON.stringify(quiz.options),
        quiz.correctAnswer,
        quiz.explanation,
        storyId,
        quiz.relatedTemple,
        quiz.xpReward
      ];
      await db.query(query, values);
    }
    console.log("Quizzes seeding complete.");

    // 4. Seed encyclopedia
    console.log("Seeding 'encyclopedia'...");
    for (const entry of ENCYCLOPEDIA_SEED) {
      const query = `
        INSERT INTO encyclopedia (
          title, slug, category, keywords, content, summary, "coverImage", "references"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          keywords = EXCLUDED.keywords,
          content = EXCLUDED.content,
          summary = EXCLUDED.summary,
          "coverImage" = EXCLUDED."coverImage",
          "references" = EXCLUDED."references"
      `;
      const values = [
        entry.title,
        entry.slug,
        entry.category,
        entry.keywords,
        entry.content,
        entry.summary,
        entry.coverImage,
        JSON.stringify(entry.references || [])
      ];
      await db.query(query, values);
    }
    console.log("Encyclopedia seeding complete.");

  } catch (error) {
    console.error("Error seeding database data:", error);
  } finally {
    await db.end();
  }
}

seed();
