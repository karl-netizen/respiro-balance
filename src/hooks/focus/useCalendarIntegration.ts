
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface CalendarConnection {
  id: string;
  provider: 'google' | 'outlook';
  connected: boolean;
  email?: string;
  lastSync?: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([
    { id: 'google', provider: 'google', connected: false },
    { id: 'outlook', provider: 'outlook', connected: false }
  ]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCalendarConnections();
      loadUpcomingEvents();
    }
  }, [user]);

  const loadCalendarConnections = async () => {
    // Mock implementation - in real app, this would check actual connections
    const mockConnections: CalendarConnection[] = [
      { 
        id: 'google', 
        provider: 'google', 
        connected: false,
        email: user?.email,
        lastSync: new Date()
      },
      { 
        id: 'outlook', 
        provider: 'outlook', 
        connected: false 
      }
    ];
    
    setConnections(mockConnections);
  };

  const loadUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      // Mock upcoming events
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Standup',
          start: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          end: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
          location: 'Conference Room A'
        },
        {
          id: '2',
          title: 'Project Review',
          start: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
          end: new Date(Date.now() + 5 * 60 * 60 * 1000),
          description: 'Quarterly project review meeting'
        },
        {
          id: '3',
          title: 'Client Call',
          start: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
          end: new Date(Date.now() + 7 * 60 * 60 * 1000)
        }
      ];
      
      setUpcomingEvents(mockEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectCalendar = async (provider: 'google' | 'outlook'): Promise<boolean> => {
    try {
      // Mock implementation - in real app, this would initiate OAuth flow
      console.log(`Connecting to ${provider} calendar...`);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnections(prev => prev.map(conn => 
        conn.provider === provider 
          ? { ...conn, connected: true, lastSync: new Date() }
          : conn
      ));
      
      return true;
    } catch (error) {
      console.error(`Error connecting to ${provider} calendar:`, error);
      return false;
    }
  };

  const disconnectCalendar = async (connectionId: string) => {
    try {
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, connected: false, lastSync: undefined }
          : conn
      ));
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const scheduleFocusSession = async (
    title: string, 
    startTime: Date, 
    durationMinutes: number
  ): Promise<string | null> => {
    try {
      // Mock implementation - in real app, this would create calendar event
      const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
      
      const newEvent: CalendarEvent = {
        id: `focus-${Date.now()}`,
        title,
        start: startTime,
        end: endTime,
        description: `Focus session - ${durationMinutes} minutes of deep work`
      };
      
      setUpcomingEvents(prev => [...prev, newEvent].sort((a, b) => a.start.getTime() - b.start.getTime()));
      
      return newEvent.id;
    } catch (error) {
      console.error('Error scheduling focus session:', error);
      return null;
    }
  };

  const findAvailableSlots = (date: Date, durationMinutes: number): Date[] => {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // Start at 9 AM
    
    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // End at 5 PM
    
    const slots: Date[] = [];
    const eventsForDay = upcomingEvents.filter(event => 
      event.start.toDateString() === date.toDateString()
    );
    
    // Generate 30-minute slots throughout the day
    let currentTime = new Date(startOfDay);
    while (currentTime < endOfDay) {
      const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60 * 1000);
      
      // Check if this slot conflicts with any existing events
      const hasConflict = eventsForDay.some(event => 
        (currentTime >= event.start && currentTime < event.end) ||
        (slotEnd > event.start && slotEnd <= event.end) ||
        (currentTime <= event.start && slotEnd >= event.end)
      );
      
      if (!hasConflict) {
        slots.push(new Date(currentTime));
      }
      
      // Move to next 30-minute slot
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }
    
    return slots;
  };

  return {
    connections,
    upcomingEvents,
    isLoading,
    connectCalendar,
    disconnectCalendar,
    scheduleFocusSession,
    findAvailableSlots,
    refreshEvents: loadUpcomingEvents
  };
};
