
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TooltipConfig } from './types';
import { useUserGuideProgress } from './hooks/useUserGuideProgress';

interface TooltipSystemProps {
  tooltips: TooltipConfig[];
  className?: string;
}

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipSystem: React.FC<TooltipSystemProps> = ({ tooltips, className = '' }) => {
  const [activeTooltip, setActiveTooltip] = useState<TooltipConfig | null>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const [targetElement, setTargetElement] = useState<Element | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { markTooltipViewed, hasViewedTooltip, userPreferences } = useUserGuideProgress();

  const calculatePosition = useCallback((target: Element, placement: TooltipConfig['placement']): TooltipPosition => {
    const targetRect = target.getBoundingClientRect();
    const tooltipElement = tooltipRef.current;
    
    if (!tooltipElement) {
      return { top: 0, left: 0, placement: 'top' };
    }

    const tooltipRect = tooltipElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let finalPlacement = placement;
    let top = 0;
    let left = 0;

    // Auto placement logic
    if (placement === 'auto') {
      const spaceTop = targetRect.top;
      const spaceBottom = viewportHeight - targetRect.bottom;
      const spaceLeft = targetRect.left;
      const spaceRight = viewportWidth - targetRect.right;

      const maxSpace = Math.max(spaceTop, spaceBottom, spaceLeft, spaceRight);
      
      if (maxSpace === spaceBottom) finalPlacement = 'bottom';
      else if (maxSpace === spaceTop) finalPlacement = 'top';
      else if (maxSpace === spaceRight) finalPlacement = 'right';
      else finalPlacement = 'left';
    }

    switch (finalPlacement) {
      case 'top':
        top = targetRect.top + scrollY - tooltipRect.height - 8;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + scrollY + 8;
        left = targetRect.left + scrollX + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left + scrollX - tooltipRect.width - 8;
        break;
      case 'right':
        top = targetRect.top + scrollY + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + scrollX + 8;
        break;
    }

    // Viewport boundary adjustments
    if (left < 8) left = 8;
    if (left + tooltipRect.width > viewportWidth - 8) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > viewportHeight - 8) {
      top = viewportHeight - tooltipRect.height - 8;
    }

    return { top, left, placement: finalPlacement };
  }, []);

  const showTooltip = useCallback((tooltip: TooltipConfig) => {
    if (!userPreferences.enableTooltips) return;
    if (tooltip.showOnce && hasViewedTooltip(tooltip.id)) return;
    if (tooltip.condition && !tooltip.condition()) return;

    const target = document.querySelector(tooltip.target);
    if (!target) return;

    setActiveTooltip(tooltip);
    setTargetElement(target);
    
    // Calculate position after render
    setTimeout(() => {
      const pos = calculatePosition(target, tooltip.placement);
      setPosition(pos);
    }, 0);

    tooltip.onShow?.();
    markTooltipViewed(tooltip.id);
  }, [calculatePosition, hasViewedTooltip, markTooltipViewed, userPreferences.enableTooltips]);

  const hideTooltip = useCallback(() => {
    if (activeTooltip) {
      activeTooltip.onHide?.();
    }
    setActiveTooltip(null);
    setPosition(null);
    setTargetElement(null);
  }, [activeTooltip]);

  // Set up event listeners
  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Element;
      const tooltip = tooltips.find(t => 
        t.trigger === 'hover' && target.matches(t.target)
      );
      
      if (tooltip) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          showTooltip(tooltip);
        }, tooltip.delay || 0);
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as Element;
      const tooltip = tooltips.find(t => 
        t.trigger === 'hover' && target.matches(t.target)
      );
      
      if (tooltip && !tooltip.interactive) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        hideTooltip();
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element;
      const tooltip = tooltips.find(t => 
        t.trigger === 'click' && target.matches(t.target)
      );
      
      if (tooltip) {
        if (activeTooltip?.id === tooltip.id) {
          hideTooltip();
        } else {
          showTooltip(tooltip);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeTooltip) {
        hideTooltip();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tooltips, showTooltip, hideTooltip, activeTooltip]);

  // Manual tooltip trigger
  const triggerTooltip = useCallback((tooltipId: string) => {
    const tooltip = tooltips.find(t => t.id === tooltipId);
    if (tooltip) {
      showTooltip(tooltip);
    }
  }, [tooltips, showTooltip]);

  // Expose trigger function globally
  useEffect(() => {
    (window as any).triggerTooltip = triggerTooltip;
    return () => {
      delete (window as any).triggerTooltip;
    };
  }, [triggerTooltip]);

  if (!activeTooltip || !position) {
    return null;
  }

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={`fixed z-50 animate-fade-in ${className}`}
      style={{
        top: position.top,
        left: position.left,
        maxWidth: '320px'
      }}
      role="tooltip"
      aria-describedby="tooltip-content"
    >
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div id="tooltip-content" className="text-sm text-gray-700 dark:text-gray-200">
                {typeof activeTooltip.content === 'string' ? (
                  <p>{activeTooltip.content}</p>
                ) : (
                  activeTooltip.content
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={hideTooltip}
              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Close tooltip"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Arrow */}
      <div
        className={`absolute w-2 h-2 bg-white border-l border-t border-primary/20 transform rotate-45 ${
          position.placement === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
          position.placement === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
          position.placement === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
          'left-[-4px] top-1/2 -translate-y-1/2'
        }`}
      />
    </div>
  );

  return createPortal(tooltipContent, document.body);
};

export default TooltipSystem;
