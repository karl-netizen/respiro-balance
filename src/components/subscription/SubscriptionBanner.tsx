
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const SubscriptionBanner: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 mb-8">
      <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 p-2 bg-primary/20 rounded-full">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Upgrade to Premium</h3>
            <p className="text-sm text-muted-foreground">
              Unlock advanced analytics, data export, and more meditation content.
            </p>
          </div>
        </div>
        <Button className="mt-3 md:mt-0" size="sm">
          View Plans
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionBanner;
