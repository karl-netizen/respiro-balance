
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

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    
    // Force scroll to top if already on the same page
    if (window.location.pathname === path) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          onClick={(e) => handleNavClick(e, link.path)}
          className={({ isActive }) =>
            cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-foreground/60 hover:text-primary hover:bg-primary/5"
            )
          }
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNavLinks;
