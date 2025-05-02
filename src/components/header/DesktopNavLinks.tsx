
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const DesktopNavLinks = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Meditation", path: "/meditate" },
    { name: "Breathing", path: "/breathe" },
    { name: "Progress", path: "/progress" },
    { name: "Morning Ritual", path: "/morning-ritual" },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
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
