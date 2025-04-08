
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({
  user: null,
  loading: true,
  isLoading: true
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null); // For reset password flows

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

  // Sign in implementation
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate authentication API call
      // In a real app, you'd call your auth service here
      console.log(`Signing in with ${email} and password`);
      
      // For demo purposes - simulate a successful login
      const userData = { email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // Sign up implementation
  const signUp = async (email: string, password: string, firstName: string) => {
    setLoading(true);
    try {
      // Simulate registration API call
      console.log(`Registering ${firstName} with ${email} and password`);
      
      // For demo purposes - just return success
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Sign out implementation
  const signOut = async () => {
    try {
      // Clear local storage and state
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Forgot password implementation
  const forgotPassword = async (email: string) => {
    try {
      // Simulate sending reset email
      console.log(`Sending password reset email to ${email}`);
      
      // In demo, we'd generate a token here
      const resetToken = 'demo-reset-token';
      setToken(resetToken);
      
      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error('Failed to send reset email');
    }
  };

  // Reset password implementation
  const resetPassword = async (newPassword: string) => {
    if (!token) {
      throw new Error('No reset token found');
    }

    try {
      // Simulate password reset
      console.log(`Resetting password with token: ${token}`);
      
      // Clear token after use
      setToken(null);
      
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Password reset failed');
    }
  };

  // Update profile implementation
  const updateProfile = async (profileData: any) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Simulate profile update
      console.log('Updating profile:', profileData);
      
      // Update user in localStorage and state
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  };

  // Verify email implementation
  const verifyEmail = async (token: string) => {
    try {
      // Simulate email verification
      console.log(`Verifying email with token: ${token}`);
      
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error('Email verification failed');
    }
  };

  // Resend verification email implementation
  const resendVerificationEmail = async (email: string) => {
    try {
      // Simulate resending verification email
      console.log(`Resending verification email to: ${email}`);
      
      return { success: true };
    } catch (error) {
      console.error('Resend verification error:', error);
      throw new Error('Failed to resend verification email');
    }
  };

  // Create context value with all methods
  const value = {
    user,
    loading,
    isLoading: loading, // Alias for loading
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail
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
