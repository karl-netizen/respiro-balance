
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
    <div className="text-center mt-2">
      <Button variant="ghost" onClick={onResume} className="text-white hover:bg-gray-800">
        Resume
      </Button>
      
      <Button variant="ghost" onClick={onEndSession} className="text-white hover:bg-gray-800">
        End Session
      </Button>
    </div>
  );
};

export default PausedActions;
