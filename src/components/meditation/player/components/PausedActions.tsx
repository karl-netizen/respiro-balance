
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
    <div className="text-center mt-3 p-4 bg-gray-800 rounded-md border-2 border-gray-500 shadow-lg flex justify-center space-x-4">
      <Button 
        variant="outline" 
        onClick={onResume} 
        className="bg-respiro-light text-gray-900 font-bold hover:bg-white hover:text-gray-900 border-2 border-white"
      >
        Resume
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onEndSession} 
        className="bg-respiro-light text-gray-900 font-bold hover:bg-white hover:text-gray-900 border-2 border-white"
      >
        End Session
      </Button>
    </div>
  );
};

export default PausedActions;
