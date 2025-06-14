
import React from 'react';
import { SessionLibraryProps } from './types';

const SessionLibrary: React.FC<SessionLibraryProps> = ({
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
  onSessionSelect,
  formatTime,
  getDifficultyColor,
  getCategoryIcon
}) => {
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="title">Sort by Title</option>
          <option value="duration">Sort by Duration</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Sessions Display */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSessionSelect(session)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getCategoryIcon(session.category)}
                <span className="text-sm text-gray-600">{session.category}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(session);
                }}
                className={`p-1 rounded ${favorites.includes(session.id) ? 'text-red-500' : 'text-gray-400'}`}
              >
                ♥
              </button>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{session.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">by {session.instructor}</span>
              <span className="text-gray-500">{formatTime(session.duration * 60)}</span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                {session.difficulty}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600">{session.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No sessions found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default SessionLibrary;
