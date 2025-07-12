
import React, { useState } from "react";
import { useUserPreferences } from "@/context";
import { Sun, Clock, Calendar, Info } from "lucide-react";
import { useTimeAwareness } from "@/hooks/useTimeAwareness";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { cn } from "@/lib/utils";

const RitualHero = () => {
  const { preferences } = useUserPreferences();
  const { getGreeting } = useTimeAwareness();
  const { deviceType } = useDeviceDetection();
  const [showDetails, setShowDetails] = useState(false);
  const morningActivities = preferences.morningActivities || [];
  const ritualsCount = preferences.morningRituals?.length || 0;
  
  const isMobile = deviceType === 'mobile';
  
  // Mobile-first interaction handlers
  const handleInteraction = () => {
    if (isMobile) {
      setShowDetails(!showDetails); // Toggle on mobile tap
    } else {
      setShowDetails(true); // Show on desktop hover
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowDetails(false); // Hide on desktop mouse leave
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-3/5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">
              {getGreeting()}, Build Your Perfect Morning
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-6">
              Create a mindful morning ritual that sets the tone for your entire day.
              Establish healthy habits, increase productivity, and start each day with intention.
            </p>
            
            <div className="flex flex-wrap gap-4 my-6">
              <div className="flex items-center">
                <Sun className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">
                  <strong>{morningActivities.length}</strong> morning activities
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">
                  <strong>{preferences.weekdayWakeTime || "Not set"}</strong> wake time
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm">
                  <strong>{ritualsCount}</strong> rituals created
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/5">
            <div className="relative min-h-[16rem]"> {/* Fixed height prevents jumps */}
              {/* Background decorative circles */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full"></div>
              
              {/* Interactive area - mobile-first optimized */}
              <div 
                className={cn(
                  "relative z-10 h-64 w-full transition-all duration-200",
                  isMobile ? "cursor-pointer active:scale-95" : "cursor-pointer hover:scale-105"
                )}
                onClick={handleInteraction}
                onMouseEnter={isMobile ? undefined : handleInteraction}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                aria-label={isMobile ? "Tap to view morning details" : "Hover to view morning details"}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleInteraction();
                  }
                }}
              >
                {/* Fixed positioned container to prevent layout shifts */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {!showDetails ? (
                    // Default state - just background decoration, no visible box
                    <div className="text-center text-muted-foreground">
                      <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm px-4">
                        {isMobile ? "Tap to view morning details" : "Hover to view morning details"}
                      </p>
                    </div>
                  ) : (
                    // Detailed box that appears on interaction - mobile-first sizing
                    <div className={cn(
                      "bg-white rounded-lg shadow-2xl border animate-fade-in",
                      // Mobile-first responsive sizing and positioning
                      "w-full max-w-[280px] sm:max-w-sm mx-auto p-4",
                      // Ensure it stays within viewport on mobile
                      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                      // Add some margin from screen edges on mobile
                      "mx-2 sm:mx-4"
                    )}>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs sm:text-sm text-muted-foreground">Morning Energy</div>
                        <div className="text-xs sm:text-sm font-medium">{preferences.morningEnergyLevel || 5}/10</div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium text-base sm:text-lg">Your Current Morning</h3>
                        {morningActivities.length > 0 ? (
                          <ul className="space-y-2 max-h-24 sm:max-h-32 overflow-y-auto">
                            {morningActivities.map((activity, i) => (
                              <li key={i} className="flex items-center text-xs sm:text-sm">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 text-xs">
                                  {i + 1}
                                </div>
                                <span className="capitalize leading-tight">
                                  {activity.replace(/_/g, ' ')}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            You haven't set up your morning activities yet.
                          </p>
                        )}
                        
                        {/* Mobile close hint */}
                        {isMobile && showDetails && (
                          <p className="text-xs text-muted-foreground text-center pt-2 border-t mt-3">
                            Tap anywhere to close
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RitualHero;
