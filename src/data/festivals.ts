export interface Festival {
  id: string;
  name: string;
  date: string; // ISO format 'YYYY-MM-DD'
  location: string;
  gravityScore: number; // 1-10 scale representing the festival's inherent magnitude
  expectedCrowd: 'Low' | 'Moderate' | 'High' | 'Very High';
  recommendedTime: string;
  dressCode: string;
  parking: 'Available' | 'Limited' | 'Very Limited';
  specialTips: string;
}

export const FESTIVALS_2026: Festival[] = [
  {
    id: 'vaikunta-ekadashi',
    name: 'Vaikunta Ekadashi',
    date: '2026-01-19',
    location: 'Tirumala',
    gravityScore: 10,
    expectedCrowd: 'Very High',
    recommendedTime: '3:00 AM - 11:00 PM',
    dressCode: 'Traditional (Mandatory)',
    parking: 'Very Limited',
    specialTips: 'Book Vaikunta Dwara Darshanam tickets months in advance.',
  },
  {
    id: 'rathasapthami',
    name: 'Rathasapthami',
    date: '2026-01-24',
    location: 'Tirumala',
    gravityScore: 8,
    expectedCrowd: 'High',
    recommendedTime: '5:00 AM - 9:00 PM',
    dressCode: 'Traditional',
    parking: 'Limited',
    specialTips: 'Witness the seven vahanams from the galleries.',
  },
  {
    id: 'ugadi',
    name: 'Ugadi',
    date: '2026-03-20',
    location: 'Tirumala & Tirupati',
    gravityScore: 7,
    expectedCrowd: 'High',
    recommendedTime: '6:00 AM - 10:00 PM',
    dressCode: 'Traditional',
    parking: 'Limited',
    specialTips: 'Panchanga Sravanam happens inside the temple.',
  },
  {
    id: 'sri-ramanavami',
    name: 'Sri Ramanavami',
    date: '2026-03-28',
    location: 'Tirumala',
    gravityScore: 7,
    expectedCrowd: 'High',
    recommendedTime: '6:00 AM - 9:00 AM',
    dressCode: 'Traditional',
    parking: 'Limited',
    specialTips: 'Special Asthanam is conducted for Lord Rama.',
  },
  {
    id: 'krishna-janmashtami',
    name: 'Krishna Janmashtami',
    date: '2026-09-04',
    location: 'Tirumala',
    gravityScore: 6,
    expectedCrowd: 'High',
    recommendedTime: '4:00 PM - 9:00 PM',
    dressCode: 'Traditional',
    parking: 'Limited',
    specialTips: 'Utlotsavam is celebrated the day after.',
  },
  {
    id: 'brahmotsavam',
    name: 'Srivari Brahmotsavam',
    date: '2026-09-17',
    location: 'Tirumala',
    gravityScore: 10,
    expectedCrowd: 'Very High',
    recommendedTime: '7:00 AM - 11:00 PM',
    dressCode: 'Traditional',
    parking: 'Very Limited',
    specialTips: 'Garuda Seva day will have extreme crowds.',
  },
  {
    id: 'deepavali',
    name: 'Deepavali Asthanam',
    date: '2026-11-08',
    location: 'Tirumala',
    gravityScore: 5,
    expectedCrowd: 'Moderate',
    recommendedTime: '7:00 AM - 10:00 AM',
    dressCode: 'Traditional',
    parking: 'Limited',
    specialTips: 'The main deity is adorned with new vastrams.',
  },
  {
    id: 'vaikunta-ekadashi-dec',
    name: 'Vaikunta Ekadashi',
    date: '2026-12-28',
    location: 'Tirumala',
    gravityScore: 10,
    expectedCrowd: 'Very High',
    recommendedTime: '3:00 AM - 11:00 PM',
    dressCode: 'Traditional (Mandatory)',
    parking: 'Very Limited',
    specialTips: 'Book Vaikunta Dwara Darshanam tickets months in advance.',
  }
];
