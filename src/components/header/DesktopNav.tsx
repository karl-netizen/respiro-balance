
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
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Home
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-foreground/80 hover:text-primary bg-transparent hover:bg-transparent focus:bg-transparent">
            Meditate
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-popover/95 backdrop-blur-sm">
            <ul className="grid gap-3 p-4 md:w-[400px]">
              <FeatureItem
                title="Guided Sessions"
                href="#meditation"
                description="Professional voice-guided meditation sessions"
              />
              <FeatureItem 
                title="Quick Breaks"
                href="#quick-breaks"
                description="2-5 minute sessions perfect for short work breaks"
              />
              <FeatureItem
                title="Deep Focus"
                href="#deep-focus"
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
          <NavigationMenuLink asChild>
            <a href="/breathe" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Breathe
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="/progress" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Progress
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="#pricing" className="text-foreground/80 hover:text-primary px-3 py-2 button-transition">
              Pricing
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
