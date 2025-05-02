
import React from "react";
import { Link } from "react-router-dom";
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
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "bg-transparent hover:bg-primary/5",
          isActive ? "text-primary" : "text-foreground/60"
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-background border shadow-md z-50">
        <ul className="grid gap-2 p-4 w-48 bg-background">
          {items.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className="block p-2 hover:bg-accent rounded-md"
                onClick={() => onItemClick(item.path)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default NavDropdown;
