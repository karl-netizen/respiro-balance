
import React from 'react';
import { SessionLibraryProps } from './types';
import { SessionFilters } from './SessionFilters';
import SessionGrid from './SessionGrid';

const SessionLibrary: React.FC<SessionLibraryProps> = ({
  filteredSessions,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  favorites,
  toggleFavorite,
  viewMode,
  setViewMode,
  onSessionSelect,
  formatTime,
  getDifficultyColor,
  getCategoryIcon
}) => {
  return (
    <div className="space-y-6">
      <SessionFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <SessionGrid 
        sessions={filteredSessions}
        viewMode={viewMode}
        onSessionSelect={onSessionSelect}
        onToggleFavorite={toggleFavorite}
        favorites={favorites}
        formatTime={formatTime}
        getDifficultyColor={getDifficultyColor}
        getCategoryIcon={getCategoryIcon}
      />
    </div>
  );
};

export default SessionLibrary;
