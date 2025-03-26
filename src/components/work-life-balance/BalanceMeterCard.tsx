
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Briefcase, Home } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const BalanceMeterCard = () => {
  const { preferences } = useUserPreferences();
  const [workLifeRatio, setWorkLifeRatio] = useState<number[]>([50]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Balance Meter</CardTitle>
          <div className="flex space-x-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <Home className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription>
          {preferences.hasCompletedOnboarding
            ? `Based on your ${preferences.workStartTime} to ${preferences.workEndTime} schedule`
            : "Track and adjust your work-life balance ratio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Work</span>
            <span className="text-sm font-medium">{workLifeRatio[0]}%</span>
            <span className="text-sm font-medium">Life</span>
          </div>
          <Slider
            value={workLifeRatio}
            onValueChange={setWorkLifeRatio}
            max={100}
            step={5}
            className="my-4"
          />
          <div className="text-sm text-muted-foreground text-center">
            {workLifeRatio[0] < 40 && "Life-focused balance"}
            {workLifeRatio[0] >= 40 && workLifeRatio[0] <= 60 && "Balanced approach"}
            {workLifeRatio[0] > 60 && "Work-focused balance"}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Detailed Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceMeterCard;
