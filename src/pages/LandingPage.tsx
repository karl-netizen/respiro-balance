
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PricingTiers from "@/components/PricingTiers";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Shield, Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      {/* Benefits Section */}
      <section className="py-20 px-6 bg-secondary/10" id="benefits">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Respiro Balance</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Our app brings mindfulness, meditation, and work-life balance together in one seamless experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Benefit 1 */}
            <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-respiro-light/30 flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-respiro-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Time</h3>
              <p className="text-foreground/70">
                Short, effective meditation and breathing sessions designed to fit into your busy workday.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-respiro-light/30 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-respiro-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reduce Stress</h3>
              <p className="text-foreground/70">
                Scientifically proven breathing techniques to lower anxiety and improve focus during work hours.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="glassmorphism-card p-6 rounded-xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-respiro-light/30 flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-respiro-dark" />
              </div>
              <h3 className="text-xl font-bold mb-2">Boost Productivity</h3>
              <p className="text-foreground/70">
                Enhance your concentration and energy levels with regular mindfulness practices.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-respiro-dark transition-transform"
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
  );
};

export default LandingPage;
