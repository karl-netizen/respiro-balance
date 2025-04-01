
import React from "react";
import { useUserPreferences } from "@/context";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, ListTodo, Bell, MessageSquare } from "lucide-react";
import { TimeBlockingUsage, WorkBoundaries, TimeManagementStyle } from "@/context/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const TimeManagementStep = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const isMobile = useIsMobile();

  const handleTimeChallengeChange = (challenge: string, checked: boolean) => {
    // Ensure timeChallenges exists in preferences
    const currentChallenges = preferences.timeChallenges || [];
    
    let updatedChallenges;
    if (checked) {
      updatedChallenges = [...currentChallenges, challenge];
    } else {
      updatedChallenges = currentChallenges.filter(item => item !== challenge);
    }
    
    updatePreferences({ timeChallenges: updatedChallenges });
  };

  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          What time management challenges do you face? (Select all that apply)
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-prioritization" 
              checked={preferences.timeChallenges?.includes("prioritization") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("prioritization", !!checked)}
            />
            <label htmlFor="challenge-prioritization" className="text-sm">
              Task prioritization difficulties
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-procrastination" 
              checked={preferences.timeChallenges?.includes("procrastination") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("procrastination", !!checked)}
            />
            <label htmlFor="challenge-procrastination" className="text-sm">
              Procrastination tendencies
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-meetings" 
              checked={preferences.timeChallenges?.includes("meetings_overload") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("meetings_overload", !!checked)}
            />
            <label htmlFor="challenge-meetings" className="text-sm">
              Meeting/calendar overload
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-distractions" 
              checked={preferences.timeChallenges?.includes("digital_distractions") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("digital_distractions", !!checked)}
            />
            <label htmlFor="challenge-distractions" className="text-sm">
              Digital distractions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-saying-no" 
              checked={preferences.timeChallenges?.includes("saying_no") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("saying_no", !!checked)}
            />
            <label htmlFor="challenge-saying-no" className="text-sm">
              Difficulty saying "no"
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="challenge-context-switching" 
              checked={preferences.timeChallenges?.includes("context_switching") || false}
              onCheckedChange={(checked) => handleTimeChallengeChange("context_switching", !!checked)}
            />
            <label htmlFor="challenge-context-switching" className="text-sm">
              Context switching struggles
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ListTodo className="w-4 h-4 mr-2 text-primary" />
          Do you currently use any time blocking method?
        </h3>
        <RadioGroup 
          value={preferences.usesTimeBlocking || "no"} 
          onValueChange={(value: TimeBlockingUsage) => updatePreferences({ usesTimeBlocking: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_regularly" id="timeblock-regular" />
            <Label htmlFor="timeblock-regular">Yes, I regularly plan my day in time blocks</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes_occasionally" id="timeblock-occasionally" />
            <Label htmlFor="timeblock-occasionally">Yes, but only occasionally</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="timeblock-no" />
            <Label htmlFor="timeblock-no">No, I don't use time blocking</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Bell className="w-4 h-4 mr-2 text-primary" />
          Work boundaries (after hours)
        </h3>
        <RadioGroup 
          value={preferences.workBoundaries || "sometimes"} 
          onValueChange={(value: WorkBoundaries) => updatePreferences({ workBoundaries: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strict" id="boundaries-strict" />
            <Label htmlFor="boundaries-strict">I have strict boundaries (no work after hours)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sometimes" id="boundaries-sometimes" />
            <Label htmlFor="boundaries-sometimes">I sometimes check work after hours</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="blended" id="boundaries-blended" />
            <Label htmlFor="boundaries-blended">My work and personal time are blended</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-primary" />
          Which time management approach appeals to you most?
        </h3>
        <RadioGroup 
          value={preferences.timeManagementStyle || "flexible"} 
          onValueChange={(value: TimeManagementStyle) => updatePreferences({ timeManagementStyle: value })}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="structured" id="time-structured" />
            <Label htmlFor="time-structured">Structured (detailed schedules, clear routines)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flexible" id="time-flexible" />
            <Label htmlFor="time-flexible">Flexible (general goals, adaptable approach)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimalist" id="time-minimalist" />
            <Label htmlFor="time-minimalist">Minimalist (focus on few important tasks only)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="need_help" id="time-help" />
            <Label htmlFor="time-help">I need help figuring out my approach</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  // On mobile, we'll use the entire component space
  return (
    <ScrollArea className="h-full">
      {content}
    </ScrollArea>
  );
};

export default TimeManagementStep;
