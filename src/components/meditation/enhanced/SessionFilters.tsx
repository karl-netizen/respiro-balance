import React from 'react';

interface SessionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
      >
        <option value="title">Sort by Title</option>
        <option value="duration">Sort by Duration</option>
        <option value="difficulty">Sort by Difficulty</option>
        <option value="rating">Sort by Rating</option>
      </select>
      <div className="flex gap-2">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`px-3 py-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Grid
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`px-3 py-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          List
        </button>
      </div>
    </div>
  );
};