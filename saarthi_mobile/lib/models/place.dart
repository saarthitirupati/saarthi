class SpiritualInfo {
  final String? deity;
  final String? knownFor;
  final List<String> devoteeTips;

  SpiritualInfo({
    this.deity,
    this.knownFor,
    this.devoteeTips = const [],
  });

  factory SpiritualInfo.fromJson(Map<String, dynamic>? json) {
    if (json == null) return SpiritualInfo();
    return SpiritualInfo(
      deity: json['deity'] as String?,
      knownFor: json['knownFor'] as String?,
      devoteeTips: (json['devoteeTips'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}

class PlaceCoordinates {
  final double lat;
  final double lng;

  PlaceCoordinates({required this.lat, required this.lng});

  factory PlaceCoordinates.fromJson(Map<String, dynamic>? json) {
    if (json == null) return PlaceCoordinates(lat: 13.6288, lng: 79.4192);
    return PlaceCoordinates(
      lat: (json['lat'] as num?)?.toDouble() ?? 13.6288,
      lng: (json['lng'] as num?)?.toDouble() ?? 79.4192,
    );
  }
}

class Place {
  final String id;
  final String name;
  final String category;
  final String location;
  final double rating;
  final int reviewCount;
  final double distanceKms;
  final String? approxDuration;
  final String? shortIntro;
  final String? description;
  final String? history;
  final String? whyVisit;
  final String? openingTime;
  final String? closingTime;
  final String? bestTime;
  final String? dressCode;
  final String? image;
  final bool isTirumala;
  final PlaceCoordinates coordinates;
  final SpiritualInfo? spiritualInfo;

  // Enriched fields from JSON
  final String? entryFee;
  final String? duration;
  final Map<String, dynamic>? detailedFacilities;
  final Map<String, dynamic>? practicalInfo;
  final Map<String, dynamic>? significance;
  final List<String> nearbyIds;
  final List<String> recommendationReasons;

  Place({
    required this.id,
    required this.name,
    required this.category,
    required this.location,
    this.rating = 4.8,
    this.reviewCount = 500,
    this.distanceKms = 0.0,
    this.approxDuration,
    this.shortIntro,
    this.description,
    this.history,
    this.whyVisit,
    this.openingTime,
    this.closingTime,
    this.bestTime,
    this.dressCode,
    this.image,
    this.isTirumala = false,
    required this.coordinates,
    this.spiritualInfo,
    this.entryFee,
    this.duration,
    this.detailedFacilities,
    this.practicalInfo,
    this.significance,
    this.nearbyIds = const [],
    this.recommendationReasons = const [],
  });

  factory Place.fromJson(Map<String, dynamic> json) {
    final loc = (json['location'] as String? ?? '').toLowerCase();
    final isTirumalaPlace = loc.contains('tirumala') ||
        (json['category'] as String? ?? '').toLowerCase().contains('tirumala') ||
        (json['id'] as String? ?? '') == 'venkateswara';

    // Extract nearby IDs from relationships
    final relationships = json['relationships'] as Map<String, dynamic>?;
    final nearbyRaw = relationships?['nearby'] as List<dynamic>? ?? [];

    // Extract recommendation reasons
    final recCtx = json['recommendationContext'] as Map<String, dynamic>?;
    final reasons = (recCtx?['recommendationReasons'] as List<dynamic>?)
        ?.map((e) => e.toString()).toList() ?? [];

    return Place(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Sacred Temple',
      category: json['category'] as String? ?? 'Spiritual',
      location: json['location'] as String? ?? 'Tirupati',
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewCount: (json['reviewCount'] as num?)?.toInt() ?? 500,
      distanceKms: (json['distanceKms'] as num?)?.toDouble() ?? 0.0,
      approxDuration: json['approxDuration'] as String?,
      shortIntro: json['shortIntro'] as String? ?? json['description'] as String?,
      description: json['description'] as String?,
      history: json['history'] as String?,
      whyVisit: json['whyVisit'] as String?,
      openingTime: json['openingTime'] as String? ?? '6:00 AM',
      closingTime: json['closingTime'] as String? ?? '9:00 PM',
      bestTime: json['bestTime'] as String? ?? 'Early Morning & Evening',
      dressCode: json['dressCode'] as String? ?? 'Traditional Indian Attire',
      image: (json['image'] as String?) != null && (json['image'] as String).startsWith('/')
          ? 'https://www.saarthiguide.in${json['image']}'
          : json['image'] as String?,
      isTirumala: isTirumalaPlace,
      coordinates: PlaceCoordinates.fromJson(json['coordinates'] as Map<String, dynamic>?),
      spiritualInfo: SpiritualInfo.fromJson(json['spiritualInfo'] as Map<String, dynamic>?),
      entryFee: json['entryFee'] as String?,
      duration: json['duration'] as String?,
      detailedFacilities: json['detailedFacilities'] as Map<String, dynamic>?,
      practicalInfo: json['practicalInfo'] as Map<String, dynamic>?,
      significance: json['significance'] as Map<String, dynamic>?,
      nearbyIds: nearbyRaw.map((e) => e.toString()).toList(),
      recommendationReasons: reasons,
    );
  }
}
