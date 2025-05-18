
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";

// Define the correct type that matches your preferences interface
type AttributionSource = "KGP Coaching & Consulting" | "LearnRelaxation" | "Other" | null;

const BusinessSelectionStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [selectedValue, setSelectedValue] = useState<AttributionSource>(
    preferences.businessAttribution as AttributionSource || null
  );

  // Ensure state is properly synced with preferences
  useEffect(() => {
    if (preferences.businessAttribution) {
      setSelectedValue(preferences.businessAttribution as AttributionSource);
    }
  }, [preferences.businessAttribution]);

  // Handler for radio button changes
  const handleRadioChange = (value: string) => {
    const typedValue = value as AttributionSource;
    setSelectedValue(typedValue);
    updatePreferences({ 
      businessAttribution: typedValue
    });
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
        value={selectedValue || ""}
        onValueChange={handleRadioChange}
        className="space-y-4"
      >
        {[
          {
            id: "kgp",
            value: "KGP Coaching & Consulting",
            title: "KGP Coaching & Consulting",
            description: "Executive and professional coaching services"
          },
          {
            id: "learnrelaxation",
            value: "LearnRelaxation",
            title: "LearnRelaxation",
            description: "Specialized relaxation techniques and meditation content"
          },
          {
            id: "other",
            value: "Other",
            title: "Other",
            description: "I found Respiro Balance another way"
          }
        ].map((option) => (
          <div 
            key={option.id} 
            className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600"
            onClick={() => handleRadioChange(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.id} />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
              <div className="font-medium text-gray-900 dark:text-gray-100">{option.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Current selection: {selectedValue || 'None'}</p>
          <p>Preferences value: {preferences.businessAttribution || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default BusinessSelectionStep;
