
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';

export interface PausedActionsProps {
  show: boolean;
  onResume: () => void;
  onEndSession: () => void;
}

export const PausedActions: React.FC<PausedActionsProps> = ({
  show,
  onResume,
  onEndSession
}) => {
  if (!show) return null;
  
  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-10">
      <h3 className="text-white text-xl font-medium">Session Paused</h3>
      <div className="flex space-x-4">
        <TouchFriendlyButton 
          onClick={onResume}
          className="bg-white text-gray-900 hover:bg-gray-200"
          hapticFeedback={true}
        >
          Resume
        </TouchFriendlyButton>
        <TouchFriendlyButton 
          variant="outline"
          onClick={onEndSession}
          className="border-white text-white hover:bg-white/20"
          hapticFeedback={true}
        >
          End Session
        </TouchFriendlyButton>
      </div>
    </div>
  );
};

export default PausedActions;
