
export interface ItineraryItem {
  time: string;
  placeId: string;
  note: string;
  duration: string;
  travelFromPrev?: string;
}

export interface DayPlan {
  day: number;
  items: ItineraryItem[];
  totalDistance?: string;
  theme: string;
}

export function generateItinerary(days: number): DayPlan[] {
  if (days <= 1) {
    return [
      {
        day: 1,
        theme: "Tirumala Essential Circuit",
        items: [
          {
            time: '06:00 AM',
            placeId: 'venkateswara',
            note: 'The heart of your journey. Start early for the main Darshan.',
            duration: '4-5 Hours'
          },
          {
            time: '11:30 AM',
            placeId: 'bhu-varaha',
            note: 'Located right opposite the main temple. Pay respects to the Lord\'s greatest devotee.',
            duration: '30 mins',
            travelFromPrev: '2 mins walk'
          },
          {
            time: '01:00 PM',
            placeId: 'akasaganga-theertham',
            note: 'Sacred waterfall whose water is used for the Lord\'s rituals.',
            duration: '1 Hour',
            travelFromPrev: '15 mins'
          },
          {
            time: '02:30 PM',
            placeId: 'papavinasam-theertham',
            note: 'A holy dip here is believed to wash away all past karmas.',
            duration: '1.5 Hours',
            travelFromPrev: '10 mins'
          }
        ]
      }
    ];
  }

  if (days === 2) {
    return [
      {
        day: 1,
        theme: "Tirumala Heights & Theerthams",
        items: [
          {
            time: '06:00 AM',
            placeId: 'venkateswara',
            note: 'Focus on the main Darshan and holy hills exploration.',
            duration: '5-6 Hours'
          },
          {
            time: '01:00 PM',
            placeId: 'bhu-varaha',
            note: 'Visit the tied-hand Hanuman opposite the main shrine.',
            duration: '30 mins',
            travelFromPrev: '2 mins walk'
          },
          {
            time: '02:00 PM',
            placeId: 'akasaganga-theertham',
            note: 'Experience the heavenly waterfall.',
            duration: '1 Hour',
            travelFromPrev: '15 mins'
          },
          {
            time: '03:30 PM',
            placeId: 'papavinasam-theertham',
            note: 'Conclude the day with a holy dip at the seven streams.',
            duration: '1.5 Hours',
            travelFromPrev: '10 mins'
          }
        ]
      },
      {
        day: 2,
        theme: "Tirupati City & Divine Mother",
        items: [
          {
            time: '08:00 AM',
            placeId: 'padmavathi',
            note: 'Start with seeking the blessings of Goddess Padmavathi.',
            duration: '2 Hours'
          },
          {
            time: '11:00 AM',
            placeId: 'kapila-theertham',
            note: 'Visit the sacred Shiva temple at the foot of the hills.',
            duration: '1.5 Hours',
            travelFromPrev: '15 mins'
          },
          {
            time: '01:00 PM',
            placeId: 'govindaraja',
            note: 'Explore the massive ancient complex in the heart of the city.',
            duration: '2 Hours',
            travelFromPrev: '10 mins'
          }
        ]
      }
    ];
  }

  // default to 3 days or more
  return [
    {
      day: 1,
      theme: "The Divine Ascent (Tirumala)",
      items: [
        {
          time: '05:00 AM',
          placeId: 'venkateswara',
          note: 'A dedicated day for the main deity and Tirumala spiritual atmosphere.',
          duration: '6-8 Hours'
        },
        {
          time: '02:00 PM',
          placeId: 'bhu-varaha',
          note: 'Visit the ancient Hanuman temple.',
          duration: '1 Hour',
          travelFromPrev: '2 mins walk'
        }
      ]
    },
    {
      day: 2,
      theme: "Local Sacred Circuit",
      items: [
        {
          time: '08:00 AM',
          placeId: 'padmavathi',
          note: 'Seek the blessings of the Divine Mother.',
          duration: '2.5 Hours'
        },
        {
          time: '11:30 AM',
          placeId: 'kapila-theertham',
          note: 'Spiritual cleansing at the holy waterfall.',
          duration: '2 Hours',
          travelFromPrev: '15 mins'
        },
        {
          time: '02:30 PM',
          placeId: 'govindaraja',
          note: 'Explore the historical Vaishnavite architecture.',
          duration: '2 Hours',
          travelFromPrev: '10 mins'
        }
      ]
    },
    {
      day: 3,
      theme: "Ancient Outskirts & Remissions",
      items: [
        {
          time: '08:00 AM',
          placeId: 'srikalahasti',
          note: 'The Kashi of the South. Perform the Rahu-Ketu pooja if needed.',
          duration: '4 Hours',
          travelFromPrev: '45 mins'
        },
        {
          time: '02:00 PM',
          placeId: 'appalayagunta-temple',
          note: 'A peaceful conclusion seeking the Abhaya Hasta blessings.',
          duration: '1.5 Hours',
          travelFromPrev: '30 mins'
        }
      ]
    }
  ];
}
