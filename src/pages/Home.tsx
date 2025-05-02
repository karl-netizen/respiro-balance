
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to Respiro Balance</h1>
      
      <p className="text-xl text-center text-muted-foreground mb-8 max-w-lg">
        Your personal assistant for meditation, mindfulness, and better wellbeing
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="bg-primary text-white hover:bg-respiro-dark"
          onClick={handleGetStarted}
        >
          Begin Your Journey
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
