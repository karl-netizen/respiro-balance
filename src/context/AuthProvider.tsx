
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, session, loading: initializing } = useAuthInitialization();
  const authMethods = useAuthMethods(navigate, setLoading);
  
  // Create the combined auth context value
  const value = {
    user,
    session,
    loading: loading || initializing,
    isLoading: loading || initializing, // Added to fix errors
    ...authMethods
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
