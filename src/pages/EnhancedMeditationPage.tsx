
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedMeditationFilters from '@/components/meditation/EnhancedMeditationFilters';
import BatchFavoritesManager from '@/components/meditation/favorites/BatchFavoritesManager';
import EnhancedAudioPlayer from '@/components/meditation/audio/EnhancedAudioPlayer';
import MeditationProgressTracker from '@/components/meditation/progress/MeditationProgressTracker';
import EnhancedSessionCompletionDialog from '@/components/meditation/completion/EnhancedSessionCompletionDialog';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';
import { useMeditationFavorites } from '@/hooks/useMeditationFavorites';
import { useMeditationResume } from '@/hooks/useMeditationResume';
import { MeditationSession } from '@/types/meditation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Heart, Users, Award } from 'lucide-react';

export interface FilterState {
  categories: string[];
  durations: string[];
  levels: string[];
  instructors: string[];
  tags: string[];
  searchTerm: string;
}

const EnhancedMeditationPage = () => {
  const navigate = useNavigate();
  const { sessions, isLoading } = useMeditationSessions();
  const { favorites, toggleFavorite, removeFavorites, getFavoriteSessions } = useMeditationFavorites();
  const { 
    canResume, 
    getResumeTime, 
    getProgressPercentage, 
    markCompleted,
    getIncompleteSessions: getIncompleteSessionsHook
  } = useMeditationResume();

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    durations: [],
    levels: [],
    instructors: [],
    tags: [],
    searchTerm: ''
  });

  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionFeedback, setSessionFeedback] = useState<{
    rating: number;
    comments: string;
  } | null>(null);

  // Get incomplete sessions for resume functionality
  const incompleteSessions = useMemo(() => {
    return getIncompleteSessionsHook(sessions);
  }, [sessions, getIncompleteSessionsHook]);

  // Get favorite sessions data
  const favoriteSessionsData = useMemo(() => {
    return getFavoriteSessions(sessions);
  }, [sessions, getFavoriteSessions]);

  // Filter sessions based on current filter state
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(session.category)) {
        return false;
      }

      // Duration filter
      if (filters.durations.length > 0) {
        const durationMatch = filters.durations.some(duration => {
          switch (duration) {
            case 'under-5':
              return session.duration < 5;
            case '5-10':
              return session.duration >= 5 && session.duration <= 10;
            case '10-15':
              return session.duration >= 10 && session.duration <= 15;
            case '15-30':
              return session.duration >= 15 && session.duration <= 30;
            case '30-plus':
              return session.duration > 30;
            default:
              return true;
          }
        });
        if (!durationMatch) return false;
      }

      // Level filter
      if (filters.levels.length > 0 && session.level && !filters.levels.includes(session.level)) {
        return false;
      }

      // Instructor filter
      if (filters.instructors.length > 0 && !filters.instructors.includes(session.instructor)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = session.tags?.some(tag => filters.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          session.title.toLowerCase().includes(searchLower) ||
          session.description.toLowerCase().includes(searchLower) ||
          session.instructor.toLowerCase().includes(searchLower) ||
          session.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [sessions, filters]);

  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session);
    setIsPlaying(false);
  };

  const handleSessionComplete = () => {
    if (selectedSession) {
      markCompleted(selectedSession.id);
      setShowCompletionDialog(true);
      setIsPlaying(false);
    }
  };

  const handleCompletionClose = () => {
    setShowCompletionDialog(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      durations: [],
      levels: [],
      instructors: [],
      tags: [],
      searchTerm: ''
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  };

  const handleRemoveFavorites = (sessionIds: string[]) => {
    removeFavorites(sessionIds);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading meditation sessions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Enhanced Meditation Experience</h1>
          <p className="text-muted-foreground">
            Discover personalized meditation sessions with advanced features and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <EnhancedMeditationFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={clearAllFilters}
              sessions={sessions}
            />
            
            {/* Progress Tracker */}
            <div className="mt-6">
              <MeditationProgressTracker sessions={sessions} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="library" className="space-y-6">
              <TabsList>
                <TabsTrigger value="library">Library</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="player" disabled={!selectedSession}>Player</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Session Library</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredSessions.length} sessions available
                    </p>
                  </div>
                  
                  {(filters.categories.length > 0 || filters.durations.length > 0 || 
                    filters.levels.length > 0 || filters.instructors.length > 0 || 
                    filters.tags.length > 0 || filters.searchTerm) && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      Clear All Filters
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSessions.map(session => (
                    <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{session.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(session);
                            }}
                            className={`${favorites.includes(session.id) ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(session.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{session.instructor}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {session.description}
                        </p>

                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{session.category}</Badge>
                          <Badge variant="outline" className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(session.duration)}
                          </Badge>
                          {session.level && (
                            <Badge variant="secondary">{session.level}</Badge>
                          )}
                        </div>

                        {canResume(session.id) && (
                          <div className="bg-primary/10 p-2 rounded">
                            <p className="text-xs text-primary font-medium">
                              Resume from {getProgressPercentage(session.id)}%
                            </p>
                          </div>
                        )}

                        <Button 
                          className="w-full" 
                          onClick={() => handleSessionSelect(session)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {canResume(session.id) ? 'Resume' : 'Start'} Session
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredSessions.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">
                        No sessions match your current filters. Try adjusting your search criteria.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="favorites">
                <BatchFavoritesManager
                  favoriteSessions={favoriteSessionsData}
                  onRemoveFavorites={handleRemoveFavorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectSession={handleSessionSelect}
                />
              </TabsContent>

              <TabsContent value="resume" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Continue Your Practice</h2>
                  <p className="text-sm text-muted-foreground">
                    Pick up where you left off with these incomplete sessions.
                  </p>
                </div>

                {incompleteSessions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incompleteSessions.map(session => (
                      <Card key={session.id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-medium">{session.title}</h3>
                              <p className="text-sm text-muted-foreground">{session.instructor}</p>
                            </div>
                            
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${getProgressPercentage(session.id)}%` }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {getProgressPercentage(session.id)}% complete
                              </span>
                              <Badge variant="outline">
                                {Math.round(getResumeTime(session.id) / 60)}m remaining
                              </Badge>
                            </div>
                            
                            <Button 
                              className="w-full"
                              onClick={() => handleSessionSelect(session)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Continue Session
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">
                        You don't have any incomplete sessions. Start a new meditation to begin your practice.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="player">
                {selectedSession && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{selectedSession.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(selectedSession)}
                            className={`${favorites.includes(selectedSession.id) ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(selectedSession.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </CardTitle>
                        <p className="text-muted-foreground">
                          {selectedSession.instructor} • {formatDuration(selectedSession.duration)}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{selectedSession.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{selectedSession.category}</Badge>
                          {selectedSession.level && (
                            <Badge variant="secondary">{selectedSession.level}</Badge>
                          )}
                          {selectedSession.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <EnhancedAudioPlayer
                      audioUrl={selectedSession.audio_url || '/placeholder-audio.mp3'}
                      title={selectedSession.title}
                      onPlay={handlePlay}
                      onPause={handlePause}
                      onComplete={handleSessionComplete}
                      autoPlay={false}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Session Completion Dialog */}
        {showCompletionDialog && selectedSession && (
          <EnhancedSessionCompletionDialog
            session={selectedSession}
            onClose={handleCompletionClose}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EnhancedMeditationPage;
