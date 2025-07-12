
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";



const ErrorPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      
      
      <div className="flex-grow flex items-center justify-center px-6 pb-20 pt-32">
        <div className="glassmorphism-card max-w-lg w-full p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-respiro-light flex items-center justify-center">
            <span className="text-5xl">404</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
          <p className="text-foreground/70 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's guide you back to a calmer space.
          </p>
          
          <Button asChild className="bg-primary text-white hover:bg-respiro-dark">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
      
      
    </div>
  );
};

export default ErrorPage;
