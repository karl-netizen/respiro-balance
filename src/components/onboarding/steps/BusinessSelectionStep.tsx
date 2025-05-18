import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";

type AttributionSource = "KGP Coaching & Consulting" | "LearnRelaxation" | "Other" | null;

const BusinessSelectionStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  // Local state to ensure UI updates immediately
  const [selectedAttribution, setSelectedAttribution] = useState<AttributionSource>(
    preferences.businessAttribution as AttributionSource || null
  );

  // Force sync with preferences when component mounts
  useEffect(() => {
    if (preferences.businessAttribution) {
      setSelectedAttribution(preferences.businessAttribution as AttributionSource);
    }
  }, [preferences.businessAttribution]);

  // Handler for radio button changes
  const handleRadioChange = (value: string) => {
    const attribution = value as AttributionSource;
    // Update local state immediately for responsive UI
    setSelectedAttribution(attribution);
    
    // Update global preferences
    updatePreferences({ 
      businessAttribution: attribution
    });
    
    // Log and show feedback
    console.log("Selected attribution:", value);
    toast.success("Selection saved", {
      description: `You selected ${value}`,
      duration: 2000
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Welcome to Respiro Balance</h3>
        <p className="text-muted-foreground mt-2 text-gray-700 dark:text-gray-300">
          Where did you hear about us? This helps us tailor your experience.
        </p>
      </div>

      <RadioGroup
        value={selectedAttribution || ""}
        onValueChange={handleRadioChange}
        className="space-y-4"
      >
        {/* KGP Option */}
        <div className="relative flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem 
            value="KGP Coaching & Consulting" 
            id="kgp" 
            className="focus:ring-2 focus:ring-primary" 
          />
          <Label 
            htmlFor="kgp" 
            className="flex-1 cursor-pointer z-10"
            onClick={() => handleRadioChange("KGP Coaching & Consulting")}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">KGP Coaching & Consulting</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Executive and professional coaching services</div>
          </Label>
          {/* Clickable overlay to ensure the entire card is clickable */}
          <div 
            className="absolute inset-0 cursor-pointer z-0" 
            onClick={() => handleRadioChange("KGP Coaching & Consulting")}
            aria-hidden="true"
          />
        </div>
        
        {/* LearnRelaxation Option */}
        <div className="relative flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem 
            value="LearnRelaxation" 
            id="learnrelaxation" 
            className="focus:ring-2 focus:ring-primary" 
          />
          <Label 
            htmlFor="learnrelaxation" 
            className="flex-1 cursor-pointer z-10"
            onClick={() => handleRadioChange("LearnRelaxation")}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">LearnRelaxation</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Specialized relaxation techniques and meditation content</div>
          </Label>
          {/* Clickable overlay to ensure the entire card is clickable */}
          <div 
            className="absolute inset-0 cursor-pointer z-0" 
            onClick={() => handleRadioChange("LearnRelaxation")}
            aria-hidden="true"
          />
        </div>
        
        {/* Other Option */}
        <div className="relative flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem 
            value="Other" 
            id="other" 
            className="focus:ring-2 focus:ring-primary" 
          />
          <Label 
            htmlFor="other" 
            className="flex-1 cursor-pointer z-10"
            onClick={() => handleRadioChange("Other")}
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">Other</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">I found Respiro Balance another way</div>
          </Label>
          {/* Clickable overlay to ensure the entire card is clickable */}
          <div 
            className="absolute inset-0 cursor-pointer z-0" 
            onClick={() => handleRadioChange("Other")}
            aria-hidden="true"
          />
        </div>
      </RadioGroup>

      {/* Debug information - will only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Current selection: {selectedAttribution || 'None'}</p>
          <p>Preferences value: {preferences.businessAttribution || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default BusinessSelectionStep;
