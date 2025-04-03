
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthMethods } from '@/hooks/useAuthMethods';

interface AuthProviderProps {
  children: ReactNode;
  navigate: NavigateFunction;
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  // Initialize authentication state
  const { user, session, loading, setLoading } = useAuthInitialization();
  
  // Get auth methods
  const authMethods = useAuthMethods(navigate, setLoading);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      ...authMethods
    }}>
      {children}
    </AuthContext.Provider>
  );
}
