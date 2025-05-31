import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarDays, Heart, Activity, Flame } from 'lucide-react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { MeditationSession, SessionBiometrics } from '@/types/supabase';
import { SubscriptionGate } from '@/components/subscription/SubscriptionGate';
import { ExportButton } from '@/components/subscription/ExportButton';

interface MeditationSessionViewProps {
  // Add any necessary props here
}

const MeditationSessionView: React.FC<MeditationSessionViewProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<MeditationSession | null>(null);
  const [biometrics, setBiometrics] = useState<SessionBiometrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('Session ID is missing.');
        }

        const { data: sessionData, error: sessionError } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('id', id)
          .single();

        if (sessionError) {
          throw new Error(`Error fetching session: ${sessionError.message}`);
        }

        if (!sessionData) {
          throw new Error('Session not found.');
        }

        setSession(sessionData);

        // Fetch biometrics data if IDs are available
        if (sessionData.biometric_before && sessionData.biometric_after) {
          const { data: biometricsData, error: biometricsError } = await supabase
            .from('biometric_data')
            .select('*')
            .in('id', [sessionData.biometric_before, sessionData.biometric_after]);

          if (biometricsError) {
            console.error('Error fetching biometrics:', biometricsError);
          } else {
            // Process and set biometrics data
            const before = biometricsData?.find(b => b.id === sessionData.biometric_before);
            const after = biometricsData?.find(b => b.id === sessionData.biometric_after);

            setBiometrics({
              heart_rate_before: before?.heart_rate,
              heart_rate_after: after?.heart_rate,
              hrv_before: before?.hrv,
              hrv_after: after?.hrv,
              stress_level_before: before?.stress_score,
              stress_level_after: after?.stress_score,
            });
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [id]);

  if (isLoading) {
    return <div>Loading session details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div>Session not found.</div>;
  }

  const duration = intervalToDuration({
    start: new Date(session.started_at),
    end: new Date(session.completed_at || Date.now()),
  });

  const formattedDuration = formatDuration(duration, {
    format: ['minutes', 'seconds'],
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground mr-2" />
            {session.title || 'Meditation Session'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Date</p>
              <p className="text-muted-foreground">
                {format(new Date(session.started_at), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Duration</p>
              <p className="text-muted-foreground">
                <Clock className="inline-block h-4 w-4 mr-1 align-middle" />
                {formattedDuration}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Type</p>
              <Badge variant="secondary">{session.session_type}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Session Details</h3>
            <p className="text-muted-foreground">{session.description}</p>
          </div>

          {biometrics && (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    <Heart className="h-4 w-4 mr-2 align-middle" />
                    Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Before: {biometrics.heart_rate_before || 'N/A'} bpm
                  </p>
                  <p className="text-muted-foreground text-sm">
                    After: {biometrics.heart_rate_after || 'N/A'} bpm
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    <Activity className="h-4 w-4 mr-2 align-middle" />
                    HRV (Heart Rate Variability)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Before: {biometrics.hrv_before || 'N/A'} ms
                  </p>
                  <p className="text-muted-foreground text-sm">
                    After: {biometrics.hrv_after || 'N/A'} ms
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    <Flame className="h-4 w-4 mr-2 align-middle" />
                    Stress Level
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Before: {biometrics.stress_level_before || 'N/A'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    After: {biometrics.stress_level_after || 'N/A'}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add premium features section */}
      <div className="mt-8 space-y-6">
        <SubscriptionGate feature="Advanced Session Analytics" showPreview={true}>
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Heart Rate Variability</p>
                  <div className="h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">Good</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Stress Reduction</p>
                  <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">-23%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </SubscriptionGate>

        <div className="flex gap-2">
          <ExportButton 
            data={{ session: session, biometrics: biometrics }}
            filename={`meditation-session-${session?.id}`}
            type="pdf"
          />
          <ExportButton 
            data={{ session: session, biometrics: biometrics }}
            filename={`meditation-session-${session?.id}`}
            type="csv"
          />
        </div>
      </div>
    </div>
  );
};

export default MeditationSessionView;
