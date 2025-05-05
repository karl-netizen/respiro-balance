
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
    <div className="text-center mt-3 p-4 bg-gray-800 rounded-md border border-gray-600 shadow-lg flex justify-center space-x-4">
      <Button 
        variant="outline" 
        onClick={onResume} 
        className="bg-gray-700 text-white font-semibold hover:bg-respiro-light hover:text-gray-900 border-respiro-light hover:border-white"
      >
        Resume
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onEndSession} 
        className="bg-gray-700 text-white font-semibold hover:bg-respiro-light hover:text-gray-900 border-respiro-light hover:border-white"
      >
        End Session
      </Button>
    </div>
  );
};

export default PausedActions;
