
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface RitualTagSelectorProps {
  selectedTags: string[];
  availableTags: string[];
  onTagToggle: (tag: string) => void;
}

const RitualTagSelector: React.FC<RitualTagSelectorProps> = ({
  selectedTags,
  availableTags,
  onTagToggle
}) => {
  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onTagToggle(tag)}
              className="h-8"
            >
              {isSelected && <X className="h-3 w-3 mr-1" />}
              {!isSelected && <Plus className="h-3 w-3 mr-1" />}
              {tag}
            </Button>
          );
        })}
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Label className="text-sm text-muted-foreground">Selected:</Label>
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RitualTagSelector;
