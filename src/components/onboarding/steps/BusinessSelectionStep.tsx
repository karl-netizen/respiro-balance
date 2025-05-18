
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/context";

const BusinessSelectionStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Handler for radio button changes
  const handleRadioChange = (value: string) => {
    updatePreferences({ 
      businessAttribution: value ? value as "KGP Coaching & Consulting" | "LearnRelaxation" | null : null 
    });
    console.log("Selected attribution:", value); // Add logging to help with debugging
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
        value={preferences.businessAttribution || ""}
        onValueChange={handleRadioChange}
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem value="KGP Coaching & Consulting" id="kgp" className="text-respiro-dark" />
          <Label htmlFor="kgp" className="flex-1 cursor-pointer">
            <div className="font-medium text-gray-900 dark:text-gray-100">KGP Coaching & Consulting</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Executive and professional coaching services</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem value="LearnRelaxation" id="learnrelaxation" className="text-respiro-dark" />
          <Label htmlFor="learnrelaxation" className="flex-1 cursor-pointer">
            <div className="font-medium text-gray-900 dark:text-gray-100">LearnRelaxation</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Specialized relaxation techniques and meditation content</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors dark:hover:bg-gray-700/50 dark:border-gray-600">
          <RadioGroupItem value="Other" id="other" className="text-respiro-dark" />
          <Label htmlFor="other" className="flex-1 cursor-pointer">
            <div className="font-medium text-gray-900 dark:text-gray-100">Other</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">I found Respiro Balance another way</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default BusinessSelectionStep;
