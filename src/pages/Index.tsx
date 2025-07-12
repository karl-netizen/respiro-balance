
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "@/components/Hero";
import PricingTiers from "@/components/PricingTiers";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Shield, Zap } from "lucide-react";

const Index = () => {
  console.log('Index page rendering...');
  console.log('Index component mounted at:', new Date().toISOString());
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  console.log('Index - Auth user:', user ? 'logged in' : 'not logged in');
  
  const handleGetStarted = () => {
    console.log('Get Started clicked, user:', user ? 'logged in' : 'not logged in');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div 
        style={{ 
          minHeight: '100vh', 
          backgroundColor: '#f8fafc',
          position: 'relative',
          zIndex: 1
        }}
      >
        
        <Hero />
        
        {/* Benefits Section with restored branding colors */}
        <section className="py-20 px-6 bg-respiro-light/20" id="benefits">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-respiro-text">Why Choose Respiro Balance</h2>
              <p className="text-respiro-text/70 max-w-2xl mx-auto">
                Our app brings mindfulness, meditation, and work-life balance together in one seamless experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* Benefit 1 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/60 backdrop-blur-sm border border-respiro-default/30 hover:scale-105 hover:shadow-xl hover:shadow-respiro-default/25 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-respiro-light/80 flex items-center justify-center mb-4 group-hover:bg-respiro-default/20 transition-colors duration-300">
                  <Clock className="h-8 w-8 text-respiro-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-respiro-text group-hover:text-respiro-dark transition-colors duration-300">Save Time</h3>
                <p className="text-respiro-text/80">
                  Short, effective meditation and breathing sessions designed to fit into your busy workday.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/60 backdrop-blur-sm border border-respiro-default/30 hover:scale-105 hover:shadow-xl hover:shadow-respiro-default/25 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-respiro-light/80 flex items-center justify-center mb-4 group-hover:bg-respiro-default/20 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-respiro-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-respiro-text group-hover:text-respiro-dark transition-colors duration-300">Reduce Stress</h3>
                <p className="text-respiro-text/80">
                  Scientifically proven breathing techniques to lower anxiety and improve focus during work hours.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/60 backdrop-blur-sm border border-respiro-default/30 hover:scale-105 hover:shadow-xl hover:shadow-respiro-default/25 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-full bg-respiro-light/80 flex items-center justify-center mb-4 group-hover:bg-respiro-default/20 transition-colors duration-300">
                  <Zap className="h-8 w-8 text-respiro-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-respiro-text group-hover:text-respiro-dark transition-colors duration-300">Boost Productivity</h3>
                <p className="text-respiro-text/80">
                  Enhance your concentration and energy levels with regular mindfulness practices.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                className="bg-respiro-dark hover:bg-respiro-darker text-white transition-transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-respiro-default/30"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleGetStarted}
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
              <p className="mt-4 text-sm text-respiro-text/70">
                No credit card required. Start with our free plan.
              </p>
            </div>
          </div>
        </section>
        
        <PricingTiers />
      </div>
    </div>
  );
};

export default Index;
