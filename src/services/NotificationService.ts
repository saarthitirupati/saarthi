export interface NotificationContext {
  location?: { lat: number; lng: number };
  time?: Date;
  weather?: string;
  userProgress?: {
    heritagePlacesVisited: number;
    totalHeritagePlaces: number;
  };
}

export class NotificationService {
  /**
   * Generates smart alerts based on the user's context.
   */
  static getSmartAlerts(context: NotificationContext) {
    const alerts = [];

    // 1. Time-based (e.g., Friday morning)
    if (context.time) {
      const day = context.time.getDay();
      const hour = context.time.getHours();
      if (day === 5 && hour >= 8 && hour <= 10) { // Friday 8 AM - 10 AM
        alerts.push({
          type: 'time',
          title: 'Weekend Planner',
          message: 'Weekend starts tomorrow. Here are 5 places under ₹500.',
        });
      }
    }

    // 2. Weather-based
    if (context.weather === 'Clear' || context.weather === 'Partly Cloudy') {
      alerts.push({
        type: 'weather',
        title: 'Perfect Weather',
        message: 'Today\'s weather is ideal for waterfalls. Recommended: Talakona, Mamandur.',
      });
    }

    // 3. Discovery-based
    if (context.userProgress) {
      const { heritagePlacesVisited, totalHeritagePlaces } = context.userProgress;
      if (heritagePlacesVisited === totalHeritagePlaces - 1) {
        alerts.push({
          type: 'discovery',
          title: 'Almost there!',
          message: `You've explored ${heritagePlacesVisited} of ${totalHeritagePlaces} heritage places. One more unlocks your Heritage Badge.`,
        });
      }
    }

    // 4. Location-based (Mocked logic for proximity)
    if (context.location) {
      // In a real app, calculate distance to POIs.
      // Mocking being near Talakona Waterfall:
      alerts.push({
        type: 'location',
        title: 'Nearby: Talakona Waterfall',
        message: "📍 You're just 1.8 km from Talakona Waterfall. Crowd is low. Want directions?",
      });
    }

    return alerts;
  }
}
