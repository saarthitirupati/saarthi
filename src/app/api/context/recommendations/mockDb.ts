// src/app/api/context/recommendations/mockDb.ts

export const mockPlacesDb = [
  {
    id: 'uuid-1',
    name: 'Tirumala Venkateswara Temple',
    slug: 'tirumala-temple',
    base_priority: 95,
    images: ['https://example.com/tirumala.jpg'],
    coordinates: { lat: 13.6833, lng: 79.3475 },
    context: {
      ideal_weather: ['Sunny', 'Cloudy', 'Clear'],
      ideal_temperature_min: 15,
      ideal_temperature_max: 30,
      indoor: true,
      best_time: ['Morning', 'Afternoon', 'Evening'],
      weekend_friendly: false, // Too crowded
      crowd_escape: false,
      rtc_available: true
    },
    live_updates: {
      crowd_level: 'EXTREME',
      parking_status: 'FULL',
      rtc_status: 'NORMAL'
    },
    alerts: []
  },
  {
    id: 'uuid-2',
    name: 'Kapila Theertham',
    slug: 'kapila-theertham',
    base_priority: 85,
    images: ['https://example.com/kapila.jpg'],
    coordinates: { lat: 13.6564, lng: 79.4208 },
    context: {
      ideal_weather: ['Rain', 'Cloudy', 'Sunny'],
      ideal_temperature_min: 20,
      ideal_temperature_max: 35,
      indoor: false,
      best_time: ['Morning'],
      weekend_friendly: true,
      crowd_escape: true,
      rtc_available: true
    },
    live_updates: {
      crowd_level: 'MEDIUM',
      parking_status: 'AVAILABLE',
      rtc_status: 'NORMAL'
    },
    alerts: []
  },
  {
    id: 'uuid-3',
    name: 'Sri Govindaraja Swamy Temple',
    slug: 'govindaraja-swamy',
    base_priority: 80,
    images: ['https://example.com/govindaraja.jpg'],
    coordinates: { lat: 13.6355, lng: 79.4232 },
    context: {
      ideal_weather: ['Sunny', 'Cloudy'],
      ideal_temperature_min: 20,
      ideal_temperature_max: 35,
      indoor: true,
      best_time: ['Morning', 'Evening'],
      weekend_friendly: true,
      crowd_escape: false,
      rtc_available: true
    },
    live_updates: {
      crowd_level: 'LOW',
      parking_status: 'AVAILABLE',
      rtc_status: 'NORMAL'
    },
    alerts: []
  }
];
