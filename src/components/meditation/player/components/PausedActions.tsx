
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
    <div className="text-center mt-3 p-4 bg-respiro-dark rounded-md border-4 border-white shadow-lg flex justify-center space-x-4">
      <Button 
        variant="outline" 
        onClick={onResume} 
        className="bg-white text-respiro-dark font-bold text-lg hover:bg-gray-200 hover:text-respiro-darker border-4 border-white"
      >
        Resume
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onEndSession} 
        className="bg-white text-respiro-dark font-bold text-lg hover:bg-gray-200 hover:text-respiro-darker border-4 border-white"
      >
        End Session
      </Button>
    </div>
  );
};

export default PausedActions;
