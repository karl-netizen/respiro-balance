
import { useState } from 'react';
import { ChevronDown } from "lucide-react";

interface MobileDropdownProps {
  title: string;
  items: { label: string; href: string }[];
}

const MobileDropdown = ({ title, items }: MobileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-foreground/80 hover:text-primary py-2 button-transition"
      >
        <span>{title}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="pl-4 space-y-2 mt-1 mb-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-foreground/70 hover:text-primary py-1 text-sm button-transition"
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
