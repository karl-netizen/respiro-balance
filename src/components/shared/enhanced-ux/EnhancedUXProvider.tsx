
import React, { createContext, useContext, ReactNode } from 'react';
import { useEnhancedUX } from '@/hooks/useEnhancedUX';

const EnhancedUXContext = createContext<ReturnType<typeof useEnhancedUX> | null>(null);

interface EnhancedUXProviderProps {
  children: ReactNode;
}

export const EnhancedUXProvider: React.FC<EnhancedUXProviderProps> = ({ children }) => {
  const enhancedUX = useEnhancedUX();
  
  return (
    <EnhancedUXContext.Provider value={enhancedUX}>
      {children}
    </EnhancedUXContext.Provider>
  );
};

export const useEnhancedUXContext = () => {
  const context = useContext(EnhancedUXContext);
  if (!context) {
    throw new Error('useEnhancedUXContext must be used within EnhancedUXProvider');
  }
  return context;
};
