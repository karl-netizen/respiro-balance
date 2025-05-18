
import React, { ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import AuthContext, { AuthContextType } from './AuthContext';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user, session, loading: initializing } = useAuthInitialization();
  
  // Force loading to end after a certain time to prevent infinite loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || initializing) {
        console.log("Force ending auth loading state after timeout");
        setLoading(false);
      }
    }, 5000); // Force loading to end after 5 seconds max
    
    return () => clearTimeout(timer);
  }, [loading, initializing]);
  
  // Use the auth methods with proper type casting
  const authMethods = useAuthMethods(navigate, setLoading) as any;
  
  // Create the combined auth context value
  const value: AuthContextType = {
    user,
    session,
    loading: loading || initializing,
    isLoading: loading || initializing,
    signUp: authMethods.signUp,
    signIn: authMethods.signIn,
    signOut: authMethods.signOut,
    forgotPassword: authMethods.forgotPassword,
    resetPassword: authMethods.resetPassword,
    updateProfile: authMethods.updateProfile,
    verifyEmail: authMethods.verifyEmail,
    resendVerificationEmail: authMethods.resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

