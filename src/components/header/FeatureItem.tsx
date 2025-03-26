
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface FeatureItemProps {
  title: string;
  href: string;
  description: string;
}

const FeatureItem = ({ title, href, description }: FeatureItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {description}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
};

export default FeatureItem;
