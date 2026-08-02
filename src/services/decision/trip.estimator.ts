/**
 * Saarthi Decision Engine - Trip Estimator Service
 * Calculates accurate multi-mode transport estimates, fuel consumption, 
 * metered auto fare ranges, RTC bus routes, calorie burn, and contextual recommendations.
 */

import { calculateDrivingDistance, calculateDistance, TIRUPATI_CENTER } from '@/utils/location';

export interface FuelRates {
  petrol: number;
  diesel: number;
  cng: number;
}

export interface TransportEstimate {
  mode: 'walk' | 'bike' | 'car' | 'auto' | 'bus';
  title: string;
  distanceKm: number;
  travelTimeMins: number;
  fuelUsedLiters: number;
  fuelCost: number;
  parkingCost: number;
  fareMin: number;
  fareMax: number;
  totalCostMin: number;
  totalCostMax: number;
  caloriesBurned?: number;
  stepCount?: number;
  busDetails?: {
    busNumber: string;
    frequency: string;
    ticketPrice: number;
    walkTimeMins: number;
    nearestStop: string;
  };
  recommendationStatus: 'best' | 'recommended' | 'warning' | 'not_recommended';
  recommendationTag: string;
  reasons: string[];
}

export interface TripEstimateResult {
  originName: string;
  destinationName: string;
  isTirumalaRoute: boolean;
  distanceKm: number;
  fuelRates: FuelRates;
  estimates: Record<string, TransportEstimate>;
  bestMode: string;
  explainability: string[];
}

export const DEFAULT_FUEL_RATES: FuelRates = {
  petrol: 108.50,
  diesel: 96.20,
  cng: 89.00
};

export const VEHICLE_MILEAGE_DEFAULTS = {
  bike: 45.0,  // km/L
  car: 15.0,   // km/L
  suv: 11.0,   // km/L
  auto: 22.0,  // km/kg CNG
  bus: 4.0     // km/L Diesel
};

export async function calculateTripEstimates(params: {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  originName?: string;
  destName?: string;
  passengers?: number;
  isRoundTrip?: boolean;
  customMileage?: Partial<Record<string, number>>;
  fuelRates?: Partial<FuelRates>;
  liveParkingStatus?: 'available' | 'limited' | 'full';
  liveTrafficStatus?: 'normal' | 'busy' | 'heavy';
}): Promise<TripEstimateResult> {
  const {
    originLat,
    originLng,
    destLat,
    destLng,
    originName = 'Current Location',
    destName = 'Destination',
    passengers = 1,
    isRoundTrip = false,
    customMileage = {},
    fuelRates: overrideFuel = {},
    liveParkingStatus = 'available',
    liveTrafficStatus = 'normal'
  } = params;

  const currentFuelRates: FuelRates = {
    ...DEFAULT_FUEL_RATES,
    ...overrideFuel
  };

  const isTirumalaRoute = 
    destName.toLowerCase().includes('tirumala') || 
    originName.toLowerCase().includes('tirumala') ||
    destName.toLowerCase().includes('svt') ||
    destName.toLowerCase().includes('srivari');

  const rawDist = calculateDrivingDistance(originLat, originLng, destLat, destLng, isTirumalaRoute);
  const totalDist = Number((rawDist * (isRoundTrip ? 2 : 1)).toFixed(1));
  const safePassengers = Math.max(1, passengers);

  // Mileage profiles
  const bikeMileage = customMileage.bike || VEHICLE_MILEAGE_DEFAULTS.bike;
  const carMileage = customMileage.car || VEHICLE_MILEAGE_DEFAULTS.car;

  // Traffic multiplier
  const trafficTimeMult = liveTrafficStatus === 'heavy' ? 1.4 : liveTrafficStatus === 'busy' ? 1.2 : 1.0;

  // 1. WALKING ESTIMATE
  const walkDist = totalDist;
  const walkTimeMins = Math.round((walkDist / 4.2) * 60);
  const calories = Math.round(walkDist * 65);
  const steps = Math.round(walkDist * 1350);
  
  const walkRec: 'best' | 'recommended' | 'warning' | 'not_recommended' = 
    walkDist <= 1.5 ? 'best' : walkDist <= 3.0 ? 'recommended' : 'not_recommended';

  const walkEstimate: TransportEstimate = {
    mode: 'walk',
    title: 'Walking',
    distanceKm: walkDist,
    travelTimeMins: walkTimeMins,
    fuelUsedLiters: 0,
    fuelCost: 0,
    parkingCost: 0,
    fareMin: 0,
    fareMax: 0,
    totalCostMin: 0,
    totalCostMax: 0,
    caloriesBurned: calories,
    stepCount: steps,
    recommendationStatus: walkRec,
    recommendationTag: walkDist <= 1.5 ? '⭐ Saarthi Suggests (Zero Cost)' : walkDist > 4.0 ? '❌ Too Far to Walk' : 'Healthy Option',
    reasons: [
      `Burns ~${calories} kcal & ${steps.toLocaleString()} steps`,
      'Zero fuel or ticket cost',
      walkDist > 3.0 ? 'Consider vehicle transport for comfort' : 'Ideal for nearby pilgrimage spots'
    ]
  };

  // 2. BIKE / SCOOTER ESTIMATE
  const bikeDist = totalDist;
  const bikeSpeed = isTirumalaRoute ? 30 : 35;
  const bikeTimeMins = Math.round(((bikeDist / bikeSpeed) * 60) * trafficTimeMult);
  const bikeLiters = Number((bikeDist / bikeMileage).toFixed(2));
  const bikeFuelCost = Math.round(bikeLiters * currentFuelRates.petrol);
  const bikeParking = isTirumalaRoute ? 15 : 10;

  const bikeRec: 'best' | 'recommended' | 'warning' | 'not_recommended' = 
    liveParkingStatus === 'full' ? 'best' : 'recommended';

  const bikeEstimate: TransportEstimate = {
    mode: 'bike',
    title: 'Motorcycle / Scooter',
    distanceKm: bikeDist,
    travelTimeMins: bikeTimeMins,
    fuelUsedLiters: bikeLiters,
    fuelCost: bikeFuelCost,
    parkingCost: bikeParking,
    fareMin: bikeFuelCost + bikeParking,
    fareMax: bikeFuelCost + bikeParking,
    totalCostMin: bikeFuelCost + bikeParking,
    totalCostMax: bikeFuelCost + bikeParking,
    recommendationStatus: bikeRec,
    recommendationTag: liveParkingStatus === 'full' ? '⭐ Saarthi Suggests (Easy Parking)' : 'Fast & Economical',
    reasons: [
      `Uses ~${bikeLiters} L petrol @ ₹${currentFuelRates.petrol}/L`,
      'Easy parking near temple entrance',
      'Fastest navigation through busy town lanes'
    ]
  };

  // 3. CAR ESTIMATE
  const carDist = totalDist;
  const carSpeed = isTirumalaRoute ? 25 : 30;
  const carTimeMins = Math.round(((carDist / carSpeed) * 60) * trafficTimeMult);
  const carLiters = Number((carDist / carMileage).toFixed(2));
  const carFuelCost = Math.round(carLiters * currentFuelRates.petrol);
  const carToll = isTirumalaRoute ? 250 : carDist > 60 ? 80 : 0;
  const carParking = isTirumalaRoute ? 50 : 30;
  const carTotal = carFuelCost + carToll + carParking;

  const carRec: 'best' | 'recommended' | 'warning' | 'not_recommended' = 
    liveParkingStatus === 'full' ? 'not_recommended' : liveTrafficStatus === 'heavy' ? 'warning' : 'recommended';

  const carEstimate: TransportEstimate = {
    mode: 'car',
    title: 'Personal Car',
    distanceKm: carDist,
    travelTimeMins: carTimeMins,
    fuelUsedLiters: carLiters,
    fuelCost: carFuelCost,
    parkingCost: carParking + carToll,
    fareMin: carTotal,
    fareMax: carTotal,
    totalCostMin: carTotal,
    totalCostMax: carTotal,
    recommendationStatus: carRec,
    recommendationTag: liveParkingStatus === 'full' ? '❌ Not Recommended Today (Parking Full)' : 'Comfortable Family Drive',
    reasons: [
      `Fuel: ~${carLiters} L @ ₹${currentFuelRates.petrol}/L (₹${carFuelCost})`,
      carToll > 0 ? `Includes ₹${carToll} Alipiri Toll Fee` : 'No toll fees',
      liveParkingStatus === 'full' ? 'Parking is full — expect delays finding a spot' : 'Comfortable for families with elderly pilgrims'
    ]
  };

  // 4. AUTO RICKSHAW ESTIMATE (Metered Range)
  const autoDist = totalDist;
  const autoTimeMins = Math.round(((autoDist / 25) * 60) * trafficTimeMult);
  
  // Auto Fare Formula: Base ₹30 for first 2km + ₹15 per extra km
  const baseFare = 30;
  const baseKm = 2.0;
  const extraPerKm = 15;
  const extraDist = Math.max(0, autoDist - baseKm);
  const calcFare = baseFare + extraDist * extraPerKm;
  
  // Range buffer: -5% to +15% for traffic/bargain variance
  const autoMin = Math.max(30, Math.round(calcFare * 0.95));
  const autoMax = Math.round(calcFare * 1.15);

  const autoEstimate: TransportEstimate = {
    mode: 'auto',
    title: 'Auto Rickshaw',
    distanceKm: autoDist,
    travelTimeMins: autoTimeMins,
    fuelUsedLiters: 0,
    fuelCost: 0,
    parkingCost: 0,
    fareMin: autoMin,
    fareMax: autoMax,
    totalCostMin: autoMin,
    totalCostMax: autoMax,
    recommendationStatus: 'recommended',
    recommendationTag: `Estimated Fare: ₹${autoMin}–₹${autoMax}`,
    reasons: [
      `Base fare ₹30 (first 2km) + ₹15/km thereafter`,
      'No parking hassle — drops right at queue entrance',
      'Readily available across all Tirupati junctions'
    ]
  };

  // 5. APSRTC BUS ESTIMATE
  const busDist = totalDist;
  const busTimeMins = Math.round((busDist / 22) * 60 + 10);
  const busTicketPrice = isTirumalaRoute ? 110 : Math.max(20, Math.round(busDist * 1.8));
  const busTotalMin = busTicketPrice * safePassengers * (isRoundTrip ? 2 : 1);

  const busEstimate: TransportEstimate = {
    mode: 'bus',
    title: 'APSRTC Electric / Express Bus',
    distanceKm: busDist,
    travelTimeMins: busTimeMins,
    fuelUsedLiters: 0,
    fuelCost: 0,
    parkingCost: 0,
    fareMin: busTotalMin,
    fareMax: busTotalMin,
    totalCostMin: busTotalMin,
    totalCostMax: busTotalMin,
    busDetails: {
      busNumber: isTirumalaRoute ? 'Tirumala Direct Express (Every 5 mins)' : 'Route 201 / Local City Shuttle',
      frequency: isTirumalaRoute ? 'Every 5–10 mins (24x7)' : 'Every 15 mins',
      ticketPrice: busTicketPrice,
      walkTimeMins: 4,
      nearestStop: isTirumalaRoute ? 'Alipiri Bus Depot / Railway Station Bus Stand' : 'Nearest APSRTC Stop (200m)'
    },
    recommendationStatus: isTirumalaRoute || liveParkingStatus === 'full' ? 'best' : 'recommended',
    recommendationTag: '⭐ Saarthi Suggests (Best Value & Zero Parking Stress)',
    reasons: [
      `₹${busTicketPrice}/passenger (${safePassengers} passenger${safePassengers > 1 ? 's' : ''})`,
      'Dedicated bus lane up Tirumala ghat road (bypasses car traffic)',
      'Drops directly at CRO / Central Reception Office'
    ]
  };

  const estimates: Record<string, TransportEstimate> = {
    walk: walkEstimate,
    bike: bikeEstimate,
    car: carEstimate,
    auto: autoEstimate,
    bus: busEstimate
  };

  // Pick best mode
  let bestMode = 'bike';
  if (isTirumalaRoute || liveParkingStatus === 'full') {
    bestMode = 'bus';
  } else if (totalDist <= 1.5) {
    bestMode = 'walk';
  } else if (safePassengers >= 3) {
    bestMode = 'car';
  }

  const explainability = [
    `Calculated for ${totalDist} km ${isRoundTrip ? 'round-trip' : 'one-way'} from ${originName} to ${destName}`,
    `Live Fuel Rates: Petrol ₹${currentFuelRates.petrol}/L, Diesel ₹${currentFuelRates.diesel}/L, CNG ₹${currentFuelRates.cng}/kg`,
    liveParkingStatus === 'full' ? 'Alert: Tirumala/Destination parking is full — public transport recommended' : 'Parking available at destination'
  ];

  return {
    originName,
    destinationName: destName,
    isTirumalaRoute,
    distanceKm: totalDist,
    fuelRates: currentFuelRates,
    estimates,
    bestMode,
    explainability
  };
}
