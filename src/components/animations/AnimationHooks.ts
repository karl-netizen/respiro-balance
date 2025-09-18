import { useState, useEffect, useCallback, useRef } from 'react';

// ============= INTERSECTION OBSERVER HOOK =============

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useInView = (options: UseInViewOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasBeenInView]);

  return { ref, isInView, hasBeenInView };
};

// ============= SCROLL PROGRESS HOOK =============

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

// ============= ELEMENT PARALLAX HOOK =============

export const useParallax = (speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
};

// ============= ANIMATION STATE HOOK =============

interface AnimationState {
  isAnimating: boolean;
  hasAnimated: boolean;
}

export const useAnimationState = (trigger: boolean = true) => {
  const [state, setState] = useState<AnimationState>({
    isAnimating: false,
    hasAnimated: false
  });

  const startAnimation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAnimating: true
    }));
  }, []);

  const endAnimation = useCallback(() => {
    setState(prev => ({
      isAnimating: false,
      hasAnimated: true
    }));
  }, []);

  const resetAnimation = useCallback(() => {
    setState({
      isAnimating: false,
      hasAnimated: false
    });
  }, []);

  useEffect(() => {
    if (trigger && !state.hasAnimated) {
      startAnimation();
      // Auto-end animation after a reasonable duration
      const timer = setTimeout(endAnimation, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, state.hasAnimated, startAnimation, endAnimation]);

  return {
    ...state,
    startAnimation,
    endAnimation,
    resetAnimation
  };
};

// ============= REDUCED MOTION HOOK =============

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// ============= STAGGER ANIMATION HOOK =============

export const useStaggerAnimation = (itemCount: number, staggerDelay: number = 100) => {
  const [visibleItems, setVisibleItems] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startStagger = useCallback(() => {
    setVisibleItems(0);
    let currentItem = 0;
    
    intervalRef.current = setInterval(() => {
      currentItem++;
      setVisibleItems(currentItem);
      
      if (currentItem >= itemCount) {
        clearInterval(intervalRef.current);
      }
    }, staggerDelay);
  }, [itemCount, staggerDelay]);

  const resetStagger = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setVisibleItems(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    visibleItems,
    startStagger,
    resetStagger,
    isComplete: visibleItems >= itemCount
  };
};

// ============= HOVER ANIMATION HOOK =============

export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false);
      setIsPressed(false);
    },
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
  };

  return {
    isHovered,
    isPressed,
    hoverProps
  };
};