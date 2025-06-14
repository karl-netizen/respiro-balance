
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'work' | 'personal' | 'meeting' | 'break';
  description?: string;
}

export class CalendarIntegrationService {
  private static readonly CACHE_KEY = 'calendar_events';
  private static readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  static async getTodaysEvents(): Promise<CalendarEvent[]> {
    try {
      // Check cache first
      const cached = this.getCachedEvents();
      if (cached) return cached;

      // For demo purposes, return mock calendar events
      // In production, you would integrate with Google Calendar, Outlook, etc.
      const mockEvents: CalendarEvent[] = this.generateMockEvents();

      this.cacheEvents(mockEvents);
      return mockEvents;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  private static generateMockEvents(): CalendarEvent[] {
    const now = new Date();
    const events: CalendarEvent[] = [];

    // Generate some realistic mock events for today
    const eventTemplates = [
      { title: 'Team Meeting', type: 'meeting' as const, duration: 60 },
      { title: 'Project Review', type: 'work' as const, duration: 90 },
      { title: 'Lunch Break', type: 'break' as const, duration: 60 },
      { title: 'Client Call', type: 'meeting' as const, duration: 30 },
      { title: 'Personal Task', type: 'personal' as const, duration: 45 }
    ];

    // Add events for the next 8 hours
    for (let i = 0; i < 3; i++) {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      const start = new Date(now.getTime() + (i + 1) * 2 * 60 * 60 * 1000); // Every 2 hours
      const end = new Date(start.getTime() + template.duration * 60 * 1000);

      events.push({
        id: `mock-event-${i}`,
        title: template.title,
        start,
        end,
        type: template.type,
        description: `Mock event for demonstration purposes`
      });
    }

    return events;
  }

  private static getCachedEvents(): CalendarEvent[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      // Convert date strings back to Date objects
      return data.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    } catch {
      return null;
    }
  }

  private static cacheEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: events,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching calendar events:', error);
    }
  }

  static getUpcomingEvents(withinMinutes: number = 60): CalendarEvent[] {
    const cached = this.getCachedEvents();
    if (!cached) return [];

    const now = new Date();
    const cutoff = new Date(now.getTime() + withinMinutes * 60 * 1000);

    return cached.filter(event => 
      event.start > now && event.start <= cutoff
    );
  }
}
