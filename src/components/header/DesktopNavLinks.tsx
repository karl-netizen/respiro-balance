
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const DesktopNavLinks = () => {
  const navigate = useNavigate();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Meditation", path: "/meditate" },
    { name: "Breathing", path: "/breathe" },
    { name: "Progress", path: "/progress" },
    { name: "Morning Ritual", path: "/morning-ritual" },
  ];

  const handleNavClick = (path: string) => {
    // If clicking on home, just navigate there
    navigate(path);
    
    // Force scroll to top
    setTimeout(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 50);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navLinks.map((link) => (
        <button
          key={link.name}
          onClick={() => handleNavClick(link.path)}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            window.location.pathname === link.path
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
