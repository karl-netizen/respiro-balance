
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import BalanceMeterCard from "./BalanceMeterCard";
import BreakRemindersCard from "./BreakRemindersCard";
import FocusModeCard from "./FocusModeCard";
import BiofeedbackCard from "@/components/biofeedback";
import { useUserPreferences } from "@/context";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTime } from "./utils";

const WorkLifeBalanceSection = () => {
  const { preferences, isCoach } = useUserPreferences();
  const isTeamOrEnterprise = preferences.subscriptionTier === "Team" || preferences.subscriptionTier === "Enterprise";

  // Format work days for display
  const formatWorkDays = () => {
    if (!preferences.workDays || preferences.workDays.length === 0) {
      return "no scheduled";
    }
    
    const days = preferences.workDays.map(day => day.charAt(0).toUpperCase() + day.slice(1));
    return days.join(', ');
  };

  return (
    <section id="balance" className="py-16 px-6 bg-gradient-to-b from-white to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Work-Life Balance Tools</h2>
            {isTeamOrEnterprise && (
              <Badge variant="outline" className="mb-4 py-1 px-3 flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{preferences.subscriptionTier} Features Enabled</span>
              </Badge>
            )}
          </div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Our tools help you maintain a healthy balance between work and personal life,
            with reminders for breaks, focus periods, and tracking your daily equilibrium.
            {isTeamOrEnterprise && " Share insights with your team and coaches for better support."}
          </p>
          {preferences.hasCompletedOnboarding && (
            <Popover>
              <PopoverTrigger asChild>
                <p className="mt-2 text-primary font-medium cursor-pointer hover:underline inline-flex items-center">
                  Personalized for your {preferences.workDays?.length || 0} day work week
                  <Info className="ml-1 h-4 w-4" />
                  {isCoach() && " • Coach view enabled"}
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Your Work Schedule</h4>
                  <div className="text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Work Days:</span>
                      <span>{formatWorkDays()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Work Hours:</span>
                      <span>{formatTime(preferences.workStartTime)} - {formatTime(preferences.workEndTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environment:</span>
                      <span className="capitalize">{preferences.workEnvironment}</span>
                    </div>
                    {preferences.lunchBreak && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lunch Break:</span>
                        <span>{formatTime(preferences.lunchTime)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stress Level:</span>
                      <span className="capitalize">{preferences.stressLevel}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="font-medium mb-1">Your Tools Customization</h4>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>Break reminders aligned with your work hours</li>
                      <li>Focus sessions optimized for your energy pattern</li>
                      <li>Balance recommendations based on your stress level</li>
                      <li>Meditation optimized for your experience level</li>
                    </ul>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BalanceMeterCard />
          <BreakRemindersCard />
          <FocusModeCard />
          <BiofeedbackCard />
        </div>
        
        <div className="mt-12 text-center">
          {isCoach() ? (
            <Link to="/coach-dashboard">
              <Button size="lg" className="bg-primary text-white hover:bg-mindflow-dark mr-4">
                Access Coach Dashboard
              </Button>
            </Link>
          ) : null}
          
          <Button size="lg" className="bg-primary text-white hover:bg-mindflow-dark">
            Explore More Balance Tools
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorkLifeBalanceSection;
