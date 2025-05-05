
import React from 'react';
import { Button } from "@/components/ui/button";

interface PausedActionsProps {
  onResume: () => void;
  onEndSession: () => void;
  show: boolean;
}

const PausedActions: React.FC<PausedActionsProps> = ({ onResume, onEndSession, show }) => {
  if (!show) return null;
  
  return (
    <div className="text-center mt-2 p-3 bg-gray-800 rounded-md flex justify-center space-x-4">
      <Button 
        variant="outline" 
        onClick={onResume} 
        className="text-white hover:bg-gray-700 border-respiro-light hover:border-respiro hover:text-respiro-light"
      >
        Resume
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onEndSession} 
        className="text-white hover:bg-gray-700 border-respiro-light hover:border-respiro hover:text-respiro-light"
      >
        End Session
      </Button>
    </div>
  );
};

export default PausedActions;
