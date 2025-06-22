
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
      setHistory(prev => prev.slice(0, -1));
      // Use window.history.back() instead of React Router navigate
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
      goBack: () => {},
      canGoBack: false,
      previousPath: null
    };
  }
  return context;
};
