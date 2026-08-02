# Database Architecture

## Supabase PostgreSQL
We rely on Supabase for robust PostgreSQL hosting, complete with Realtime functionality.

### Core Tables
- `places`: Stores location details, coordinates, and descriptions.
- `alerts`: Stores emergency or informational broadcasts.
- `status`: Stores live Darshan wait times and crowd levels.
- `festivals`: Tracks upcoming events.

### Realtime Subscriptions
We use Supabase Realtime for high-velocity data:
- `alerts`
- `status`
- `festivals`

These tables broadcast `INSERT`, `UPDATE`, and `DELETE` events. The frontend subscribes to these events via the `useLiveRefresh` hook to ensure the UI is always up to date without polling.
