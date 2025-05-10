
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Heart } from 'lucide-react';

interface PausedActionsProps {
  onFavorite?: () => void;
  onShare?: () => void;
  onSaveProgress?: () => void;
  isFavorited?: boolean;
}

const PausedActions: React.FC<PausedActionsProps> = ({
  onFavorite,
  onShare,
  onSaveProgress,
  isFavorited = false
}) => {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      {onFavorite && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={onFavorite}
          className={isFavorited ? "bg-rose-50 border-rose-200" : ""}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
        </Button>
      )}
      
      {onShare && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}
      
      {onSaveProgress && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={onSaveProgress}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default PausedActions;
