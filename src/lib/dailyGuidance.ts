export interface DayTempleInfo {
  dayName: string;
  dayNameTe: string;
  deity: string;
  deityTe: string;
  placeId: string;
  placeName: string;
  placeNameTe: string;
  headlineEn: string;
  headlineTe: string;
  benefitEn: string;
  benefitTe: string;
  reasonsEn: string[];
  reasonsTe: string[];
}

export const DAY_TEMPLE_GUIDES: Record<number, DayTempleInfo> = {
  0: { // Sunday - Sun / Surya & Sacred Theerthams
    dayName: 'Sunday',
    dayNameTe: 'ఆదివారం',
    deity: 'Surya Narayana & Sacred Theerthams',
    deityTe: 'సూర్యనారాయణ స్వామి & పవిత్ర తీర్థాలు',
    placeId: 'papavinasam-theertham',
    placeName: 'Papavinasam & Akasa Ganga Theertham',
    placeNameTe: 'పాపవినాశనం & ఆకాశగంగ తీర్థం',
    headlineEn: 'Sunday: Visit Papavinasam & Akasa Ganga while queue eases.',
    headlineTe: 'ఆదివారం: పాపవినాశనం & ఆకాశగంగ దర్శించండి.',
    benefitEn: '⚡ SAVE 2-3 HOURS WAITING',
    benefitTe: '⚡ 2-3 గంటల నిరీక్షణ ఆదా',
    reasonsEn: [
      'Holy water cleansing before Srivari Darshan',
      'Queue congestion eases after 2:30 PM slot',
      'Peaceful mountain waterfalls away from main rush'
    ],
    reasonsTe: [
      'దర్శనానికి ముందు పవిత్ర తీర్థ స్నానం శుభప్రదం',
      'మధ్యాహ్నం 2:30 తర్వాత క్యూ వేగం పెరుగుతుంది',
      'రద్దీకి దూరంగా ప్రశాంత ఆధ్యాత్మిక అనుభూతి'
    ]
  },
  1: { // Monday - Lord Shiva (Kapila Theertham / Srikalahasti)
    dayName: 'Monday',
    dayNameTe: 'సోమవారం',
    deity: 'Lord Shiva (Kapileswara)',
    deityTe: 'పరమశివుడు (శ్రీ కపిలేశ్వరస్వామి)',
    placeId: 'kapila-theertham',
    placeName: 'Sri Kapileswara Swamy Temple (Kapila Theertham)',
    placeNameTe: 'శ్రీ కపిలేశ్వరస్వామి ఆలయం (కపిలతీర్థం)',
    headlineEn: 'Monday: Visit Kapila Theertham now; queue eases after 2 PM.',
    headlineTe: 'సోమవారం: కపిలతీర్థం దర్శించండి; మధ్యాహ్నం 2 తర్వాత క్యూకి వెళ్లండి.',
    benefitEn: '⚡ SAVE 2 HOURS WAITING',
    benefitTe: '⚡ 2 గంటల నిరీక్షణ ఆదా',
    reasonsEn: [
      'Sacred for Lord Shiva at Kapila Theertham shrine',
      'Queue wait clears significantly after 2:00 PM',
      'Located conveniently near Alipiri entrance'
    ],
    reasonsTe: [
      'శివారాధనకు అత్యంత విశిష్టమైన రోజు',
      'మధ్యాహ్నం 2:00 తర్వాత క్యూ రద్దీ తగ్గుతుంది',
      'అలిపిరి సమీపంలోనే ఆలయం ఉంది'
    ]
  },
  2: { // Tuesday - Hanuman & Shakti (Japali / Gangamma)
    dayName: 'Tuesday',
    dayNameTe: 'మంగళవారం',
    deity: 'Lord Hanuman & Sri Gangamma',
    deityTe: 'శ్రీ ఆంజనేయస్వామి & గంగమ్మ తల్లి',
    placeId: 'japali-hanuman',
    placeName: 'Japali Hanuman Theertham',
    placeNameTe: 'జాపాలి హనుమాన్ తీర్థం',
    headlineEn: 'Tuesday: Visit Japali Hanuman Theertham while queue eases.',
    headlineTe: 'మంగళవారం: జాపాలి హనుమాన్ తీర్థం దర్శించండి.',
    benefitEn: '⚡ SAVE 2.5 HOURS WAITING',
    benefitTe: '⚡ 2.5 గంటల నిరీక్షణ ఆదా',
    reasonsEn: [
      'Sacred for Sri Hanuman at Japali shrine',
      'Afternoon queues move faster as morning rush clears',
      'Shaded forest walk with fresh mountain air'
    ],
    reasonsTe: [
      'ఆంజనేయ స్వామి తపోస్థలి జాపాలి',
      'మధ్యాహ్నం క్యూ లైన్లు వేగంగా కదులుతాయి',
      'ప్రశాంత అటవీ మార్గంలో ఆధ్యాత్మిక అనుభూతి'
    ]
  },
  3: { // Wednesday - Krishna & Ganesha (ISKCON / Kanipakam)
    dayName: 'Wednesday',
    dayNameTe: 'బుధవారం',
    deity: 'Lord Krishna & Vighneshwara',
    deityTe: 'శ్రీకృష్ణుడు & విఘ్నేశ్వరుడు',
    placeId: 'iskcon-tirupati',
    placeName: 'ISKCON Lotus Temple',
    placeNameTe: 'ఇస్కాన్ లోటస్ టెంపుల్',
    headlineEn: 'Wednesday: Visit ISKCON Lotus Temple now; enter queue later.',
    headlineTe: 'బుధవారం: ఇస్కాన్ లోటస్ టెంపుల్ దర్శించండి.',
    benefitEn: '⚡ SAVE 2 HOURS WAITING',
    benefitTe: '⚡ 2 గంటల సమయం ఆదా',
    reasonsEn: [
      'Sacred for Sri Krishna at ISKCON Lotus Temple',
      'Morning peak rush (10 AM - 1 PM) clears during visit',
      'Satvik vegetarian meals available on premise'
    ],
    reasonsTe: [
      'అద్భుతమైన ఇస్కాన్ మందిర దర్శనం',
      'ఉదయం 10-1 గంటల మధ్య రద్దీ తగ్గుతుంది',
      'సాత్విక ప్రసాద భోజనం అందుబాటులో ఉంది'
    ]
  },
  4: { // Thursday - Guru & Srivari Netra Darshanam (Padmavathi / Srinivasa Mangapuram)
    dayName: 'Thursday',
    dayNameTe: 'గురువారం',
    deity: 'Sri Padmavathi Ammavaru & Kalyana Venkateswara',
    deityTe: 'శ్రీ పద్మావతి అమ్మవారు & కళ్యాణ వేంకటేశ్వరుడు',
    placeId: 'padmavathi',
    placeName: 'Sri Padmavathi Ammavari Temple (Tiruchanur)',
    placeNameTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం (తిరుచానూరు)',
    headlineEn: 'Thursday: Visit Goddess Padmavathi at Tiruchanur first.',
    headlineTe: 'గురువారం: తిరుచానూరు పద్మావతి అమ్మవారిని దర్శించండి.',
    benefitEn: '⚡ FULL PILGRIMAGE BLESSINGS + 2 HRS SAVED',
    benefitTe: '⚡ సంపూర్ణ యాత్రా ఫలం + 2 గంటలు ఆదా',
    reasonsEn: [
      'Tiruchanur darshan completes your pilgrimage',
      'Afternoon general queue wait drops significantly',
      '15 mins from Tirupati via frequent electric buses'
    ],
    reasonsTe: [
      'పద్మావతి అమ్మవారి దర్శనంతో యాత్ర సంపూర్ణం',
      'మధ్యాహ్నం క్యూ వేచి ఉండే సమయం తగ్గుతుంది',
      'తిరుపతి నుండి ప్రతి 10 నిమిషాలకు బస్సులు'
    ]
  },
  5: { // Friday - Mahalakshmi & Srivari Abhishekam (Padmavathi Devi)
    dayName: 'Friday',
    dayNameTe: 'శుక్రవారం',
    deity: 'Sri Mahalakshmi (Goddess Padmavathi)',
    deityTe: 'శ్రీ మహాలక్ష్మి (పద్మావతి దేవి)',
    placeId: 'padmavathi',
    placeName: 'Sri Padmavathi Ammavari Temple (Tiruchanur)',
    placeNameTe: 'శ్రీ పద్మావతి అమ్మవారి ఆలయం (తిరుచానూరు)',
    headlineEn: 'Friday: Seek Goddess Padmavathi blessings at Tiruchanur.',
    headlineTe: 'శుక్రవారం: తిరుచానూరు పద్మావతి అమ్మవారిని దర్శించండి.',
    benefitEn: '⚡ MAHALAKSHMI BLESSINGS + 2 HRS SAVED',
    benefitTe: '⚡ మహాలక్ష్మి కృప + 2 గంటలు ఆదా',
    reasonsEn: [
      'Supreme for Goddess Lakshmi kumkuma archana',
      'Smooth Tiruchanur darshan in under 45 mins',
      'Enter Tirumala queue post Friday Abhishekam'
    ],
    reasonsTe: [
      'శుక్రవారం లక్ష్మీదేవి కుంకుమార్చన శుభప్రదం',
      'తిరుచానూరులో 45 నిమిషాల్లో ప్రశాంత దర్శనం',
      'అభిషేక రద్దీ తగ్గిన తర్వాత క్యూకి వెళ్లండి'
    ]
  },
  6: { // Saturday - Shanivara Balaji (Govindaraja Swamy / Srivari Padalu)
    dayName: 'Saturday',
    dayNameTe: 'శనివారం',
    deity: 'Lord Venkateswara & Sri Govindaraja Swamy',
    deityTe: 'శ్రీ వేంకటేశ్వరస్వామి & శ్రీ గోవిందరాజస్వామి',
    placeId: 'govindaraja',
    placeName: 'Sri Govindaraja Swamy Temple',
    placeNameTe: 'శ్రీ గోవిందరాజస్వామి ఆలయం',
    headlineEn: 'Saturday: Visit Sri Govindaraja Swamy Temple in Tirupati.',
    headlineTe: 'శనివారం: శ్రీ గోవిందరాజస్వామిని దర్శించండి.',
    benefitEn: '⚡ AVOID MORNING SURGE + SAVE 3 HOURS',
    benefitTe: '⚡ శనివారపు రద్దీ నివారణ + 3 గంటలు ఆదా',
    reasonsEn: [
      'Srivari & Govindaraja Swamy primary holy day',
      '8th-century historic shrine in Tirupati town',
      'Enter general queue post 2:30 PM'
    ],
    reasonsTe: [
      'శ్రీవారి అన్న గోవిందరాజస్వామి దర్శనం',
      'తిరుపతిలో 8 శతాబ్దాల పురాతన క్షేత్రం',
      'ఉదయపు రద్దీ తగ్గిన తర్వాత క్యూకి వెళ్లండి'
    ]
  }
};

export function getDayTempleGuidance(date = new Date()): DayTempleInfo {
  const day = date.getDay();
  return DAY_TEMPLE_GUIDES[day] || DAY_TEMPLE_GUIDES[1];
}
