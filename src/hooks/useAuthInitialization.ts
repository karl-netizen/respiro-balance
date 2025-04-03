
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEMO_SESSION, DEMO_USER } from '@/lib/demoAuth';

export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  return { user, session, loading, setLoading };
};
