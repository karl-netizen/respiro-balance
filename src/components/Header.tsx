
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10 
      ${isScrolled ? 'glass-morph' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mindflow to-mindflow-dark flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
          <h1 className="ml-3 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-mindflow-dark to-mindflow">
            Mindflow
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-foreground/80 hover:text-primary button-transition">Features</a>
          <a href="#meditation" className="text-foreground/80 hover:text-primary button-transition">Meditate</a>
          <a href="#pricing" className="text-foreground/80 hover:text-primary button-transition">Pricing</a>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Log In
          </Button>
          <Button className="bg-primary text-white hover:bg-mindflow-dark">
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-morph animate-fade-in">
          <div className="flex flex-col space-y-4 p-6">
            <a 
              href="#features" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#meditation" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Meditate
            </a>
            <a 
              href="#pricing" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full">
              Log In
            </Button>
            <Button className="bg-primary text-white hover:bg-mindflow-dark w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
