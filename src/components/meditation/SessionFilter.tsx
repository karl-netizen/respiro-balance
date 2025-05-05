
import React, { useEffect } from 'react';
import { MeditationSession } from '@/types/meditation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SessionFilterProps {
  sessions: MeditationSession[];
  onFilteredSessionsChange: (sessions: MeditationSession[]) => void;
  activeTab: string;
  onCategoryChange: (category: string) => void;
}

const SessionFilter: React.FC<SessionFilterProps> = ({ 
  sessions, 
  onFilteredSessionsChange,
  activeTab,
  onCategoryChange
}) => {
  // Define categories - ensure they match tabs exactly
  const categories = ['guided', 'quick', 'deep', 'sleep'];
  
  // Filter sessions when category changes
  useEffect(() => {
    const categoryValue = activeTab;
    const filteredSessions = sessions.filter(session => {
      return session.category === categoryValue;
    });
    
    onFilteredSessionsChange(filteredSessions);
  }, [activeTab, sessions, onFilteredSessionsChange]);
  
  return (
    <div className="session-filter-container mb-6">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Filter by Category:</label>
        <Select 
          value={activeTab} 
          onValueChange={(value) => onCategoryChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem 
                key={category} 
                value={category}
                className="capitalize"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SessionFilter;
