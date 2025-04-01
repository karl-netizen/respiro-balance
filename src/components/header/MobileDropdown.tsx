
import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from '@/lib/utils';

interface MobileDropdownProps {
  title: string;
  items: { label: string; href: string; onClick?: () => void }[];
  toggleMainMenu?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

const MobileDropdown = ({ title, items, toggleMainMenu, icon, className }: MobileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (onClick?: () => void) => {
    setIsOpen(false);
    if (onClick) {
      onClick();
    }
    if (toggleMainMenu) {
      toggleMainMenu();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-foreground/80 hover:text-primary py-2 button-transition"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-2 mt-1 mb-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-foreground/70 hover:text-primary py-1 text-sm button-transition flex items-center gap-2"
              onClick={() => handleItemClick(item.onClick)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDropdown;
