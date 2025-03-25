
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Home, Clock, Battery, Bell, Sun, Moon } from "lucide-react";

const WorkLifeBalance = () => {
  const [workLifeRatio, setWorkLifeRatio] = useState<number[]>([50]);
  const [notifications, setNotifications] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  return (
    <section id="balance" className="py-16 px-6 bg-gradient-to-b from-white to-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work-Life Balance Tools</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Our tools help you maintain a healthy balance between work and personal life,
            with reminders for breaks, focus periods, and tracking your daily equilibrium.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Work-Life Balance Meter */}
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
                Track and adjust your work-life balance ratio
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

          {/* Break Reminders */}
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Break Reminders</CardTitle>
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Regular breaks to maintain focus and prevent burnout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Micro-breaks (5 min)</span>
                  <span className="text-sm text-muted-foreground">Every hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Medium breaks (15 min)</span>
                  <span className="text-sm text-muted-foreground">Every 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Long breaks (30 min)</span>
                  <span className="text-sm text-muted-foreground">Every 4 hours</span>
                </div>
                <div className="flex items-center space-x-2 pt-4">
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                  <label
                    htmlFor="notifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable notifications
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Customize Schedule
              </Button>
            </CardFooter>
          </Card>

          {/* Focus Mode */}
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Focus Mode</CardTitle>
                <Battery className="h-5 w-5 text-primary" />
              </div>
              <CardDescription>
                Dedicated time for deep work with minimal distractions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Focus Session</span>
                  <div className="flex items-center space-x-4">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <Moon className="h-4 w-4 text-indigo-500" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Focus mode blocks notifications and helps you stay concentrated on your task
                  with ambient sounds and breathing reminders.
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="focusMode"
                    checked={focusMode}
                    onCheckedChange={setFocusMode}
                  />
                  <label
                    htmlFor="focusMode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {focusMode ? "Focus mode active" : "Enable focus mode"}
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={focusMode ? "default" : "outline"}
                className="w-full"
                onClick={() => setFocusMode(!focusMode)}
              >
                {focusMode ? "End Focus Session" : "Start Focus Session"}
              </Button>
            </CardFooter>
          </Card>
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

export default WorkLifeBalance;
