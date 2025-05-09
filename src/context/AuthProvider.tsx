
import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

// Extend useAuthMethods to include needed methods
interface ExtendedAuthMethods {
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  updateProfile: (data: any) => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<any>;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, session, loading: initializing } = useAuthInitialization();
  // Use the auth methods with proper type casting
  const authMethods = useAuthMethods(navigate, setLoading) as unknown as ExtendedAuthMethods;
  
  // Create the combined auth context value
  const value = {
    user,
    session,
    loading: loading || initializing,
    isLoading: loading || initializing,
    ...authMethods
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
