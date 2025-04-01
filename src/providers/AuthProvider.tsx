
import { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase, demoAuth } from '@/lib/supabase';
import { AuthContext } from '@/context/AuthContext';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  requestPasswordReset, 
  updateUserPassword 
} from '@/lib/authActions';

// Create a demo user for testing
const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { first_name: 'Demo' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  role: 'authenticated',
};

// Create a demo session
const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  user: DEMO_USER,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USER); // Auto-set demo user
  const [session, setSession] = useState<Session | null>(DEMO_SESSION); // Auto-set demo session
  const [loading, setLoading] = useState(false); // Set loading to false initially
  const navigate = useNavigate();

  useEffect(() => {
    // Skip all auth checks in testing mode
    console.log("Testing mode: Using demo user automatically");
    setSession(DEMO_SESSION);
    setUser(DEMO_USER);
    setLoading(false);

    // Return a no-op cleanup function
    return () => {};
  }, []);

  // Auth methods (these will just be stubs for testing)
  const signIn = async (email: string, password: string) => {
    console.log("Test mode: Auto sign-in with:", email);
    return Promise.resolve();
  };

  const signUp = async (email: string, password: string, firstName?: string) => {
    console.log("Test mode: Auto sign-up with:", email);
    return Promise.resolve();
  };

  const signOut = async () => {
    console.log("Test mode: Sign out (ignored)");
    return Promise.resolve();
  };

  const forgotPassword = async (email: string) => {
    console.log("Test mode: Forgot password for:", email);
    return Promise.resolve();
  };

  const resetPassword = async (newPassword: string) => {
    console.log("Test mode: Reset password to:", newPassword);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      forgotPassword, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
