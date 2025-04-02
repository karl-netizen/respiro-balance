
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for the authentication state to be determined
    if (!loading) {
      setIsCheckingAuth(false);
    }
  }, [loading]);

  // Show loading state while checking authentication
  if (isCheckingAuth || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render protected content
  return <Outlet />;
};

export default RequireAuth;
