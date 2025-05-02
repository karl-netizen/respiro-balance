
import { useLocation } from "react-router-dom";

export const useActiveRoute = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    if (path.includes('?')) {
      // If the path has query parameters, just check the base path
      const basePath = path.split('?')[0];
      return location.pathname === basePath || location.pathname.startsWith(basePath + '/');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return { isActive };
};
