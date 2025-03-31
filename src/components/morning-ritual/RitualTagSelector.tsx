
import React from "react";
import { Tag } from "lucide-react";
import { Label } from "@/components/ui/label";

interface RitualTagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const RitualTagSelector = ({ 
  availableTags, 
  selectedTags, 
  onTagToggle 
}: RitualTagSelectorProps) => {
  return (
    <div>
      <Label className="flex items-center mb-3">
        <Tag className="h-4 w-4 mr-2" />
        Tags <span className="text-muted-foreground text-xs ml-2">(optional)</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <div 
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`
              py-1 px-3 rounded-full text-xs cursor-pointer transition-colors
              ${selectedTags.includes(tag) 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RitualTagSelector;
