
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { useActiveRoute } from "./navigationUtils";

interface NavDropdownItem {
  label: string;
  path: string;
}

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
  isActive: boolean;
  onItemClick: (path: string) => void;
  activeCategory?: string; // Added to filter items by category
}

const NavDropdown = ({ title, items, isActive, onItemClick, activeCategory }: NavDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isActive: checkIsActive } = useActiveRoute();
  
  // Filter items if activeCategory is provided and this is the meditation dropdown
  const filteredItems = activeCategory && title === "Meditate" 
    ? items.filter(item => item.path.includes(`tab=${activeCategory}`) || !item.path.includes('?tab='))
    : items;

  const handleItemClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`NavDropdown item clicked: ${path}`);
    onItemClick(path);
    navigate(path);
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "bg-transparent hover:bg-primary/5",
          isActive ? "text-primary font-medium" : "text-foreground/60"
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white border shadow-lg z-[99999] rounded-lg min-w-[200px] p-1 fixed">{/*Increased z-index and added fixed positioning for mobile*/}
        <div className="bg-white rounded-lg">
          <ul className="grid gap-1 p-3 w-full bg-white min-w-[180px]">
            {filteredItems.map((item) => {
              // Use our useActiveRoute hook to check if this item's path is active
              const isItemActive = checkIsActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "block p-2 hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      isItemActive && "bg-primary/10 text-primary font-medium" // Highlight active item
                    )}
                    onClick={(e) => handleItemClick(item.path, e)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavDropdown;
