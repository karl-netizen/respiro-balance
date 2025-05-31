
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Settings, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CalendarConnection {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  email: string;
  connected: boolean;
  lastSync: string;
}

export const CalendarIntegration: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [focusBlocking, setFocusBlocking] = useState(true);

  useEffect(() => {
    if (user) {
      loadCalendarConnections();
    }
  }, [user]);

  const loadCalendarConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Mock data for demo since we don't have real calendar connections yet
      setConnections([
        {
          id: '1',
          provider: 'google',
          email: user?.email || 'user@example.com',
          connected: false,
          lastSync: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error loading calendar connections:', error);
    }
  };

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      // This would initiate Google OAuth flow
      console.log('Initiating Google Calendar connection...');
      
      // Mock successful connection for demo
      setTimeout(() => {
        setConnections(prev => prev.map(conn => 
          conn.provider === 'google' 
            ? { ...conn, connected: true, lastSync: new Date().toISOString() }
            : conn
        ));
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    try {
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, connected: false }
          : conn
      ));
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '📅';
      case 'outlook': return '📧';
      case 'apple': return '🍎';
      default: return '📅';
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
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Connected Calendars</h3>
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getProviderIcon(connection.provider)}</span>
                <div>
                  <p className="font-medium capitalize">{connection.provider} Calendar</p>
                  <p className="text-sm text-muted-foreground">{connection.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {connection.connected ? (
                  <>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDisconnect(connection.id)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleGoogleConnect}
                    disabled={isConnecting}
                    size="sm"
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Integration Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Integration Settings</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Auto-schedule focus sessions</p>
                <p className="text-xs text-muted-foreground">
                  Automatically create focus blocks in your calendar
                </p>
              </div>
              <Switch 
                checked={autoSchedule}
                onCheckedChange={setAutoSchedule}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Focus time blocking</p>
                <p className="text-xs text-muted-foreground">
                  Prevent meetings during scheduled focus time
                </p>
              </div>
              <Switch 
                checked={focusBlocking}
                onCheckedChange={setFocusBlocking}
              />
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Available Features</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Meeting preparation focus sessions</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-green-500" />
              <span>Buffer time around meetings</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-green-500" />
              <span>Smart focus scheduling</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4 text-green-500" />
              <span>Context-aware sessions</span>
            </div>
          </div>
        </div>

        {/* Connection Help */}
        {!connections.some(c => c.connected) && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Connect your calendar</p>
                <p className="text-blue-700">
                  Link your calendar to automatically schedule focus sessions and avoid conflicts.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
