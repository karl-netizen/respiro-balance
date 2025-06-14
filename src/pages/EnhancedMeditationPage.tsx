
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedMeditationFilters from '@/components/meditation/EnhancedMeditationFilters';
import BatchFavoritesManager from '@/components/meditation/favorites/BatchFavoritesManager';
import MeditationProgressTracker from '@/components/meditation/progress/MeditationProgressTracker';
import EnhancedSessionCompletionDialog from '@/components/meditation/completion/EnhancedSessionCompletionDialog';
import SessionLibrary from '@/components/meditation/enhanced/SessionLibrary';
import ResumeTab from '@/components/meditation/enhanced/ResumeTab';
import PlayerTab from '@/components/meditation/enhanced/PlayerTab';
import { useEnhancedMeditationPage } from '@/hooks/useEnhancedMeditationPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnhancedMeditationPage = () => {
  const {
    // Data
    sessions,
    isLoading,
    filteredSessions,
    incompleteSessions,
    favoriteSessionsData,
    favorites,
    filters,
    selectedSession,
    showCompletionDialog,
    isPlaying,
    hasActiveFilters,
    
    // Functions
    canResume,
    getResumeTime,
    getProgressPercentage,
    toggleFavorite,
    handleSessionSelect,
    handleSessionComplete,
    handleCompletionClose,
    handlePlay,
    handlePause,
    handleFiltersChange,
    clearAllFilters,
    formatDuration,
    handleRemoveFavorites
  } = useEnhancedMeditationPage();

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

              <TabsContent value="library">
                <SessionLibrary
                  filteredSessions={filteredSessions}
                  favorites={favorites}
                  canResume={canResume}
                  getProgressPercentage={getProgressPercentage}
                  toggleFavorite={toggleFavorite}
                  onSelectSession={handleSessionSelect}
                  formatDuration={formatDuration}
                  onClearFilters={clearAllFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </TabsContent>

              <TabsContent value="favorites">
                <BatchFavoritesManager
                  favoriteSessions={favoriteSessionsData}
                  onRemoveFavorites={handleRemoveFavorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectSession={handleSessionSelect}
                />
              </TabsContent>

              <TabsContent value="resume">
                <ResumeTab
                  incompleteSessions={incompleteSessions}
                  getProgressPercentage={getProgressPercentage}
                  getResumeTime={getResumeTime}
                  onSelectSession={handleSessionSelect}
                />
              </TabsContent>

              <TabsContent value="player">
                <PlayerTab
                  selectedSession={selectedSession}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                  formatDuration={formatDuration}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onComplete={handleSessionComplete}
                />
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
