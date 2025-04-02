
import { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AuthContext } from '@/context/AuthContext';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  requestPasswordReset, 
  updateUserPassword 
} from '@/lib/authActions';
import { toast } from 'sonner';

// Demo user and session for development without Supabase credentials
const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { first_name: 'Demo' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  role: 'authenticated',
};

const DEMO_SESSION: Session = {
  access_token: 'demo-access-token',
  token_type: 'bearer',
  refresh_token: 'demo-refresh-token',
  expires_in: 3600,
  expires_at: new Date().getTime() + 3600000,
  user: DEMO_USER,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If Supabase is not configured, use demo mode
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured: Using demo user automatically");
      setSession(DEMO_SESSION);
      setUser(DEMO_USER);
      setLoading(false);
      return () => {}; // No cleanup needed for demo mode
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Also update the user's last login time
          if (currentSession.user) {
            const { error } = await supabase
              .from('user_profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', currentSession.user.id);
              
            if (error) {
              console.error("Error updating last login:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Update last login time
          try {
            const { error } = await supabase
              .from('user_profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', newSession.user.id);
              
            if (error) {
              console.error("Error updating last login:", error);
            }
          } catch (error) {
            console.error("Error handling sign-in event:", error);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auth methods - now these actually work with Supabase
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await signInWithEmail(email, password, navigate, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string) => {
    setLoading(true);
    try {
      return await signUpWithEmail(email, password, firstName || '', setLoading);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      return await signOutUser(navigate, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      return await requestPasswordReset(email, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    setLoading(true);
    try {
      return await updateUserPassword(newPassword, navigate, setLoading);
    } finally {
      setLoading(false);
    }
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
