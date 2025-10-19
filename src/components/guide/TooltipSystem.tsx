
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TooltipConfig } from './types';
import { useUserGuideProgress } from './hooks/useUserGuideProgress';

interface TooltipSystemProps {
  tooltips: TooltipConfig[];
}

interface ActiveTooltip extends TooltipConfig {
  targetElement: Element;
  position: { top: number; left: number };
}

const TooltipSystem: React.FC<TooltipSystemProps> = ({ tooltips }) => {
  const [activeTooltips, setActiveTooltips] = useState<ActiveTooltip[]>([]);
  const { hasViewedTooltip, markTooltipViewed } = useUserGuideProgress();
  const tooltipRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];
    
    const handleTooltipTriggers = () => {
      tooltips.forEach(tooltip => {
        // Skip if already viewed and showOnce is true
        if (tooltip.showOnce && hasViewedTooltip(tooltip.id)) {
          return;
        }

        // Skip if condition is not met
        if (tooltip.condition && !tooltip.condition()) {
          return;
        }

        const targetElement = document.querySelector(tooltip.target);
        if (!targetElement) return;

        const showTooltip = () => {
          const rect = targetElement.getBoundingClientRect();
          const position = calculatePosition(tooltip.placement, rect, 300, 200);

          const activeTooltip: ActiveTooltip = {
            ...tooltip,
            targetElement,
            position
          };

          setActiveTooltips(prev => {
            const exists = prev.find(t => t.id === tooltip.id);
            return exists ? prev : [...prev, activeTooltip];
          });

          if (tooltip.onShow) {
            tooltip.onShow();
          }

          markTooltipViewed(tooltip.id);
        };

        const hideTooltip = () => {
          setActiveTooltips(prev => prev.filter(t => t.id !== tooltip.id));
          if (tooltip.onHide) {
            tooltip.onHide();
          }
        };

        // Set up event listeners based on trigger type
        switch (tooltip.trigger) {
          case 'hover':
            targetElement.addEventListener('mouseenter', showTooltip);
            targetElement.addEventListener('mouseleave', hideTooltip);
            cleanupFunctions.push(() => {
              targetElement.removeEventListener('mouseenter', showTooltip);
              targetElement.removeEventListener('mouseleave', hideTooltip);
            });
            break;
          case 'click':
            targetElement.addEventListener('click', showTooltip);
            cleanupFunctions.push(() => {
              targetElement.removeEventListener('click', showTooltip);
            });
            break;
          case 'focus':
            targetElement.addEventListener('focus', showTooltip);
            targetElement.addEventListener('blur', hideTooltip);
            cleanupFunctions.push(() => {
              targetElement.removeEventListener('focus', showTooltip);
              targetElement.removeEventListener('blur', hideTooltip);
            });
            break;
          case 'manual':
            // Manual tooltips are triggered programmatically
            break;
        }
      });
    };

    // Set up tooltip triggers
    handleTooltipTriggers();

    // Set up global tooltip trigger function
    window.triggerTooltip = (tooltipId: string) => {
      const tooltip = tooltips.find(t => t.id === tooltipId);
      if (tooltip) {
        const targetElement = document.querySelector(tooltip.target);
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const position = calculatePosition(tooltip.placement, rect, 300, 200);

          const activeTooltip: ActiveTooltip = {
            ...tooltip,
            targetElement,
            position
          };

          setActiveTooltips(prev => {
            const exists = prev.find(t => t.id === tooltip.id);
            return exists ? prev : [...prev, activeTooltip];
          });

          markTooltipViewed(tooltip.id);
        }
      }
    };

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      delete window.triggerTooltip;
    };
  }, [tooltips, hasViewedTooltip, markTooltipViewed]);

  const calculatePosition = (
    placement: 'top' | 'bottom' | 'left' | 'right',
    targetRect: DOMRect,
    tooltipWidth: number,
    tooltipHeight: number
  ) => {
    let position = { top: 0, left: 0 };

    switch (placement) {
      case 'top':
        position = {
          top: targetRect.top - tooltipHeight - 10,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2
        };
        break;
      case 'bottom':
        position = {
          top: targetRect.bottom + 10,
          left: targetRect.left + targetRect.width / 2 - tooltipWidth / 2
        };
        break;
      case 'left':
        position = {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.left - tooltipWidth - 10
        };
        break;
      case 'right':
        position = {
          top: targetRect.top + targetRect.height / 2 - tooltipHeight / 2,
          left: targetRect.right + 10
        };
        break;
    }

    // Keep tooltip within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    position.left = Math.max(10, Math.min(position.left, viewport.width - tooltipWidth - 10));
    position.top = Math.max(10, Math.min(position.top, viewport.height - tooltipHeight - 10));

    return position;
  };

  const handleClose = (tooltipId: string) => {
    setActiveTooltips(prev => prev.filter(t => t.id !== tooltipId));
  };

  if (activeTooltips.length === 0) {
    return null;
  }

  return createPortal(
    <>
      {activeTooltips.map(tooltip => (
        <div
          key={tooltip.id}
          ref={el => {
            if (el) tooltipRefs.current.set(tooltip.id, el);
          }}
          className="fixed z-50 max-w-xs"
          style={{
            top: `${tooltip.position.top}px`,
            left: `${tooltip.position.left}px`
          }}
        >
          <Card className="shadow-lg border border-primary/20 animate-fade-in">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {typeof tooltip.content === 'string' ? (
                    <p className="text-sm text-foreground">{tooltip.content}</p>
                  ) : (
                    tooltip.content
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClose(tooltip.id)}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </>,
    document.body
  );
};

export default TooltipSystem;
