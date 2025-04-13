
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="min-h-screen pt-20 md:pt-28 pb-16 md:pb-20 px-4 md:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-respiro-light/30 to-transparent -z-10" />
      
      {/* Decorative circles - adjusted for mobile */}
      <div className="absolute top-40 -right-20 w-60 md:w-80 h-60 md:h-80 rounded-full bg-respiro-light/40 blur-3xl -z-10" />
      <div className="absolute bottom-20 -left-20 w-60 md:w-80 h-60 md:h-80 rounded-full bg-respiro-light/30 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className={`md:w-1/2 space-y-4 md:space-y-6 ${loaded ? 'animate-float-up' : 'opacity-0'}`}>
            <div className="inline-block">
              <span className="inline-block px-4 py-1.5 rounded-full bg-respiro-light text-respiro-dark text-xs md:text-sm font-medium animate-fade-in">
                Breathe Into Balance
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-respiro-text">
              <span className="block">Find Harmony in</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-respiro-dark to-respiro">Your Daily Life</span>
            </h1>
            
            <p className="text-base md:text-lg text-foreground/80 max-w-xl">
              Respiro Balance helps you cultivate mindfulness and reduce stress through breathing-centered meditation experiences tailored to restore balance to your work and life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
              <Button 
                size={isMobile ? "default" : "lg"}
                className="bg-primary text-white hover:bg-respiro-dark button-transition"
                onClick={handleGetStarted}
              >
                Begin Your Journey
              </Button>
              <Button 
                size={isMobile ? "default" : "lg"}
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10 button-transition"
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Discover More
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-xs md:text-sm text-foreground/60">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Join other professionals already breathing with Respiro Balance</span>
            </div>
          </div>
          
          <div className={`w-full md:w-1/2 mt-8 md:mt-0 ${loaded ? 'animate-float-up animation-delay-200' : 'opacity-0'}`}>
            <div className="relative">
              <div className="aspect-square w-full max-w-xs md:max-w-md mx-auto rounded-3xl glassmorphism-card p-4 md:p-6 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-respiro-light via-respiro to-respiro-dark" />
                
                <div className="text-center space-y-4 md:space-y-6 flex flex-col items-center justify-center h-full">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-respiro-light flex items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-respiro to-respiro-dark animate-pulse-slow" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-semibold">Breathe & Center</h3>
                    <p className="text-xs md:text-sm text-foreground/70">Take a moment to breathe and restore your balance</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10 rounded-full text-xs md:text-sm"
                    onClick={handleGetStarted}
                  >
                    Begin 5-Min Respiro Session
                  </Button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-16 md:w-24 h-16 md:h-24 rounded-full bg-respiro-light/50 blur-xl -z-10" />
              <div className="absolute -bottom-8 -left-8 w-20 md:w-32 h-20 md:h-32 rounded-full bg-respiro-light/40 blur-xl -z-10" />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a 
            href="#benefits" 
            className="flex flex-col items-center text-foreground/60 hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-xs md:text-sm mb-1 md:mb-2">Explore</span>
            <ChevronDown size={isMobile ? 16 : 20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
