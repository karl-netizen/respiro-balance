
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationHistoryContextType {
  history: string[];
  addToHistory: (path: string) => void;
  goBack: () => void;
  canGoBack: boolean;
  previousPath: string | null;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextType | undefined>(undefined);

interface NavigationHistoryProviderProps {
  children: ReactNode;
}

export const NavigationHistoryProvider: React.FC<NavigationHistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<string[]>(['/']);
  const location = useLocation();

  // Track navigation changes
  useEffect(() => {
    const currentPath = location.pathname + location.search;
    setHistory(prev => {
      if (prev[prev.length - 1] !== currentPath) {
        return [...prev.slice(-9), currentPath];
      }
      return prev;
    });
  }, [location]);

  const addToHistory = (path: string) => {
    setHistory(prev => {
      if (prev[prev.length - 1] !== path) {
        return [...prev.slice(-9), path];
      }
      return prev;
    });
  };

  const goBack = () => {
    if (history.length > 1) {
      // Use window.history.back() for proper browser navigation
      window.history.back();
    }
  };

  const canGoBack = history.length > 1;
  const previousPath = history.length > 1 ? history[history.length - 2] : null;

  const value = {
    history,
    addToHistory,
    goBack,
    canGoBack,
    previousPath
  };

  return (
    <NavigationHistoryContext.Provider value={value}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => {
  const context = useContext(NavigationHistoryContext);
  if (context === undefined) {
    // Return safe defaults instead of throwing error
    return {
      history: ['/'],
      addToHistory: () => {},
      goBack: () => window.history.back(),
      canGoBack: window.history.length > 1,
      previousPath: null
    };
  }
  return context;
};
