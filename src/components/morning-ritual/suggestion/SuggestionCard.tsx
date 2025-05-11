
import React from 'react';
import { RitualSuggestion } from './types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAddSuggestion } from './useAddSuggestion';

interface SuggestionCardProps {
  suggestion: RitualSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const { addSuggestion, isAdding } = useAddSuggestion();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{suggestion.title}</CardTitle>
        <CardDescription>{suggestion.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {suggestion.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-sm">
            <p>
              <span className="text-muted-foreground">Duration:</span>{' '}
              {suggestion.duration} minutes
            </p>
            {suggestion.timeOfDay && (
              <p>
                <span className="text-muted-foreground">Best time:</span>{' '}
                {suggestion.timeOfDay}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => addSuggestion(suggestion)}
          disabled={isAdding}
          className="w-full"
          variant="default"
        >
          <CirclePlus className="h-4 w-4 mr-2" />
          Add to My Rituals
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
