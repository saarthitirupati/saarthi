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
  evKwh: number;
}

export interface TransportEstimate {
  mode: 'walk' | 'bike' | 'car' | 'suv' | 'ev' | 'auto' | 'bus';
  title: string;
  vehicleType?: string;
  fuelType?: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'None';
  distanceKm: number;
  travelTimeMins: number;
  fuelUsedLiters: number;
  fuelUsedUnit: string;
  fuelCost: number;
  tollCost: number;
  parkingCost: number;
  fareMin: number;
  fareMax: number;
  totalCostMin: number;
  totalCostMax: number;
  costPerPerson: number;
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
  fuelSource?: string;
  district?: string;
  passengers: number;
  isRoundTrip: boolean;
  estimates: Record<string, TransportEstimate>;
  bestMode: string;
  explainability: string[];
}

export const DEFAULT_FUEL_RATES: FuelRates = {
  petrol: 108.49,
  diesel: 100.28,
  cng: 88.50,
  evKwh: 8.50
};

export const VEHICLE_PRESETS = {
  bike_commuter: { name: 'Commuter Bike (100–125cc)', mileage: 52.0, fuel: 'petrol' as const, ghatFactor: 1.15 },
  bike_cruiser: { name: 'Cruiser / Royal Enfield (350cc)', mileage: 35.0, fuel: 'petrol' as const, ghatFactor: 1.18 },
  bike_ev: { name: 'Electric Scooter (Ather/Ola)', mileage: 33.3, fuel: 'ev' as const, unitRate: 0.35, ghatFactor: 1.20 },
  car_petrol: { name: 'Hatchback / Sedan (Petrol)', mileage: 16.0, fuel: 'petrol' as const, ghatFactor: 1.22 },
  car_diesel: { name: 'Hatchback / Sedan (Diesel)', mileage: 20.0, fuel: 'diesel' as const, ghatFactor: 1.20 },
  suv_diesel: { name: 'SUV / 7-Seater (Innova/Scorpio)', mileage: 12.0, fuel: 'diesel' as const, ghatFactor: 1.25 },
  car_ev: { name: 'Electric Car (Nexon EV / ZS EV)', mileage: 7.14, fuel: 'ev' as const, unitRate: 1.20, ghatFactor: 1.25 }
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
    fuelType: 'None',
    distanceKm: walkDist,
    travelTimeMins: walkTimeMins,
    fuelUsedLiters: 0,
    fuelUsedUnit: 'km',
    fuelCost: 0,
    tollCost: 0,
    parkingCost: 0,
    fareMin: 0,
    fareMax: 0,
    totalCostMin: 0,
    totalCostMax: 0,
    costPerPerson: 0,
    caloriesBurned: calories,
    stepCount: steps,
    recommendationStatus: walkRec,
    recommendationTag: walkDist <= 1.5 ? 'Saarthi Suggests (Zero Cost)' : walkDist > 4.0 ? 'Not Recommended for Long Distance' : 'Healthy Walking Route',
    reasons: [
      `Burns ~${calories} kcal & ${steps.toLocaleString()} steps`,
      'Zero fuel or ticket cost',
      walkDist > 3.0 ? 'Consider vehicle transport for comfortable travel' : 'Ideal for nearby pilgrimage spots'
    ]
  };

  // 2. BIKE COMMUTER (100–125cc)
  const bikeMileage = customMileage.bike || VEHICLE_PRESETS.bike_commuter.mileage;
  const bikeDist = totalDist;
  const bikeSpeed = isTirumalaRoute ? 30 : 35;
  const bikeTimeMins = Math.round(((bikeDist / bikeSpeed) * 60) * trafficTimeMult);
  const bikeGhatMult = isTirumalaRoute ? VEHICLE_PRESETS.bike_commuter.ghatFactor : 1.0;
  const bikeLiters = Number(((bikeDist / bikeMileage) * bikeGhatMult).toFixed(2));
  const bikeFuelCost = Math.round(bikeLiters * currentFuelRates.petrol);
  const bikeParking = isTirumalaRoute ? 15 : 10;
  const bikeTotal = bikeFuelCost + bikeParking;

  const bikeEstimate: TransportEstimate = {
    mode: 'bike',
    title: 'Motorcycle / Scooter',
    vehicleType: 'Commuter (100–125cc)',
    fuelType: 'Petrol',
    distanceKm: bikeDist,
    travelTimeMins: bikeTimeMins,
    fuelUsedLiters: bikeLiters,
    fuelUsedUnit: 'L',
    fuelCost: bikeFuelCost,
    tollCost: 0,
    parkingCost: bikeParking,
    fareMin: bikeTotal,
    fareMax: bikeTotal,
    totalCostMin: bikeTotal,
    totalCostMax: bikeTotal,
    costPerPerson: Math.round(bikeTotal / Math.min(2, safePassengers)),
    recommendationStatus: liveParkingStatus === 'full' ? 'best' : 'recommended',
    recommendationTag: liveParkingStatus === 'full' ? 'Saarthi Suggests (Easy Parking)' : 'Fast & Economical',
    reasons: [
      `Uses ~${bikeLiters} L petrol @ ₹${currentFuelRates.petrol}/L`,
      'Two-wheelers are exempt from toll charges',
      isTirumalaRoute ? 'Helmets mandatory; Ghat road open 3:00 AM – 12:00 Midnight' : 'Fastest navigation through busy town lanes'
    ]
  };

  // 3. CAR (Petrol Hatchback / Sedan)
  const carMileage = customMileage.car || VEHICLE_PRESETS.car_petrol.mileage;
  const carDist = totalDist;
  const carSpeed = isTirumalaRoute ? 25 : 30;
  const carTimeMins = Math.round(((carDist / carSpeed) * 60) * trafficTimeMult);
  const carGhatMult = isTirumalaRoute ? VEHICLE_PRESETS.car_petrol.ghatFactor : 1.0;
  const carLiters = Number(((carDist / carMileage) * carGhatMult).toFixed(2));
  const carFuelCost = Math.round(carLiters * currentFuelRates.petrol);
  const carToll = isTirumalaRoute ? 0 : carDist > 60 ? 85 : 0;
  const carParking = isTirumalaRoute ? 50 : 30;
  const carTotal = carFuelCost + carToll + carParking;

  const carEstimate: TransportEstimate = {
    mode: 'car',
    title: 'Personal Car (Petrol)',
    vehicleType: 'Hatchback / Sedan (Petrol)',
    fuelType: 'Petrol',
    distanceKm: carDist,
    travelTimeMins: carTimeMins,
    fuelUsedLiters: carLiters,
    fuelUsedUnit: 'L',
    fuelCost: carFuelCost,
    tollCost: carToll,
    parkingCost: carParking,
    fareMin: carTotal,
    fareMax: carTotal,
    totalCostMin: carTotal,
    totalCostMax: carTotal,
    costPerPerson: Math.round(carTotal / safePassengers),
    recommendationStatus: liveParkingStatus === 'full' ? 'not_recommended' : liveTrafficStatus === 'heavy' ? 'warning' : 'recommended',
    recommendationTag: liveParkingStatus === 'full' ? 'Parking Constrained on Hill' : 'Comfortable Family Drive',
    reasons: [
      `Fuel: ~${carLiters} L @ ₹${currentFuelRates.petrol}/L (₹${carFuelCost})`,
      `Cost per person: ₹${Math.round(carTotal / safePassengers)} (${safePassengers} pilgrim${safePassengers > 1 ? 's' : ''})`,
      isTirumalaRoute ? 'Tirumala Hill descent minimum time is 28 mins for safety' : 'Ideal for family & luggage'
    ]
  };

  // 4. SUV / MUV (7-Seater Diesel)
  const suvMileage = customMileage.suv || VEHICLE_PRESETS.suv_diesel.mileage;
  const suvDist = totalDist;
  const suvTimeMins = carTimeMins;
  const suvGhatMult = isTirumalaRoute ? VEHICLE_PRESETS.suv_diesel.ghatFactor : 1.0;
  const suvLiters = Number(((suvDist / suvMileage) * suvGhatMult).toFixed(2));
  const suvFuelCost = Math.round(suvLiters * currentFuelRates.diesel);
  const suvToll = isTirumalaRoute ? 0 : suvDist > 60 ? 110 : 0;
  const suvParking = isTirumalaRoute ? 100 : 50;
  const suvTotal = suvFuelCost + suvToll + suvParking;

  const suvEstimate: TransportEstimate = {
    mode: 'suv',
    title: 'SUV / 7-Seater (Diesel)',
    vehicleType: 'Innova / Scorpio (Diesel)',
    fuelType: 'Diesel',
    distanceKm: suvDist,
    travelTimeMins: suvTimeMins,
    fuelUsedLiters: suvLiters,
    fuelUsedUnit: 'L',
    fuelCost: suvFuelCost,
    tollCost: suvToll,
    parkingCost: suvParking,
    fareMin: suvTotal,
    fareMax: suvTotal,
    totalCostMin: suvTotal,
    totalCostMax: suvTotal,
    costPerPerson: Math.round(suvTotal / safePassengers),
    recommendationStatus: safePassengers >= 5 ? 'best' : 'recommended',
    recommendationTag: safePassengers >= 5 ? 'Saarthi Suggests (Best for Groups)' : 'Spacious Group Travel',
    reasons: [
      `Uses ~${suvLiters} L Diesel @ ₹${currentFuelRates.diesel}/L (₹${suvFuelCost})`,
      `Economical for groups: only ₹${Math.round(suvTotal / safePassengers)}/person`,
      'Spacious luggage capacity for prasadams & baggage'
    ]
  };

  // 5. ELECTRIC VEHICLE (EV Car)
  const evDist = totalDist;
  const evEnergyKwh = Number(((evDist / VEHICLE_PRESETS.car_ev.mileage) * (isTirumalaRoute ? 1.25 : 1.0)).toFixed(2));
  const evCost = Math.round(evDist * VEHICLE_PRESETS.car_ev.unitRate);
  const evParking = carParking;
  const evTotal = evCost + carToll + evParking;

  const evEstimate: TransportEstimate = {
    mode: 'ev',
    title: 'Electric Vehicle (EV Car)',
    vehicleType: 'EV Car (Nexon / ZS EV)',
    fuelType: 'Electric',
    distanceKm: evDist,
    travelTimeMins: carTimeMins,
    fuelUsedLiters: evEnergyKwh,
    fuelUsedUnit: 'kWh',
    fuelCost: evCost,
    tollCost: carToll,
    parkingCost: evParking,
    fareMin: evTotal,
    fareMax: evTotal,
    totalCostMin: evTotal,
    totalCostMax: evTotal,
    costPerPerson: Math.round(evTotal / safePassengers),
    recommendationStatus: 'best',
    recommendationTag: 'Eco-Friendly & Lowest Cost',
    reasons: [
      `Power consumption: ~${evEnergyKwh} kWh (~₹${evCost} @ ₹1.20/km)`,
      'Zero emissions on sacred hill routes',
      'Regenerative braking recharges battery on Tirumala down-ghat'
    ]
  };

  // 6. AUTO RICKSHAW ESTIMATE (Metered Range)
  const autoDist = totalDist;
  const autoTimeMins = Math.round(((autoDist / 25) * 60) * trafficTimeMult);
  const baseFare = 30;
  const baseKm = 2.0;
  const extraPerKm = 15;
  const extraDist = Math.max(0, autoDist - baseKm);
  const calcFare = baseFare + extraDist * extraPerKm;
  const autoMin = Math.max(30, Math.round(calcFare * 0.95));
  const autoMax = Math.round(calcFare * 1.15);

  const autoEstimate: TransportEstimate = {
    mode: 'auto',
    title: 'Auto Rickshaw',
    fuelType: 'CNG',
    distanceKm: autoDist,
    travelTimeMins: autoTimeMins,
    fuelUsedLiters: 0,
    fuelUsedUnit: 'km',
    fuelCost: 0,
    tollCost: 0,
    parkingCost: 0,
    fareMin: autoMin,
    fareMax: autoMax,
    totalCostMin: autoMin,
    totalCostMax: autoMax,
    costPerPerson: Math.round(autoMin / Math.min(3, safePassengers)),
    recommendationStatus: isTirumalaRoute ? 'not_recommended' : 'recommended',
    recommendationTag: isTirumalaRoute ? 'Autos Prohibited on Tirumala Ghat Road' : `Estimated Fare: ₹${autoMin}–₹${autoMax}`,
    reasons: [
      isTirumalaRoute ? 'Auto rickshaws are strictly not permitted on Tirumala Ghat Road' : 'Base fare ₹30 (first 2km) + ₹15/km thereafter',
      'No parking hassle — drops right at temple gate',
      'Available across all railway & bus station pickup points'
    ]
  };

  // 7. APSRTC BUS ESTIMATE
  const busDist = totalDist;
  const busTimeMins = Math.round((busDist / 22) * 60 + 10);
  const busTicketPrice = isTirumalaRoute ? 110 : Math.max(20, Math.round(busDist * 1.8));
  const busTotalMin = busTicketPrice * safePassengers * (isRoundTrip ? 2 : 1);

  const busEstimate: TransportEstimate = {
    mode: 'bus',
    title: 'APSRTC Electric / Express Bus',
    fuelType: 'Electric',
    distanceKm: busDist,
    travelTimeMins: busTimeMins,
    fuelUsedLiters: 0,
    fuelUsedUnit: 'km',
    fuelCost: 0,
    tollCost: 0,
    parkingCost: 0,
    fareMin: busTotalMin,
    fareMax: busTotalMin,
    totalCostMin: busTotalMin,
    totalCostMax: busTotalMin,
    costPerPerson: busTicketPrice * (isRoundTrip ? 2 : 1),
    busDetails: {
      busNumber: isTirumalaRoute ? 'Tirumala Direct Express (Every 5 mins)' : 'Route 201 / Local City Shuttle',
      frequency: isTirumalaRoute ? 'Every 5–10 mins (24x7)' : 'Every 15 mins',
      ticketPrice: busTicketPrice,
      walkTimeMins: 4,
      nearestStop: isTirumalaRoute ? 'Alipiri Bus Depot / Railway Station Bus Stand' : 'Nearest APSRTC Stop (200m)'
    },
    recommendationStatus: isTirumalaRoute || liveParkingStatus === 'full' ? 'best' : 'recommended',
    recommendationTag: 'Saarthi Suggests (Best Value & Zero Parking Stress)',
    reasons: [
      `₹${busTicketPrice}/passenger (${safePassengers} passenger${safePassengers > 1 ? 's' : ''})`,
      'Dedicated bus lane up Tirumala ghat road (bypasses car traffic)',
      'Drops directly at CRO / Central Reception Office'
    ]
  };

  const estimates: Record<string, TransportEstimate> = {
    bike: bikeEstimate,
    car: carEstimate,
    suv: suvEstimate,
    ev: evEstimate,
    bus: busEstimate,
    auto: autoEstimate,
    walk: walkEstimate
  };

  // Best mode recommendation
  let bestMode = 'bike';
  if (isTirumalaRoute || liveParkingStatus === 'full') {
    bestMode = 'bus';
  } else if (safePassengers >= 5) {
    bestMode = 'suv';
  } else if (safePassengers >= 3) {
    bestMode = 'car';
  } else if (totalDist <= 1.5) {
    bestMode = 'walk';
  }

  const explainability = [
    `Calculated for ${totalDist} km ${isRoundTrip ? 'round-trip' : 'one-way'} from ${originName} to ${destName}`,
    `Live IndianAPI Fuel Rates: Petrol ₹${currentFuelRates.petrol}/L, Diesel ₹${currentFuelRates.diesel}/L`,
    isTirumalaRoute ? 'Ghat Road slope factor applied (+15% to +25% fuel burn on uphill)' : 'Standard plains road driving calculation'
  ];

  return {
    originName,
    destinationName: destName,
    isTirumalaRoute,
    distanceKm: totalDist,
    fuelRates: currentFuelRates,
    fuelSource: 'IndianAPI (Live)',
    district: 'Tirupati / Chittoor District',
    passengers: safePassengers,
    isRoundTrip,
    estimates,
    bestMode,
    explainability
  };
}
