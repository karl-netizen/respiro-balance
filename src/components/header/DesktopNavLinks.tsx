
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { useActiveRoute } from "./navigation/navigationUtils";
import NavLink from "./navigation/NavLink";
import NavDropdown from "./navigation/NavDropdown";
import { 
  homeSection,
  meditateSection, 
  breathingSection, 
  workLifeBalanceSection 
} from "./navigation/navigationData";

const DesktopNavLinks = () => {
  const navigate = useNavigate();
  const { isActive } = useActiveRoute();
  const location = useLocation();
  
  // Extract active category from URL if on meditate page
  const getActiveCategory = () => {
    if (location.pathname.includes('/meditate')) {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get('tab') || 'guided'; // Default to 'guided' if no tab specified
    }
    return null;
  };
  
  const activeCategory = getActiveCategory();
  
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
        {/* Home dropdown */}
        <NavDropdown
          title={homeSection.title}
          items={homeSection.items}
          isActive={isActive('/') || isActive('/landing') || isActive('/dashboard')}
          onItemClick={handleNavClick}
        />

        {/* Meditation dropdown */}
        <NavDropdown
          title={meditateSection.title}
          items={meditateSection.items}
          isActive={isActive('/meditation')}
          onItemClick={handleNavClick}
          activeCategory={activeCategory}
        />

        {/* Breathing dropdown */}
        <NavDropdown
          title={breathingSection.title}
          items={breathingSection.items}
          isActive={isActive('/breathe')}
          onItemClick={handleNavClick}
        />
        
        {/* Work-Life Balance dropdown */}
        <NavDropdown
          title={workLifeBalanceSection.title}
          items={workLifeBalanceSection.items}
          isActive={isActive('/work-life-balance')}
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

        {/* Pricing link */}
        <NavigationMenuItem>
          <NavLink
            to="/pricing"
            isActive={isActive('/pricing')}
            onClick={() => handleNavClick("/pricing")}
          >
            Pricing
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavLinks;
