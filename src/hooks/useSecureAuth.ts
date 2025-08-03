/**
 * Secure Authentication Hook
 * Enhanced authentication with security measures
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  authRateLimiter, 
  clearSecuritySensitiveData, 
  isValidEmail, 
  validatePasswordStrength,
  logSecurityEvent 
} from '@/utils/security';
import { isDemoMode } from '@/config/environment';

export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const secureSignIn = useCallback(async (email: string, password: string) => {
    const identifier = email.toLowerCase();
    
    // Rate limiting check
    if (authRateLimiter.isRateLimited(identifier)) {
      const remainingAttempts = authRateLimiter.getRemainingAttempts(identifier);
      logSecurityEvent('Rate limit exceeded', { email: identifier }, 'warn');
      toast.error('Too many login attempts', {
        description: `Please wait before trying again. Remaining attempts: ${remainingAttempts}`
      });
      return;
    }

    // Input validation
    if (!isValidEmail(email)) {
      toast.error('Invalid email format');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    authRateLimiter.recordAttempt(identifier);

    try {
      // Clear any existing session data before new login
      clearSecuritySensitiveData();

      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        logSecurityEvent('Demo login successful', { email: identifier });
        toast.success('Demo Mode - Welcome back!', {
          description: 'Using demo account (no actual authentication occurred)'
        });
        navigate('/dashboard');
        return;
      }

      // Attempt global sign out first to clear any stale sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if this fails
        console.warn('Global signout failed:', error);
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        logSecurityEvent('Login failed', { 
          email: identifier, 
          error: error.message 
        }, 'warn');
        throw error;
      }

      logSecurityEvent('Login successful', { email: identifier });
      toast.success('Welcome back!', {
        description: 'You\'ve been successfully signed in.'
      });

      // Force page reload for clean state
      window.location.href = '/dashboard';
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed', {
        description: error.message || 'Please check your credentials'
      });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const secureSignUp = useCallback(async (email: string, password: string, firstName: string = '') => {
    // Input validation
    if (!isValidEmail(email)) {
      toast.error('Invalid email format');
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      const missingRequirements = Object.entries(passwordValidation.requirements)
        .filter(([_, met]) => !met)
        .map(([req]) => req);
      
      toast.error('Password does not meet requirements', {
        description: `Missing: ${missingRequirements.join(', ')}`
      });
      return;
    }

    setLoading(true);

    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 800));
        logSecurityEvent('Demo signup', { email });
        toast.success('Demo Mode - Account created!', {
          description: 'Simulated account creation (no actual registration occurred)'
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
          },
        }
      });

      if (error) {
        logSecurityEvent('Signup failed', { 
          email, 
          error: error.message 
        }, 'warn');
        throw error;
      }

      logSecurityEvent('Signup successful', { email });
      toast.success('Account created!', {
        description: 'Please check your email for the confirmation link.'
      });

    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('Sign up failed', {
        description: error.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const secureSignOut = useCallback(async () => {
    setLoading(true);

    try {
      // Clean up security-sensitive data first
      clearSecuritySensitiveData();

      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        logSecurityEvent('Demo logout');
        toast.success('Demo Mode - Signed out');
        window.location.href = '/login';
        return;
      }

      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.warn('Global signout failed:', error);
      }

      logSecurityEvent('Logout successful');
      toast.success('Signed out successfully');
      
      // Force page reload for clean state
      window.location.href = '/login';

    } catch (error: any) {
      console.error('Error signing out:', error);
      logSecurityEvent('Logout failed', { error: error.message }, 'error');
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    secureSignIn,
    secureSignUp,
    secureSignOut,
    loading,
  };
};