import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { useActiveRoute } from "./navigationUtils";

// Import our advanced TypeScript patterns
import {
  NavigationItem,
  DropdownConfig,
  NavigationState,
  DropdownState,
  NavigationEventEmitter,
  NavigationError,
  Result,
  NavItemId,
  RoutePath,
  DropdownId,
  CategoryId,
  createNavItemId,
  createRoutePath,
  createCategoryId,
  safeNavigate,
  isNavigationSuccess,
  isDropdownOpen,
  Ok,
  Err
} from "./types";

// ===================================================================
// ENHANCED COMPONENT INTERFACES WITH ADVANCED TYPING
// ===================================================================

interface EnhancedNavDropdownProps {
  readonly config: DropdownConfig;
  readonly isActive: boolean;
  readonly activeCategory?: CategoryId;
  readonly eventEmitter: NavigationEventEmitter;
  readonly onNavigationStateChange?: (state: NavigationState) => void;
  readonly onDropdownStateChange?: (state: DropdownState) => void;
  readonly className?: string;
  readonly disabled?: boolean;
}

interface NavigationItemProps {
  readonly item: NavigationItem;
  readonly isActive: boolean;
  readonly isDisabled?: boolean;
  readonly onClick: (item: NavigationItem, event: React.MouseEvent) => Promise<Result<void>>;
}

// ===================================================================
// MEMOIZED NAVIGATION ITEM COMPONENT
// ===================================================================

const NavigationItemComponent = React.memo<NavigationItemProps>(({ 
  item, 
  isActive, 
  isDisabled = false, 
  onClick 
}) => {
  const handleClick = useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();
    
    if (isDisabled) {
      return;
    }

    try {
      const result = await onClick(item, event);
      if (!isNavigationSuccess(result)) {
        console.error('Navigation failed:', result.error.message);
      }
    } catch (error) {
      console.error('Unexpected navigation error:', error);
    }
  }, [item, onClick, isDisabled]);

  return (
    <li>
      <Link
        to={item.path}
        className={cn(
          "block p-2 hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none",
          isActive && "bg-primary/10 text-primary font-medium",
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          item.isExternal && "after:content-['↗'] after:ml-1 after:text-xs"
        )}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={isDisabled}
        {...(item.isExternal && { 
          target: '_blank', 
          rel: 'noopener noreferrer' 
        })}
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
});

NavigationItemComponent.displayName = 'NavigationItemComponent';

// ===================================================================
// ENHANCED NAV DROPDOWN WITH ADVANCED PATTERNS
// ===================================================================

const EnhancedNavDropdown: React.FC<EnhancedNavDropdownProps> = ({
  config,
  isActive,
  activeCategory,
  eventEmitter,
  onNavigationStateChange,
  onDropdownStateChange,
  className,
  disabled = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isActive: checkIsActive } = useActiveRoute();
  
  // State management with discriminated unions
  const [dropdownState, setDropdownState] = useState<DropdownState>({ type: 'closed' });
  const [navigationState, setNavigationState] = useState<NavigationState>({ status: 'idle' });

  // Memoized filtered items with type safety
  const filteredItems = useMemo((): readonly NavigationItem[] => {
    if (!activeCategory) return config.items;
    
    return config.items.filter(item => 
      item.category === activeCategory || !item.category
    );
  }, [config.items, activeCategory]);

  // Type-safe navigation handler with Result pattern
  const handleItemClick = useCallback(async (
    item: NavigationItem
  ): Promise<Result<void>> => {
    const startTime = performance.now();
    const currentPath = createRoutePath(location.pathname);
    
    try {
      // Update navigation state to show loading
      const newNavigationState: NavigationState = {
        status: 'navigating',
        targetPath: item.path
      };
      setNavigationState(newNavigationState);
      onNavigationStateChange?.(newNavigationState);

      // Emit navigation start event
      eventEmitter.emit('nav:navigationStart', {
        fromPath: currentPath,
        toPath: item.path
      });

      // Emit item click event
      eventEmitter.emit('nav:itemClick', {
        itemId: item.id,
        path: item.path,
        timestamp: new Date()
      });

      // Validate navigation path
      const pathResult = safeNavigate(item.path);
      if (!isNavigationSuccess(pathResult)) {
        throw pathResult.error;
      }

      // Perform navigation
      navigate(item.path);

      // Update state to success
      const successState: NavigationState = {
        status: 'success',
        currentPath: item.path,
        timestamp: new Date()
      };
      setNavigationState(successState);
      onNavigationStateChange?.(successState);

      // Emit navigation complete event
      const duration = performance.now() - startTime;
      eventEmitter.emit('nav:navigationComplete', {
        path: item.path,
        duration
      });

      // Close dropdown after successful navigation
      setDropdownState({ type: 'closing', dropdownId: config.id });
      setTimeout(() => {
        setDropdownState({ type: 'closed' });
      }, 150);

      return Ok(undefined);

    } catch (error) {
      const navigationError = error instanceof NavigationError 
        ? error 
        : new NavigationError(
            error instanceof Error ? error.message : 'Unknown navigation error',
            'NAVIGATION_FAILED',
            { 
              path: item.path, 
              dropdownId: config.id,
              timestamp: new Date() 
            }
          );

      // Update state to error
      const errorState: NavigationState = {
        status: 'error',
        error: navigationError,
        previousPath: currentPath
      };
      setNavigationState(errorState);
      onNavigationStateChange?.(errorState);

      // Emit navigation error event
      eventEmitter.emit('nav:navigationError', {
        error: navigationError,
        attemptedPath: item.path
      });

      return Err(navigationError);
    }
  }, [
    navigate, 
    location.pathname, 
    eventEmitter, 
    config.id, 
    onNavigationStateChange
  ]);

  // Dropdown state handlers
  const handleDropdownOpen = useCallback(() => {
    const newState: DropdownState = { type: 'opening', dropdownId: config.id };
    setDropdownState(newState);
    onDropdownStateChange?.(newState);
    
    eventEmitter.emit('nav:dropdownOpen', { dropdownId: config.id });
    
    setTimeout(() => {
      const openState: DropdownState = { type: 'open', dropdownId: config.id };
      setDropdownState(openState);
      onDropdownStateChange?.(openState);
    }, 50);
  }, [config.id, eventEmitter, onDropdownStateChange]);

  const handleDropdownClose = useCallback(() => {
    const newState: DropdownState = { type: 'closing', dropdownId: config.id };
    setDropdownState(newState);
    onDropdownStateChange?.(newState);
    
    eventEmitter.emit('nav:dropdownClose', { dropdownId: config.id });
    
    setTimeout(() => {
      setDropdownState({ type: 'closed' });
    }, 150);
  }, [config.id, eventEmitter, onDropdownStateChange]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Clean up any pending state changes
      setDropdownState({ type: 'closed' });
      setNavigationState({ status: 'idle' });
    };
  }, []);

  // Loading state indicator
  const isNavigating = navigationState.status === 'navigating';
  const isDropdownOpening = dropdownState.type === 'opening' || dropdownState.type === 'open';

  return (
    <NavigationMenuItem className={className}>
      <NavigationMenuTrigger
        className={cn(
          "bg-transparent hover:bg-primary/5 transition-all duration-200",
          isActive ? "text-primary font-medium" : "text-foreground/60",
          disabled && "opacity-50 cursor-not-allowed",
          isNavigating && "opacity-75 cursor-wait"
        )}
        disabled={disabled}
        onMouseEnter={handleDropdownOpen}
        onMouseLeave={handleDropdownClose}
        onClick={handleDropdownOpen}
      >
        <div className="flex items-center gap-2">
          <span>{config.title}</span>
          {isNavigating && (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </NavigationMenuTrigger>
      
      <NavigationMenuContent 
        className={cn(
          "bg-white border shadow-lg z-[99999] rounded-lg min-w-[200px] p-1 fixed transition-all duration-200",
          isDropdownOpening ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
        onMouseEnter={handleDropdownOpen}
        onMouseLeave={handleDropdownClose}
      >
        <div className="bg-white rounded-lg">
          <ul className="grid gap-1 p-3 w-full bg-white min-w-[200px]">
            {filteredItems.map((item) => {
              const isItemActive = checkIsActive(item.path);
              const isItemDisabled = disabled || 
                (item.requiresAuth && !isActive) || // Example auth check
                isNavigating;
              
              return (
                <NavigationItemComponent
                  key={item.id}
                  item={item}
                  isActive={isItemActive}
                  isDisabled={isItemDisabled}
                  onClick={handleItemClick}
                />
              );
            })}
            
            {filteredItems.length === 0 && (
              <li className="p-4 text-center text-muted-foreground text-sm">
                No items available
              </li>
            )}
          </ul>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

EnhancedNavDropdown.displayName = 'EnhancedNavDropdown';

export default EnhancedNavDropdown;