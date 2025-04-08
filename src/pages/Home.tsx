
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold text-center mb-6">Welcome to Respiro Balance</h1>
      
      <p className="text-xl text-center text-muted-foreground mb-8 max-w-lg">
        Your personal assistant for meditation, mindfulness, and better wellbeing
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link to="/login">Sign In</Link>
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link to="/register">Create Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
