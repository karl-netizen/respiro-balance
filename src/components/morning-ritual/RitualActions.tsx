
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Play } from 'lucide-react';

interface RitualActionsProps {
  isCompletedToday: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RitualActions: React.FC<RitualActionsProps> = ({
  isCompletedToday,
  onComplete,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex items-center space-x-2">
      {!isCompletedToday && (
        <TouchFriendlyButton
          size="sm"
          onClick={onComplete}
          className="bg-green-500 hover:bg-green-600"
          hapticFeedback={true}
        >
          <Play className="h-4 w-4 mr-1" />
          Complete
        </TouchFriendlyButton>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <TouchFriendlyButton variant="ghost" size="sm" hapticFeedback={true}>
            <MoreHorizontal className="h-4 w-4" />
          </TouchFriendlyButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RitualActions;
