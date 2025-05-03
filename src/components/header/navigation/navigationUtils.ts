
import { matchPath, useLocation } from 'react-router-dom';
import { NavSection } from './navigationData';

/**
 * Check if a path matches the current location
 */
export const isPathActive = (path: string, currentPathWithSearch: string): boolean => {
  // If comparing exact paths with search params
  if (path.includes('?') && currentPathWithSearch === path) {
    return true;
  }
  
  // For paths without search params, just check if the current path starts with this path
  // This handles nested routes
  const pathWithoutParams = path.split('?')[0];
  const currentPathWithoutParams = currentPathWithSearch.split('?')[0];
  
  // Special case for root path to avoid false positives
  if (pathWithoutParams === '/' && currentPathWithoutParams !== '/') {
    return false;
  }
  
  // Use matchPath for proper route matching
  return !!matchPath(
    { path: pathWithoutParams, end: pathWithoutParams === '/' },
    currentPathWithoutParams
  );
};

/**
 * Check if a section has an active item
 */
export const isSectionActive = (section: NavSection, currentPathWithSearch: string): boolean => {
  return section.items.some(item => isPathActive(item.path, currentPathWithSearch));
};

/**
 * Get active item in section
 */
export const getActiveItem = (section: NavSection, currentPathWithSearch: string) => {
  return section.items.find(item => isPathActive(item.path, currentPathWithSearch));
};

/**
 * Custom hook to check if routes are active based on current location
 */
export const useActiveRoute = () => {
  const location = useLocation();
  const currentPathWithSearch = location.pathname + location.search;
  
  return {
    isActive: (path: string) => isPathActive(path, currentPathWithSearch),
    isSectionActive: (section: NavSection) => isSectionActive(section, currentPathWithSearch),
    getActiveItem: (section: NavSection) => getActiveItem(section, currentPathWithSearch),
    currentPath: currentPathWithSearch
  };
};
