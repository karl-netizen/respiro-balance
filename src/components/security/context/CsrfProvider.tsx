// CSRF Protection Context and Provider
// Extracted from SecureFormComponents.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { type CSRFToken } from '@/security/SecureAuthSystem';

interface CSRFContextType {
  token: CSRFToken | null;
  refreshToken: () => Promise<void>;
  validateToken: (token: CSRFToken) => boolean;
}

const CSRFContext = React.createContext<CSRFContextType | null>(null);

export const CSRFProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<CSRFToken | null>(null);

  const refreshToken = useCallback(async () => {
    try {
      // Generate a mock CSRF token for demo purposes
      const mockToken = `csrf_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      setToken(mockToken as CSRFToken);
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }, []);

  const validateToken = useCallback((tokenToValidate: CSRFToken): boolean => {
    return token === tokenToValidate;
  }, [token]);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  return (
    <CSRFContext.Provider value={{ token, refreshToken, validateToken }}>
      {children}
    </CSRFContext.Provider>
  );
};

export const useCSRF = (): CSRFContextType => {
  const context = React.useContext(CSRFContext);
  if (!context) {
    throw new Error('useCSRF must be used within CSRFProvider');
  }
  return context;
};
