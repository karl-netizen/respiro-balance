
import { createContext, useContext } from 'react';

// Define comprehensive auth context type with all required methods and properties
interface AuthContextType {
  user: any;
  loading: boolean;
  isLoading?: boolean; // Alias for loading (used in some components)
  signIn?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string, firstName: string) => Promise<any>;
  signOut?: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (password: string) => Promise<void>;
  updateProfile?: (data: any) => Promise<void>;
  verifyEmail?: (token: string) => Promise<void>;
  resendVerificationEmail?: (email: string) => Promise<void>;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
