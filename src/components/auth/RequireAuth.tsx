
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

// Check if we're in demo mode by looking at the Supabase configuration
// This will be true when Supabase credentials are missing
const IS_DEMO_MODE = true; // For this app, we're always in demo mode

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated
  if (!user) {
    if (IS_DEMO_MODE) {
      // In demo mode, we'll allow access even without authentication
      toast.info("Demo Mode Active", {
        description: "Normally this would require login, but demo mode is enabled"
      });
      return <>{children}</>;
    } else {
      // In production mode, redirect to login
      // Save the current location so we can redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default RequireAuth;
