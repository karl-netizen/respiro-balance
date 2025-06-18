
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, TrendingUp, Zap } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';
import { useOfflineStorage } from './offline/OfflineStorageProvider';
import { meditationSessions } from '@/data/meditationSessions';

interface RecommendationReason {
  type: 'popular' | 'short' | 'beginner' | 'trending';
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface SmartRecommendation {
  session: MeditationSession;
  reasons: RecommendationReason[];
  priority: number;
}

export const SmartDownloadRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [downloadedSessions, setDownloadedSessions] = useState<Set<string>>(new Set());
  const { isSessionDownloaded, downloadSession } = useOfflineStorage();

  useEffect(() => {
    loadRecommendations();
    checkDownloadedSessions();
  }, []);

  const checkDownloadedSessions = async () => {
    const downloaded = new Set<string>();
    for (const session of meditationSessions) {
      const isDownloaded = await isSessionDownloaded(session.id);
      if (isDownloaded) {
        downloaded.add(session.id);
      }
    }
    setDownloadedSessions(downloaded);
  };

  const loadRecommendations = () => {
    const reasonTypes: Record<string, RecommendationReason> = {
      popular: {
        type: 'popular',
        label: 'Popular',
        icon: <TrendingUp className="h-3 w-3" />,
        color: 'bg-blue-100 text-blue-700'
      },
      short: {
        type: 'short',
        label: 'Quick',
        icon: <Zap className="h-3 w-3" />,
        color: 'bg-green-100 text-green-700'
      },
      beginner: {
        type: 'beginner',
        label: 'Beginner',
        icon: <Clock className="h-3 w-3" />,
        color: 'bg-purple-100 text-purple-700'
      }
    };

    // Smart recommendation algorithm
    const recs: SmartRecommendation[] = meditationSessions
      .filter(session => session.audio_url) // Only sessions with audio
      .map(session => {
        const reasons: RecommendationReason[] = [];
        let priority = 0;

        // Popular sessions (simulated popularity)
        if (['morning-focus', 'stress-relief', 'sleep-meditation'].includes(session.id)) {
          reasons.push(reasonTypes.popular);
          priority += 10;
        }

        // Short sessions for quick access
        if (session.duration <= 10) {
          reasons.push(reasonTypes.short);
          priority += 8;
        }

        // Beginner-friendly sessions
        if (session.difficulty === 'Beginner' || session.duration <= 15) {
          reasons.push(reasonTypes.beginner);
          priority += 6;
        }

        // Essential categories get higher priority
        if (['Stress Relief', 'Focus', 'Sleep'].includes(session.category)) {
          priority += 5;
        }

        return {
          session,
          reasons,
          priority
        };
      })
      .filter(rec => rec.reasons.length > 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6); // Top 6 recommendations

    setRecommendations(recs);
  };

  const handleDownload = async (session: MeditationSession) => {
    if (!session.audio_url) return;

    try {
      const success = await downloadSession(session.id, session.audio_url, session);
      if (success) {
        setDownloadedSessions(prev => new Set([...prev, session.id]));
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadAll = async () => {
    const notDownloaded = recommendations.filter(
      rec => !downloadedSessions.has(rec.session.id)
    );

    for (const rec of notDownloaded) {
      await handleDownload(rec.session);
    }
  };

  const notDownloadedCount = recommendations.filter(
    rec => !downloadedSessions.has(rec.session.id)
  ).length;

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recommended Downloads</CardTitle>
          {notDownloadedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAll}
            >
              <Download className="h-4 w-4 mr-2" />
              Download All ({notDownloadedCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const isDownloaded = downloadedSessions.has(rec.session.id);
            
            return (
              <div key={rec.session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{rec.session.title}</h4>
                    {rec.reasons.map((reason, index) => (
                      <Badge key={index} variant="secondary" className={`text-xs ${reason.color}`}>
                        {reason.icon}
                        <span className="ml-1">{reason.label}</span>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{rec.session.duration} min</span>
                    <span>{rec.session.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isDownloaded ? (
                    <Badge variant="secondary" className="text-xs">
                      Downloaded
                    </Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(rec.session)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Pro tip:</strong> Download sessions you frequently use to save data and ensure they're always available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
