
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import { RitualSuggestion } from './useRitualSuggestions';

interface SuggestionCardProps {
  suggestion: RitualSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const handleUse = () => {
    // This would integrate with the ritual creation form
    console.log('Using suggestion:', suggestion.title);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{suggestion.title}</CardTitle>
            <CardDescription className="mt-1 text-sm leading-relaxed line-clamp-2">
              {suggestion.description}
            </CardDescription>
          </div>
          <Badge variant={suggestion.difficulty === 'easy' ? 'secondary' : 'default'} className="flex-shrink-0">
            {suggestion.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{suggestion.duration} minutes</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {suggestion.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button onClick={handleUse} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Use This Ritual
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
