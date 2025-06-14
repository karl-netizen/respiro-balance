
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MeditationSession } from '@/types/meditation';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { useMeditationResume } from '@/hooks/useMeditationResume';
import { toast } from 'sonner';

// Import our new enhanced components
import EnhancedMeditationFilters from '@/components/meditation/EnhancedMeditationFilters';
import EnhancedAudioPlayer from '@/components/meditation/audio/EnhancedAudioPlayer';
import MeditationProgressTracker from '@/components/meditation/progress/MeditationProgressTracker';
import BatchFavoritesManager from '@/components/meditation/favorites/BatchFavoritesManager';
import EnhancedSessionCompletionDialog from '@/components/meditation/completion/EnhancedSessionCompletionDialog';

// Import existing components and data
import { meditationSessions } from '@/data/meditationSessions';
import { MeditationLibraryBrowser } from '@/components/meditation';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';

interface SessionFeedback {
  rating: number;
  mood: string;
  comment: string;
  focusImprovement: number;
  stressReduction: number;
  wouldRecommend: boolean;
  favorite: boolean;
}

const EnhancedMeditationPage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [filteredSessions, setFilteredSessions] = useState<MeditationSession[]>(meditationSessions);
  const [favoriteSessions, setFavoriteSessions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<MeditationSession[]>([]);

  const { isPremium } = useSubscriptionContext();
  const {
    saveProgress,
    getResumeTime,
    canResume,
    markCompleted,
    getIncompleteSessions,
    getProgressPercentage
  } = useMeditationResume();

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteSessions');
    if (storedFavorites) {
      setFavoriteSessions(JSON.parse(storedFavorites));
    }

    const storedCompleted = localStorage.getItem('completedMeditationSessions');
    if (storedCompleted) {
      setCompletedSessions(JSON.parse(storedCompleted));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteSessions', JSON.stringify(favoriteSessions));
  }, [favoriteSessions]);

  // Save completed sessions to localStorage
  useEffect(() => {
    localStorage.setItem('completedMeditationSessions', JSON.stringify(completedSessions));
  }, [completedSessions]);

  const handleSelectSession = (session: MeditationSession) => {
    if (session.premium && !isPremium) {
      toast.error('Premium session', {
        description: 'Upgrade to access premium content',
        action: {
          label: 'Upgrade',
          onClick: () => window.location.href = '/subscription'
        }
      });
      return;
    }

    setSelectedSession(session);
    setActiveTab('player');

    // Check if we can resume this session
    if (canResume(session.id)) {
      const resumeTime = getResumeTime(session.id);
      const progressPercentage = getProgressPercentage(session.id);
      
      toast.info(`Resume from ${Math.floor(resumeTime / 60)}:${Math.floor(resumeTime % 60).toString().padStart(2, '0')}`, {
        description: `${progressPercentage}% complete`,
        action: {
          label: 'Start Over',
          onClick: () => saveProgress(session.id, 0, session.duration * 60, false)
        }
      });
    }
  };

  const handleToggleFavorite = (session: MeditationSession) => {
    setFavoriteSessions(prev => {
      if (prev.includes(session.id)) {
        return prev.filter(id => id !== session.id);
      } else {
        return [...prev, session.id];
      }
    });
  };

  const handleRemoveFavorites = (sessionIds: string[]) => {
    setFavoriteSessions(prev => prev.filter(id => !sessionIds.includes(id)));
    toast.success(`Removed ${sessionIds.length} session${sessionIds.length !== 1 ? 's' : ''} from favorites`);
  };

  const handleSessionComplete = () => {
    if (selectedSession) {
      markCompleted(selectedSession.id);
      setShowCompletionDialog(true);
    }
  };

  const handleFeedbackSubmit = (feedback: SessionFeedback) => {
    if (selectedSession) {
      // Update completed sessions with feedback
      const completedSession = {
        ...selectedSession,
        completed: true,
        completed_at: new Date().toISOString(),
        rating: feedback.rating,
        feedback: feedback.comment
      };

      setCompletedSessions(prev => {
        const existing = prev.findIndex(s => s.id === selectedSession.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = completedSession;
          return updated;
        }
        return [...prev, completedSession];
      });

      // Add to favorites if requested
      if (feedback.favorite && !favoriteSessions.includes(selectedSession.id)) {
        setFavoriteSessions(prev => [...prev, selectedSession.id]);
      }

      toast.success('Thank you for your feedback!');
    }
  };

  const handleAchievementUnlocked = (achievement: any) => {
    toast.success(`Achievement Unlocked: ${achievement.title}`, {
      description: achievement.description,
      duration: 5000
    });
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (selectedSession) {
      saveProgress(selectedSession.id, currentTime, duration, false);
    }
  };

  const getFavoriteSessions = () => {
    return meditationSessions.filter(session => favoriteSessions.includes(session.id));
  };

  const getIncompleteSessions = () => {
    return getIncompleteSessions(meditationSessions);
  };

  const isFavorite = (sessionId: string) => favoriteSessions.includes(sessionId);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Meditation Library</h1>
            <p className="text-muted-foreground mt-1">
              Your complete mindfulness companion with {meditationSessions.length} sessions
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {completedSessions.length} completed
            </Badge>
            <Badge variant="outline">
              {favoriteSessions.length} favorites
            </Badge>
          </div>
        </div>
        
        {!isPremium && <SubscriptionBanner />}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites
              {favoriteSessions.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {favoriteSessions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="resume">
              Resume
              {getIncompleteSessions().length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getIncompleteSessions().length}
                </Badge>
              )}
            </TabsTrigger>
            {selectedSession && (
              <TabsTrigger value="player">
                <Play className="h-4 w-4 mr-2" />
                Now Playing
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <EnhancedMeditationFilters
              sessions={meditationSessions}
              onFilteredSessionsChange={setFilteredSessions}
            />
            
            <MeditationLibraryBrowser
              activeTab="all"
              setActiveTab={() => {}}
              recentlyPlayed={completedSessions.slice(-5)}
              getFavoriteSessions={getFavoriteSessions}
              handleSelectSession={handleSelectSession}
              handleToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
              filterSessionsByCategory={(category) => 
                filteredSessions.filter(s => s.category === category)
              }
              durationFilter={null}
              setDurationFilter={() => {}}
              resetFilters={() => {}}
            />
          </TabsContent>

          <TabsContent value="favorites">
            <BatchFavoritesManager
              favoriteSessions={getFavoriteSessions()}
              onRemoveFavorites={handleRemoveFavorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectSession={handleSelectSession}
            />
          </TabsContent>

          <TabsContent value="progress">
            <MeditationProgressTracker
              sessions={completedSessions}
              onAchievementUnlocked={handleAchievementUnlocked}
            />
          </TabsContent>

          <TabsContent value="resume">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Continue Your Practice</h2>
              
              {getIncompleteSessions().length === 0 ? (
                <div className="text-center py-12">
                  <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No incomplete sessions to resume.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getIncompleteSessions().map(session => {
                    const progressPercentage = getProgressPercentage(session.id);
                    const resumeTime = getResumeTime(session.id);
                    
                    return (
                      <div key={session.id} className="p-4 border rounded-lg space-y-3">
                        <div>
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {session.instructor}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(resumeTime / 60)}:{Math.floor(resumeTime % 60).toString().padStart(2, '0')}</span>
                          </div>
                          
                          <Button 
                            size="sm"
                            onClick={() => handleSelectSession(session)}
                          >
                            Resume
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {selectedSession && (
            <TabsContent value="player">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{selectedSession.title}</h2>
                  <div className="flex items-center justify-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{selectedSession.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(selectedSession.duration)}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    {selectedSession.description}
                  </p>
                </div>

                <EnhancedAudioPlayer
                  audioUrl={selectedSession.audio_url}
                  title={selectedSession.title}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onComplete={handleSessionComplete}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <Footer />

      {/* Enhanced Completion Dialog */}
      <EnhancedSessionCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        session={selectedSession!}
        meditationStats={{
          focusScore: 85,
          calmScore: 90,
          timeCompleted: selectedSession ? selectedSession.duration * 60 : 0
        }}
        onSubmitFeedback={handleFeedbackSubmit}
        onContinue={() => {
          setShowCompletionDialog(false);
          setActiveTab('browse');
        }}
        onReplay={() => {
          setShowCompletionDialog(false);
          if (selectedSession) {
            saveProgress(selectedSession.id, 0, selectedSession.duration * 60, false);
          }
        }}
        onShare={() => {
          // Implement sharing functionality
          toast.success('Shared your meditation achievement!');
        }}
      />
    </div>
  );
};

export default EnhancedMeditationPage;
