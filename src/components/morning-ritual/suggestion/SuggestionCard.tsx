
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus } from 'lucide-react';
import { useAddSuggestion } from './useAddSuggestion';

interface RitualSuggestion {
  id: string;
  title: string;
  description: string;
  timeOfDay: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  category: string;
}

interface SuggestionCardProps {
  suggestion: RitualSuggestion;
  onAdd?: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onAdd }) => {
  const { addSuggestion, isAdding } = useAddSuggestion();

  const handleAdd = async () => {
    await addSuggestion(suggestion);
    onAdd?.();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            <CardDescription className="mt-1">
              {suggestion.description}
            </CardDescription>
          </div>
          <Badge className={getPriorityColor(suggestion.priority)}>
            {suggestion.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{suggestion.timeOfDay} • {suggestion.duration} minutes</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {suggestion.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Button 
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? 'Adding...' : 'Add to My Rituals'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionCard;
