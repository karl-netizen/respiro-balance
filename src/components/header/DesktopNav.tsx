
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import FeatureItem from "./FeatureItem";

const DesktopNav = () => {
  const { user } = useAuth();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Home
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {user && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
                Dashboard
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent">
            Meditate
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/95 backdrop-blur-sm">
            <ul className="grid gap-3 p-4 md:w-[400px]">
              <FeatureItem
                title="Guided Sessions"
                href="/meditate?tab=guided"
                description="Professional voice-guided meditation sessions"
              />
              <FeatureItem 
                title="Quick Breaks"
                href="/meditate?tab=quick"
                description="2-5 minute sessions perfect for short work breaks"
              />
              <FeatureItem
                title="Deep Focus"
                href="/meditate?tab=deep"
                description="Longer sessions for deep restoration"
              />
              <FeatureItem
                title="Meditation Library"
                href="/meditate"
                description="Browse our complete collection of sessions"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent">
            Breathe
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/95 backdrop-blur-sm">
            <ul className="grid gap-3 p-4 md:w-[400px]">
              <FeatureItem
                title="Breathing Visualizer"
                href="/breathe"
                description="Interactive breathing exercise with visual guidance"
              />
              <FeatureItem 
                title="Breathing Techniques"
                href="/breathe?tab=techniques"
                description="Learn different breathing techniques and their benefits"
              />
              <FeatureItem
                title="Box Breathing"
                href="/breathe?tab=techniques&technique=box"
                description="Equal inhale, hold, exhale, and pause (4-4-4-4)"
              />
              <FeatureItem
                title="4-7-8 Breathing"
                href="/breathe?tab=techniques&technique=478"
                description="Inhale for 4, hold for 7, exhale for 8"
              />
              <FeatureItem
                title="Coherent Breathing"
                href="/breathe?tab=techniques&technique=coherent"
                description="Slow, rhythmic breathing at 5-6 breaths per minute (5-5)"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/progress" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Progress
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/#pricing" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Pricing
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
