
import React from 'react';
import SessionLibrary from '@/components/meditation/enhanced/SessionLibrary';
import ResumeTab from '@/components/meditation/enhanced/ResumeTab';
import PlayerTab from '@/components/meditation/enhanced/PlayerTab';
import { useEnhancedMeditationPage } from '@/hooks/useEnhancedMeditationPage';

const EnhancedMeditationPage = () => {
  const {
    activeTab,
    setActiveTab,
    selectedSession,
    setSelectedSession,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    sessions,
    filteredSessions,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    favorites,
    toggleFavorite,
    viewMode,
    setViewMode,
    progress,
    setProgress,
    recentSessions,
    completedSessions,
    favoritesList,
    handleSessionSelect,
    handleSessionComplete,
    handleSessionResume,
    formatTime,
    getProgressColor,
    getDifficultyColor,
    getCategoryIcon
  } = useEnhancedMeditationPage();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'library':
        return (
          <SessionLibrary
            filteredSessions={filteredSessions}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            favorites={Array.from(favorites)}
            toggleFavorite={(session) => toggleFavorite(session.id)}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onSessionSelect={handleSessionSelect}
            formatTime={formatTime}
            getDifficultyColor={getDifficultyColor}
            getCategoryIcon={getCategoryIcon}
          />
        );
      case 'resume':
        return (
          <ResumeTab
            sessions={sessions}
            onSessionSelect={handleSessionSelect}
            formatTime={formatTime}
            getDifficultyColor={getDifficultyColor}
            getCategoryIcon={getCategoryIcon}
          />
        );
      case 'player':
        return (
          <PlayerTab
            selectedSession={selectedSession}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            progress={progress}
            setProgress={setProgress}
            onSessionComplete={handleSessionComplete}
            formatTime={formatTime}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enhanced Meditation Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover guided meditations, mindfulness exercises, and breathing techniques 
            designed to enhance your well-being and inner peace.
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('library')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'library'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Meditation Library
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'resume'
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Continue Practice
              </button>
              {selectedSession && (
                <button
                  onClick={() => setActiveTab('player')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'player'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Now Playing
                </button>
              )}
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMeditationPage;
