
import { Button } from "@/components/ui/button";
import BalanceMeterCard from "./BalanceMeterCard";
import BreakRemindersCard from "./BreakRemindersCard";
import FocusModeCard from "./FocusModeCard";
import BiofeedbackCard from "@/components/biofeedback";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

const WorkLifeBalanceSection = () => {
  const { preferences, isCoach } = useUserPreferences();
  const isTeamOrEnterprise = preferences.subscriptionTier === "Team" || preferences.subscriptionTier === "Enterprise";

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
            <p className="mt-2 text-primary font-medium">
              Personalized for your {preferences.workDays.length} day work week
              {isCoach() && " • Coach view enabled"}
            </p>
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
