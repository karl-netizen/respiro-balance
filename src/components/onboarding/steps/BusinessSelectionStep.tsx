
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const BusinessSelectionStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Welcome to Respiro Balance</h3>
        <p className="text-muted-foreground mt-2">
          Where did you hear about us? This helps us tailor your experience.
        </p>
      </div>

      <RadioGroup
        value={preferences.businessAttribution || ""}
        onValueChange={(value) => 
          updatePreferences({ 
            businessAttribution: value as "KGP Coaching & Consulting" | "LearnRelaxation" | null 
          })
        }
        className="space-y-4"
      >
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors">
          <RadioGroupItem value="KGP Coaching & Consulting" id="kgp" />
          <Label htmlFor="kgp" className="flex-1 cursor-pointer">
            <div className="font-medium">KGP Coaching & Consulting</div>
            <div className="text-sm text-muted-foreground">Executive and professional coaching services</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors">
          <RadioGroupItem value="LearnRelaxation" id="learnrelaxation" />
          <Label htmlFor="learnrelaxation" className="flex-1 cursor-pointer">
            <div className="font-medium">LearnRelaxation</div>
            <div className="text-sm text-muted-foreground">Specialized relaxation techniques and meditation content</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-secondary/50 transition-colors">
          <RadioGroupItem value="" id="other" />
          <Label htmlFor="other" className="flex-1 cursor-pointer">
            <div className="font-medium">Other</div>
            <div className="text-sm text-muted-foreground">I found Respiro Balance another way</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default BusinessSelectionStep;
