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
    headlineEn: 'Sunday is sacred for Holy Theerthams. Cleanse at Papavinasam now and join queue later.',
    headlineTe: 'ఆదివారం పవిత్ర తీర్థాల దినం. పాపవినాశనం దర్శించి, మధ్యాహ్నం తర్వాత శ్రీవారి క్యూకు వెళ్లండి.',
    benefitEn: '⚡ SAVE APPROX. 2-3 HOURS WAITING',
    benefitTe: '⚡ 2-3 గంటల నిరీక్షణ సమయం ఆదా',
    reasonsEn: [
      'Sunday is auspicious for holy water cleansing before Srivari Darshan',
      'Queue congestion eases significantly in the late afternoon slot (post 2:30 PM)',
      'Scenic mountain waterfalls provide peaceful meditation away from crowds'
    ],
    reasonsTe: [
      'శ్రీవారి దర్శనానికి ముందు పవిత్ర తీర్థ జలాల స్నానం అత్యంత పుణ్యప్రదం',
      'మధ్యాహ్నం 2:30 తర్వాత ప్రధాన క్యూ లైన్ల వేగం పెరుగుతుంది',
      'రద్దీకి దూరంగా కొండలపై ప్రశాంత ఆధ్యాత్మిక అనుభూతి లభిస్తుంది'
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
    headlineEn: 'Monday is sacred for Lord Shiva. Visit Kapila Theertham now and enter Srivari queue after lunch.',
    headlineTe: 'సోమవారం పరమశివుడికి ప్రీతికరం. కపిలతీర్థం దర్శించి, మధ్యాహ్నం తర్వాత శ్రీవారి క్యూలో ప్రవేశించండి.',
    benefitEn: '⚡ SAVE APPROX. 2 HOURS IN STATIC QUEUES',
    benefitTe: '⚡ సుమారు 2 గంటల నిరీక్షణ సమయం ఆదా',
    reasonsEn: [
      'Monday is holy for Lord Shiva; Kapila Theertham has sacred waterfall & ancient Shiva shrine',
      'Queue wait clears significantly during afternoon slot (after 2:00 PM)',
      'Located conveniently at the foot of Tirumala hills near Alipiri'
    ],
    reasonsTe: [
      'సోమవారం శివారాధనకు అత్యంత విశిష్టమైన రోజు; కపిలతీర్థ జలపాతంలో శివ దర్శనం శుభప్రదం',
      'మధ్యాహ్నం 2:00 తర్వాత ప్రధాన క్యూ రద్దీ గణనీయంగా తగ్గుతుంది',
      'అలిపిరి సమీపంలో కొండల పాదాల వద్ద ఈ పుణ్యక్షేత్రం ఉంది'
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
    headlineEn: 'Tuesday is dedicated to Lord Hanuman. Trek to Japali Theertham while queue lines ease.',
    headlineTe: 'మంగళవారం శ్రీ ఆంజనేయస్వామికి ప్రీతికరం. జాపాలి తీర్థం దర్శించి, తర్వాత దర్శనానికి వెళ్లండి.',
    benefitEn: '⚡ SAVE APPROX. 2.5 HOURS WAITING',
    benefitTe: '⚡ 2.5 గంటల నిరీక్షణ సమయం ఆదా',
    reasonsEn: [
      'Tuesday is sacred for Sri Hanuman; Japali is where Lord Anjaneya meditated in Tirumala hills',
      'Afternoon queue lines move faster after morning rush batches clear',
      'Shaded forest walk offers spiritual calm and fresh mountain air before darshan'
    ],
    reasonsTe: [
      'మంగళవారం హనుమాన్ ఆరాధనకు విశేషమైన రోజు; జాపాలిలో ఆంజనేయుని తపోస్థలి ఉంది',
      'ఉదయం రద్దీ తగ్గిన తర్వాత మధ్యాహ్నం క్యూ లైన్లు వేగంగా కదులుతాయి',
      'ప్రశాంత అటవీ మార్గంలో ఆధ్యాత్మిక ప్రశాంతత లభిస్తుంది'
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
    headlineEn: 'Wednesday is auspicious for Sri Krishna. Visit ISKCON Temple now and enter queue later.',
    headlineTe: 'బుధవారం శ్రీకృష్ణుడికి ప్రీతికరం. ఇస్కాన్ మందిరాన్ని దర్శించి, తర్వాత క్యూకు వెళ్లండి.',
    benefitEn: '⚡ SAVE APPROX. 2 HOURS WAITING',
    benefitTe: '⚡ సుమారు 2 గంటల సమయం ఆదా',
    reasonsEn: [
      'Wednesday is holy for Sri Krishna; experience golden altar & serene lotus temple architecture',
      'Peak morning rush (10 AM - 1 PM) clears while you enjoy serene temple premises',
      'Satvik vegetarian prasadam & Govinda restaurant available on premise'
    ],
    reasonsTe: [
      'బుధవారం కృష్ణారాధన శుభకరం; అద్భుతమైన ఇస్కాన్ మందిర దర్శనం చేసుకోండి',
      'ఉదయం 10-1 గంటల మధ్య రద్దీ తగ్గే వరకు సమయాన్ని సద్వినియోగం చేసుకోండి',
      'పరిశుభ్రమైన సాత్విక ప్రసాద భోజనం అందుబాటులో ఉంటుంది'
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
    headlineEn: 'Thursday is Srivari Netra Darshanam day. Visit Goddess Padmavathi at Tiruchanur first.',
    headlineTe: 'గురువారం శ్రీవారి నేత్ర దర్శనం. తిరుచానూరు పద్మావతి అమ్మవారిని ముందుగా దర్శించండి.',
    benefitEn: '⚡ COMPLETE PILGRIMAGE BLESSINGS + 2 HRS SAVED',
    benefitTe: '⚡ సంపూర్ణ యాత్రా ఫలం + 2 గంటలు ఆదా',
    reasonsEn: [
      'Sacred tradition: Seeking blessings of Goddess Padmavathi at Tiruchanur completes your pilgrimage',
      'Afternoon general queue wait drops significantly compared to morning rush',
      'Just 15 mins from Tirupati with frequent APSRTC electric bus shuttle service'
    ],
    reasonsTe: [
      'సంప్రదాయం ప్రకారం తిరుచానూరు పద్మావతి అమ్మవారి దర్శనంతోనే యాత్ర సంపూర్ణం అవుతుంది',
      'ఉదయపు రద్దీతో పోలిస్తే మధ్యాహ్నం సమయంలో వేచి ఉండే సమయం బాగా తగ్గుతుంది',
      'తిరుపతి నుండి ప్రతి 10 నిమిషాలకు విద్యుత్ బస్సు సౌకర్యం ఉంది'
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
    headlineEn: 'Friday is sacred for Goddess Lakshmi & Srivari Abhishekam. Seek blessings at Tiruchanur.',
    headlineTe: 'శుక్రవారం అమ్మవారికి & శ్రీవారి అభిషేకానికి అత్యంత పవిత్రం. తిరుచానూరు దర్శించండి.',
    benefitEn: '⚡ SHUKRAVARA MAHALAKSHMI BLESSINGS + 2 HRS SAVED',
    benefitTe: '⚡ శుక్రవార మహాలక్ష్మి కృప + 2 గంటలు ఆదా',
    reasonsEn: [
      'Friday is supreme for Goddess Lakshmi; taking Tiruchanur Kumkuma archana brings prosperity',
      'Smoothly organized queues at Tiruchanur allow peaceful darshan in under 45 mins',
      'Time your Tirumala entry for late afternoon when Friday Abhishekam rush clears'
    ],
    reasonsTe: [
      'శుక్రవారం లక్ష్మీదేవి పూజలకు అత్యంత విశిష్టమైన రోజు; కుంకుమార్చన దర్శనం శుభప్రదం',
      'తిరుచానూరులో 45 నిమిషాల వ్యవధిలో ప్రశాంత దర్శనం లభిస్తుంది',
      'శుక్రవారం అభిషేక రద్దీ తగ్గిన తర్వాత మధ్యాహ్నం శ్రీవారి క్యూకు వెళ్లడం ఉత్తమం'
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
    headlineEn: "Saturday is Srivari's primary holy day. Visit Sri Govindaraja Swamy Temple in town now.",
    headlineTe: 'శనివారం శ్రీవారి విశేష దినం. తిరుపతిలో శ్రీ గోవిందరాజస్వామిని దర్శించండి.',
    benefitEn: '⚡ AVOID MORNING SURGE + SAVE 3 HOURS',
    benefitTe: '⚡ శనివారపు రద్దీ నివారణ + 3 గంటలు ఆదా',
    reasonsEn: [
      "Saturday is Srivari's foremost day; Govindaraja Swamy is Lord Venkateswara's elder brother",
      'Magnificent 8-century historic temple located right in the heart of Tirupati',
      'Bypass peak Saturday morning queue surge by entering general queue after 2:30 PM'
    ],
    reasonsTe: [
      'శనివారం స్వామివారికి అత్యంత ప్రీతికరం; శ్రీవారి అన్నగారైన గోవిందరాజస్వామి దర్శనం విశేషం',
      'తిరుపతి నడిబొడ్డున ఉన్న 8 శతాబ్దాల పురాతన చారిత్రక మహా క్షేత్రం',
      'శనివారపు ఉదయపు విపరీతమైన రద్దీ తగ్గిన తర్వాత మధ్యాహ్నం దర్శనానికి వెళ్లడం మంచిది'
    ]
  }
};

export function getDayTempleGuidance(date = new Date()): DayTempleInfo {
  const day = date.getDay();
  return DAY_TEMPLE_GUIDES[day] || DAY_TEMPLE_GUIDES[1];
}
