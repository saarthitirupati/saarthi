export interface TravelCosts {
  busFare: string;
  carCost: string;
  bikeCost: string;
}

export function calculateTravelCosts(distanceKm: number, isGhatRoute: boolean = false): TravelCosts {
  const dist = Math.max(1, distanceKm);

  if (isGhatRoute) {
    return {
      busFare: `₹60 - ₹100 per person (APSRTC Ghat service)`,
      carCost: `Private Taxi / Cab: ₹1,500 - ₹2,500+ (Ghat Route)`,
      bikeCost: `₹100 for petrol (approx) - Careful on steep curves`
    };
  }

  // 1. Bus Fare (RTC averages: ~₹2 per km for Express, minimum ₹20)
  const busCost = Math.max(20, Math.round(dist * 2.0));
  
  // 2. Car Fuel & Tolls
  // Average mileage: 15 km/l. Petrol: ~₹105/l -> ₹7 per km
  const carFuelCost = Math.round(dist * 7);
  // Tolls: ~₹1.5 per km on highways for trips > 50km
  const tollCost = dist > 50 ? Math.round(dist * 1.5) : 0;
  
  // 3. Taxi Fare
  // Local (Ola/Uber): ~₹20/km
  // Outstation: ~₹14/km (but charges round-trip distance) + driver bata (₹300 if >100km)
  let taxiCost = 0;
  if (dist < 20) {
    taxiCost = Math.max(150, Math.round(dist * 20)); // City taxi min fare
  } else {
    taxiCost = Math.round((dist * 2) * 14); // Round trip calculation for outstation
    if (dist > 100) taxiCost += 300; // Driver bata
  }

  // 4. Bike Fuel
  // Average commuter bike: 45 km/l -> ₹2.33 per km
  const bikeCost = Math.max(30, Math.round(dist * 2.5));

  if (dist < 5) {
    return {
      busFare: `₹20 per person (minimum fare)`,
      carCost: `₹80 - ₹120 for local auto-rickshaw`,
      bikeCost: `₹30 for petrol (approx)`
    };
  }

  const tollString = tollCost > 0 ? ` + ₹${tollCost} toll` : '';

  return {
    busFare: `₹${busCost} per person (one-way)`,
    carCost: `₹${carFuelCost} fuel${tollString} (or ₹${taxiCost} for taxi)`,
    bikeCost: `₹${bikeCost} for petrol (approx)`
  };
}
