
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useUserPreferences } from '@/context/hooks/useUserPreferences';

interface StateDebuggerProps {
  data: Record<string, any>;
  title?: string;
  initialExpanded?: boolean;
}

/**
 * StateDebugger component - A development tool to visualize state in your application
 * 
 * Usage:
 * ```jsx
 * <StateDebugger 
 *   data={{ 
 *     selectedSession, 
 *     dialogOpen, 
 *     activeTab, 
 *     filteredSessions: filteredSessions.length 
 *   }} 
 *   title="Meditation Page State" 
 * />
 * ```
 */
const StateDebugger: React.FC<StateDebuggerProps> = ({ 
  data, 
  title = "State Debugger", 
  initialExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const { preferences } = useUserPreferences();
  
  const isDarkMode = preferences.theme === 'dark';
  
  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // Safely stringify any data
  const safeStringify = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'function') return 'function() { ... }';
    
    try {
      if (typeof value === 'object') {
        // Handle circular references
        const seen = new WeakSet();
        return JSON.stringify(value, (_, val) => {
          if (typeof val === 'object' && val !== null) {
            if (seen.has(val)) return '[Circular]';
            seen.add(val);
          }
          return val;
        }, 2);
      }
      return String(value);
    } catch (err) {
      return `[Error displaying value: ${err}]`;
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 max-w-md overflow-hidden rounded-lg shadow-lg ${
        isDarkMode ? 'bg-gray-800 text-green-400 border border-gray-700' : 'bg-white text-green-600 border border-gray-200'
      } transition-all duration-200`}
      style={{ maxHeight: isExpanded ? '80vh' : 'auto' }}
    >
      <div 
        className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-sm">{title}</h3>
        {isExpanded ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
      </div>
      
      {isExpanded && (
        <div 
          className="p-4 overflow-auto text-xs font-mono"
          style={{ maxHeight: 'calc(80vh - 40px)' }}
        >
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                {key}:
              </div>
              <pre 
                className="mt-1 p-2 rounded overflow-x-auto whitespace-pre-wrap break-words" 
                style={{
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'
                }}
              >
                {safeStringify(value)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StateDebugger;
