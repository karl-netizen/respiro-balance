
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
}

interface CalendarConnection {
  id: string;
  provider: string;
  connected: boolean;
  lastSync: string;
}

export const useCalendarIntegration = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConnections();
      loadUpcomingEvents();
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error loading calendar connections:', error);
    }
  };

  const loadUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      // Mock upcoming events for demo
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Team Standup',
          start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          end: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
          attendees: ['team@company.com']
        },
        {
          id: '2',
          title: 'Project Review',
          start: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          end: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          location: 'Conference Room A'
        }
      ];

      setUpcomingEvents(mockEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectCalendar = async (provider: 'google' | 'outlook') => {
    try {
      // This would initiate OAuth flow
      console.log(`Connecting to ${provider} calendar...`);
      
      // Mock successful connection
      const newConnection: CalendarConnection = {
        id: Date.now().toString(),
        provider,
        connected: true,
        lastSync: new Date().toISOString()
      };

      setConnections(prev => [...prev, newConnection]);
      return true;
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
      return false;
    }
  };

  const disconnectCalendar = async (connectionId: string) => {
    try {
      await supabase
        .from('calendar_connections')
        .delete()
        .eq('id', connectionId);

      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const scheduleFocusSession = async (
    title: string,
    startTime: Date,
    duration: number
  ) => {
    try {
      // This would create a calendar event
      console.log('Scheduling focus session:', { title, startTime, duration });
      
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title,
        start: startTime.toISOString(),
        end: endTime.toISOString()
      };

      setUpcomingEvents(prev => [...prev, newEvent]);
      return newEvent.id;
    } catch (error) {
      console.error('Error scheduling focus session:', error);
      return null;
    }
  };

  const findAvailableSlots = (
    date: Date,
    duration: number,
    workingHours: { start: number; end: number } = { start: 9, end: 17 }
  ) => {
    const availableSlots: Date[] = [];
    const dayEvents = upcomingEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });

    // Generate potential slots every 30 minutes during working hours
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, minute, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

        // Check if slot conflicts with existing events
        const hasConflict = dayEvents.some(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        if (!hasConflict && slotEnd.getHours() <= workingHours.end) {
          availableSlots.push(slotStart);
        }
      }
    }

    return availableSlots;
  };

  return {
    connections,
    upcomingEvents,
    isLoading,
    connectCalendar,
    disconnectCalendar,
    scheduleFocusSession,
    findAvailableSlots,
    refetch: () => {
      loadConnections();
      loadUpcomingEvents();
    }
  };
};
