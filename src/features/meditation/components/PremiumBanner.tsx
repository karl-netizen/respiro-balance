import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';

export const PremiumBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
            <p className="text-muted-foreground">
              Unlock advanced analytics, data export, and more meditation content.
            </p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          View Plans
        </Button>
      </CardContent>
    </Card>
  );
};