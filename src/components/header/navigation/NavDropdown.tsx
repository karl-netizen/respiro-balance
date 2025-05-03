
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface NavDropdownItem {
  label: string;
  path: string;
}

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
  isActive: boolean;
  onItemClick: (path: string) => void;
}

const NavDropdown = ({ title, items, isActive, onItemClick }: NavDropdownProps) => {
  const navigate = useNavigate();

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
      <NavigationMenuContent className="bg-white border shadow-md z-[999] dropdown-content">
        <ul className="grid gap-2 p-4 w-48 bg-white">
          {items.map((item) => {
            // Determine if this item's path matches current location
            const isItemActive = window.location.pathname + window.location.search === item.path;
            
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
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavDropdown;
