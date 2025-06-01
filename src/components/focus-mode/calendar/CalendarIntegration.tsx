
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink, Plus } from 'lucide-react';
import { useCalendarIntegration } from '@/hooks/focus/useCalendarIntegration';

export const CalendarIntegration: React.FC = () => {
  const { 
    connections, 
    upcomingEvents, 
    isLoading,
    connectCalendar,
    disconnectCalendar
  } = useCalendarIntegration();

  const handleConnect = async (provider: 'google' | 'outlook') => {
    const success = await connectCalendar(provider);
    if (success) {
      console.log(`Successfully connected to ${provider}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Calendar Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Connected Calendars</h4>
          {connections.map(connection => (
            <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium capitalize">{connection.provider} Calendar</p>
                  <p className="text-xs text-muted-foreground">
                    {connection.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={connection.connected ? "default" : "outline"}>
                  {connection.connected ? 'Connected' : 'Disconnected'}
                </Badge>
                {connection.connected ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => disconnectCalendar(connection.id)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleConnect(connection.provider as 'google' | 'outlook')}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {connections.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">No calendar connections</p>
              <div className="space-x-2">
                <Button onClick={() => handleConnect('google')}>
                  Connect Google Calendar
                </Button>
                <Button variant="outline" onClick={() => handleConnect('outlook')}>
                  Connect Outlook
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Upcoming Events</h4>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map(event => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(event.start).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {event.location && (
                          <span>• {event.location}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
