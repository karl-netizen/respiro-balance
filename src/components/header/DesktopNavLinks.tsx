
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { useActiveRoute } from "./navigation/navigationUtils";
import NavLink from "./navigation/NavLink";
import NavDropdown from "./navigation/NavDropdown";
import { meditateSection, breathingSection } from "./navigation/navigationData";

const DesktopNavLinks = () => {
  const navigate = useNavigate();
  const { isActive } = useActiveRoute();
  
  const handleNavClick = useCallback((path: string) => {
    console.log(`Navigation clicked: ${path}`);
    
    // Navigate to the path
    navigate(path);
    
    // Use a longer timeout to ensure navigation completes before scrolling
    setTimeout(() => {
      console.log("Scrolling to top after navigation");
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 300);
  }, [navigate]);

  return (
    <NavigationMenu className="z-50">
      <NavigationMenuList>
        {/* Home link */}
        <NavigationMenuItem>
          <NavLink 
            to="/landing"
            isActive={isActive('/landing')}
            onClick={() => handleNavClick("/landing")}
          >
            Home
          </NavLink>
        </NavigationMenuItem>

        {/* Meditation dropdown */}
        <NavDropdown
          title={meditateSection.title}
          items={meditateSection.items}
          isActive={isActive('/meditate')}
          onItemClick={handleNavClick}
        />

        {/* Breathing dropdown */}
        <NavDropdown
          title={breathingSection.title}
          items={breathingSection.items}
          isActive={isActive('/breathe')}
          onItemClick={handleNavClick}
        />

        {/* Progress link */}
        <NavigationMenuItem>
          <NavLink
            to="/progress"
            isActive={isActive('/progress')}
            onClick={() => handleNavClick("/progress")}
          >
            Progress
          </NavLink>
        </NavigationMenuItem>

        {/* Morning Ritual link */}
        <NavigationMenuItem>
          <NavLink
            to="/morning-ritual"
            isActive={isActive('/morning-ritual')}
            onClick={() => handleNavClick("/morning-ritual")}
          >
            Morning Ritual
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavLinks;
