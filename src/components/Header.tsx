
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, Crown } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { preferences } = useUserPreferences();

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
            <span className="text-white font-semibold text-lg">R</span>
          </div>
          <h1 className="ml-3 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-mindflow-dark to-mindflow">
            Respiro Balance
          </h1>
        </div>

        {/* Desktop Navigation with Updated Structure */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
                  Home
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent">
                Meditate
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-popover/95 backdrop-blur-sm">
                <ul className="grid gap-3 p-4 md:w-[400px]">
                  <FeatureItem
                    title="Guided Sessions"
                    href="#meditation"
                    description="Professional voice-guided meditation sessions"
                  />
                  <FeatureItem 
                    title="Quick Breaks"
                    href="#quick-breaks"
                    description="2-5 minute sessions perfect for short work breaks"
                  />
                  <FeatureItem
                    title="Deep Focus"
                    href="#deep-focus"
                    description="Longer sessions for deep restoration"
                  />
                  <FeatureItem
                    title="Meditation Library"
                    href="/meditate"
                    description="Browse our complete collection of sessions"
                  />
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/breathe" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
                  Breathe
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/progress" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
                  Progress
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="#pricing" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
                  Pricing
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Account and Subscription Elements */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center">
            <div className="mr-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {preferences.subscriptionTier || "Free"}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={20} />
            </Button>
          </div>
          <Button className="bg-primary text-white hover:bg-mindflow-dark">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - Updated for new structure */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-morph animate-fade-in">
          <div className="flex flex-col space-y-2 p-6">
            <a 
              href="/" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
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
            />
            
            <a 
              href="/breathe" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Breathe
            </a>
            
            <a 
              href="/progress" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Progress
            </a>
            
            <a 
              href="#pricing" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full mt-2">
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

// Helper component for feature items in the dropdown
const FeatureItem = ({ title, href, description }: { title: string; href: string; description: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

// Mobile dropdown component
const MobileDropdown = ({ title, items }: { title: string; items: { label: string; href: string }[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-foreground/80 hover:text-primary py-2 button-transition"
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-2 mt-1 mb-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-foreground/70 hover:text-primary py-1 text-sm button-transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
