
import { ReactNode } from 'react';
import { useNavigate, NavigateFunction as ReactRouterNavigateFunction } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthMethods } from '@/hooks/useAuthMethods';

type NavigateFunction = ReactRouterNavigateFunction;

interface AuthProviderProps {
  children: ReactNode;
  navigate?: NavigateFunction;
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  // Use react-router's navigate if not provided
  const routerNavigate = useNavigate();
  const navigationFunction = navigate || routerNavigate;
  
  // Initialize authentication state
  const { user, session, loading } = useAuthInitialization();
  
  // Get auth methods
  const authMethods = useAuthMethods(navigationFunction, () => {});

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
