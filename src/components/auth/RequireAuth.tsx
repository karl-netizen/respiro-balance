
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

// Toggle between demo mode and real auth - can be changed for testing
const IS_DEMO_MODE = localStorage.getItem('respiro-auth-mode') === 'demo' || 
                     !localStorage.getItem('respiro-auth-mode'); // Default to demo if not set

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Use an effect to manage local loading state
  useEffect(() => {
    console.log("RequireAuth: Authentication loading state changed:", authLoading);
    
    // Start a timer to prevent infinite loading
    const timer = setTimeout(() => {
      if (loading) {
        console.log("RequireAuth: Forcing loading state to false after timeout");
        setLoading(false);
      }
    }, 3000); // Force loading to end after 3 seconds max
    
    // Set loading based on auth loading, but only if we're still loading
    if (!authLoading && loading) {
      console.log("RequireAuth: Auth loading complete, ending loading state");
      setLoading(false);
    }
    
    return () => clearTimeout(timer);
  }, [authLoading, loading]);

  // If still in loading state, show spinner
  if (loading && !IS_DEMO_MODE) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // In demo mode, bypass authentication completely
  if (IS_DEMO_MODE) {
    console.log("RequireAuth: Demo mode active, bypassing authentication check");
    
    // Only show the toast once per session
    if (!sessionStorage.getItem('demo-toast-shown')) {
      toast.info("Demo Mode Active", {
        description: "Authentication is bypassed for demonstration purposes"
      });
      sessionStorage.setItem('demo-toast-shown', 'true');
    }
    
    return <>{children}</>;
  }
  
  // If not authenticated and not in demo mode
  if (!user && !IS_DEMO_MODE) {
    console.log("RequireAuth: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // User is authenticated or in demo mode, render children
  return <>{children}</>;
};

export default RequireAuth;
