
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";

// Define the specific business types allowed
type BusinessType = "KGP Coaching & Consulting" | "LearnRelaxation" | "Other";

const BusinessSelectionStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType>(
    (preferences.attributionSource as BusinessType) || "Other"
  );
  const [otherBusiness, setOtherBusiness] = useState(
    selectedBusiness === "Other" ? preferences.attributionSource || "" : ""
  );

  const handleBusinessChange = (value: string) => {
    const businessType = value as BusinessType;
    setSelectedBusiness(businessType);
    
    // Only update preferences with the selected value if it's not "Other"
    if (businessType !== "Other") {
      updatePreferences({ attributionSource: businessType });
      toast.success("Business updated", {
        description: `Selected business: ${businessType}`,
        duration: 1500
      });
    } else {
      // For "Other", we'll update when they type in the input field
      setOtherBusiness("");
    }
  };

  const handleOtherBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherBusiness(value);
    
    if (value.trim() !== "") {
      updatePreferences({ attributionSource: value });
      toast.success("Business updated", {
        description: `Custom business name saved`,
        duration: 1500
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">How did you hear about us?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          This helps us understand where our community is coming from
        </p>
      </div>

      <RadioGroup 
        value={selectedBusiness} 
        onValueChange={handleBusinessChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="KGP Coaching & Consulting" id="kgp" />
          <Label htmlFor="kgp" className="font-medium">KGP Coaching & Consulting</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="LearnRelaxation" id="learnrelaxation" />
          <Label htmlFor="learnrelaxation" className="font-medium">LearnRelaxation.com</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Other" id="other" />
          <Label htmlFor="other" className="font-medium">Other</Label>
        </div>
      </RadioGroup>

      {selectedBusiness === "Other" && (
        <div className="mt-3">
          <Label htmlFor="otherSource" className="text-sm font-medium">Please specify:</Label>
          <Input 
            id="otherSource"
            value={otherBusiness}
            onChange={handleOtherBusinessChange}
            className="mt-1"
            placeholder="Where did you hear about us?"
          />
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p>Selected business: {selectedBusiness}</p>
          {selectedBusiness === "Other" && <p>Other business: {otherBusiness}</p>}
        </div>
      )}
    </div>
  );
};

export default BusinessSelectionStep;
