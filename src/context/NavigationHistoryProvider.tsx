import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationHistoryContextType {
  canGoBack: boolean;
  goBack: () => void;
  previousPath: string | null;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

export const NavigationHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;
    
    setHistory(prev => {
      const newHistory = [...prev];
      
      // Don't add the same path twice in a row
      if (newHistory[newHistory.length - 1] !== currentPath) {
        newHistory.push(currentPath);
        
        // Keep only the last 10 pages to prevent memory issues
        if (newHistory.length > 10) {
          newHistory.shift();
        }
      }
      
      return newHistory;
    });
  }, [location.pathname]);

  const canGoBack = history.length > 1;
  const previousPath = history.length > 1 ? history[history.length - 2] : null;

  const goBack = () => {
    if (canGoBack && previousPath) {
      // Remove the current page from history before navigating back
      setHistory(prev => prev.slice(0, -1));
      navigate(previousPath);
    } else {
      // Fallback to dashboard or landing page
      navigate('/dashboard');
    }
  };

  return (
    <NavigationHistoryContext.Provider value={{ canGoBack, goBack, previousPath }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = (): NavigationHistoryContextType => {
  const context = useContext(NavigationHistoryContext);
  if (context === undefined) {
    throw new Error('useNavigationHistory must be used within a NavigationHistoryProvider');
  }
  return context;
};
