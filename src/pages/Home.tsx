
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Using the same demo mode flag as in RequireAuth
const IS_DEMO_MODE = true;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    console.log("Get Started clicked, user:", user ? "logged in" : "not logged in");
    
    if (user) {
      navigate('/dashboard');
    } else if (IS_DEMO_MODE) {
      // For demo purposes, show a toast and navigate directly to dashboard
      toast.info("Demo Mode", {
        description: "Bypassing login for demonstration"
      });
      navigate('/dashboard');
    } else {
      // In production, would redirect to login
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 mt-8 bg-background">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">Welcome to Respiro Balance</h1>
      
      <p className="text-xl text-center text-muted-foreground mb-8 max-w-lg">
        Your personal assistant for meditation, mindfulness, and better wellbeing
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8 py-6 h-auto cursor-pointer shadow-md"
          onClick={handleGetStarted}
        >
          Begin Your Journey
        </Button>
        
        <Button 
          variant="outline" 
          asChild 
          size="lg" 
          className="border-primary text-primary hover:bg-primary/10 hover:text-primary text-lg px-8 py-6 h-auto"
        >
          <Link to="/landing">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}

export default Home;
