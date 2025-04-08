
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth as useAuthHook } from '@/context/AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({
  user: null,
  loading: true
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication logic without using useNavigate directly
  useEffect(() => {
    // Here you would normally check for authentication status
    // For example, checking localStorage or a token
    const checkAuth = async () => {
      try {
        // Simulating auth check
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
