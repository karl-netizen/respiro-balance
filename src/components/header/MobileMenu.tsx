
import { useState } from 'react';
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDropdown from './MobileDropdown';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-foreground"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-morph animate-fade-in">
          <div className="flex flex-col space-y-2 p-6">
            <a 
              href="/" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              Home
            </a>
            
            <MobileDropdown 
              title="Meditate" 
              items={[
                { label: "Guided Sessions", href: "#meditation" },
                { label: "Quick Breaks", href: "#quick-breaks" },
                { label: "Deep Focus", href: "#deep-focus" },
                { label: "Meditation Library", href: "/meditate" }
              ]} 
              toggleMainMenu={toggleMenu}
            />
            
            <MobileDropdown 
              title="Breathe" 
              items={[
                { label: "Breathing Visualizer", href: "/breathe" },
                { label: "Breathing Techniques", href: "/breathe?tab=techniques" },
                { label: "Box Breathing", href: "/breathe?tab=techniques&technique=box" },
                { label: "4-7-8 Breathing", href: "/breathe?tab=techniques&technique=478" },
                { label: "Coherent Breathing", href: "/breathe?tab=techniques&technique=coherent" }
              ]} 
              toggleMainMenu={toggleMenu}
            />
            
            <a 
              href="/progress" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              Progress
            </a>
            
            <a 
              href="#pricing" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              Pricing
            </a>
            
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-white w-full mt-2"
              onClick={toggleMenu}
            >
              Log In
            </Button>
            <Button 
              className="bg-primary text-white hover:bg-mindflow-dark w-full"
              onClick={toggleMenu}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
