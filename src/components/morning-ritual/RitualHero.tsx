
import React, { useState } from "react";
import { useUserPreferences } from "@/context";
import { Sun, Clock, Calendar, Info } from "lucide-react";
import { useTimeAwareness } from "@/hooks/useTimeAwareness";

const RitualHero = () => {
  const { preferences } = useUserPreferences();
  const { getGreeting } = useTimeAwareness();
  const [showDetails, setShowDetails] = useState(false);
  const morningActivities = preferences.morningActivities || [];
  const ritualsCount = preferences.morningRituals?.length || 0;

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
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full"></div>
              
              {/* Hover trigger */}
              <div 
                className="relative z-10 bg-white rounded-lg shadow-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl"
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">Morning Energy</div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{preferences.morningEnergyLevel || 5}/10</div>
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Your Morning Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Hover to view your current morning activities
                  </p>
                </div>
              </div>

              {/* Detailed box that appears on hover */}
              {showDetails && (
                <div className="absolute top-0 left-0 right-0 z-20 bg-white rounded-lg shadow-2xl p-6 border animate-fade-in">
                  <div className="flex justify-between mb-4">
                    <div className="text-sm text-muted-foreground">Morning Energy</div>
                    <div className="text-sm font-medium">{preferences.morningEnergyLevel || 5}/10</div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Your Current Morning</h3>
                    {morningActivities.length > 0 ? (
                      <ul className="space-y-2">
                        {morningActivities.map((activity, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              {i + 1}
                            </div>
                            <span className="capitalize">
                              {activity.replace(/_/g, ' ')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        You haven't set up your morning activities yet.
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
  );
};

export default RitualHero;
