
import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface MobileDropdownProps {
  title: string;
  items: { label: string; href: string; onClick?: () => void }[];
  toggleMainMenu?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const MobileDropdown = ({ title, items, toggleMainMenu, icon, className }: MobileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  // Check if any of the items in this dropdown matches current path
  const hasActiveItem = items.some(item => item.href === currentPath);

  const handleItemClick = (href: string, onClick?: () => void) => {
    console.log(`MobileDropdown item clicked: ${href}`);
    setIsOpen(false);
    
    if (onClick) {
      onClick();
    }
    
    if (toggleMainMenu) {
      toggleMainMenu();
    }
    
    // Check if the href is a local route or external link
    const isExternalLink = href.startsWith('http');
    if (!isExternalLink) {
      navigate(href);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between text-white hover:text-respiro-light py-2 button-transition",
          hasActiveItem && "text-primary font-medium" // Highlight when an item is active
        )}
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-2 mt-1 mb-2 bg-gray-800 rounded-md py-2 px-2 z-50">
          {items.map((item) => {
            // Check if this item is active
            const isItemActive = item.href === currentPath;
            
            // Check if the href is a local route or external link
            const isExternalLink = item.href.startsWith('http');
            
            // For local routes (not starting with 'http')
            if (!isExternalLink) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "block text-white hover:bg-gray-700 py-1 px-2 text-sm button-transition flex items-center gap-2 rounded-md",
                    isItemActive && "bg-gray-700 font-medium border-l-2 border-primary pl-1" // Highlight active item
                  )}
                  onClick={() => handleItemClick(item.href, item.onClick)}
                >
                  {item.label}
                </Link>
              );
            }
            
            // For external links
            return (
              <a
                key={item.label}
                href={item.href}
                className="block text-white hover:bg-gray-700 py-1 px-2 text-sm button-transition flex items-center gap-2 rounded-md"
                onClick={() => handleItemClick(item.href, item.onClick)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MobileDropdown;
