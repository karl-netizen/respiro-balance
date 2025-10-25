
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Clock, Star, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SubscriptionGate } from '@/features/subscription';
import { useSubscription } from '@/features/subscription';
import { SessionInsightDialog } from '@/components/biofeedback/SessionInsightDialog';
import { useBiofeedbackStore } from '@/store/biofeedbackStore';

export interface MeditationSessionViewProps {
  sessionId?: string;
  onComplete?: (session: any, feedback?: { rating: number; notes?: string; }) => void;
}

const MeditationSessionView: React.FC<MeditationSessionViewProps> = ({ 
  sessionId: propSessionId,
  onComplete 
}) => {
  const { sessionId: urlSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  
  const sessionId = propSessionId || urlSessionId;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [rating, setRating] = useState(0);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const { isConnected } = useBiofeedbackStore();

  // Mock session data - in real implementation, fetch from database
  const session = {
    id: sessionId || '1',
    title: 'Morning Mindfulness',
    description: 'Start your day with peaceful awareness and gentle breathing',
    duration: 10,
    difficulty: 'Beginner',
    category: 'Mindfulness',
    instructor: 'Sarah Chen',
    isPremium: false,
    imageUrl: '/placeholder.svg'
  };

  const progress = session.duration > 0 ? (currentTime / (session.duration * 60)) * 100 : 0;

  const getAccessMessage = () => {
    if (session.isPremium && !isPremium) {
      return "This premium session requires a Premium or Premium+ subscription to access.";
    }
    return null;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleComplete = () => {
    const completedSession = {
      ...session,
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    const feedback = rating > 0 ? { rating } : undefined;
    onComplete?.(completedSession, feedback);
    
    // Show biofeedback insight if connected
    if (isConnected) {
      setShowInsightDialog(true);
    } else {
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate timer when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < session.duration * 60) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, session.duration]);

  const accessMessage = getAccessMessage();

  if (accessMessage) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <SubscriptionGate feature="Premium Sessions" showPreview>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/meditate')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </div>

            {/* Session Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img 
                    src={session.imageUrl} 
                    alt={session.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{session.title}</CardTitle>
                      {session.isPremium && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{session.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {session.duration} min
                      </Badge>
                      <Badge variant="outline">{session.difficulty}</Badge>
                      <Badge variant="outline">{session.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        by {session.instructor}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm">
                    {accessMessage}
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    Upgrade to access unlimited premium sessions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SubscriptionGate>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/meditate')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <img 
                src={session.imageUrl} 
                alt={session.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{session.title}</CardTitle>
                  {session.isPremium && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{session.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {session.duration} min
                  </Badge>
                  <Badge variant="outline">{session.difficulty}</Badge>
                  <Badge variant="outline">{session.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    by {session.instructor}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Audio Controls Visual Placeholder */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Audio Controls Section */}
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                <div className="text-gray-500 text-sm mb-4">Audio Controls (Visual Layout)</div>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">Vol</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">Skip</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(session.duration * 60)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRestart}
                  disabled={currentTime === 0}
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="h-16 w-16 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleComplete}
                  disabled={currentTime < session.duration * 60}
                >
                  Complete
                </Button>
              </div>

              {/* Rating */}
              {currentTime >= session.duration * 60 && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">How was your session?</h3>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star 
                          className={`h-6 w-6 ${
                            star <= rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biofeedback Insight Dialog */}
      <SessionInsightDialog
        open={showInsightDialog}
        onClose={() => {
          setShowInsightDialog(false);
          navigate('/dashboard');
        }}
        sessionId={session.id}
        sessionType="meditation"
        duration={session.duration}
      />
    </div>
  );
};

export default MeditationSessionView;
