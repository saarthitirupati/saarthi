import 'package:flutter/material.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';
import '../../core/app_state.dart';
import '../../data/admin_repository.dart';
import '../../data/supabase_repository.dart';
import '../../models/darshan.dart';

class DarshanScreen extends StatefulWidget {
  final SupabaseRepository supabaseRepo;

  const DarshanScreen({super.key, required this.supabaseRepo});

  @override
  State<DarshanScreen> createState() => _DarshanScreenState();
}

class _DarshanScreenState extends State<DarshanScreen> {
  final _appState = AppState.instance;
  late DarshanStatus _status;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _status = DarshanStatus.sample();
    _fetchStatus();
  }

  Future<void> _fetchStatus() async {
    // Pull admin live status first so AppState getters update
    try {
      final adminData = await AdminRepository.instance.fetchLiveStatus();
      if (adminData != null) _appState.updateFromAdminLiveStatus(adminData);
    } catch (_) {}

    final s = await widget.supabaseRepo.getLiveDarshanStatus();
    if (mounted) {
      setState(() {
        _status = s;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Darshan & Queue Timings',
          style: TextStyle(fontWeight: FontWeight.w900),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.emerald),
            onPressed: () {
              setState(() => _isLoading = true);
              _fetchStatus();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchStatus,
        color: AppTheme.emerald,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // 1. Live Wait Time Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppTheme.surfaceCard,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.borderSubtle),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Sarva Darshan (Free SSD)',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.statusGreenBg,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _appState.crowdStatus,
                          style: const TextStyle(
                            color: AppTheme.statusGreen,
                            fontWeight: FontWeight.w800,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        _appState.sarvaDarshanWait,
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.emerald,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Current Wait',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Compartments occupied: ${_status.compartmentsFull} / 31',
                    style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Tip: ${_status.recommendation}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF78350F),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 2. Free SSD Token Counters
            const Text(
              'Free SSD Token Counters in Tirupati',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            _buildSsdCounterCard(
              name: 'Bhudevi Complex',
              location: 'Alipiri Footpath Entrance',
              timing: 'Opens 4:00 AM (Aadhaar Card mandatory)',
              icon: Icons.confirmation_number_rounded,
            ),
            _buildSsdCounterCard(
              name: 'Srinivasam Complex',
              location: 'Opposite Tirupati Central Bus Station',
              timing: 'Opens 4:00 AM daily until quota exhausts',
              icon: Icons.directions_bus_rounded,
            ),
            _buildSsdCounterCard(
              name: 'Govindaraja Choultries (Vishnu Nivasam)',
              location: 'Behind Tirupati Railway Station',
              timing: 'Opens 4:00 AM daily',
              icon: Icons.train_rounded,
            ),
            const SizedBox(height: 20),

            // 3. Ghat Road Speed Rules
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.saffronLight,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.saffron.withOpacity(0.3)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.speed_rounded, color: AppTheme.saffron, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Tirumala Ghat Road Speed Regulations',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF78350F),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 10),
                  Text(
                    '• Uphill Ascent: Minimum travel time is 28 minutes from Alipiri Toll Gate to Tirumala.\n'
                    '• Downhill Descent: Minimum travel time is 40 minutes to prevent brake overheating.\n'
                    '• Max Speed Limit: 30 km/h on curves. Heavy automated fines are levied by TTD at the exit toll gates for early arrivals.',
                    style: TextStyle(fontSize: 13, height: 1.4, color: AppTheme.textPrimary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSsdCounterCard({
    required String name,
    required String location,
    required String timing,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surfaceCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.borderSubtle),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppTheme.emeraldLight,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppTheme.emerald, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                ),
                Text(
                  location,
                  style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                ),
                const SizedBox(height: 2),
                Text(
                  timing,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF78350F)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
