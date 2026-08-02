import { Place, PlaceType, BudgetLevel } from '@/types/place';
import { PLACES } from '@/data/places';

export type { Place, PlaceType, BudgetLevel };
export { PLACES };

export function getPlaceGuideData(place: Place) {
  const isSpiritual = place.placeType === 'spiritual' || place.category.toLowerCase().includes('temple') || place.category.toLowerCase().includes('shrine');
  
  const formatHour = (h: number) => {
    if (h === 0 || h === 24) return "12:00 AM";
    if (h === 12) return "12:00 PM";
    return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
  };

  const opening = place.openingTime || (place.openFrom !== undefined ? formatHour(place.openFrom) : "6:00 AM");
  const closing = place.closingTime || (place.openTo !== undefined ? formatHour(place.openTo) : "9:00 PM");

  const durationStr = place.duration || (place.durationMins ? `${Math.floor(place.durationMins / 60) > 0 ? `${Math.floor(place.durationMins / 60)}h ` : ''}${place.durationMins % 60 > 0 ? `${place.durationMins % 60}m` : ''}` : "1-2 hours");

  const calcBikeFuel = Math.max(50, Math.round(place.distanceKms * 8));
  const calcCarFuel = Math.max(150, Math.round(place.distanceKms * 20));

  const defaultWhyVisit = place.id === 'sv-zoo-park' 
    ? "Spanning over 1,200 hectares at the foothills of the Seshachalam ranges, this is one of Asia’s largest zoological parks. It operates on modern wilderness conservation values, housing wildlife inside sprawling, near-natural open enclosures rather than small cages. The entire sanctuary features a unique mythological theme, mapping native Indian wildlife species to their sacred context in ancient Vedic lore."
    : "Highly recommended for its unique ambiance, architectural grandeur, and historical importance.";
  const defaultHistory = place.id === 'sv-zoo-park'
    ? "Established in 1987, Sri Venkateswara Zoological Park isn't just a wildlife sanctuary—it is a living tapestry of Hindu mythology. Every enclosure and zone is meticulously designed around ancient Indian scriptures. For instance, the majestic lions are housed in zones mirroring the epic narratives of the Ramayana and Mahabharata. The avian enclosures reflect the celestial birds of the Vedas, while the mighty elephants roam in spaces inspired by Airavata, the divine mount of Lord Indra. This unique thematic approach transforms a simple zoo visit into an immersive journey through India's rich spiritual and ecological heritage, teaching modern conservation through the lens of timeless legends."
    : (place.history || "This site holds a prominent spot in regional lore, boasting historical architecture and cultural significance passed down for centuries.");

  return {
    ...place,
    name: place.name,
    location: place.location,
    category: place.category,
    image: place.image,
    shortIntro: place.shortIntro || place.description || "A beautiful and significant location to experience local heritage and atmosphere.",
    whyVisit: place.whyVisit || place.spiritualInfo?.knownFor || defaultWhyVisit,
    openingTime: opening,
    closingTime: closing,
    bestTime: place.bestTime || "Morning and Evening hours",
    duration: durationStr,
    distanceKms: place.distanceKms,
    travelByRTC: place.travelByRTC || `Frequent APSRTC buses run from Tirupati Central Bus Station directly towards ${place.location || 'the location'}.`,
    travelByCar: place.travelByCar || `Accessible via well-paved roads. Take the main bypass route or local highway. Google Maps navigation is fully reliable.`,
    travelByBike: place.travelByBike || `A scenic and enjoyable ride. Ideal for two-wheelers during daytime. Keep a helmet on and check for local tolls.`,
    approxRTCFare: place.approxRTCFare || `₹${Math.max(20, Math.round(place.distanceKms * 2.5))} per person (one-way)`,
    approxCarCost: place.approxCarCost || `₹${calcCarFuel} for fuel (or ₹${Math.max(400, Math.round(place.distanceKms * 40))} for taxi fare)`,
    approxBikeCost: place.approxBikeCost || `₹${calcBikeFuel} for petrol (approx)`,
    entryFee: place.entryFee || (place.entryFeeNum === 0 ? "Free Entry" : `₹${place.entryFeeNum} per person`),
    history: defaultHistory,
    visitorTips: {
      dressCode: place.visitorTips?.dressCode || (isSpiritual ? "Traditional Indian attire required (Dhoti/Saree/Kurta)." : "Casual comfortable clothing and walking shoes."),
      crowdNote: place.visitorTips?.crowdNote || (place.isMustVisit ? "Heavy weekend crowds expected. Early morning visits recommended." : "Moderate crowd levels throughout the week."),
      footwearRule: place.visitorTips?.footwearRule || (isSpiritual ? "Must be removed before entering the inner sanctum/temple premises." : "Not restricted, but comfortable walking shoes are highly recommended."),
      photoRule: place.visitorTips?.photoRule || (isSpiritual ? "Photography is strictly prohibited inside the main sanctum." : "Permitted everywhere. Bring a good camera for scenic vistas."),
      entryRule: place.visitorTips?.entryRule || (place.entryFeeNum && place.entryFeeNum > 0 ? `Paid entry ticket (₹${place.entryFeeNum}) required. Special queues available.` : "Free public access. Maintain decorum and follow queues.")
    }
  };
}
