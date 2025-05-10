
import React from "react";
import { Check } from "lucide-react";
import { useUserPreferences } from "@/context";

const FinalStep = () => {
  const { preferences } = useUserPreferences();
  
  // Ensure workDays is always an array to prevent errors in the join operation
  const formattedWorkDays = (preferences.workDays || [])
    .map(day => day.charAt(0).toUpperCase() + day.slice(1))
    .join(', ');
  
  // Format the meditation goals for display
  const formatMeditationGoals = () => {
    const goals = preferences.meditationGoals || [];
    if (goals.length === 0) return "Not specified";
    
    return goals.map(goal => {
      // Convert snake_case to readable text
      return goal.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }).join(', ');
  };
  
  return (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-primary" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Your profile is ready!</h3>
        <p className="text-muted-foreground mt-2">
          We've customized your experience based on your preferences.
        </p>
      </div>
      
      <div className="bg-muted p-4 rounded-md text-left">
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="font-medium">Work Days:</div>
          <div>{formattedWorkDays || "Not specified"}</div>
          
          <div className="font-medium">Work Hours:</div>
          <div>{preferences.workStartTime || "09:00"} - {preferences.workEndTime || "17:00"}</div>
          
          <div className="font-medium">Lunch Break:</div>
          <div>{preferences.lunchBreak ? `Yes, at ${preferences.lunchTime || "12:00"}` : 'No'}</div>
          
          <div className="font-medium">Morning Exercise:</div>
          <div>{preferences.morningExercise ? `Yes, at ${preferences.exerciseTime || "07:00"}` : 'No'}</div>
          
          <div className="font-medium">Bedtime:</div>
          <div>{preferences.bedTime || "Not specified"}</div>
          
          <div className="font-medium">Meditation Experience:</div>
          <div className="capitalize">{preferences.meditationExperience || "Not specified"}</div>
          
          <div className="font-medium">Meditation Goals:</div>
          <div>{formatMeditationGoals()}</div>
          
          <div className="font-medium">Session Duration:</div>
          <div>{preferences.preferredSessionDuration || 10} minutes</div>
        </div>
      </div>

      {/* Display personalized recommendations */}
      <div className="bg-primary/5 p-4 rounded-md text-left">
        <h4 className="font-semibold mb-2">Your Personalized Recommendations</h4>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="font-medium">Recommended Session Duration:</div>
          <div>{preferences.recommendedSessionDuration || preferences.preferredSessionDuration || 10} minutes</div>
          
          <div className="font-medium">Optimal Meditation Time:</div>
          <div>{preferences.recommendedMeditationTime || "Based on your schedule"}</div>
          
          {preferences.recommendedTechniques && preferences.recommendedTechniques.length > 0 && (
            <>
              <div className="font-medium">Recommended Techniques:</div>
              <div>{preferences.recommendedTechniques.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</div>
            </>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        You can update these preferences anytime in your profile settings.
      </p>
    </div>
  );
};

export default FinalStep;
