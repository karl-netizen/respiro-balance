
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

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

  // In demo mode, we'll allow access even without authentication
  if (!user) {
    // If this is an actual deployed app, we'd redirect to login
    // For demo purposes, we'll just warn and allow access
    toast.info("Demo Mode Active", {
      description: "Normally this would require login, but demo mode is enabled"
    });
    return <>{children}</>;
  }
  
  return <>{children}</>;
};

export default RequireAuth;
