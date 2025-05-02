
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, onClick, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        navigationMenuTriggerStyle(),
        "bg-transparent hover:bg-primary/5",
        isActive ? "text-primary" : "text-foreground/60"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
