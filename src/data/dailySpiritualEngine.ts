export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioUrl?: string;
  category: string;
}

export interface DynamicSeva {
  id: string;
  label: string;
  iconName: 'heart' | 'droplets' | 'users' | 'shield' | 'check-circle' | 'sparkles' | 'footprints' | 'sun';
  category: 'preparation' | 'queue' | 'gratitude' | 'community' | 'safety';
}

export interface TodaysCompanionData {
  priorityLevel: number; // 1: Festival, 2: Temple Day, 3: Weekday Theme, 4: General Reflection
  priorityReason: string;
  theme: string;
  headline: string;
  divineMoment: {
    quote: string;
    author: string;
    duration: string;
    reflectionTip: string;
  };
  significance: {
    title: string;
    category: 'Temple' | 'History' | 'Architecture' | 'Festivals' | 'Rituals' | 'Prasadam' | 'Annamayya' | 'TTD';
    description: string;
  };
  sevas: DynamicSeva[];
  audio: AudioTrack;
  journeyMessage: {
    stage: 'before' | 'queue' | 'after' | 'general';
    title: string;
    actionableAdvice: string;
  };
  moodPrompt: {
    question: string;
    options: { id: string; iconName: string; label: string; feedback: string }[];
  };
  habitPrompt: {
    text: string;
  };
}

export const AUDIO_CATALOG: AudioTrack[] = [
  { id: 'suprabhatam', title: 'Sri Venkateswara Suprabhatam', artist: 'Traditional Chanting', duration: '30 sec', category: 'Morning Wakeup' },
  { id: 'govinda-namalu', title: 'Govinda Namalu (108 Names)', artist: 'Annamayya Choral', duration: '45 sec', category: 'Devotional Chanting' },
  { id: 'ashtakam', title: 'Venkateswara Ashtakam', artist: 'Traditional Stotram', duration: '35 sec', category: 'Praise & Chanting' },
  { id: 'annamayya', title: 'Nigama Nigamanta (Annamayya Keerthana)', artist: 'Carnatic Vocal', duration: '40 sec', category: 'Annamayya Legend' },
  { id: 'bell-meditation', title: 'Tirumala Temple Bell Chime Meditation', artist: 'Sanctum Atmosphere', duration: '30 sec', category: 'Peaceful Meditation' },
];

export const DAY_OF_WEEK_THEMES: Record<number, { theme: string; deity: string; quote: string; author: string; triviaCategory: 'Temple' | 'History' | 'Architecture' | 'Festivals' | 'Rituals' | 'Prasadam' | 'Annamayya' | 'TTD'; triviaTitle: string; trivia: string }> = {
  0: { // Sunday - Sun / Surya & Sri Hari
    theme: 'Vitality & Divine Radiance',
    deity: 'Surya Narayana',
    quote: 'Like the morning sun illuminating Swami Pushkarini, true faith dissolves every shadow of doubt.',
    author: 'Sri Ramanujacharya Wisdom',
    triviaCategory: 'Architecture',
    triviaTitle: 'Ananda Nilayam Golden Vimanam',
    trivia: 'The golden tower above the sanctum absorbs the morning sunlight, radiating divine warmth over the Seven Hills.'
  },
  1: { // Monday - Lord Shiva & Sri Kapileswara
    theme: 'Inner Calmness & Sacred Patience',
    deity: 'Lord Shiva',
    quote: 'Silence in queue is not empty waiting; it is the deepest prayer of a tranquil mind.',
    author: 'Kapila Maharshi Teaching',
    triviaCategory: 'Temple',
    triviaTitle: 'Kapila Theertham Cave Temple',
    trivia: 'Located at the foot of Tirumala, Kapila Theertham is the only Lord Shiva temple in the entire Tirupati region.'
  },
  2: { // Tuesday - Lord Subrahmanya / Hanuman & Protection
    theme: 'Strength & Fearless Devotion',
    deity: 'Hanuman',
    quote: 'When you take a step towards the Lord with courage, divine grace protects your entire journey.',
    author: 'Bedi Anjaneya Tradition',
    triviaCategory: 'History',
    triviaTitle: 'Bedi Anjaneya Shrine Legend',
    trivia: 'Bedi Anjaneya stands right opposite the main temple with bound hands to ensure he remains forever protecting Tirumala.'
  },
  3: { // Wednesday - Lord Vishnu / Rama & Truthfulness
    theme: 'Righteous Conduct & Dharma',
    deity: 'Lord Kodandarama',
    quote: 'Walk the path of Truth and kindness; every tired step uphill is recorded as a noble deed.',
    author: 'Sri Rama Charitam',
    triviaCategory: 'Rituals',
    triviaTitle: 'Srivari Archana Tradition',
    trivia: 'Exact Vedic rituals established over 1,000 years ago by Saint Ramanuja are strictly followed without fail every morning.'
  },
  4: { // Thursday - Guru & Saint Annamayya / Wisdom
    theme: 'Gratitude & Divine Music',
    deity: 'Guru & Annamayya',
    quote: 'He who surrendered his heart at the Lotus Feet of Venkateswara knows no fear and no lack.',
    author: 'Saint Annamayya Sankeertana',
    triviaCategory: 'Annamayya',
    triviaTitle: '32,000 Sacred Sankeertanas',
    trivia: 'Saint Annamayya composed 32,000 songs on copper plates dedicated solely to Lord Venkateswara in Tirumala.'
  },
  5: { // Friday - Goddess Lakshmi & Padmavathi / Prosperity & Grace
    theme: 'Divine Grace & Compassion',
    deity: 'Goddess Lakshmi',
    quote: 'Darshan is complete only when your heart is filled with compassion for every fellow pilgrim.',
    author: 'Tiruchanoor Temple Tradition',
    triviaCategory: 'Prasadam',
    triviaTitle: 'Tirupati Laddu GI Tag',
    trivia: 'The famous Tirupati Laddu prasadam, prepared with pure ghee and cardamom, holds a global Geographical Indication (GI) tag.'
  },
  6: { // Saturday - Lord Venkateswara & Hanuman / Kali Yuga Varada
    theme: 'Complete Surrender & Yatra Joy',
    deity: 'Lord Venkateswara',
    quote: 'In this Kali Yuga, simply uttering "Govinda! Govinda!" with love grants supreme peace of mind.',
    author: 'Sri Venkateswara Mahatmyam',
    triviaCategory: 'TTD',
    triviaTitle: 'Free Annadanam Facility',
    trivia: 'TTD serves free hot nutritious meals to over 100,000 pilgrims daily at the Tarigonda Vengamamba Complex.'
  }
};

export function getTodaysCompanion(
  date: Date = new Date(),
  liveStatus?: any,
  journeyStage: 'before' | 'queue' | 'after' | 'general' = 'general',
  todayFestival?: any
): TodaysCompanionData {
  const dayOfWeek = date.getDay();
  const dayTheme = DAY_OF_WEEK_THEMES[dayOfWeek] || DAY_OF_WEEK_THEMES[6];
  const audioTrack = AUDIO_CATALOG[dayOfWeek % AUDIO_CATALOG.length];

  let priorityLevel = 3; // Default: Weekday Theme (Priority 3)
  let priorityReason = `${dayTheme.deity} Day`;
  let theme = dayTheme.theme;
  let headline = `Today's Divine Guidance for ${dayTheme.deity}`;
  let quote = dayTheme.quote;
  let author = dayTheme.author;
  let triviaCategory = dayTheme.triviaCategory;
  let triviaTitle = dayTheme.triviaTitle;
  let trivia = dayTheme.trivia;

  // PRIORITY 1: Festival Calendar Override
  if (todayFestival && (todayFestival.isToday || todayFestival.isLive)) {
    priorityLevel = 1;
    priorityReason = todayFestival.name || todayFestival.title || 'Festival Day';
    theme = `${todayFestival.name || todayFestival.title} Utsavam`;
    headline = `Sacred Festival Guidance: ${todayFestival.name || todayFestival.title}`;
    quote = todayFestival.shortDescription || todayFestival.description || `On this sacred day of ${todayFestival.name}, meditating on the Lord brings boundless spiritual merit.`;
    author = 'Tirumala Festival Calendar';
    triviaCategory = 'Festivals';
    triviaTitle = `${todayFestival.name || todayFestival.title} Significance`;
    trivia = todayFestival.longDescription || todayFestival.description || `Celebrated with immense grandness at Tirumala, drawing thousands of devotees to behold the divine procession.`;
  } 
  // PRIORITY 2: Important Temple Day (Saturdays & Fridays or High Crowd Queue Context)
  else if (dayOfWeek === 6 || dayOfWeek === 5) {
    priorityLevel = 2;
    priorityReason = dayOfWeek === 6 ? 'Srivari Saturday' : 'Lakshmi Friday';
  }

  // Live Queue / Weather Context Override if Crowd or Rain is Active
  if (liveStatus?.crowdLevel === 'heavy' || (liveStatus?.waitTimeMinutes && liveStatus.waitTimeMinutes > 180)) {
    theme = 'Patience is Supreme Worship';
    headline = 'Today\'s Guidance: Waiting with Patience';
    quote = 'When the queue moves slowly, turn your waiting time into silent chanting of Govinda Namalu.';
    author = 'Tirumala Yatra Wisdom';
    triviaCategory = 'TTD';
    triviaTitle = 'Vaikuntam Queue Complex Comforts';
    trivia = 'TTD provides free milk, food, water, and medical care continuously to pilgrims in all queue compartments.';
  } else if (liveStatus?.isRaining || liveStatus?.weatherCondition?.toLowerCase().includes('rain')) {
    theme = 'Safety & Care on Holy Hills';
    headline = 'Today\'s Guidance: Safety is Devotion';
    quote = 'Walk gently on sacred stone paths; helping a slipping pilgrim is equal to performing a holy ritual.';
    author = 'Srivari Seva Principle';
    triviaCategory = 'Temple';
    triviaTitle = 'Swami Pushkarini Holy Waters';
    trivia = 'The sacred lake Swami Pushkarini is believed to contain waters from all 68,000 holy rivers of India.';
  }

  // Determine dynamic sevas based on time of day & context
  const hour = date.getHours();
  let sevas: DynamicSeva[] = [];

  if (journeyStage === 'queue' || (liveStatus?.waitTimeMinutes && liveStatus.waitTimeMinutes > 60)) {
    sevas = [
      { id: 'queue-1', label: 'Help elderly or families in line', iconName: 'users', category: 'queue' },
      { id: 'queue-2', label: 'Keep queue surroundings clean', iconName: 'shield', category: 'safety' },
      { id: 'queue-3', label: 'Stay calm & chant Govinda Namalu', iconName: 'heart', category: 'gratitude' }
    ];
  } else if (hour < 11) { // Morning
    sevas = [
      { id: 'morn-1', label: 'Drink water before starting walk', iconName: 'droplets', category: 'preparation' },
      { id: 'morn-2', label: 'Keep entry ticket & ID ready', iconName: 'check-circle', category: 'preparation' },
      { id: 'morn-3', label: 'Offer morning gratitude prayer', iconName: 'heart', category: 'gratitude' }
    ];
  } else if (hour > 18) { // Evening / Night
    sevas = [
      { id: 'eve-1', label: 'Reflect on peaceful darshan moments', iconName: 'sparkles', category: 'gratitude' },
      { id: 'eve-2', label: 'Share food or prasadam with someone', iconName: 'users', category: 'community' },
      { id: 'eve-3', label: 'Rest well for tomorrow\'s yatra', iconName: 'sun', category: 'preparation' }
    ];
  } else { // Afternoon / General
    sevas = [
      { id: 'gen-1', label: 'Stay hydrated during warm hours', iconName: 'droplets', category: 'preparation' },
      { id: 'gen-2', label: 'Yield way to walking pilgrims', iconName: 'footprints', category: 'community' },
      { id: 'gen-3', label: 'Keep sacred hills plastic-free', iconName: 'shield', category: 'safety' }
    ];
  }

  // Determine journey message
  let journeyAdvice = 'Prepare your mind and body with pure devotion before entering the queue.';
  if (journeyStage === 'queue') {
    journeyAdvice = 'Patience in queue is worship itself. Listen to Suprabhatam or chant silently.';
  } else if (journeyStage === 'after') {
    journeyAdvice = 'Take your sacred darshan peace home and share joy with your family and neighbors.';
  }

  return {
    priorityLevel,
    priorityReason,
    theme,
    headline,
    divineMoment: {
      quote,
      author,
      duration: '30-Sec Reflection',
      reflectionTip: 'Take three deep breaths and silently chant "Om Namo Venkatesaya".'
    },
    significance: {
      title: triviaTitle,
      category: triviaCategory,
      description: trivia
    },
    sevas,
    audio: audioTrack,
    journeyMessage: {
      stage: journeyStage,
      title: journeyStage === 'queue' ? 'Waiting in Queue' : journeyStage === 'after' ? 'Post-Darshan Blessings' : 'Before Your Darshan',
      actionableAdvice: journeyAdvice
    },
    moodPrompt: {
      question: 'How are you feeling today on your yatra?',
      options: [
        { id: 'peaceful', iconName: 'heart', label: 'Peaceful', feedback: 'May Lord Venkateswara bless you with enduring serenity.' },
        { id: 'excited', iconName: 'smile', label: 'Excited', feedback: 'Your joyful devotion brings warmth to the entire pilgrimage!' },
        { id: 'grateful', iconName: 'sparkles', label: 'Grateful', feedback: 'Gratitude opens the gateway to divine grace.' },
        { id: 'patient', iconName: 'shield', label: 'Patient', feedback: 'Patience transforms every waiting moment into sacred seva.' }
      ]
    },
    habitPrompt: {
      text: 'Come back tomorrow for a new story, divine guidance, and daily seva.'
    }
  };
}
