// ===================================================================
// RESPONSIVE LAYOUT SYSTEM - Mobile-first responsive components
// ===================================================================

import React, { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

// 1. CONTAINER COMPONENT
// ===================================================================

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  size = 'xl',
  padding,
  className,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const getPaddingClasses = () => {
    if (typeof padding === 'number') {
      return `px-${padding}`;
    }
    
    if (padding) {
      let classes = '';
      if (padding.sm) classes += `px-${padding.sm} `;
      if (padding.md) classes += `md:px-${padding.md} `;
      if (padding.lg) classes += `lg:px-${padding.lg} `;
      if (padding.xl) classes += `xl:px-${padding.xl} `;
      return classes.trim();
    }
    
    return 'px-4 md:px-6 lg:px-8';
  };

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full',
        sizeClasses[size],
        getPaddingClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

// 2. GRID SYSTEM
// ===================================================================

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
  gap?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
  rows?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(({
  children,
  columns = 1,
  gap = 4,
  rows,
  className,
  ...props
}, ref) => {
  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12',
      }[columns] || `grid-cols-${columns}`;
    }

    let classes = '';
    if (columns.sm) classes += `grid-cols-${columns.sm} `;
    if (columns.md) classes += `md:grid-cols-${columns.md} `;
    if (columns.lg) classes += `lg:grid-cols-${columns.lg} `;
    if (columns.xl) classes += `xl:grid-cols-${columns.xl} `;
    return classes.trim();
  };

  const getGapClasses = () => {
    if (typeof gap === 'number') {
      return `gap-${gap}`;
    }

    let classes = '';
    if (gap.sm) classes += `gap-${gap.sm} `;
    if (gap.md) classes += `md:gap-${gap.md} `;
    if (gap.lg) classes += `lg:gap-${gap.lg} `;
    if (gap.xl) classes += `xl:gap-${gap.xl} `;
    return classes.trim();
  };

  const getRowClasses = () => {
    if (!rows) return '';
    
    if (typeof rows === 'number') {
      return `grid-rows-${rows}`;
    }

    let classes = '';
    if (rows.sm) classes += `grid-rows-${rows.sm} `;
    if (rows.md) classes += `md:grid-rows-${rows.md} `;
    if (rows.lg) classes += `lg:grid-rows-${rows.lg} `;
    if (rows.xl) classes += `xl:grid-rows-${rows.xl} `;
    return classes.trim();
  };

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        getColumnClasses(),
        getGapClasses(),
        getRowClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// 3. GRID ITEM
// ===================================================================

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  span?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
  start?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
  end?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  } | number;
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(({
  children,
  span,
  start,
  end,
  className,
  ...props
}, ref) => {
  const getSpanClasses = () => {
    if (!span) return '';
    
    if (typeof span === 'number') {
      return `col-span-${span}`;
    }

    let classes = '';
    if (span.sm) classes += `col-span-${span.sm} `;
    if (span.md) classes += `md:col-span-${span.md} `;
    if (span.lg) classes += `lg:col-span-${span.lg} `;
    if (span.xl) classes += `xl:col-span-${span.xl} `;
    return classes.trim();
  };

  const getStartClasses = () => {
    if (!start) return '';
    
    if (typeof start === 'number') {
      return `col-start-${start}`;
    }

    let classes = '';
    if (start.sm) classes += `col-start-${start.sm} `;
    if (start.md) classes += `md:col-start-${start.md} `;
    if (start.lg) classes += `lg:col-start-${start.lg} `;
    if (start.xl) classes += `xl:col-start-${start.xl} `;
    return classes.trim();
  };

  const getEndClasses = () => {
    if (!end) return '';
    
    if (typeof end === 'number') {
      return `col-end-${end}`;
    }

    let classes = '';
    if (end.sm) classes += `col-end-${end.sm} `;
    if (end.md) classes += `md:col-end-${end.md} `;
    if (end.lg) classes += `lg:col-end-${end.lg} `;
    if (end.xl) classes += `xl:col-end-${end.xl} `;
    return classes.trim();
  };

  return (
    <div
      ref={ref}
      className={cn(
        getSpanClasses(),
        getStartClasses(),
        getEndClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

GridItem.displayName = 'GridItem';

// 4. SECTION COMPONENT
// ===================================================================

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullHeight?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(({
  children,
  variant = 'default',
  size = 'lg',
  fullHeight = false,
  className,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-background text-foreground',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
  };

  const sizeClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-24 lg:py-32',
  };

  return (
    <section
      ref={ref}
      className={cn(
        'w-full',
        variantClasses[variant],
        sizeClasses[size],
        fullHeight && 'min-h-screen flex items-center',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';

// 5. RESPONSIVE NAVIGATION
// ===================================================================

interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface ResponsiveNavigationProps {
  items: NavigationItem[];
  logo?: ReactNode;
  actions?: ReactNode;
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'transparent' | 'blur';
  sticky?: boolean;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  items,
  logo,
  actions,
  mobileBreakpoint = 'lg',
  variant = 'default',
  sticky = true
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const breakpointClasses = {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden',
    xl: 'xl:hidden',
  };

  const showDesktopClasses = {
    sm: 'sm:flex',
    md: 'md:flex',
    lg: 'lg:flex',
    xl: 'xl:flex',
  };

  const variantClasses = {
    default: 'bg-background border-b border-border',
    transparent: 'bg-transparent',
    blur: 'bg-background/80 backdrop-blur-md border-b border-border',
  };

  return (
    <nav className={cn(
      'w-full z-50',
      sticky && 'sticky top-0',
      variantClasses[variant]
    )}>
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className={cn('hidden space-x-8', showDesktopClasses[mobileBreakpoint])}>
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground',
                  'border-b-2 border-transparent hover:border-primary',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && (
                  <span className="mr-2">{item.icon}</span>
                )}
                {item.label}
                {item.badge && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {actions}
            
            {/* Mobile menu button */}
            <button
              className={cn('p-2 rounded-md text-muted-foreground hover:text-foreground', breakpointClasses[mobileBreakpoint])}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={cn('pb-3 space-y-1', breakpointClasses[mobileBreakpoint])}>
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  'text-muted-foreground hover:text-foreground hover:bg-accent',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  {item.icon && (
                    <span className="mr-3">{item.icon}</span>
                  )}
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground bg-primary rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </Container>
    </nav>
  );
};

// 6. HERO SECTION COMPONENT
// ===================================================================

interface HeroSectionProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  image?: ReactNode;
  background?: 'default' | 'gradient' | 'image';
  layout?: 'centered' | 'split' | 'image-right' | 'image-left';
  size?: 'sm' | 'md' | 'lg';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  actions,
  image,
  background = 'default',
  layout = 'centered',
  size = 'lg'
}) => {
  const backgroundClasses = {
    default: 'bg-background',
    gradient: 'bg-gradient-to-br from-primary/10 via-background to-secondary/10',
    image: 'bg-cover bg-center bg-no-repeat',
  };

  const sizeClasses = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
  };

  const ContentSection = () => (
    <div className={cn(
      'space-y-6',
      layout === 'centered' && 'text-center max-w-4xl mx-auto',
      (layout === 'image-right' || layout === 'image-left') && 'max-w-xl'
    )}>
      {subtitle && (
        <div className="text-sm font-semibold text-primary tracking-wide uppercase">
          {subtitle}
        </div>
      )}
      
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      
      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
      
      {actions && (
        <div className={cn(
          'flex flex-wrap gap-4',
          layout === 'centered' && 'justify-center',
          layout !== 'centered' && 'justify-start'
        )}>
          {actions}
        </div>
      )}
    </div>
  );

  const ImageSection = () => image && (
    <div className="relative">
      {image}
    </div>
  );

  return (
    <Section className={cn(backgroundClasses[background], sizeClasses[size])}>
      <Container>
        {layout === 'centered' && (
          <div className="space-y-8">
            <ContentSection />
            {image && (
              <div className="flex justify-center">
                <ImageSection />
              </div>
            )}
          </div>
        )}

        {layout === 'split' && (
          <Grid columns={{ sm: 1, lg: 2 }} gap={{ sm: 8, lg: 12 }} className="items-center">
            <GridItem>
              <ContentSection />
            </GridItem>
            <GridItem>
              <ImageSection />
            </GridItem>
          </Grid>
        )}

        {layout === 'image-right' && (
          <Grid columns={{ sm: 1, lg: 2 }} gap={{ sm: 8, lg: 12 }} className="items-center">
            <GridItem>
              <ContentSection />
            </GridItem>
            <GridItem>
              <ImageSection />
            </GridItem>
          </Grid>
        )}

        {layout === 'image-left' && (
          <Grid columns={{ sm: 1, lg: 2 }} gap={{ sm: 8, lg: 12 }} className="items-center">
            <GridItem className="lg:order-2">
              <ContentSection />
            </GridItem>
            <GridItem className="lg:order-1">
              <ImageSection />
            </GridItem>
          </Grid>
        )}
      </Container>
    </Section>
  );
};

// Components are exported inline above