
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface StateDebuggerProps {
  data: Record<string, any>;
  title?: string;
  initialExpanded?: boolean;
}

/**
 * A development-only component that displays state for debugging purposes
 */
const StateDebugger: React.FC<StateDebuggerProps> = ({ 
  data, 
  title = "State Debugger", 
  initialExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-black bg-opacity-90 text-green-400 p-4 rounded-lg shadow-lg border border-green-500 text-xs font-mono">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-bold">{title}</h3>
        {isExpanded ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </div>
      
      {isExpanded && (
        <div className="max-h-96 overflow-auto">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default StateDebugger;
