
import React from 'react';
import { useMorningRituals } from '@/hooks/useMorningRituals';
import SuggestionCard from './suggestion/SuggestionCard';
import { useRitualSuggestions } from './suggestion/useRitualSuggestions';
import { Button } from '@/components/ui/button';
import { CirclePlus, RefreshCw } from 'lucide-react';

const SuggestionsSection: React.FC = () => {
  const { suggestions, refreshSuggestions, isLoading } = useRitualSuggestions();
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Suggestions</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshSuggestions}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map(suggestion => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsSection;
