
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PricingTiers from "@/components/PricingTiers";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

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
        <Header />
        <Hero />
        
        {/* Benefits Section */}
        <section className="py-20 px-6 bg-secondary/10" id="benefits">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose Respiro Balance</h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Our app brings mindfulness, meditation, and work-life balance together in one seamless experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {/* Benefit 1 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Save Time</h3>
                <p className="text-foreground/70">
                  Short, effective meditation and breathing sessions designed to fit into your busy workday.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Reduce Stress</h3>
                <p className="text-foreground/70">
                  Scientifically proven breathing techniques to lower anxiety and improve focus during work hours.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Boost Productivity</h3>
                <p className="text-foreground/70">
                  Enhance your concentration and energy levels with regular mindfulness practices.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                className="bg-primary text-white hover:bg-primary/90 transition-transform hover:scale-105"
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
              <p className="mt-4 text-sm text-foreground/70">
                No credit card required. Start with our free plan.
              </p>
            </div>
          </div>
        </section>
        
        <PricingTiers />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
