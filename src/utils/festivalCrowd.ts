import { FESTIVALS_2026, Festival } from '@/data/festivals';

export interface FestivalCrowdInfo {
  hasImpact: boolean;
  isFestivalActive: boolean;
  isUpcoming: boolean;
  daysUntil?: number;
  festival?: Festival;
  festivalName: string;
  festivalDate: string;
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Peak Rush';
  isDirectCenter: boolean;
  badgeTextEn: string;
  badgeTextTe: string;
  alertTitleEn: string;
  alertTitleTe: string;
  alertMessageEn: string;
  alertMessageTe: string;
  recommendedTime: string;
  specialTips?: string;
}

/**
 * Normalizes a Date into YYYY-MM-DD in Indian Standard Time (IST / UTC+5:30)
 */
function getTodayISTString(date: Date = new Date()): string {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 3600000 * 5.5);
  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const day = String(ist.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes difference in calendar days between two YYYY-MM-DD strings
 */
function getDayDifference(targetDateStr: string, todayStr: string): number {
  const [y1, m1, d1] = targetDateStr.split('-').map(Number);
  const [y2, m2, d2] = todayStr.split('-').map(Number);
  const dTarget = new Date(y1, m1 - 1, d1).getTime();
  const dToday = new Date(y2, m2 - 1, d2).getTime();
  return Math.round((dTarget - dToday) / (1000 * 60 * 60 * 24));
}

/**
 * Dynamic Festival Crowd Intelligence
 * Evaluates whether the given placeId is directly hosting or experiencing spillover crowds from an active or upcoming festival.
 */
export function getFestivalCrowdIntelligence(
  placeId: string, 
  customDate?: Date
): FestivalCrowdInfo {
  if (!placeId) {
    return createDefaultInfo();
  }

  const todayStr = getTodayISTString(customDate);
  const normalizedId = placeId.toLowerCase().trim();

  // Find all festivals linked to this temple (direct placeId or in relatedTemples)
  const matchingFestivals = FESTIVALS_2026.filter(f => {
    const directMatch = (f.placeId || '').toLowerCase() === normalizedId;
    const relatedMatch = (f.relatedTemples || []).some(
      t => t.toLowerCase() === normalizedId || normalizedId.includes(t.toLowerCase()) || t.toLowerCase().includes(normalizedId)
    );
    return directMatch || relatedMatch;
  });

  if (matchingFestivals.length === 0) {
    return createDefaultInfo();
  }

  // 1. Check for TODAY'S ACTIVE FESTIVALS
  for (const fest of matchingFestivals) {
    const diff = getDayDifference(fest.date, todayStr);
    
    // Active if today is the festival date
    if (diff === 0) {
      const isDirectCenter = (fest.placeId || '').toLowerCase() === normalizedId;
      const crowdLevel: FestivalCrowdInfo['crowdLevel'] = isDirectCenter
        ? (fest.expectedCrowd === 'Very High' ? 'Peak Rush' : (fest.expectedCrowd || 'High'))
        : 'High';

      return {
        hasImpact: true,
        isFestivalActive: true,
        isUpcoming: false,
        daysUntil: 0,
        festival: fest,
        festivalName: fest.name,
        festivalDate: fest.date,
        crowdLevel,
        isDirectCenter,
        badgeTextEn: isDirectCenter ? `🔥 Peak Rush: ${fest.name}` : `🟡 High Crowd (${fest.name})`,
        badgeTextTe: isDirectCenter ? `🔥 అత్యధిక రద్దీ: ${fest.name}` : `🟡 అధిక రద్దీ (${fest.name})`,
        alertTitleEn: isDirectCenter ? `Festival Day: ${fest.name}` : `Spillover Devotee Rush: ${fest.name}`,
        alertTitleTe: isDirectCenter ? `పండుగ దినం: ${fest.name}` : `భక్తుల రద్దీ హెచ్చరిక: ${fest.name}`,
        alertMessageEn: isDirectCenter
          ? `Primary sacred celebrations for ${fest.name} are taking place today at this temple. Devotee footfall and queue lines are at peak levels.`
          : `High pilgrim footfall expected today due to devotees visiting in connection with ${fest.name}.`,
        alertMessageTe: isDirectCenter
          ? `నేడు ఈ ఆలయంలో ${fest.name} ప్రధాన ఉత్సవాలు జరుగుతున్నాయి. దర్శనానికి భక్తుల రద్దీ అత్యధికంగా ఉంటుంది.`
          : `${fest.name} సందర్భంగా ఈ ఆలయానికి భక్తుల రద్దీ అధికంగా ఉండే అవకాశం ఉంది.`,
        recommendedTime: fest.recommendedTime || 'Early morning before 7:00 AM or late evening after 8:00 PM',
        specialTips: fest.specialTips
      };
    }
  }

  // 2. Check for UPCOMING FESTIVALS (next 1 to 2 days)
  for (const fest of matchingFestivals) {
    const diff = getDayDifference(fest.date, todayStr);
    if (diff >= 1 && diff <= 2) {
      const isDirectCenter = (fest.placeId || '').toLowerCase() === normalizedId;
      const dayLabelEn = diff === 1 ? 'Tomorrow' : 'in 2 days';
      const dayLabelTe = diff === 1 ? 'రేపు' : '2 రోజుల్లో';

      return {
        hasImpact: true,
        isFestivalActive: false,
        isUpcoming: true,
        daysUntil: diff,
        festival: fest,
        festivalName: fest.name,
        festivalDate: fest.date,
        crowdLevel: isDirectCenter ? 'High' : 'Moderate',
        isDirectCenter,
        badgeTextEn: `⏳ Upcoming: ${fest.name} (${dayLabelEn})`,
        badgeTextTe: `⏳ రాబోయే పండుగ: ${fest.name} (${dayLabelTe})`,
        alertTitleEn: `Upcoming Festival: ${fest.name} (${dayLabelEn})`,
        alertTitleTe: `రాబోయే ఉత్సవం: ${fest.name} (${dayLabelTe})`,
        alertMessageEn: `${fest.name} is scheduled for ${fest.date} (${dayLabelEn}). Pilgrim arrivals and weekend rush are expected to increase.`,
        alertMessageTe: `${fest.date} (${dayLabelTe}) న ${fest.name} వేడుకలు ప్రారంభం కానున్నాయి. భక్తుల రాక పెరిగే అవకాశం ఉంది.`,
        recommendedTime: fest.recommendedTime || 'Morning hours recommended before festival rush begins',
        specialTips: fest.specialTips
      };
    }
  }

  return createDefaultInfo();
}

function createDefaultInfo(): FestivalCrowdInfo {
  return {
    hasImpact: false,
    isFestivalActive: false,
    isUpcoming: false,
    festivalName: '',
    festivalDate: '',
    crowdLevel: 'Moderate',
    isDirectCenter: false,
    badgeTextEn: '',
    badgeTextTe: '',
    alertTitleEn: '',
    alertTitleTe: '',
    alertMessageEn: '',
    alertMessageTe: '',
    recommendedTime: '6:00 AM - 11:00 AM or post 5:00 PM'
  };
}
