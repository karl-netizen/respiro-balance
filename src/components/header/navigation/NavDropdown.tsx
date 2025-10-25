
import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { useActiveRoute } from "./navigationUtils";

// Import enhanced TypeScript patterns
import {
  NavigationItem,
  NavigationEventEmitter,
  createNavItemId,
  createRoutePath,
  createCategoryId,
  safeNavigate,
  isNavigationSuccess
} from "./types";

// Legacy interface for backward compatibility
interface NavDropdownItem {
  label: string;
  path: string;
}

interface NavDropdownProps {
  title: string;
  items: NavDropdownItem[];
  isActive: boolean;
  onItemClick: (path: string) => void;
  activeCategory?: string;
}

const NavDropdown = ({ title, items, isActive, onItemClick, activeCategory }: NavDropdownProps) => {
  const navigate = useNavigate();
  useLocation();
  const { isActive: checkIsActive } = useActiveRoute();
  
  // Global event emitter (in real app, this would be provided via context)
  const [eventEmitter] = useState(() => new NavigationEventEmitter());

  // Convert legacy items to enhanced NavigationItem format
  const enhancedItems: NavigationItem[] = useMemo(() => {
    return items.map((item, index) => ({
      id: createNavItemId(`${title.toLowerCase()}_${index}`),
      label: item.label,
      path: createRoutePath(item.path),
      category: activeCategory ? createCategoryId(activeCategory) : undefined,
      requiresAuth: false,
      isExternal: false
    }));
  }, [items, title, activeCategory]);

  // Filter items if activeCategory is provided and this is the meditation dropdown
  const filteredItems = activeCategory && title === "Meditate" 
    ? enhancedItems.filter(item => 
        item.path.includes(`tab=${activeCategory}`) || !item.path.includes('?tab=')
      )
    : enhancedItems;

  const handleItemClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`NavDropdown item clicked: ${path}`);
    
    // Type-safe navigation with enhanced patterns
    const navigationResult = safeNavigate(path);
    
    if (isNavigationSuccess(navigationResult)) {
      // Emit navigation event
      eventEmitter.emit('nav:itemClick', {
        itemId: createNavItemId(`${title.toLowerCase()}_item`),
        path: navigationResult.data,
        timestamp: new Date()
      });
      
      onItemClick(path);
      navigate(path);
    } else {
      console.error('Navigation failed:', navigationResult.error.message);
    }
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "bg-transparent hover:bg-primary/5 transition-colors duration-200",
          isActive ? "text-primary font-medium" : "text-foreground/60"
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white border shadow-lg z-[99999] rounded-lg min-w-[200px] p-1 fixed">
        <div className="bg-white rounded-lg">
          <ul className="grid gap-1 p-3 w-full bg-white min-w-[180px]">
            {filteredItems.map((item) => {
              const isItemActive = checkIsActive(item.path);
              
              return (
                <li key={item.id}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "block p-2 hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      isItemActive && "bg-primary/10 text-primary font-medium"
                    )}
                    onClick={(e) => handleItemClick(item.path, e)}
                    aria-current={isItemActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </div>
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

// Export enhanced version for new implementations
export { default as EnhancedNavDropdown } from './EnhancedNavDropdown';
export { default as NavDropdownDemo } from './NavDropdownDemo';
