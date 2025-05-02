
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const DesktopNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Meditation", path: "/meditate" },
    { name: "Breathing", path: "/breathe" },
    { name: "Progress", path: "/progress" },
    { name: "Morning Ritual", path: "/morning-ritual" },
  ];

  const handleNavClick = useCallback((path: string) => {
    console.log(`Navigation clicked: ${path}, current path: ${location.pathname}`);
    
    if (location.pathname === path) {
      console.log("Already on this page, scrolling to top");
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      console.log(`Navigating to: ${path}`);
      // Navigate to the new page
      navigate(path);
      
      // Use a longer timeout to ensure navigation completes before scrolling
      setTimeout(() => {
        console.log("Scrolling to top after navigation");
        window.scrollTo({top: 0, behavior: 'smooth'});
      }, 300);
    }
  }, [location.pathname, navigate]);

  return (
    <nav className="hidden lg:flex items-center space-x-1 z-20">
      {navLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleNavClick(link.path)}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            location.pathname === link.path
              ? "bg-primary/10 text-primary"
              : "text-foreground/60 hover:text-primary hover:bg-primary/5"
          )}
        >
          {link.name}
        </button>
      ))}
    </nav>
  );
};

export default DesktopNavLinks;
