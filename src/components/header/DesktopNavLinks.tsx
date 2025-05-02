
import React, { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const DesktopNavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Function to check if a route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {/* Home link */}
        <NavigationMenuItem>
          <Link
            to="/landing"
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-primary/5",
              isActive('/landing') ? "text-primary" : "text-foreground/60"
            )}
            onClick={() => handleNavClick("/landing")}
          >
            Home
          </Link>
        </NavigationMenuItem>

        {/* Meditation dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-primary/5",
              isActive('/meditate') ? "text-primary" : "text-foreground/60"
            )}
          >
            Meditate
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-background border shadow-md">
            <ul className="grid gap-2 p-4 w-48">
              <li>
                <Link 
                  to="/meditate" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/meditate")}
                >
                  All Sessions
                </Link>
              </li>
              <li>
                <Link 
                  to="/meditate?tab=guided" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/meditate?tab=guided")}
                >
                  Guided Meditation
                </Link>
              </li>
              <li>
                <Link 
                  to="/meditate?tab=quick" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/meditate?tab=quick")}
                >
                  Quick Sessions
                </Link>
              </li>
              <li>
                <Link 
                  to="/meditate?tab=deep" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/meditate?tab=deep")}
                >
                  Deep Focus
                </Link>
              </li>
              <li>
                <Link 
                  to="/meditate?tab=sleep" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/meditate?tab=sleep")}
                >
                  Sleep
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Breathing dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "bg-transparent hover:bg-primary/5",
              isActive('/breathe') ? "text-primary" : "text-foreground/60"
            )}
          >
            Breathing
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-background border shadow-md">
            <ul className="grid gap-2 p-4 w-48">
              <li>
                <Link 
                  to="/breathe" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/breathe")}
                >
                  Breathing Exercises
                </Link>
              </li>
              <li>
                <Link 
                  to="/breathe?tab=techniques" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/breathe?tab=techniques")}
                >
                  Breathing Techniques
                </Link>
              </li>
              <li>
                <Link 
                  to="/breathe?tab=techniques&technique=box" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/breathe?tab=techniques&technique=box")}
                >
                  Box Breathing
                </Link>
              </li>
              <li>
                <Link 
                  to="/breathe?tab=techniques&technique=478" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/breathe?tab=techniques&technique=478")}
                >
                  4-7-8 Breathing
                </Link>
              </li>
              <li>
                <Link 
                  to="/breathe?tab=techniques&technique=coherent" 
                  className="block p-2 hover:bg-accent rounded-md"
                  onClick={() => handleNavClick("/breathe?tab=techniques&technique=coherent")}
                >
                  Coherent Breathing
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Progress link */}
        <NavigationMenuItem>
          <Link
            to="/progress"
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-primary/5",
              isActive('/progress') ? "text-primary" : "text-foreground/60"
            )}
            onClick={() => handleNavClick("/progress")}
          >
            Progress
          </Link>
        </NavigationMenuItem>

        {/* Morning Ritual link */}
        <NavigationMenuItem>
          <Link
            to="/morning-ritual"
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-primary/5",
              isActive('/morning-ritual') ? "text-primary" : "text-foreground/60"
            )}
            onClick={() => handleNavClick("/morning-ritual")}
          >
            Morning Ritual
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavLinks;
