
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Moon, Sun, Bell, Heart, Search, Settings, HelpCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDropdown from './MobileDropdown';
import { useUserPreferences } from '@/context/hooks/useUserPreferences';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { user } = useAuth();
  const isDarkMode = preferences.theme === 'dark';
  
  const toggleTheme = () => {
    updatePreferences({ theme: isDarkMode ? 'light' : 'dark' });
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

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
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              Home
            </Link>
            
            {user && (
              <Link 
                to="/dashboard" 
                className="text-foreground/80 hover:text-primary py-2 button-transition"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}
            
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
            
            {/* Additional Mobile Menu Items */}
            <div className="pt-2 mt-2 border-t border-foreground/10">
              <MobileDropdown
                title="User Profile"
                icon={<User size={16} className="mr-2" />}
                items={[
                  { label: "My Profile", href: "/profile" },
                  { label: "Account Settings", href: "/settings/account" },
                  { label: "Preferences", href: "/settings/preferences" },
                  { label: "Logout", href: "/logout" }
                ]}
                toggleMainMenu={toggleMenu}
              />
              
              <button 
                className="flex w-full items-center justify-between text-foreground/80 hover:text-primary py-2 button-transition"
                onClick={() => {
                  toggleTheme();
                }}
              >
                <span className="flex items-center">
                  {isDarkMode ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
              
              <MobileDropdown
                title="Notifications"
                icon={<Bell size={16} className="mr-2" />}
                items={[
                  { label: "All Notifications", href: "/notifications" },
                  { label: "Session Reminders", href: "/notifications/reminders" },
                  { label: "Progress Updates", href: "/notifications/progress" },
                  { label: "New Content", href: "/notifications/content" }
                ]}
                toggleMainMenu={toggleMenu}
              />
              
              <MobileDropdown
                title="Favorites"
                icon={<Heart size={16} className="mr-2" />}
                items={[
                  { label: "Saved Sessions", href: "/favorites/sessions" },
                  { label: "Favorite Techniques", href: "/favorites/techniques" },
                  { label: "Custom Mixes", href: "/favorites/mixes" }
                ]}
                toggleMainMenu={toggleMenu}
              />
              
              <a 
                href="/search" 
                className="flex items-center text-foreground/80 hover:text-primary py-2 button-transition"
                onClick={toggleMenu}
              >
                <Search size={16} className="mr-2" />
                Search
              </a>
              
              <MobileDropdown
                title="Settings"
                icon={<Settings size={16} className="mr-2" />}
                items={[
                  { label: "App Settings", href: "/settings" },
                  { label: "Notifications", href: "/settings/notifications" },
                  { label: "Privacy", href: "/settings/privacy" },
                  { label: "Display", href: "/settings/display" }
                ]}
                toggleMainMenu={toggleMenu}
              />
              
              <MobileDropdown
                title="Help & Support"
                icon={<HelpCircle size={16} className="mr-2" />}
                items={[
                  { label: "FAQs", href: "/help/faqs" },
                  { label: "Contact Support", href: "/help/contact" },
                  { label: "Tutorials", href: "/help/tutorials" },
                  { label: "Community Forum", href: "/community" }
                ]}
                toggleMainMenu={toggleMenu}
              />
              
              <MobileDropdown
                title="Downloads"
                icon={<Download size={16} className="mr-2" />}
                items={[
                  { label: "Downloaded Content", href: "/downloads" },
                  { label: "Download Manager", href: "/downloads/manage" },
                  { label: "Storage Settings", href: "/downloads/storage" }
                ]}
                toggleMainMenu={toggleMenu}
              />
            </div>
            
            <div className="pt-4 mt-2">
              {!user && (
                <>
                  <Button 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-white w-full mt-2"
                    onClick={toggleMenu}
                    asChild
                  >
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button 
                    className="bg-primary text-white hover:bg-respiro-dark w-full mt-2"
                    onClick={toggleMenu}
                    asChild
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
