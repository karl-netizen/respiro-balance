
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12 mt-8">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to Respiro Balance</h1>
      
      <p className="text-xl text-center text-muted-foreground mb-8 max-w-lg">
        Your personal assistant for meditation, mindfulness, and better wellbeing
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="bg-black text-white hover:bg-gray-800 font-bold text-lg px-8 py-6 h-auto cursor-pointer border-2 border-black shadow-md"
          onClick={handleGetStarted}
        >
          Begin Your Journey
        </Button>
        
        <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6 h-auto">
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
