
import { Button } from "@/components/ui/button";
import BalanceMeterCard from "./BalanceMeterCard";
import BreakRemindersCard from "./BreakRemindersCard";
import FocusModeCard from "./FocusModeCard";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const WorkLifeBalanceSection = () => {
  const { preferences } = useUserPreferences();

  return (
    <section id="balance" className="py-16 px-6 bg-gradient-to-b from-white to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work-Life Balance Tools</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Our tools help you maintain a healthy balance between work and personal life,
            with reminders for breaks, focus periods, and tracking your daily equilibrium.
          </p>
          {preferences.hasCompletedOnboarding && (
            <p className="mt-2 text-primary font-medium">
              Personalized for your {preferences.workDays.length} day work week
            </p>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BalanceMeterCard />
          <BreakRemindersCard />
          <FocusModeCard />
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-primary text-white hover:bg-mindflow-dark">
            Explore More Balance Tools
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorkLifeBalanceSection;
