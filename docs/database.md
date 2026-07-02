# Database Architecture

Saarthi relies on Supabase (PostgreSQL) as its primary database for dynamic content, such as live status updates, user profiles, and saved itineraries.
For highly static content (e.g., standard definitions of places and stories), we use static data objects located in `src/data/`, allowing for fast, zero-latency reads.

## Key Tables

*   `places`: Information on destinations, historical spots, etc.
*   `live_status`: Current crowd or wait-time telemetry for active locations.
*   *(Additional tables documented as created...)*
