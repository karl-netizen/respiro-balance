
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import { useAddSuggestion } from './useAddSuggestion';
import { RitualSuggestion } from './types';

interface SuggestionCardProps {
  suggestion: RitualSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const { addSuggestion, isAdding } = useAddSuggestion();

  const handleAddClick = async () => {
    try {
      await addSuggestion(suggestion);
    } catch (error) {
      // Error is already handled in useAddSuggestion
      console.error('Error in handleAddClick:', error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{suggestion.title}</CardTitle>
        <CardDescription>
          {suggestion.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{suggestion.duration} min</span>
          {suggestion.timeOfDay && (
            <Badge variant="outline" className="ml-2">
              {suggestion.timeOfDay}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {suggestion.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleAddClick}
          disabled={isAdding}
          className="w-full flex items-center justify-center gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add to Rituals</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
