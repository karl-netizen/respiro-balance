
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

interface FeatureItemProps {
  title: string;
  href: string;
  description: string;
}

const FeatureItem = ({ title, href, description }: FeatureItemProps) => {
  const isExternalLink = href.startsWith('http');
  
  const linkContent = (
    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
      <div className="text-sm font-medium leading-none">{title}</div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {description}
      </p>
    </div>
  );

  return (
    <li>
      <NavigationMenuLink asChild>
        {isExternalLink ? (
          <a href={href} className="block no-underline">
            {linkContent}
          </a>
        ) : (
          <Link to={href} className="block no-underline">
            {linkContent}
          </Link>
        )}
      </NavigationMenuLink>
    </li>
  );
};

export default FeatureItem;
