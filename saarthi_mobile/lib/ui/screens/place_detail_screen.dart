import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme.dart';
import '../../core/app_state.dart';
import '../../core/transitions.dart';
import '../../data/local_repository.dart';
import '../../models/place.dart';
import '../widgets/offline_precinct_map.dart';
import '../widgets/saarthi_image.dart';

class PlaceDetailScreen extends StatelessWidget {
  final Place place;
  final LocalRepository localRepo;

  const PlaceDetailScreen({
    super.key,
    required this.place,
    required this.localRepo,
  });

  Future<void> _launchNavigation() async {
    final uri = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final layout = localRepo.getTempleLayout(place.id);
    final appState = AppState.instance;

    return ListenableBuilder(
      listenable: appState,
      builder: (context, _) {
        final isTelugu = appState.isTelugu;
        final isSaved = appState.isPlaceSaved(place.id);
        final dynamicDist = appState.getDistanceTo(place.coordinates, place.isTirumala);
        final travelTime = appState.formatTravelTime(dynamicDist, place.isTirumala);

        // Resolve nearby places
        final nearbyPlaces = place.nearbyIds
            .map((id) => localRepo.getPlaceById(id))
            .where((p) => p != null)
            .cast<Place>()
            .toList();

        // If nearbyIds is empty, find geographically close places
        final displayNearby = nearbyPlaces.isNotEmpty
            ? nearbyPlaces
            : localRepo.places
                .where((p) => p.id != place.id)
                .where((p) => appState.getDistanceTo(p.coordinates, p.isTirumala) <= 10.0)
                .toList()
              ..sort((a, b) {
                final dA = LocalRepository.calculateHaversineDistance(
                    place.coordinates.lat, place.coordinates.lng, a.coordinates.lat, a.coordinates.lng);
                final dB = LocalRepository.calculateHaversineDistance(
                    place.coordinates.lat, place.coordinates.lng, b.coordinates.lat, b.coordinates.lng);
                return dA.compareTo(dB);
              });

        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          body: CustomScrollView(
            slivers: [
              // 1. Hero Image with Overlaid Controls
              _buildHeroSliver(context, isSaved, appState),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 16),

                      // 2. Title & Location
                      _buildTitleSection(dynamicDist, appState),
                      const SizedBox(height: 16),

                      // 3. Quick Info Cards (Distance, Drive, Status, Entry)
                      _buildQuickInfoRow(dynamicDist, travelTime),
                      const SizedBox(height: 20),

                      // 4. Before You Go — Timings & Practical Info
                      _buildBeforeYouGo(),
                      const SizedBox(height: 16),

                      // 5. Essential Facilities Grid
                      if (place.detailedFacilities != null && place.detailedFacilities!.isNotEmpty) ...[
                        _buildFacilitiesGrid(),
                        const SizedBox(height: 16),
                      ],

                      // 6. Offline Precinct Map
                      if (layout != null) ...[
                        OfflinePrecinctMap(layoutData: layout),
                        const SizedBox(height: 20),
                      ],

                      // 7. About This Place
                      if (place.description != null && place.description!.isNotEmpty) ...[
                        _buildSection(
                          title: 'About This Temple',
                          icon: Icons.info_outline_rounded,
                          content: place.description!,
                        ),
                        const SizedBox(height: 16),
                      ],

                      // 8. Why Visit (Explainable recommendation)
                      if (place.whyVisit != null && place.whyVisit!.isNotEmpty) ...[
                        _buildSection(
                          title: 'Why Visit This Sacred Site',
                          icon: Icons.auto_awesome_rounded,
                          content: place.whyVisit!,
                        ),
                        const SizedBox(height: 16),
                      ],

                      // 9. Devotee Tips
                      if (place.spiritualInfo != null && place.spiritualInfo!.devoteeTips.isNotEmpty) ...[
                        _buildDevoteeTips(),
                        const SizedBox(height: 16),
                      ],

                      // 10. Nearby Sacred Temples
                      if (displayNearby.isNotEmpty) ...[
                        _buildNearbySection(context, displayNearby.take(4).toList(), appState),
                        const SizedBox(height: 16),
                      ],

                      // 11. More Details & Heritage
                      if (place.history != null && place.history!.isNotEmpty) ...[
                        _buildExpandableSection(
                          title: 'Sthala Puranam & Sacred Legend',
                          icon: Icons.history_edu_rounded,
                          content: place.history!,
                        ),
                        const SizedBox(height: 16),
                      ],

                      // 12. Website link
                      _buildWebsiteLink(),
                      const SizedBox(height: 100),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Bottom Navigation Bar
          bottomNavigationBar: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: AppTheme.borderSubtle)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _launchNavigation,
                    icon: const Icon(Icons.navigation_rounded, color: Colors.white, size: 18),
                    label: Text(
                      'Start Navigation  $travelTime',
                      style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.emerald,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                _buildBottomAction(Icons.home_work_rounded, () {}),
                _buildBottomAction(
                  isSaved ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                  () => appState.toggleSavePlace(place.id),
                  color: isSaved ? Colors.red : null,
                ),
                _buildBottomAction(Icons.share_rounded, () {}),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBottomAction(IconData icon, VoidCallback onTap, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(left: 4),
      child: IconButton(
        icon: Icon(icon, size: 22, color: color ?? const Color(0xFF64748B)),
        onPressed: onTap,
        style: IconButton.styleFrom(
          backgroundColor: const Color(0xFFF1F5F9),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
    );
  }

  // 1. HERO IMAGE SLIVER
  Widget _buildHeroSliver(BuildContext context, bool isSaved, AppState appState) {
    return SliverAppBar(
      expandedHeight: 260,
      pinned: true,
      backgroundColor: Colors.white,
      leading: Padding(
        padding: const EdgeInsets.all(6),
        child: CircleAvatar(
          backgroundColor: Colors.black54,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
      ),
      actions: [
        CircleAvatar(
          backgroundColor: Colors.black54,
          child: IconButton(
            icon: const Icon(Icons.share_rounded, color: Colors.white, size: 20),
            onPressed: () {},
          ),
        ),
        const SizedBox(width: 8),
        CircleAvatar(
          backgroundColor: Colors.black54,
          child: IconButton(
            icon: Icon(
              isSaved ? Icons.favorite_rounded : Icons.favorite_border_rounded,
              color: isSaved ? Colors.red : Colors.white,
              size: 20,
            ),
            onPressed: () => appState.toggleSavePlace(place.id),
          ),
        ),
        const SizedBox(width: 12),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            if (place.image != null && place.image!.isNotEmpty)
              SaarthiImage(url: place.image, fit: BoxFit.cover)
            else
              Container(
                color: place.isTirumala ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7),
                child: Icon(
                  place.isTirumala ? Icons.temple_hindu_rounded : Icons.account_balance_rounded,
                  size: 80,
                  color: place.isTirumala ? AppTheme.saffron : AppTheme.emerald,
                ),
              ),
            // Bottom gradient for readability
            const Positioned(
              bottom: 0, left: 0, right: 0,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.transparent, Colors.black54],
                  ),
                ),
                child: SizedBox(height: 80),
              ),
            ),
            // Rating & badges
            Positioned(
              bottom: 12, left: 16,
              child: Row(
                children: [
                  _buildBadge('★ ${place.rating}', const Color(0xFFFEF3C7), AppTheme.saffron),
                  if (place.category.isNotEmpty) ...[
                    const SizedBox(width: 6),
                    _buildBadge(place.category, Colors.white, AppTheme.emerald),
                  ],
                  const SizedBox(width: 6),
                  _buildBadge('• Open Now', const Color(0xFFDCFCE7), AppTheme.emerald),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBadge(String text, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(6)),
      child: Text(text, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: fg)),
    );
  }

  // 2. TITLE & LOCATION
  Widget _buildTitleSection(double dist, AppState appState) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Hero(
          tag: 'place-title-${place.id}',
          child: Material(
            color: Colors.transparent,
            child: Text(
              place.name,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            const Icon(Icons.location_on_rounded, size: 14, color: Color(0xFF64748B)),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                '${place.location} • ~${dist.toStringAsFixed(1)} km from you',
                style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // 3. QUICK INFO ROW
  Widget _buildQuickInfoRow(double dist, String travelTime) {
    final entryLabel = place.entryFee ?? 'Free';
    final shortEntry = entryLabel.length > 12 ? 'Free' : entryLabel;

    return Row(
      children: [
        _buildQuickCard(Icons.straighten_rounded, 'DISTANCE', '${dist.toStringAsFixed(1)} km'),
        const SizedBox(width: 8),
        _buildQuickCard(Icons.directions_car_rounded, 'DRIVE', travelTime, highlight: true),
        const SizedBox(width: 8),
        _buildQuickCard(Icons.circle, 'STATUS', 'Open', statusColor: AppTheme.emerald),
        const SizedBox(width: 8),
        _buildQuickCard(Icons.confirmation_number_outlined, 'ENTRY', shortEntry),
      ],
    );
  }

  Widget _buildQuickCard(IconData icon, String label, String value, {bool highlight = false, Color? statusColor}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: highlight ? AppTheme.emerald.withOpacity(0.3) : AppTheme.borderSubtle),
        ),
        child: Column(
          children: [
            Icon(icon, size: 22, color: statusColor ?? (highlight ? AppTheme.emerald : const Color(0xFF64748B))),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: Color(0xFF94A3B8), letterSpacing: 0.5)),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: highlight ? AppTheme.emerald : AppTheme.textPrimary),
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  // 4. BEFORE YOU GO
  Widget _buildBeforeYouGo() {
    final dressLabel = place.practicalInfo?['dressCode'] as String? ?? place.dressCode ?? 'Traditional';
    final parkingLabel = place.practicalInfo?['parking'] as String? ?? 'Available';
    final phonesLabel = place.practicalInfo?['phones'] as String? ?? 'Allowed Outside';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Before you go', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                border: Border.all(color: AppTheme.borderSubtle),
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text('Status', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // Timings card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFF0FDF4),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.emerald.withOpacity(0.15)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.access_time_rounded, size: 16, color: AppTheme.emerald),
                  const SizedBox(width: 6),
                  Text(
                    'TIMINGS & SCHEDULE',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppTheme.emerald, letterSpacing: 0.3),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                '${place.openingTime} – ${place.closingTime}',
                style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: AppTheme.textPrimary),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10),

        // Practical info chips
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _buildInfoChip(Icons.checkroom_rounded, 'Dress Code', dressLabel),
            _buildInfoChip(Icons.local_parking_rounded, 'Parking', parkingLabel),
            _buildInfoChip(Icons.phone_android_rounded, 'Phones', phonesLabel),
          ],
        ),
      ],
    );
  }

  Widget _buildInfoChip(IconData icon, String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 14, color: AppTheme.emerald),
              const SizedBox(width: 4),
              Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF64748B))),
            ],
          ),
          const SizedBox(height: 4),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 90),
            child: Text(
              value,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.textPrimary),
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
            ),
          ),
        ],
      ),
    );
  }

  // 5. FACILITIES GRID
  Widget _buildFacilitiesGrid() {
    final facilities = place.detailedFacilities!;
    final items = <MapEntry<String, Map<String, dynamic>>>[];

    for (final entry in facilities.entries) {
      if (entry.value is Map<String, dynamic>) {
        final val = entry.value as Map<String, dynamic>;
        if (val['available'] == true) {
          items.add(MapEntry(entry.key, val));
        }
      }
    }
    if (items.isEmpty) return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Essential Facilities', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900)),
          const SizedBox(height: 12),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: items.map((e) => _buildFacilityItem(e.key, e.value)).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildFacilityItem(String key, Map<String, dynamic> data) {
    final icons = {
      'parking': Icons.local_parking_rounded,
      'washrooms': Icons.wc_rounded,
      'drinkingWater': Icons.water_drop_rounded,
      'footwearCounter': Icons.do_not_step_rounded,
      'prasadam': Icons.restaurant_rounded,
      'lockers': Icons.lock_outline_rounded,
    };
    final labels = {
      'parking': 'Parking',
      'washrooms': 'Restrooms',
      'drinkingWater': 'RO Water',
      'footwearCounter': 'Footwear',
      'prasadam': 'Prasadam',
      'lockers': 'Lockers',
    };
    final subLabel = data['distance'] as String? ?? data['cost'] as String? ?? '';

    return SizedBox(
      width: 85,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icons[key] ?? Icons.check_circle_outline_rounded, size: 22, color: AppTheme.emerald),
          ),
          const SizedBox(height: 4),
          Text(
            labels[key] ?? _formatKey(key),
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
            textAlign: TextAlign.center,
            overflow: TextOverflow.ellipsis,
          ),
          if (subLabel.isNotEmpty)
            Text(
              subLabel,
              style: const TextStyle(fontSize: 10, color: Color(0xFF64748B)),
              textAlign: TextAlign.center,
            ),
        ],
      ),
    );
  }

  String _formatKey(String key) {
    return key.replaceAllMapped(RegExp(r'[A-Z]'), (m) => ' ${m[0]}').trim();
  }

  // 9. DEVOTEE TIPS
  Widget _buildDevoteeTips() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.tips_and_updates_rounded, color: AppTheme.emerald, size: 18),
              SizedBox(width: 8),
              Text('Devotee Tips & Guidance', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
            ],
          ),
          const SizedBox(height: 10),
          ...place.spiritualInfo!.devoteeTips.map(
            (tip) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('• ', style: TextStyle(fontWeight: FontWeight.bold)),
                  Expanded(
                    child: Text(tip, style: const TextStyle(fontSize: 13, height: 1.3)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 10. NEARBY SACRED TEMPLES
  Widget _buildNearbySection(BuildContext context, List<Place> nearby, AppState appState) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Nearby Sacred Temples', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
            Text('View All →', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppTheme.emerald)),
          ],
        ),
        const SizedBox(height: 12),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 0.85,
          children: nearby.map((p) => _buildNearbyCard(context, p, appState)).toList(),
        ),
      ],
    );
  }

  Widget _buildNearbyCard(BuildContext context, Place nearbyPlace, AppState appState) {
    final dist = LocalRepository.calculateHaversineDistance(
      place.coordinates.lat, place.coordinates.lng,
      nearbyPlace.coordinates.lat, nearbyPlace.coordinates.lng,
    );
    final distStr = dist < 1.0 ? '${(dist * 1000).toInt()} m' : '${dist.toStringAsFixed(1)} km';
    final driveMin = (dist / 0.5).ceil(); // ~30km/h avg

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        AppTransitions.smoothSlideRoute(
          PlaceDetailScreen(place: nearbyPlace, localRepo: localRepo),
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppTheme.borderSubtle),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    child: SizedBox.expand(
                      child: SaarthiImage(
                        url: nearbyPlace.image,
                        fit: BoxFit.cover,
                        fallbackIcon: Icons.temple_hindu_rounded,
                      ),
                    ),
                  ),
                  Positioned(
                    top: 8, left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black54,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '$driveMin mins',
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    nearbyPlace.name,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      const Icon(Icons.location_on_rounded, size: 11, color: Color(0xFF64748B)),
                      const SizedBox(width: 2),
                      Text(
                        '$distStr away',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 11. EXPANDABLE SECTION
  Widget _buildExpandableSection({required String title, required IconData icon, required String content}) {
    return ExpansionTile(
      tilePadding: const EdgeInsets.symmetric(horizontal: 14),
      childrenPadding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: AppTheme.borderSubtle),
      ),
      collapsedShape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: const BorderSide(color: AppTheme.borderSubtle),
      ),
      backgroundColor: Colors.white,
      collapsedBackgroundColor: Colors.white,
      leading: Icon(icon, color: AppTheme.emerald, size: 18),
      title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800)),
      children: [
        Text(content, style: const TextStyle(fontSize: 13, height: 1.5, color: AppTheme.textPrimary)),
      ],
    );
  }

  // 12. WEBSITE LINK
  Widget _buildWebsiteLink() {
    return Center(
      child: TextButton.icon(
        onPressed: () async {
          final uri = Uri.parse('https://www.saarthiguide.in/place/${place.id}');
          if (await canLaunchUrl(uri)) {
            await launchUrl(uri, mode: LaunchMode.externalApplication);
          }
        },
        icon: const Icon(Icons.open_in_new_rounded, size: 14),
        label: const Text('View on saarthiguide.in', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
      ),
    );
  }

  // GENERIC SECTION CARD
  Widget _buildSection({required String title, required IconData icon, required String content}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: AppTheme.emerald, size: 18),
              const SizedBox(width: 8),
              Flexible(
                child: Text(title, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(fontSize: 13, height: 1.4, color: AppTheme.textPrimary),
          ),
        ],
      ),
    );
  }
}
