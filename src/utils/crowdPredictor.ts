export interface CrowdPrediction {
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  trafficAlert: string;
  parking: 'Available' | 'Limited' | 'Very Limited';
  rawScore: number;
}

/**
 * Predicts the crowd and traffic for a given festival using an exponential time-decay model.
 * @param gravityScore The inherent magnitude of the festival (1-10)
 * @param daysRemaining Days left until the festival date (0 = today)
 * @param isWeekend Boolean indicating if the target calculation day is a weekend
 * @returns CrowdPrediction object containing calculated levels
 */
export function predictCrowdMetrics(
  gravityScore: number,
  daysRemaining: number,
  isWeekend: boolean
): CrowdPrediction {
  // Ensure we don't calculate for past days
  const validDays = Math.max(0, daysRemaining);

  // Exponential decay function: score reduces as days remaining increase.
  // Using a decay constant of 0.25 means the score halves roughly every 2.7 days.
  // At days = 0, decayFactor = 1.0
  // At days = 3, decayFactor = ~0.47
  // At days = 7, decayFactor = ~0.17
  const decayConstant = 0.25;
  const decayFactor = Math.exp(-decayConstant * validDays);

  let rawScore = gravityScore * decayFactor;

  // Weekend multiplier: Weekends naturally attract 20% more baseline crowd
  if (isWeekend) {
    rawScore *= 1.2;
  }

  // Cap the score at 10
  rawScore = Math.min(10, rawScore);

  let crowdLevel: CrowdPrediction['crowdLevel'] = 'Low';
  let trafficAlert = 'Normal Traffic';
  let parking: CrowdPrediction['parking'] = 'Available';

  if (rawScore >= 8) {
    crowdLevel = 'Very High';
    trafficAlert = 'Severe Congestion';
    parking = 'Very Limited';
  } else if (rawScore >= 5) {
    crowdLevel = 'High';
    trafficAlert = 'High Congestion';
    parking = 'Limited';
  } else if (rawScore >= 3) {
    crowdLevel = 'Moderate';
    trafficAlert = 'Traffic Building Up';
    parking = 'Available'; // Maybe 'Limited' if close to 5, but 'Available' is fine for Moderate
  } else {
    crowdLevel = 'Low';
    trafficAlert = 'Normal Traffic';
    parking = 'Available';
  }

  return {
    crowdLevel,
    trafficAlert,
    parking,
    rawScore
  };
}
