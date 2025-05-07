
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FocusContextType {
  isActive: boolean;
  startFocus: () => void;
  endFocus: () => void;
  focusTime: number;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [focusTime, setFocusTime] = useState(0);

  const startFocus = () => {
    setIsActive(true);
  };

  const endFocus = () => {
    setIsActive(false);
    setFocusTime(0);
  };

  const value = {
    isActive,
    startFocus,
    endFocus,
    focusTime
  };

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = (): FocusContextType => {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};

export default FocusContext;
