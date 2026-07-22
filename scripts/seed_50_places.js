const fs = require('fs');
const crypto = require('crypto');

function generateUUID() {
  return crypto.randomUUID();
}

const cityId = '11111111-1111-1111-1111-111111111111'; // Tirupati
const categories = {
  Spiritual: '22222222-1111-1111-1111-111111111111',
  Nature: '22222222-2222-2222-2222-222222222222',
  Heritage: '22222222-3333-3333-3333-333333333333',
  'Hidden Gems': '22222222-4444-4444-4444-444444444444',
  Waterfalls: '22222222-5555-5555-5555-555555555555',
  Museums: '22222222-6666-6666-6666-666666666666'
};

const rawData = [
  ["Tirumala Venkateswara Temple", "Spiritual", "The primary, world-famous pilgrimage site atop the Seshachalam hills.", 79.3498, 13.6833, 100],
  ["Sri Padmavathi Ammavari Temple", "Spiritual", "Just 5 km away; dedicated to Lord Venkateswara's consort, Goddess Padmavathi.", 79.4313, 13.6067, 95],
  ["Sri Govindaraja Swamy Temple", "Spiritual", "One of the oldest and largest temple complexes in the heart of Tirupati city.", 79.4211, 13.6268, 90],
  ["Kapila Theertham", "Waterfalls", "A unique Shiva temple with a sacred waterfall at the foothills.", 79.4215, 13.6524, 85],
  ["Sri Kodandarama Swamy Temple", "Spiritual", "Dedicated to Lord Rama, Sita, and Lakshmana in the city center.", 79.4200, 13.6291, 80],
  ["ISKCON Temple", "Spiritual", "A beautiful, peaceful Krishna temple located on the Alipiri-bypass road.", 79.4011, 13.6335, 75],
  ["Sri Veda Narayana Swamy Temple", "Spiritual", "Located in Nagalapuram (about 60 km away), famous for the Matsya Avatar.", 79.7915, 13.3983, 70],
  ["Sri Prasanna Venkateswara Swamy Temple", "Spiritual", "Located 16 km away, believed to be the spot where the Lord blessed Goddess Padmavathi.", 79.5262, 13.6042, 70],
  ["Sri Kalahasti Temple", "Spiritual", "Located 36 km away; one of the Pancha Bhoota Sthalams dedicated to Vayu.", 79.7042, 13.7483, 90],
  ["Sri Kalyana Venkateswara Swamy Temple (Srinivasa Mangapuram)", "Spiritual", "12 km from Tirupati; site where Lord Venkateswara and Padmavathi stayed after marriage.", 79.3514, 13.6197, 85],
  ["Gudimallam", "Heritage", "About 30 km away; features a highly ancient and unique Shiva Lingam.", 79.5694, 13.5855, 60],
  ["Sri Agastheeswara Swamy Temple", "Spiritual", "10 km from Tirupati; associated with Sage Agastya.", 79.3242, 13.5964, 65],
  ["Sri Kalyana Venkateswara Swamy Temple (Narayanavanam)", "Spiritual", "40 km away; the traditional venue of Lord Venkateswara's wedding.", 79.5841, 13.4187, 65],
  ["Sri Venugopala Swamy Temple", "Spiritual", "A historic 14th-century temple located roughly 50 km from Tirupati.", 79.5441, 13.3444, 55],
  ["Chandragiri Fort", "Heritage", "14 km away; a massive 11th-century historical fort and palace.", 79.3174, 13.5878, 80],
  ["Kanipakam Vinayaka Swamy Temple", "Spiritual", "75 km away; dedicated to a highly revered and self-manifested idol of Lord Ganesha.", 79.0343, 13.2755, 85],
  ["Sri Kailasanatha Kona", "Waterfalls", "70 km from the city; a beautifully scenic waterfall with an ancient Shiva temple.", 79.7420, 13.3862, 70],
  ["Talakona Waterfalls", "Waterfalls", "50 km away; the highest waterfall in Andhra Pradesh.", 79.2081, 13.8055, 85],
  ["Sri Vedanarayana Swamy Temple (Nagalapuram)", "Heritage", "An ancient Vijayanagara-era temple built facing the sun.", 79.7915, 13.3983, 70],
  ["Papavinasanam Theertham", "Waterfalls", "A sacred waterfall in Tirumala believed to cleanse devotees of their sins.", 79.3331, 13.7028, 75],
  ["Akasaganga Theertham", "Waterfalls", "A perennial waterfall and holy tank near the main temple.", 79.3392, 13.6934, 75],
  ["Chakra Theertham", "Nature", "A sacred pond surrounded by hills, situated near Papavinasanam.", 79.3292, 13.6834, 65],
  ["Jabali Theertham", "Nature", "A tranquil and historically significant forest shrine/theertham in Tirumala.", 79.3400, 13.6890, 60],
  ["Gogarbham Theertham", "Nature", "Known as the Womb of the Cows and one of the holiest theerthams.", 79.3450, 13.6910, 55],
  ["Ramakrishna Theertham", "Nature", "A calm, scenic water body deep within the Tirumala forests.", 79.3550, 13.6810, 50],
  ["Kumaradhara Theertham", "Nature", "Famed for its purifying waters, often visited during special holy days.", 79.3310, 13.6700, 55],
  ["Thumbura Theertham", "Nature", "A beautiful forest stream requiring a scenic trek to reach.", 79.3200, 13.7100, 60],
  ["Vaikuntam Theertham", "Nature", "Located deep in the hills, associated with Vaikuntha.", 79.3400, 13.7200, 45],
  ["Sitamma Theertham", "Nature", "A small, holy water pool in the dense Tirumala hills.", 79.3500, 13.6750, 40],
  ["Sri Venkateswara Zoological Park", "Nature", "One of the largest zoos in Asia.", 79.3789, 13.6260, 80],
  ["Silathoranam", "Nature", "A unique natural rock formation in Tirumala, millions of years old.", 79.3421, 13.6899, 70],
  ["TTD Gardens", "Nature", "Beautifully manicured gardens in Tirumala.", 79.3470, 13.6850, 65],
  ["Sri Vari Museum", "Museums", "Located in Tirumala, displaying the rich history, jewelry, and architecture.", 79.3510, 13.6860, 75],
  ["Regional Science Centre & Planetarium", "Museums", "An educational and recreational center located in the city.", 79.3950, 13.6390, 70],
  ["Tirupati Regional Archaeological Museum", "Museums", "Houses historical artifacts and antiques found in and around Chittoor.", 79.4205, 13.6255, 55],
  ["Deer Park (Tirumala)", "Nature", "A peaceful enclosure near the Papavinasanam road.", 79.3370, 13.6950, 60],
  ["Shilparamam", "Museums", "An arts, crafts, and cultural village in Tirupati.", 79.4320, 13.6150, 65],
  ["Sri Venkateswara National Park", "Nature", "A vast protected forest area rich in biodiversity.", 79.2500, 13.7500, 85],
  ["Sri Bhu Varaha Swamy Temple", "Spiritual", "Located on the banks of Swami Pushkarini; traditionally visited before the main temple.", 79.3485, 13.6845, 90],
  ["Vyasasramam", "Hidden Gems", "A famous, serene ashram and spiritual center established by Sage Suka.", 79.6210, 13.6840, 40],
  ["Hathiramji Mutt", "Hidden Gems", "A historic and prominent matha in Tirumala.", 79.3501, 13.6821, 35],
  ["Suka Bramhasramam", "Hidden Gems", "A well-known ashram in the region offering spiritual retreats.", 79.6010, 13.6910, 35],
  ["Sri Brahmeswar Parswanath Swarna Jain Mandir", "Spiritual", "A peaceful and historically important Jain temple located in the city.", 79.4250, 13.6210, 45],
  ["Sri Gangamma Temple", "Spiritual", "Highly revered local deity; the annual Gangamma Jatara is a major cultural event.", 79.4230, 13.6310, 70],
  ["Kashi Vishweshwar Temple", "Spiritual", "A beautiful Shiva temple located within the Nagalapuram complex.", 79.7920, 13.3990, 50],
  ["Swami Pushkarini Lake", "Spiritual", "The holy tank adjacent to the Tirumala temple.", 79.3490, 13.6840, 85],
  ["Sadasiva Kona", "Hidden Gems", "A beautiful, quiet nature spot featuring a waterfall and a Shiva temple.", 79.7110, 13.4210, 50],
  ["Siddalaya Kandriga", "Hidden Gems", "A serene forested religious area with natural water cascades and temples.", 79.5210, 13.4110, 40],
  ["Kaigal Falls", "Waterfalls", "A stunning, lesser-known waterfall located in the Koundinya Wildlife Sanctuary.", 78.6010, 13.0610, 65],
  ["Koundinya Wildlife Sanctuary", "Nature", "The only elephant sanctuary in Andhra Pradesh.", 78.7510, 13.1510, 70]
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let placesSQL = `-- ------------------------------------------------------------------------------\n-- 5. PLACES (LAYER 1)\n-- ------------------------------------------------------------------------------\n`;
let contextSQL = `-- ------------------------------------------------------------------------------\n-- 6. PLACE CONTEXT (LAYER 2)\n-- ------------------------------------------------------------------------------\n`;

for (const p of rawData) {
  const [name, catName, description, lng, lat, basePriority] = p;
  const placeId = generateUUID();
  const slug = generateSlug(name);
  const catId = categories[catName] || categories['Hidden Gems'];
  
  // Layer 1
  placesSQL += `INSERT INTO public.places (id, city_id, category_id, name, slug, description, coordinates, base_priority, verification_status, has_parking, has_restroom, free_entry, requires_ticket) 
VALUES ('${placeId}', '${cityId}', '${catId}', '${name.replace(/'/g, "''")}', '${slug}', '${description.replace(/'/g, "''")}', ST_Point(${lng}, ${lat}), ${basePriority}, 'VERIFIED', ${basePriority > 60}, true, true, false) ON CONFLICT (slug) DO NOTHING;\n`;

  // Layer 2
  const bestTime = (catName === 'Nature' || catName === 'Waterfalls') ? '["Morning", "Afternoon"]' : '["Morning", "Evening"]';
  const idealWeather = (catName === 'Waterfalls' || catName === 'Nature') ? '["Sunny", "Cloudy"]' : '["Sunny", "Cloudy", "Rain"]';
  const indoor = catName === 'Museums';
  const outdoor = catName !== 'Museums';
  const crowdEscape = basePriority < 70;
  
  contextSQL += `INSERT INTO public.place_context (place_id, best_time, ideal_weather, ideal_temperature_min, ideal_temperature_max, season, weekend_friendly, weekday_friendly, hot_weather_friendly, crowd_escape, indoor, outdoor, family_friendly, elderly_friendly, wheelchair_accessible, rtc_available, recommendation_priority)
VALUES ('${placeId}', '${bestTime}'::jsonb, '${idealWeather}'::jsonb, 15, ${indoor ? 45 : 32}, 'All', true, true, ${indoor}, ${crowdEscape}, ${indoor}, ${outdoor}, true, ${basePriority > 70}, false, ${basePriority > 50}, ${basePriority}) ON CONFLICT DO NOTHING;\n`;
}

fs.writeFileSync('supabase/seed_places.sql', placesSQL + '\n' + contextSQL);
console.log('Successfully generated supabase/seed_places.sql with 50 places.');
